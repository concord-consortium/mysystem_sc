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
  canvasView: SC.outlet('parentView.parentView.parentView'),    // can't refer to MySystem.mainPage.mainPane.canvasView in tests...
  displayProperties: 'x y r isHovering dragLinkSrcTerminal stroke'.w(),

  x:                 0,
  y:                 0,
  r:                 function(){
                        return this.get('isHovering') ? 12 : 10;
                      }.property('isHovering'),
  normalFill:        '#ccc',
  hoverFill:         '#00F',
  draggingFill:      '#0F0',
  fillOpacity:       0.4,
  stroke:            '#333',
  strokeWidth:       '1',
  strokeOpacity:     '0.2',
  isLineDrag:        NO,
  dragX:            null,
  dragY:            null,
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
  }.property('isHovering', 'dragLinkSrcTerminal').cacheable(),

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
    this.set('dragLinkSrcTerminal', this);
    this.set('dragLinkEndTerminal', null);
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
    if (this.get('dragLinkSrcTerminal') === this) {
      this.set('dragLinkSrcTerminal',null);
    }
    if (!!this.get('dragLinkEndTerminal')) {
      MySystem.statechart.sendAction('rubberbandLinkComplete');
    } else {
      MySystem.statechart.sendAction('rubberbandLinkAbandoned');
    }
    return YES;
  },

  touchEnd: function (evt) {
    this.mouseUp(evt);
  },

  mouseEntered: function () {
    this.set('isHovering', YES);
    if (this.get('dragLinkSrcTerminal') && this.get('dragLinkSrcTerminal') != this) {
      this.set('dragLinkEndTerminal',this);
    }
    return YES;
  },

  mouseExited: function () {
    this.set('isHovering',NO);
    if (this.get('dragLinkEndTerminal') === this) {
      this.set('dragLinkEndTerminal',null);
    }
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
      y1 = this.get('startY'),
      y2 = this.get('endY'),
      isTopTerminal = this.get('parentView') == this.getPath('parentView.parentView.terminalA');
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
      this._raphaelCanvas = raphaelCanvas;
      this._arrowPath  = raphaelCanvas.path();
      this._arrowPath.attr(attrs.tail);
      this._arrowHead  = raphaelCanvas.path();
      this._arrowHead.attr(attrs.head);
      return raphaelCanvas.set().push(
        this._arrowPath,
        this._arrowHead
      );
    },

    render: function (context, firstTime) {
      if (firstTime) {
        context.callback(this, this.renderCallback, this.attrs());
        this.renderChildViews(context,firstTime);
      }
      else {
        var attrs = this.attrs();
        this._arrowPath.attr(attrs.tail);
        this._arrowHead.attr(attrs.head);
      }
    }

  })
});

