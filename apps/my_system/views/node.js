// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/editable_label');
sc_require('views/terminal');
sc_require('views/remove_button');

/** @class

  Display class for displaying a Node. Expects its 'content' property to be a MySystem.Node record.

  @extends SC.View
*/
MySystem.NodeView = RaphaelViews.RaphaelView.extend(SC.ContentDisplay,
/** @scope MySystem.NodeView.prototype */ {

  childViews: 'removeButtonView titleView terminalA terminalB'.w(),

  contentDisplayProperties: 'x y image title'.w(),
  displayProperties: 'bodyWidth bodyHeight bodyColor bodyOpacity borderColor borderOpacity borderWidth borderRadius imageWidth imageHeight'.w(),
    
  // PROPERTIES
  
  isSelected: NO,
  isDragging: NO,
  isHovered:  NO,
  
  bodyWidthBinding:  SC.Binding.oneWay("MySystem.activityController.content.nodeWidth"),
  bodyHeightBinding: SC.Binding.oneWay("MySystem.activityController.content.nodeHeight"),
  terminalRadiusBinding: SC.Binding.oneWay("MySystem.activityController.content.terminalRadius"),

  bodyColor:   '#000000',       // the node s/b visually transparent, but not transparent to mouse events, so it must have a fill
  bodyOpacity: 0,
  fontSize: 14,

  // for titleView
  titleBinding: '*content.title',
  xBinding:     '*content.x',
  yBinding:     '*content.y',
  
  centerX: function () {
    return this.get('x') + this.get('bodyWidth') / 2;
  }.property('x', 'bodyWidth').cacheable(),
  
  titleY: function () {
    return this.get('y') + this.get('bodyHeight') + this.get('fontSize') + this.get('terminalRadius');
  }.property('y', 'bodyHeight').cacheable(),
 
  terminalAY: function() {
    return this.get('y');     // could parameterize this better later
  }.property('y', 'bodyHeight').cacheable(),
  
  terminalBY: function() {
    return this.get('y') + this.get('bodyHeight');     // could parameterize this better later
  }.property('y', 'bodyHeight').cacheable(),

  borderColor: function () {
    return this.get('isSelected') ? 'rgb(173, 216, 230)' : '#CCCCCC';
  }.property('isSelected').cacheable(),
  
  borderOpacity: 1.0,
  
  borderWidth: function () {
    return this.get('isSelected') ? 4 : 1;
  }.property('isSelected'),
  
  borderRadius: 5,
  
  // target width and height - these may change after image scaling
  imageWidth: function() {
    return this.get('bodyWidth') * 0.9;
  }.property('bodyWidth').cacheable(),
  
  imageHeight: function() {
    return this.get('bodyHeight') * 0.9;
  }.property('bodyHeight').cacheable(),

  verticalMargin: function() {
    return this.get('bodyHeight') * 0.1;
  }.property('bodyHeight').cacheable(),

  horizontalMargin: function() {
    return this.get('bodyWidth') * 0.1;
  }.property('bodyWidth').cacheable(),

  // place-holder for our rendered raphael image object
  // this is the nodes 'image'.
  _raphaelImage: null,

  // place-holder for our rendered raphael rectangle object
  // this is the nodes 'border' essentially.
  _raphaelRect: null,

  diagramControllerBinding: 'MySystem.nodesController',
  onlySelectedDiagramObjectBinding: '*diagramController.onlySelectedObject',
  
  isOnlySelectedDiagramObject: function () {
    return this.get('onlySelectedDiagramObject') === this.get('content');
  }.property('onlySelectedDiagramObject', 'content'),
  
  isRemoveButtonVisible: function () {
    return this.get('isHovered') || this.get('isOnlySelectedDiagramObject');
  }.property('isHovered', 'isOnlySelectedDiagramObject'),    
  
  // CHILD VIEWS
  
  removeButtonView: MySystem.RemoveButtonView.design({
    isVisibleBinding:          '.parentView.isRemoveButtonVisible',

    parentBorderColorBinding:  '.parentView.borderColor',
    parentXBinding:            '.parentView.x',
    parentBodyWidthBinding:    '.parentView.bodyWidth',    
    
    normalCircleStrokeBinding: '.parentBorderColor',
    hoveredCircleStroke:       '#666',
    normalCircleFill:          '#FFF',
    hoveredCircleFill:         '#666',
    normalXStrokeBinding:      '.parentBorderColor',
    hoveredXStroke:            '#FFF',
    
    cx: function () {
      return this.get('parentX') + this.get('parentBodyWidth');
    }.property('parentX', 'parentBodyWidth'),

    cyBinding: '.parentView.y'
  }),
  
  titleView: MySystem.EditableLabelView.design({
    isEditable:      NO,
    fontSizeBinding: '.parentView.fontSize',
    textColor:       '#000',
    textBinding:     '.parentView.title',
    centerXBinding:  '.parentView.centerX',
    centerYBinding:  '.parentView.titleY',
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
    var hMargin = this.get('horizontalMargin');
    var vMargin = this.get('verticalMargin');

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
          x:      hMargin + content.get('x'), // +((hMargin-this.get('imageWidth'))/2),  // center narrow images
          y:      vMargin + content.get('y'),
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
      
      var scaledHeight =  (targetHeight / srcHeight);
      var scaledWidth  =  (targetWidth  / srcWidth);
      var scalar = scaledWidth < scaledHeight ? scaledHeight : scaledWidth; 
      var newWidth = srcWidth * scalar;
      var newHeight = srcHeight * scalar;      
      // RunLoop here, or image won't change until mouse moves
      SC.RunLoop.begin();
        this.set('imageWidth', newWidth);
        this.set('imageHeight', newHeight);
      SC.RunLoop.end();
    }
  },
  
  // EVENT METHODS GO HERE:
  
  mouseEntered: function () {
    this.set('isHovered', YES);
    return YES;
  },
  
  mouseExited: function () {
    this.set('isHovered', NO);
    return YES;
  },
  
  removeButtonClicked: function () {
    MySystem.statechart.sendAction('deleteDiagramObject', this, this.get('content'));
    return YES;
  }
  
});

MySystem.NodeView.mixin({
  DROP_OFFSET: {x: 21, y: 16}
});

