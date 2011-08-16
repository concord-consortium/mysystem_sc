// ==========================================================================
// Project:   MySystem.Terminal
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('mixins/arrow_drawing');

/** @class

  @extends RaphaelViews.RaphaelView
*/
MySystem.TerminalView = RaphaelViews.RaphaelView.extend({
   childViews: 'inProgressLinkView'.w(),
   displayProperties: 'x y r fill stroke'.w(),

   x:                 0,
   y:                 0,
   r:                 5,
   fill:              '#ccc',
   fillOpacity:       '0.2',
   stroke:            '#333',
   strokeWidth:       '1',
   strokeOpacity:     '0.2',
   isLineDrag:        NO,
   deltaX:              null,
   deltaY:              null,
   _raphaelCircle:    null,

  attrs: function() {
    return {
       'cx':             this.get('x'),
       'cy':             this.get('y'),
       'r':              this.get('r'),
       'fill':           this.get('fill'),
       'fill-opacity':   this.get('fillOpacity'),
       'stroke':         this.get('stroke'),
       'strokeWidth':    this.get('strokeWidth'),
       'stroke-opacity': this.get('strokeOpacity')
    };
  },

  // RENDER METHODS
  renderCallback: function (raphaelCanvas, attrs) {
    this._raphaelCircle  = raphaelCanvas.circle();
    this._raphaelCircle.attr(this.attrs());
    return this._raphaelCircle;
  },
  
  render: function (context, firstTime) {
    if (firstTime) {
      context.callback(this, this.renderCallback, this.attrs());
      this.renderChildViews(context,firstTime);
    }
    else {
      this._raphaelCircle.attr(this.attrs());
    }
  },
  
  mouseDown: function (evt) {
    this._downX = evt.pageX;
    this._downY = evt.pageY;
    this.set('deltaX', 0);
    this.set('deltaY', 0);
    this.set('isLineDrag', YES);
    return YES;
  },
  
  mouseDragged: function (evt) {
    return this._drag(evt);
  },

  
  _drag: function (evt) {
    if (!this.get('isLineDrag')) {
      return NO;
    }
    this.set('deltaX', evt.pageX - this._downX);
    this.set('deltaY', evt.pageY - this._downY);
    return YES;
  },

  mouseUp: function (evt) {
    // don't forget to handle the last mouse movement!
    this._drag(evt);
    this.set('isLineDrag', NO);
    return YES;
  },
  

  // Rubber-Banding In-Progress Link
  //
  //
  inProgressLinkView:  RaphaelViews.RaphaelView.design({
    displayProperties: 'startX startY deltaX deltaY isVisible'.w(),
    startXBinding:     '.parentView.x',
    startYBinding:     '.parentView.y',
    isVisibleBinding:  '.parentView.isLineDrag',
    strokeWidth:       3,
    strokeColor:       "#0000FF",
    deltaXBinding:     '.parentView.deltaX',
    deltaYBinding:     '.parentView.deltaY',
    _raphaelPath:      null,

    path: function() {
      var x1 = this.get('startX'),
      x2 = this.get('deltaX') + x1,
      y1 = this.get('startY'),
      y2 = this.get('deltaY') + y1;
      
      return MySystem.ArrowDrawing.arrowPath(x1,y1,x2,y2,15,20);
    },

    attrs: function() {
      return { 
        'path': this.path(),
        'stroke': this.get('strokeColor'),
        'fill': "#0000FF",
        'stroke-width': this.get('strokeWidth')
      };
    },
    
    _raphaelCanvas: null,

    renderCallback: function (raphaelCanvas, attrs) {
      this._raphaelCanvas = raphaelCanvas;
      this._raphaelPath  = raphaelCanvas.path();
      this._raphaelPath.attr(attrs);
      return this._raphaelPath;
    },
    
    render: function (context, firstTime) {
      if (firstTime) {
        context.callback(this, this.renderCallback, this.attrs());
        this.renderChildViews(context,firstTime);
      }
      else {
        this._raphaelPath.attr(this.attrs());
      }
    }

  })
});

  // NOTE: old Linkit code commented out:
  // layout: { left: 45, top: +5, width: 10, height: 10 },
  // linkClass: 'MySystem.Link',

  // Validate if links can originate from this terminal
  // canDragLink: function() {
    // var proposedLinkColor = MySystem.linkColorChooser.get('content');
    // if (MySystem.studentMode === MySystem.NOVICE_STUDENT) {
    //   // This block for novice mode
    //   if (this.node.get('transformer')) {
    //     // Transformers may generate any link type
    //     return YES;
    //   }
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so the new link may establish the link type
    //     return YES;
    //   }
    //   if (this.node.get('linkColor') == proposedLinkColor) {
    //     // The proposed link has the right color
    //     return YES;
    //   }
    //   SC.Logger.log('No link creation here: ' + this.node.get('linkColor') + ' is not ' + proposedLinkColor);
    //   return NO;
    // } else if (MySystem.studentMode === MySystem.ADVANCED_STUDENT) {
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so the new link may establish the link type
    //     return YES;
    //   }
    //   if (this.node.get('linkColor') == proposedLinkColor) {
    //     // The proposed link has the right color
    //     return YES;
    //   }
    //   if (this.node.hasTransformationWithOutgoingColor(proposedLinkColor)) {
    //     return YES;
    //   }
    //   if (this.node.hasIncomingLinksWithColor(proposedLinkColor)) {
    //     return YES;
    //   }
    //   SC.Logger.log('No link creation here: ' + this.node.get('linkColor') + ' is not ' + proposedLinkColor);
    //   return NO;
    // } else {
    //   SC.Logger.log("MySystem.studentMode invalid:" + MySystem.studentMode);
    //   return NO;
    // }
  //   return YES;
  // }, 

  // Validate if the currently-being-created link may end at this terminal
  // canDropLink: function() {
    // SC.Logger.log('Checking if links may drop at this terminal');
    // var inboundLinkColor = MySystem.linkColorChooser.get('content');
    // if (MySystem.studentMode == MySystem.NOVICE_STUDENT) {
    //   // This block for novice mode
    //   if (this.node.get('transformer')) {
    //     // Transformers can accept any link
    //     return YES;
    //   }
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so this establishes the energy type
    //     return YES;
    //   }
    //   if (this.node.get('linkColor') == inboundLinkColor) {
    //     // The being-created link has the same color as all those currently in place
    //     return YES;
    //   }
    //   // else
    //   return NO;
    // } else if (MySystem.studentMode == MySystem.ADVANCED_STUDENT) {
    //   if (this.node.get('transformer')) {
    //     // Transformers can accept any link
    //     return YES;
    //   }
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so this establishes the energy type
    //     return YES;
    //   }
    //   // if (this.node.get('linkColor') == inboundLinkColor) {
    //   //        // The being-created link has the same color as all those currently in place
    //   //        return YES;
    //   // }
    //   // else
    //   return YES;
    // } else {
    //   SC.Logger.log("Bad student mode: " + MySystem.studentMode);
    //   return NO;
    // }
  //   return YES;
  // },

  // computeDragOperations: function(drag, evt) {
  //   return this.canDropLink() ? SC.DRAG_LINK : SC.DRAG_NONE;
  // }

