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
  childViews: "text".w(),
  text: SC.FormView.row("Label:", SC.TextFieldView.extend({
    layout: {height: 20, width: 150},
    contentValueKey: 'text'
  }))
});
