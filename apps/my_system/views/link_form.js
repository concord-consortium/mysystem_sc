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

MySystem.LinkFormView = SC.View.extend({
  contentBinding: SC.Binding.single('MySystem.nodesController.allSelected').oneWay(),
  fields: "text".w(),
  text: Forms.FormView.row(SC.TextFieldView, {
    fieldKey: "text",
    fieldLabel: "Label:"
  })
});
