// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt SCUI */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
MySystem.NodeView = SC.View.extend(SCUI.Cleanup, LinkIt.NodeView,
/** @scope MySystem.NodeView.prototype */ {

  layout: { top: 0, left: 0, width: 100, height: 100 },

  displayProperties: 'content isSelected'.w(),

  content: null,
  isSelected: false,
  
  childViews: 'label inputTerminal outputTerminal'.w(),
  
  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  label: SC.LabelView.design({
    layout: { centerY: 0, centerX: 0, width: 100, height: 25 },
    classNames: ['name'],
    textAlign: SC.ALIGN_CENTER,    
    valueBinding: '.parentView*content.title',
    isEditable: YES
  }),
  
  inputTerminal: SC.View.design(LinkIt.Terminal, {
    layout: { left: 50, top: -5, width: 10, height: 10 },
    classNames: ['input-terminal'],
    linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#A5C0DC', cap: LinkIt.ROUND},
    nodeBinding: '.parentView*content',
    terminal: 'input',
    direction: LinkIt.INPUT_TERMINAL
  }),
  
  outputTerminal: SC.View.design(LinkIt.Terminal, {
    layout: { left: 50, bottom: -5, width: 10, height: 10 },
    classNames: ['output-terminal'],
    linkStyle: { lineStyle: LinkIt.STRAIGHT, width: 3, color: '#A5C0DC', cap: LinkIt.ROUND},
    nodeBinding: '.parentView*content',
    terminal: 'output',
    direction: LinkIt.OUTPUT_TERMINAL
  }),

  // ..........................................................
  // LINKIT Specific for the view
  // 
  /**
    Implements LinkIt.NodeView.terminalViewFor()
  */
  terminalViewFor: function (terminalKey) {
    return this[terminalKey + 'Terminal'];
  }

});
