// ==========================================================================
// Project:   MySystem.DiagramView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/terminal');

/** @class

  Display class for displaying a MySystem diagram (a set of nodes and links) as a collection.
  Is a drop target for nodes from the NodesPaletteView, invokes statechart's 'addNode' action upon drop.

  @extends SC.View
*/

// Define the diagramExampleView attribute in Link and Node.
// It seems weird to have the model object specify a view, so
// I'm doing it here, rather than directly in the model
// because this is where the views are going to be used.
MySystem.Link.reopen({
  diagramExampleView: function() {
    return MySystem.LinkView;
  }.property()
});
MySystem.Node.reopen({
  diagramExampleView: function() {
    return MySystem.NodeView;
  }.property()
});

MySystem.DiagramView = RaphaelViews.RaphaelCollectionView.extend(
/** @scope MySystem.DiagramView.prototype */ {

  // exampleView: MySystem.NodeView,
  contentExampleViewKey: 'diagramExampleView',
  
  // This tels the collection view to deselect everything
  // if the nothing is clicked on 
  allowDeselectAll: YES,

  // Allow keyboard delete operations:
  acceptsFirstResponder: YES,
  canDeleteContent: YES,

  _isDragging: NO,
  
  
  // Override this so that we can control the order in which things are drawn,
  // which controls which objects get drawn on top of which other objects.
  renderChildViews: function (context, firstTime) {
    var cv = this.get('childViews');
    var view;

    var nodes = cv.filter(function(v) { return v.get('content') instanceof MySystem.Node; });
    var links = cv.filter(function(v) { return v.get('content') instanceof MySystem.Link; });

    // nodes first, so that links are always drawn on top of them
    this._renderChildren(context, firstTime, nodes);

    // sort the links by weight, descending, so that larger links don't obscure smaller links
    var sortedLinks = links.sort(function(a,b) {
      return (b.get('weight') - a.get('weight'));
    });
    this._renderChildren(context, firstTime, sortedLinks);

    return context;
  },

  _renderChildren: function(context, firstTime, views) {
    for (var i=0, ii=views.length; i<ii; ++i) {
      view = views[i];
      if (!view) continue;

      context = context.begin(view.get('layer'));
      view.prepareRaphaelContext(context, firstTime);
      context = context.end();
    }
  },

  // SC.DropTarget
  //   The methods below are all part o the SC.DropTarget protocol
  //   and must be implemented to function as a drop target.
  isDropTarget: YES,
  dragStarted: function(drag, evt) {},
  dragEntered: function(drag, evt) {},
  dragUpdated: function(drag, evt) {},
  dragExited: function(drag, evt) {},
  dragEnded: function(drag, evt) {},
  acceptDragOperation: function(drag, op) {
    return YES;
  },

  computeDragOperations: function () {
    return SC.DRAG_LINK;      // TODO this happens to work, but are we using the right semantics?
  },
  
  performDragOperation: function (drag, op) {
    var canvasOffset = this.get('canvasView').$().offset(),

        // The numbers at the end are to account for the difference in size of the PaletteItemView
        // compared to the Node view.  Mostly likely those could be computed.
        newNodeX = drag.location.x - drag.ghostOffset.x - canvasOffset.left + MySystem.NodeView.DROP_OFFSET.x,
        newNodeY = drag.location.y - drag.ghostOffset.y - canvasOffset.top  + MySystem.NodeView.DROP_OFFSET.y,
    
        newNodeAttributes = {
          title:    drag.data.title,
          image:    drag.data.image,
          x:        newNodeX,
          y:        newNodeY,
          nodeType: drag.data.uuid
        };
    
    // Create the node
    MySystem.statechart.sendEvent('addNode', newNodeAttributes);

    // De-select other diagram objects and select 
    return SC.DRAG_COPY;
  },
  
  
  mouseDown: function (evt) {
    if (!!evt.shiftKey){
      evt.shiftKey = NO;
      evt.ctrlKey = YES;
    }
    var handledBySuper = sc_super();
    
    if (handledBySuper) {
      this._dragX = evt.pageX;
      this._dragY = evt.pageY;
      this.invokeLast(this._startDrag);
    }

    return handledBySuper;
  },
  
  touchStart: function (evt) {
    return this.mouseDown(evt);
  },
  
  mouseDragged: function (evt) {
    this._drag(evt);
    return sc_super();
  },
  
  touchesDragged: function(evt, touches) {
    this.mouseDragged(evt);
  },
  
  mouseUp: function (evt) {
    // don't forget to handle the last mouse movement!
    this._drag(evt);
    
    // just to be sure we don't drag views around in case we get sent more mouseDragged events
    this._isDragging = NO;
    this._dragMap = [];
    this._draggedViews = [];
    
    return sc_super();
  },
  
  touchEnd: function (evt) {
    return this.mouseUp(evt);
  },

  _startDrag: function () {
    var containerView  = this.get('containerView') || this,
        $canvasView    = this.get('canvasView').$();
    
    this._isDragging = YES;
    
    this._dragFrame = {
      left:   0,
      top:    0,
      right:  $canvasView.innerWidth(),
      bottom: $canvasView.innerHeight()
    };

    this._draggedViews = containerView.get('childViews').filter(function (view) {
      return view.get('isSelected') && view.get('content').kindOf(MySystem.Node);
    });
    
    this._dragMap = this._draggedViews.map( function (view) {
      return {
        x:      view.get('x'),
        y:      view.get('y'),
        width:  view.get('bodyWidth') + view.get('borderWidth') / 2,
        height: view.get('bodyHeight') + view.get('borderWidth') / 2
      };
    });
  },
  
  _drag: function (evt) {
    var dx = evt.pageX - this._dragX,
        dy = evt.pageY - this._dragY;
    
    
    if (!this._isDragging) {
      return NO;
    }
    
    // clear the select properties of mouseDownInfo
    // TODO: change the conditions, probably the nodes shouldn't move eitehr until
    //   these conditiosn are met
    if(Math.abs(dx) > 5 || Math.abs(dy) > 5){
      this.mouseDownInfo.shouldReselect = NO;
      this.mouseDownInfo.shouldSelect = NO;
    }
    
    this._dragX = evt.pageX;
    this._dragY = evt.pageY;
    
    this._updateDragMap(dx, dy);
    this._adjustDraggedViews();
  },
  
  _updateDragMap: function (dx, dy) {
    for (var i = 0; i < this._dragMap.length; i++) {
      this._dragMap[i].x += dx;
      this._dragMap[i].y += dy;
    }
  },
  
  _adjustDraggedViews: function () {
    var i, x, y, view, width, height;
    
    for (i = 0; i < this._draggedViews.length; i++) {
      x      = this._dragMap[i].x;
      y      = this._dragMap[i].y;
      width  = this._dragMap[i].width;
      height = this._dragMap[i].height;
      
      if (x          < this._dragFrame.left)   x = this._dragFrame.left;
      if (x + width  > this._dragFrame.right)  x = this._dragFrame.right - width;
      if (y          < this._dragFrame.top)    y = this._dragFrame.top;
      if (y + height > this._dragFrame.bottom) y = this._dragFrame.bottom - height;
      
      view = this._draggedViews[i];

      view.beginPropertyChanges();
      view.set('x', x);
      view.set('y', y);
      view.endPropertyChanges();
    }
  }  
  
});
