// ==========================================================================
// Project:   MySystem.EnergyColorView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  This view is meant as an exampleView for a list of colors for a node.
  (see MySystem.TransformationBuilderPane.)

  @extends SC.View
*/
MySystem.EnergyColorView = SC.View.extend(LinkIt.NodeView,
/** @scope MySystem.EnergyColorView.prototype */ {

  layout: { top: 0, left: 0, width: 40, height: 25 },
  classNames: "energy-type".w(),
  displayProperties: "content isSelected".w(),
  content: null,
  isSelected: NO,
  
  childViews: "color terminal".w(),
  color: SC.View.design({
    layout: { height: 25, width: 80 },
    backgroundColorBinding: ".parentView*content.color"
  }),
  terminal: MySystem.Terminal.design({
    layout: { centerY: 0, centerX: 0, width: 10, height: 10 },
    nodeBinding: '.parentView*content',
    classNames: "transformation-terminal".w(),
    terminal: 'a'
  }),

  /**
    Implements LinkIt.NodeView.terminalViewFor()
  */
  terminalViewFor: function (terminalKey) {
    return this.terminal;
  }

});
