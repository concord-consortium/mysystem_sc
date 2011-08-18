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
  renderCallback: function (raphaelCanvas, lineAttrs, headAttrs, borderAttrs) {
    var tail = raphaelCanvas.path().attr(lineAttrs),
        head = raphaelCanvas.path().attr(headAttrs),
        border = raphaelCanvas.path().attr(borderAttrs),
        label = raphaelCanvas.text().attr(this._getLabelAttrs(tail)),
        labelBg = raphaelCanvas.rect().attr(this._getLabelBackgroundAttrs(raphaelCanvas, label));
    return raphaelCanvas.set().push(
      border,
      tail,
      head,
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

        raphaelObject,
        border,
        line,
        head;

    if (firstTime) {
      context.callback(this, this.renderCallback, lineAttrs, headAttrs, borderAttrs);
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
      label.attr(this._getLabelAttrs(line));
      labelBg.attr(this._getLabelBackgroundAttrs(this, label));

      labelBg.toFront();
      label.toFront();
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
    }
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
  }
});

