// ==========================================================================
// Project:   MySystem.NodeFormView
// Copyright: ©2011 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

MySystem.NodeFormView = SC.FormView.extend({
  contentBinding: SC.Binding.oneWay('MySystem.nodesController.selection').firstIfType(MySystem.Node),
  childViews: "image title".w(),

  image: SC.FormView.row("Image:", SC.TextFieldView.design({
    layout: {width: 150, height: 20 },
    contentValueKey: 'image'
  })),

  image: SC.FormView.row("Title:", SC.TextFieldView.design({
    layout: {width: 150, height: 20 },
    contentValueKey: 'title'
  }))
});
