// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/editable_label');
sc_require('views/terminal');

/** @class

  Display class for displaying a Node. Expects its 'content' property to be a MySystem.Node record.

  @extends SC.View
*/
MySystem.NodeView = RaphaelViews.RaphaelView.extend(SC.ContentDisplay,
/** @scope MySystem.NodeView.prototype */ {

  childViews: 'titleView terminalA terminalB'.w(),
  
  contentDisplayProperties: 'x y image title'.w(),
  displayProperties: 'bodyWidth bodyHeight bodyColor bodyOpacity borderColor borderOpacity borderWidth borderRadius imageWidth imageHeight'.w(),
    
  // PROPERTIES
  
  isSelected: NO,
  isDragging: NO,
  
  bodyWidth: 100,
  bodyHeight: 110,
  bodyColor: '#000000',       // the node s/b visually transparent, but not transparent to mouse events, so it must have a fill
  bodyOpacity: 0,
 
  // for titleView
  titleBinding: '*content.title',
  titleBindingDefault: SC.Binding.oneWay(),
  xBinding:     '*content.x',
  yBinding:     '*content.y',
  
  centerX: function () {
    return this.get('x') + this.get('bodyWidth') / 2;
  }.property('x', 'bodyWidth'),
  
  titleY: function () {
    return this.get('y') + this.get('bodyHeight') - 20;     // could parameterize this better later
  }.property('y', 'bodyHeight'),
 
  terminalAY: function() {
    return this.get('y');     // could parameterize this better later
  }.property('y', 'bodyHeight'),
  
  terminalBY: function() {
    return this.get('y') + this.get('bodyHeight');     // could parameterize this better later
  }.property('y', 'bodyHeight'),

  borderColor: function () {
    return this.get('isSelected') ? 'rgb(173, 216, 230)' : '#CCCCCC';
  }.property('isSelected'),
  
  borderOpacity: 1.0,
  
  borderWidth: function () {
    return this.get('isSelected') ? 4 : 1;
  }.property('isSelected'),
  
  borderRadius: 5,
  
  // target width and height - these may change after image scaling
  imageWidth: 50,
  
  imageHeight: 70,

  // place-holder for our rendered raphael image object
  // this is the nodes 'image'.
  _raphaelImage: null,

  // place-holder for our rendered raphael rectangle object
  // this is the nodes 'border' essentially.
  _raphaelRect: null,

  collectionView: function () {
    var ret = this.get('parentView');
    
    if (ret && ret.kindOf && ret.kindOf(SC.CollectionView)) {
      return ret;
    }
    else {
      ret = ret.get('parentView');
      if (ret && ret.kindOf && ret.kindOf(SC.CollectionView)) {
        return ret;
      }
      else {
        return null;
      }
    }
  }.property('parentView').cacheable(),


  // CHILD VIEWS
  
  titleView: MySystem.EditableLabelView.design({
    isEditable:     YES,
    fontSize:       14,
    textColor:      '#000',
    textBinding:    '.parentView.title',
    centerXBinding: '.parentView.centerX',
    centerYBinding: '.parentView.titleY',
    selectMe: function() {
      var currentNode = this.getPath('parentView.content');
      MySystem.nodesController.unselectAll();
      MySystem.nodesController.selectObject(currentNode);
    }.observes('isEditing')
  }),
 
  terminalA: MySystem.TerminalView.design({
    xBinding: '.parentView.centerX',
    yBinding: '.parentView.terminalAY',
    isVisible: YES
  }),
  terminalB: MySystem.TerminalView.design({
    xBinding: '.parentView.centerX',
    yBinding: '.parentView.terminalBY',
    isVisible: YES
  }),

  // RENDER METHODS
  renderCallback: function (raphaelCanvas, attrs,imageAttrs) {
    this._raphaelRect  = raphaelCanvas.rect();
    this._raphaelImage = raphaelCanvas.image();

    this._raphaelRect.attr(attrs);
    this._raphaelImage.attr(imageAttrs);

    return raphaelCanvas.set().push(this._raphaelRect,this._raphaelImage);
  },
  
  render: function (context, firstTime) {
    
    var content = this.get('content');
    
    if (firstTime) {
      // when we first load this image, create a new Image object so we can inspect 
      // the actual width and height, and then scale the rendered image appropriately 
      // while keeping the aspect ratio
      var image = new Image();
      var self = this;
      image.onload = function() {
        self.setImageDimensions(image);
      };
      image.src = content.get('image');
      
    }
    
    var attrs = {
          'x':              content.get('x'),
          'y':              content.get('y'),
          'r':              this.get('borderRadius'),
          'width':          this.get('bodyWidth'),
          'height':         this.get('bodyHeight'),
          'fill':           this.get('bodyColor'),
          'fill-opacity':   this.get('bodyOpacity'),
          'stroke':         this.get('borderColor'),
          'stroke-width':   this.get('borderWidth'),
          'stroke-opacity': this.get('borderOpacity')
        },

        imageAttrs = {
          src:    content.get('image'),
          x:      25 + content.get('x')+((50-this.get('imageWidth'))/2),  // center narrow images
          y:      10 + content.get('y'),
          width:  this.get('imageWidth'),
          height: this.get('imageHeight')
        };

    if (firstTime) {
      context.callback(this, this.renderCallback, attrs, imageAttrs);
      this.renderChildViews(context,firstTime);
    }
    else {
      this._raphaelRect.attr(attrs);
      this._raphaelImage.attr(imageAttrs);
    }
  },
  
  setImageDimensions: function (image) {
    image.onload = null;
    if (image.width > 1){
      var targetWidth = this.get('imageWidth'),
          targetHeight = this.get('imageHeight'),
          srcWidth = image.width,
          srcHeight = image.height;
      
      var scaledWidth =  ((srcWidth * targetHeight) / srcHeight);   
      var scaleOnWidth = scaledWidth > targetWidth;
      
      var newWidth = scaleOnWidth ? targetWidth : scaledWidth,
          newHeight = scaleOnWidth? (srcHeight * targetWidth) / srcWidth : targetHeight;
          
      // RunLoop here, or image won't change until mouse moves
      SC.RunLoop.begin();
        this.set('imageWidth', newWidth);
        this.set('imageHeight', newHeight);
      SC.RunLoop.end();
    }
  }
  
  // EVENT METHODS GO HERE:
});


