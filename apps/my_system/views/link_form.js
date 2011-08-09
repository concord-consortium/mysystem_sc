// ==========================================================================
// Project:   MySystem.NodeView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

MySystem.LinkFormView = SC.FormView.extend({
  contentBinding: SC.Binding.oneWay('MySystem.nodesController.allSelected').firstOnly(),
  childViews: "energy text".w(),

  text: SC.FormView.row("Label:", SC.TextFieldView.design({
    layout: {width: 150, height: 20 },
    contentValueKey: 'text'
  })),

  energy: SC.FormView.row("Energy:", SC.RadioView.design({
    // apparently it is vitally important that width be speficied prior to height in the RadioView layout...
    layout: { width: 150, height: 120, centerY: 0},
    itemsBinding: SC.Binding.oneWay('MySystem.activityController.energyTypes'),
    contentValueKey: 'energyType',
    itemTitleKey: 'label',
    itemValueKey: 'uuid',
    itemIsEnabledKey: 'isEnabled',
    layoutDirection: SC.LAYOUT_VERTICAL
  }))

});
