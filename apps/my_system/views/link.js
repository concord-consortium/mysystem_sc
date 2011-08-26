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
  borderColor: '#ADD8E6',

  borderOpacity: function () {
    return this.get('isSelected') ? 1.0 : 0;
  }.property('isSelected'),

  lineWidth: 6,
  lineSpacing: 2,
  borderWidth: 3,

  // RENDER METHODS
  renderCallback: function (raphaelCanvas, lineAttrs, headAttrs, borderAttrs, borderAttrs2) {
    var tail = raphaelCanvas.path().attr(lineAttrs),
        head = raphaelCanvas.path().attr(headAttrs),
        border = raphaelCanvas.path().attr(borderAttrs),
        border2 = raphaelCanvas.path().attr(borderAttrs2),
        label = raphaelCanvas.text().attr(this._getLabelAttrs(tail)),
        labelBg = raphaelCanvas.rect().attr(this._getLabelBackgroundAttrs(raphaelCanvas, label));
    return raphaelCanvas.set().push(
      border,
      border2,
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
        endY      = 0,
        startIdx  = 0,
        endIdx    = 0,
        startWidth = 10,
        endWidth  = 10,
        lineWidth = this.get('lineWidth'),
        lineSpacing = this.get('lineSpacing');

        if (!!startNode) { 
          startX = startNode.get('x');
          startY = startNode.get('y');
          var sLinks = startNode.get('outLinks');
          startIdx = sLinks.indexOf(content);
          startWidth = sLinks.get('length') * (lineWidth + lineSpacing);
        }

        if (!!endNode) {
          endX = endNode.get('x');
          endY = endNode.get('y');
          var eLinks = endNode.get('inLinks');
          endIdx = eLinks.indexOf(content);
          endWidth = eLinks.get('length') * (lineWidth + lineSpacing);
        }

        // Spread the links along the edge of the node, so they're not all pointing at the same spot
        // always start on the bottom
        var startLeft = startX + (100 - startWidth)/2;
        startX = startLeft + (startIdx * (lineWidth + lineSpacing));
        startY = startY + 110;

        // always end at the top
        var endLeft = endX + (100 - endWidth)/2;
        endX = endLeft + (endIdx * (lineWidth + lineSpacing));
        // endY = endY;

        var pathStr   = MySystem.ArrowDrawing.arrowPath(startX,startY,endX,endY,NO,YES);
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
        line,
        head;

    if (firstTime) {
      context.callback(this, this.renderCallback, lineAttrs, headAttrs, borderAttrs, borderAttrs2);
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
  }
});

