// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/editable_label');
sc_require('views/terminal');
sc_require('mixins/arrow_drawing');

/** @class

  Display class for displaying a Link. Expects its 'content' property to be a MySystem.Link record.

  @extends SC.View
*/
MySystem.LinkView = RaphaelViews.RaphaelView.extend(SC.ContentDisplay,
/** @scope MySystem.LinkView.prototype */ {

  displayProperties: 'content.endNode.x content.endNode.y content.startNode.x content.startNode.y lineColor borderColor borderOpacity lineWidth borderWidth'.w(),

  // PROPERTIES
  lineColorBinding: '*content.color',
  borderColor: '#FFFF00',

  borderOpacity: function () {
    return this.get('isSelected') ? 1.0 : 0;
  }.property('isSelected'),

  lineWidth: 3,
  borderWidth: 3,

  // RENDER METHODS
  renderCallback: function (raphaelCanvas, lineAttrs, headAttrs, borderAttrs, labelAttrs) {
    var label = raphaelCanvas.text().attr(labelAttrs);
    var labelBg = raphaelCanvas.rect().attr(this._getLabelBackgroundAttrs(raphaelCanvas, label));
    return raphaelCanvas.set().push(
      raphaelCanvas.path().attr(borderAttrs),
      raphaelCanvas.path().attr(lineAttrs),
      raphaelCanvas.path().attr(headAttrs),
      labelBg,
      label.toFront()
    );
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
    
        if (content.get('startTerminal') === 'a') {
          startX = startX + 50;
          startY = startY + 10;
        } else {
          startX = startX + 50;
          startY = startY + 110;
        }
        if (content.get('endTerminal') === 'a') {
          endX = endX + 50;
          endY = endY + 10;
        } else {
          endX = endX + 50;
          endY = endY + 110;
        }
        
        // offset the labels to the 1/3 mark closest to the destination to help avoid overlapping labels
        var centerX = (endX-startX)*2/3.0 + startX;
        var centerY = (endY-startY)*2/3.0 + startY;

        var pathStr   = MySystem.ArrowDrawing.arrowPath(startX,startY,endX,endY);
        var lineColor = this.get('lineColor') || "#000099";

        var borderAttrs = {
          'path':           pathStr.tail + pathStr.head,
          'stroke':         this.get('borderColor'),
          'opacity':        this.get('borderOpacity'),
          'stroke-width':   this.get('lineWidth') + 2 * this.get('borderWidth'),  // the border "around" the line is really a fat line behind it
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

        labelAttrs =  {
          'x':              centerX,
          'y':              centerY,
          'fill':           'black',
          'text':           content.get('text')
        },

        raphaelObject,
        border,
        line,
        head,
        label;

    if (firstTime) {
      context.callback(this, this.renderCallback, lineAttrs, headAttrs, borderAttrs, labelAttrs);
    }
    else {
      raphaelObject = this.get('raphaelObject');
      border        = raphaelObject.items[0];
      line          = raphaelObject.items[1];
      head          = raphaelObject.items[2];
      labelBg       = raphaelObject.items[3];
      label         = raphaelObject.items[4];

      border.attr(borderAttrs);
      line.attr(lineAttrs);
      head.attr(headAttrs);
      label.attr(labelAttrs);
      labelBg.attr(this._getLabelBackgroundAttrs(this, label));

      labelBg.toFront();
      label.toFront();
    }
  },

  _getLabelBackgroundAttrs: function(canvas, label) {
    var bb = label.getBBox();
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
  }
});

