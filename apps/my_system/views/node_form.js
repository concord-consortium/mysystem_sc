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
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  contentBinding: SC.Binding.oneWay('MySystem.nodesController.selection').firstIfType(MySystem.Node),
  childViews: function() {
    var children = ["title"];
    if (MySystem.activityController.get('enableNodeDescriptionEditing')) {
      children.push("description");
    }
    return children;
  }.property(),
  isVisible: NO,
  contentChanged: function() {
    var c = this.get('content');
    if (!!c && c.instanceOf(MySystem.Node)) {
      this.set('isVisible', YES);
    } else {
      this.set('isVisible', NO);
    }
  }.observes('*content.guid'),

  title: SC.FormView.row("Title:", SC.TextFieldView.design({
    layout: {width: 150, height: 20 },
    contentValueKey: 'title'
  })),

  description: SC.FormView.row("Description:", SC.TextFieldView.design({
    layout: {width: 150, height: 60, centerY: 0 },
    contentValueKey: 'description',
    isTextArea: YES
  }))

});
