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
sc_require('MySystem.Link');

MySystem.NodeView = SC.View.extend(SCUI.Cleanup, LinkIt.NodeView,
/** @scope MySystem.NodeView.prototype */ {
  
  layout: { top: 0, left: 0, width: 100, height: 120 },
  classNames: 'node'.w(),
  
  displayProperties: 'content isSelected'.w(),
  content: null,
  isSelected: false,
  
  childViews: 'icon label aTerminal bTerminal'.w(),
  
  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  icon: SC.ImageView.design({
    classNames: 'image',
    useImageCache: true,
    layout: { top: 20, width:50, height:70, centerX: 0},
    // value: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png',
    valueBinding: '.parentView*content.image'
  }),

  label: SC.LabelView.design({
    layout: { bottom: 12, centerX: 0, width: 100, height: 25 },
    classNames: ['name'],
    textAlign: SC.ALIGN_CENTER,    
    valueBinding: '.parentView*content.title',
    isEditable: YES
  }),
  
  aTerminal: SC.View.design(LinkIt.Terminal, {
    layout: { left: 45, top: +5, width: 10, height: 10 },
    classNames: 'input terminal'.w(),
    linkStyle: { lineStyle: LinkIt.VERTICAL_CURVED, width: 3, color: '#A5C0DC', cap: LinkIt.ROUND},
    label: { text: "term a input", fontSize: 16, backgroundColor: "#FFFFFF"},
    nodeBinding: '.parentView*content',
    terminal: 'a',
    linkClass: MySystem.Link
    // direction: LinkIt.INPUT_TERMINAL
  }),
  
  bTerminal: SC.View.design(LinkIt.Terminal, {
    layout: { left: 45, bottom: +5, width: 10, height: 10 },
    classNames: 'output terminal'.w(),
    linkStyle: { lineStyle: LinkIt.VERTICAL_CURVED, width: 3, color: '#A5C0DC', cap: LinkIt.ROUND},
    label: { text: "term b output", fontSize: 16, backgroundColor: "#FFFFFF" },
    nodeBinding: '.parentView*content',
    terminal: 'b',
    linkClass: MySystem.Link
    // direction: LinkIt.OUTPUT_TERMINAL
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
