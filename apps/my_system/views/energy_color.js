// ==========================================================================
// Project:   MySystem.EnergyColorView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This view is meant as an exampleView for a list of colors for a node.
  (see MySystem.TransformationBuilderPane.)

  @extends SC.View
*/
MySystem.EnergyColorView = SC.View.extend(
/** @scope MySystem.EnergyColorView.prototype */ {

  childViews: "color terminal".w(),
  color: SC.View.design({
    layout: { height: 25 },
    backgroundColorBinding: ".parentView.content"
  }),
  terminal: MySystem.Terminal.design({
    layout: { centerY: 0, centerX: 0 }
  })

});
