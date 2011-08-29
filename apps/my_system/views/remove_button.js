// ==========================================================================
// Project:   MySystem.RemoveButtonView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

MySystem.RemoveButtonView = RaphaelViews.RaphaelView.extend({
  displayProperties:      'cx cy circleStroke circleFill'.w(),

  isHovered: NO,
  
  r:  12,
  cx: 0,
  cy: 0,
  
  circleStroke: function () {
    return this.get('isHovered') ? this.get('hoveredCircleStroke') : this.get('normalCircleStroke');
  }.property('isHovered', 'normalCircleStroke', 'hoveredCircleStroke'),
  
  circleFill: function () {
    return this.get('isHovered') ? this.get('hoveredCircleFill') : this.get('normalCircleFill');
  }.property('isHovered', 'normalCircleFill', 'hoveredCircleFill'),
  
  xStroke:function () {
    return this.get('isHovered') ? this.get('hoveredXStroke') : this.get('normalXStroke');
  }.property('isHovered', 'normalXStroke', 'hoveredXStroke'),
  
  renderCallback: function (raphaelCanvas, circleAttrs, xAttrs) {
    return raphaelCanvas.set().push(
      raphaelCanvas.circle().attr(circleAttrs),
      raphaelCanvas.path().attr(xAttrs)
    );
  },
  
  render: function (context, firstTime) {
    var cx = this.get('cx') || 0,
        cy = this.get('cy') || 0,
          
        circleAttrs = {
          cx:     cx,
          cy:     cy,
          r:      this.get('r'),
          stroke: this.get('circleStroke'),
          fill:   this.get('circleFill'),
          'stroke-width':  3
        },
        
        d = 5,
        
        xPath = ['M', cx - d, cy - d, 
                 'L', cx + d, cy + d,
                 'M', cx - d, cy + d, 
                 'L', cx + d, cy - d].join(' '),

        xAttrs = {
          'path':         xPath,
          'stroke':       this.get('xStroke'),
          'stroke-width': 3
        },
    
        raphaelObject,
        raphaelCircle,
        raphaelX;
    
    if (firstTime) {
      context.callback(this, this.renderCallback, circleAttrs, xAttrs);
    }
    else {
      raphaelObject = this.get('raphaelObject');
      raphaelCircle = raphaelObject.items[0];
      raphaelX      = raphaelObject.items[1];

      raphaelCircle.attr(circleAttrs);
      raphaelX.attr(xAttrs);
    }
  },
  
  mouseEntered: function () {
    this.set('isHovered', YES);
    return YES;
  },
  
  mouseExited: function () {
    this.set('isHovered', NO);
    return YES;
  },
  
  mouseDown: function () {
    return this.get('parentView').removeButtonClicked();
  }
  
});