// TODO: Remove the following when RaphaelViews conversion is complete. RPK 8-11-11


// LinkIt.NodeView,
// /** @scope MySystem.NodeView.prototype */ {
// 
//   layout: { top: 0, left: 0, width: 100, height: 120 },
//   classNames: 'node'.w(),
// 
//   displayProperties: 'content isSelected'.w(),
//   content: null,
//   isSelected: false,
// 
//   childViews: 'icon label aTerminal bTerminal'.w(), //  transformationIcon
// 
//   /** @private */
//   _runAction: function(evt) {
//     var action = this.get('action'),
//         target = this.get('target') || null;
// 
//     if (action) {
//       this.getPath('pane.rootResponder').sendAction(action, target, this, this.get('pane'));
//     }
//   },
// 
//   render: function (context) {
//     sc_super();
//     if (this.get('isSelected')) context.addClass('selected');
//   },  
// 
//   icon: SC.ImageView.design({
//     classNames: 'image',
//     useImageQueue: YES,
//     layout: { top: 20, width:50, height:70, centerX: 0},
//     valueBinding: '.parentView*content.image'
//   }),
// 
//   label: SC.LabelView.design({
//     layout: { bottom: 12, centerX: 0, width: 100, height: 25 },
//     classNames: ['name'],
//     textAlign: SC.ALIGN_CENTER,    
//     valueBinding: '.parentView*content.title',
//     isEditable: YES
//   }),
// 
//   aTerminal: MySystem.Terminal.design({
//     nodeBinding: '.parentView*content',
//     classNames: 'input terminal'.w(),
//     terminal: 'a'
//     // direction: LinkIt.INPUT_TERMINAL
//   }),
// 
//   bTerminal: MySystem.Terminal.design({
//     layout: { left: 45, bottom: +5, width: 10, height: 10 },
//     nodeBinding: '.parentView*content',
//     classNames: 'output terminal'.w(),
//     terminal: 'b'
//     // direction: LinkIt.OUTPUT_TERMINAL
//   }),
// 
//   /* Temporarily removed for Berkeley 0.1 release */
//   // transformationIcon: SC.ImageView.design({
//   //   classNames: 'image',
//   //   useImageQueue: YES,
//   //   layout: {left: 5, bottom: +5, width: 20, height:20 },
//   //   valueBinding: '.parentView*content.transformationIcon',
//   //   toolTipBinding: '.parentView*content.toolTip',
//   //   click: function(evt) {
//   //     if (this.get('toolTip')) { // If tooltip is null, there's nothing to do
//   //       MySystem.transformationsController.openTransformationBuilder(this.get('parentView').get('content'));
//   //     }
//   //     return YES;
//   //   }
//   // }),
// 
//   // ..........................................................
//   // LINKIT Specific for the view
//   // 
//   /**
//     Implements LinkIt.NodeView.terminalViewFor()
//   */
//   terminalViewFor: function (terminalKey) {
//     return this[terminalKey + 'Terminal'];
//   },
// 
//   /** 
//   * implement action behavior of see sproutcore/desktop/view/button
//   */
//   // doubleClick: function(evt, skipHoldRepeat) {
//   //     this._runAction(evt);
//   // }
// 
//   /**
//   * Stuff for DropTarget
//   */
//   dragStarted: function(drag, evt) {},
//   dragEntered: function(drag, evt) {},
//   dragUpdated: function(drag, evt) {},
//   dragExited: function(drag, evt) {},
//   dragEnded: function(drag, evt) {},
//   computeDragOperations: function(drag, evt, ops) {
//     if (drag.hasDataType('Boolean')) {
//       return SC.DRAG_LINK;
//     } else {
//       return SC.DRAG_NONE;
//     }
//   },
//   acceptDragOperation: function(drag, operation) { return true; },
//   performDragOperation: function(drag, operation) {
//     this.content.set('transformer', true);
//     return operation;
//   }
// });
