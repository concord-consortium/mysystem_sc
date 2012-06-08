// ==========================================================================
// Project:   MySystem.Terminal
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('mixins/arrow_drawing');
sc_require('controllers/terminal');
/** @class

@extends RaphaelViews.RaphaelView
*/
MySystem.TerminalView = RaphaelViews.RaphaelView.extend({
  childViews: 'inProgressLinkView'.w(),
  canvasView: SC.outlet('parentView.parentView.parentView'),    // can't refer to MySystem.mainPage.mainPane.canvasView in tests...
  displayProperties: 'x y r isHovering radius dragLinkSrcTerminal dragLinkEndTerminal stroke'.w(),

  x:                 0,
  y:                 0,
  radiusBinding:     SC.Binding.oneWay("MySystem.activityController.content.terminalRadius"),

  r:                 function(){
                        return this.get('isHovering') ? this.get('radius') * 1.25 : this.get('radius');
                      }.property('isHovering, radius'),

  normalFill:        '#ccc',
  hoverFill:         '#00F',
  draggingFill:      '#0F0',
  fillOpacity:       0.4,
  stroke:            '#333',
  strokeWidth:       '1',
  strokeOpacity:     '0.2',
  isLineDrag:        NO,
  dragX:             null,
  dragY:             null,
  _raphaelCircle:    null,

  dragLinkSrcTerminalBinding: 'MySystem.nodesController.dragLinkSrcTerminal',
  dragLinkEndTerminalBinding: 'MySystem.nodesController.dragLinkEndTerminal',
  isHovering:        NO,

  fill: function() {
    var hover    = this.get('isHovering'),
        isSrc    = this.get('dragLinkSrcTerminal') == this,
        isEnd    = this.get('dragLinkEndTerminal') == this;
    
    if (hover) {
      return isEnd ? this.get('draggingFill') : this.get('hoverFill');
    }
    
    return isSrc ? this.get('hoverFill') :this.get('normalFill');
  }.property('isHovering', 'dragLinkSrcTerminal', 'dragLinkEndTerminal'),

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
    MySystem.statechart.gotoState('ADDING_LINK');
    // calculate difference between svg coords and screen coords
    this._xTransform = this.get('canvasView').$().offset().left;
    this._yTransform = this.get('canvasView').$().offset().top;
    this.set('dragX', this.get('x'));
    this.set('dragY', this.get('y'));
    this.set('isLineDrag', YES);

    MySystem.terminalController.dragStart(this);
    return YES;
  },

  touchStart: function (evt) {
    return this.mouseDown(evt);
  },

  mouseDragged: function (evt) {
    return this._drag(evt);
  },

  touchesDragged: function (evt) {
    // fake mouseEntered and mouseExited events
    var rootResponder = this.getPath('pane.rootResponder'),
        target = document.elementFromPoint(evt.pageX, evt.pageY),
        targetView = SC.$(target).view()[0];
    
    if(this._lastEnteredView && this._lastEnteredView != targetView){
      this._lastEnteredView.tryToPerform('mouseExited', evt);
    }

    targetView.tryToPerform('mouseEntered', evt);
    this._lastEnteredView = targetView;

    return this.mouseDragged(evt);
  },

  _drag: function (evt) {
    if (!this.get('isLineDrag')) {
      return NO;
    }
    this.set('dragX', evt.pageX - this._xTransform);
    this.set('dragY', evt.pageY - this._yTransform);
    return YES;
  },

  mouseUp: function (evt) {
    // don't forget to handle the last mouse movement!
    this._drag(evt);
    this.set('isLineDrag', NO);

    MySystem.terminalController.dragComplete();
    return YES;
  },

  touchEnd: function (evt) {
    this.mouseUp(evt);
  },

  mouseEntered: function (evt) {
    MySystem.terminalController.focusIn(this);
    return YES;
  },

  mouseExited: function (evt) {    
    MySystem.terminalController.focusOut(this);
    return YES;
  },
  

  // Rubber-Banding In-Progress Link
  //
  //
  inProgressLinkView:  RaphaelViews.RaphaelView.design({
    displayProperties: 'startX startY endX endY isVisible'.w(),
    startXBinding:     '.parentView.x',
    startYBinding:     '.parentView.y',
    endXBinding:       '.parentView.dragX',
    endYBinding:       '.parentView.dragY',
    isVisibleBinding:  '.parentView.isLineDrag',
    strokeWidth:       3,
    strokeColor:       "#0000FF",
    _arrowPath:        null,
    _arrowHead:        null,

    path: function() {
      var x1 = this.get('startX'),
      x2 = this.get('endX'),
      mod_x = x1 > x2 ? 10 : -10,

      y1 = this.get('startY'),
      y2 = this.get('endY') - 10,
      mod_y = y1 > y2 ? 10 : -10,

      isTopTerminal = this.get('parentView') == this.getPath('parentView.parentView.terminalA');
      // We need to draw a bit offset from the mouse event,
      // because 'pointer-events: none' doesn't seem to be working
      // on FireFox, and we need to avoid 'mouse in' and 'mouse out' errors
      // when the cursor is at the apex of the arrow-head.
      y2 = y2 < y1 ? y2 + 20 : y2 + 3;
      x2 = x2 > x1 ? x2 - 3 : x2 + 3;
      return MySystem.ArrowDrawing.arrowPath(x1,y1,x2,y2,isTopTerminal,isTopTerminal,null,null,null,0);
    },

    attrs: function() {
      var paths = this.path();
      return {
        tail: {
          'path': paths.tail,
          'stroke': this.get('strokeColor'),
          'stroke-width': this.get('strokeWidth')
        },
        head: {
          'path': paths.head,
          'stroke': this.get('strokeColor'),
          'fill': this.get('strokeColor'),
          'stroke-width': this.get('strokeWidth')
        }
      };
    },

    _raphaelCanvas: null,

    renderCallback: function (raphaelCanvas, attrs) {
      var group;
      this._raphaelCanvas = raphaelCanvas;
      this._arrowPath  = raphaelCanvas.path();
      this._arrowPath.attr(attrs.tail);
      // ignore mouse events for the SVG arrow head: 
      // http://www.w3.org/TR/SVG/interact.html
      this._arrowPath.node.style['pointer-events'] = "none";
      
      this._arrowHead  = raphaelCanvas.path();
      this._arrowHead.attr(attrs.head);
      this._arrowHead.node.style['pointer-events'] = "none";
      group = raphaelCanvas.set();
      group.push(
        this._arrowPath,
        this._arrowHead
      );
      return group;
    },

    render: function (context, firstTime) {
      if (firstTime) {
        context.callback(this, this.renderCallback, this.attrs());
        this.renderChildViews(context,firstTime);
      }
      else {
        var attrs = this.attrs();
        this._arrowPath.attr(attrs.tail);
        this._arrowPath.node.style['pointer-events'] = "none";

        this._arrowHead.attr(attrs.head);
        this._arrowHead.node.style['pointer-events'] = "none";
      }
    }

  })
});

