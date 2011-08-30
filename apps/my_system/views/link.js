// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/editable_label');
sc_require('views/terminal');
sc_require('views/remove_button');
sc_require('mixins/arrow_drawing');

/** @class

  Display class for displaying a Link. Expects its 'content' property to be a MySystem.Link record.

  @extends SC.View
*/
MySystem.LinkView = RaphaelViews.RaphaelView.extend(SC.ContentDisplay,
/** @scope MySystem.LinkView.prototype */ {

  displayProperties: 'content.endNode.x content.endNode.y content.startNode.x content.startNode.y lineColor borderColor borderOpacity lineWidth borderWidth'.w(),

  childViews: 'removeButtonView'.w(),
  
  // PROPERTIES
  lineColorBinding: '*content.color',
  borderColor: '#ADD8E6',

  borderOpacity: function () {
    return this.get('isSelected') ? 1.0 : 0;
  }.property('isSelected'),

  lineWidth: 6,
  borderWidth: 3,

  isHovered: NO,
  
  diagramControllerBinding: 'MySystem.nodesController',
  onlySelectedDiagramObjectBinding: '*diagramController.onlySelectedObject',
  
  isOnlySelectedDiagramObject: function () {
    return this.get('onlySelectedDiagramObject') === this.get('content');
  }.property('onlySelectedDiagramObject', 'content'),
  
  isRemoveButtonOccluded: NO,
  
  isRemoveButtonVisible: function () {
    return (this.get('isHovered') || this.get('isOnlySelectedDiagramObject')) && !this.get('isRemoveButtonOccluded');
  }.property('isHovered', 'isOnlySelectedDiagramObject', 'isRemoveButtonOccluded'),

  removeButtonX: 0,
  removeButtonY: 0,
  
  removeButtonView: MySystem.RemoveButtonView.design({
    isVisibleBinding: '.parentView.isRemoveButtonVisible', 
    normalCircleStrokeBinding: '.parentView.lineColor',
    normalXStrokeBinding: '.parentView.lineColor',   
    cxBinding: '.parentView.removeButtonX',
    cyBinding: '.parentView.removeButtonY'
  }),
  
  // RENDER METHODS
  renderCallback: function (raphaelCanvas, lineAttrs, headAttrs, borderAttrs, borderAttrs2) {
    var tail    = raphaelCanvas.path().attr(lineAttrs),
        head    = raphaelCanvas.path().attr(headAttrs),
        border  = raphaelCanvas.path().attr(borderAttrs),
        border2 = raphaelCanvas.path().attr(borderAttrs2),
        label   = raphaelCanvas.text().attr(this._getLabelAttrs(tail)),
        labelBg = raphaelCanvas.rect().attr(this._getLabelBackgroundAttrs(raphaelCanvas, label)),

        ret     = raphaelCanvas.set().push(
          border,
          border2,
          tail,
          head,
          labelBg,
          label.toFront()
        );
        
    this._setRemoveButtonLocation(ret);
    return ret;
  },

  render: function (context, firstTime) {
    var content   = this.get('content'),
        startNode = content.get('startNode'),
        endNode   = content.get('endNode'),
        startX    = 0,
        startY    = 0,
        endX      = 0,
        endY      = 0;

        if (!!startNode) { 
          startX = startNode.get('x');
          startY = startNode.get('y');
        }
        
        if (!!endNode) {
          endX = endNode.get('x');
          endY = endNode.get('y');
        }
        
        var startingAtTop = (content.get('startTerminal') === 'a'),
            endingAtTop   = (content.get('endTerminal') === 'a');
    
        if (startingAtTop) {
          startX = startX + 50;
          startY = startY;
        } else {
          startX = startX + 50;
          startY = startY + 110;
        }
        if (endingAtTop) {
          endX = endX + 50;
          endY = endY;
        } else {
          endX = endX + 50;
          endY = endY + 110;
        }

        var pathStr   = MySystem.ArrowDrawing.arrowPath(startX,startY,endX,endY,startingAtTop,endingAtTop);
        var lineColor = this.get('lineColor') || "#000099";

        var borderAttrs = {
          'path':           pathStr.tail + pathStr.head,
          'stroke':         this.get('borderColor'),
          'opacity':        this.get('borderOpacity'),
          'stroke-width':   this.get('lineWidth') + 2 + 2 * this.get('borderWidth'),  // the border "around" the line is really a fat line behind it
          'stroke-linecap': 'round'
        },
        
        borderAttrs2 = {    // a white line of separation between the arrow and the border
          'path':           pathStr.tail + pathStr.head,
          'stroke':         '#FFFFFF',
          'opacity':        this.get('borderOpacity'),
          'stroke-width':   this.get('lineWidth') + 3,
          'stroke-linecap': 'round'
        },

        lineAttrs = {
          'path':           pathStr.tail,
          'stroke':         lineColor,
          'stroke-width':   this.get('lineWidth'),
          'stroke-linecap': 'round'
        },
        
        headAttrs = {
          'path':           pathStr.head,
          'stroke':         lineColor,
          'fill':           lineColor,
          'stroke-width':   this.get('lineWidth'),
          'stroke-linecap': 'round'
        },

        raphaelObject,
        border,
        border2,
        head,
        line,
        labelBg,
        label;

    if (firstTime) {
      context.callback(this, this.renderCallback, lineAttrs, headAttrs, borderAttrs, borderAttrs2);
      this.renderChildViews(context, firstTime);
    }
    else {
      raphaelObject = this.get('raphaelObject');
      border        = raphaelObject.items[0];
      border2       = raphaelObject.items[1];
      line          = raphaelObject.items[2];
      head          = raphaelObject.items[3];
      labelBg       = raphaelObject.items[4];
      label         = raphaelObject.items[5];

      border.attr(borderAttrs);
      border2.attr(borderAttrs2);
      line.attr(lineAttrs);
      head.attr(headAttrs);
      label.attr(this._getLabelAttrs(line));
      labelBg.attr(this._getLabelBackgroundAttrs(this, label));

      labelBg.toFront();
      label.toFront();
      
      this._setRemoveButtonLocation(raphaelObject);
    }
  },
  
  _getLabelAttrs: function(path) {
    if (path.getTotalLength() < 1) return {};
    
    var center = path.getPointAtLength(path.getTotalLength() * (2/3));
    var text = this.get('content').get('text');
    
    return {
      'x':              center.x,
      'y':              center.y,
      'fill':           'black',
      'text':           !!text ? text : "" 
    };
  },

  _getLabelBackgroundAttrs: function(canvas, label) {
    var bb = label.getBBox();
    if (bb.height === 0){
      return {};
    }
    var hpad = 10;
    var vpad = 6;
    return {
      'x':              bb.x - hpad/2,
      'y':              bb.y - vpad/2,
      'width':          bb.width + hpad,
      'height':         bb.height + vpad + 1, // offset just a little more on the bottom so the text looks visually centered
      'r':              5,
      'fill':           'white',
      'stroke':         '#444444',
      'stroke-width':   1,
      'stroke-opacity': 0.5
    };
  },
  
  _setRemoveButtonLocation: function (raphaelObject) {
    var line = raphaelObject.items[2],
        distanceAlongLine   = 35,
        distanceAlongNormal = 20,
        len, p1, p2, scale, dx, dy, x, y, occluded;
        
    if (line.attr('path').length < 1) return;     // this can happen after our content is destroyed
    
    len = line.getTotalLength();
    p2  = line.getPointAtLength(len);
    
    if (len > 50) {
      p1 = line.getPointAtLength(len - distanceAlongLine);
      
      dx = p2.x - p1.x;
      dy = p2.y - p1.y;
      scale = distanceAlongNormal / distanceAlongLine * (dx > 0 ? 1 : -1);
      
      x = p1.x + scale * dy;
      y = p1.y - scale * dx;
      occluded = NO;
    }
    else {
      x = 0;
      y = 0;
      occluded = YES;
    }
        
    this.set('removeButtonX', x);
    this.set('removeButtonY', y);
    this.set('isRemoveButtonOccluded', occluded);
  },
  
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
  }
  
});

