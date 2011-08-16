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
  renderCallback: function (raphaelCanvas, lineAttrs, borderAttrs) {
    return raphaelCanvas.set().push(
      raphaelCanvas.path().attr(borderAttrs),
      raphaelCanvas.path().attr(lineAttrs)
    );
  },

  render: function (context, firstTime) {
    var content   = this.get('content'),
        startNode = content.get('startNode'),
        endNode   = content.get('endNode'),
        startX    = startNode.get('x'),
        startY    = startNode.get('y'),
        endX      = endNode.get('x'),
        endY      = endNode.get('y');

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
        var pathStr   = MySystem.ArrowDrawing.arrowPath(startX,startY,endX,endY);

        var lineColor = this.get('lineColor') || "#000099";

        var borderAttrs = {
          'path':           pathStr,
          'stroke':         this.get('borderColor'),
          'opacity':        this.get('borderOpacity'),
          'stroke-width':   this.get('lineWidth') + 2 * this.get('borderWidth'),  // the border "around" the line is really a fat line behind it
          'stroke-linecap': 'round'
        },

        lineAttrs = {
          'path':           pathStr,
          'stroke':         lineColor,
          'fill':           lineColor,
          'stroke-width':   this.get('lineWidth'),
          'stroke-linecap': 'round'
        },

        raphaelObject,
        border,
        line;

    if (firstTime) {
      context.callback(this, this.renderCallback, lineAttrs, borderAttrs);
    }
    else {
      raphaelObject = this.get('raphaelObject');
      border        = raphaelObject.items[0];
      line          = raphaelObject.items[1];

      border.attr(borderAttrs);
      line.attr(lineAttrs);
    }
  }
});

