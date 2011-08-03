// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('models/link');
sc_require('views/terminal');

MySystem.NodeView = SC.View.extend(LinkIt.NodeView,
/** @scope MySystem.NodeView.prototype */ {

  layout: { top: 0, left: 0, width: 100, height: 120 },
  classNames: 'node'.w(),

  displayProperties: 'content isSelected'.w(),
  content: null,
  isSelected: false,

  childViews: 'icon label aTerminal bTerminal'.w(), //  transformationIcon

  /** @private */
  _runAction: function(evt) {
    var action = this.get('action'),
        target = this.get('target') || null;

    if (action) {
      this.getPath('pane.rootResponder').sendAction(action, target, this, this.get('pane'));
    }
  },

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  icon: SC.ImageView.design({
    classNames: 'image',
    useImageCache: true,
    layout: { top: 20, width:50, height:70, centerX: 0},
    valueBinding: '.parentView*content.image'
  }),

  label: SC.LabelView.design({
    layout: { bottom: 12, centerX: 0, width: 100, height: 25 },
    classNames: ['name'],
    textAlign: SC.ALIGN_CENTER,    
    valueBinding: '.parentView*content.title',
    isEditable: YES
  }),

  aTerminal: MySystem.Terminal.design({
    nodeBinding: '.parentView*content',
    classNames: 'input terminal'.w(),
    terminal: 'a'
    // direction: LinkIt.INPUT_TERMINAL
  }),

  bTerminal: MySystem.Terminal.design({
    layout: { left: 45, bottom: +5, width: 10, height: 10 },
    nodeBinding: '.parentView*content',
    classNames: 'output terminal'.w(),
    terminal: 'b'
    // direction: LinkIt.OUTPUT_TERMINAL
  }),

  /* Temporarily removed for Berkeley 0.1 release */
  // transformationIcon: SC.ImageView.design({
  //   classNames: 'image',
  //   useImageCache: true,
  //   layout: {left: 5, bottom: +5, width: 20, height:20 },
  //   valueBinding: '.parentView*content.transformationIcon',
  //   toolTipBinding: '.parentView*content.toolTip',
  //   click: function(evt) {
  //     if (this.get('toolTip')) { // If tooltip is null, there's nothing to do
  //       MySystem.transformationsController.openTransformationBuilder(this.get('parentView').get('content'));
  //     }
  //     return YES;
  //   }
  // }),

  // ..........................................................
  // LINKIT Specific for the view
  // 
  /**
    Implements LinkIt.NodeView.terminalViewFor()
  */
  terminalViewFor: function (terminalKey) {
    return this[terminalKey + 'Terminal'];
  },

  /** 
  * implement action behavior of see sproutcore/desktop/view/button
  */
  // doubleClick: function(evt, skipHoldRepeat) {
  //     this._runAction(evt);
  // }

  /**
  * Stuff for DropTarget
  */
  dragStarted: function(drag, evt) {},
  dragEntered: function(drag, evt) {},
  dragUpdated: function(drag, evt) {},
  dragExited: function(drag, evt) {},
  dragEnded: function(drag, evt) {},
  computeDragOperations: function(drag, evt, ops) {
    if (drag.hasDataType('Boolean')) {
      return SC.DRAG_LINK;
    } else {
      return SC.DRAG_NONE;
    }
  },
  acceptDragOperation: function(drag, operation) { return true; },
  performDragOperation: function(drag, operation) {
    this.content.set('transformer', true);
    return operation;
  }
});
