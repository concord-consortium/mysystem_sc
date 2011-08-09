// ==========================================================================
// Project:   MySystem.StoryFormView
// Copyright: ©2011 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

MySystem.StoryFormView = SC.FormView.extend({
  contentBinding: SC.Binding.oneWay('MySystem.storyController.content'),
  childViews: "story".w(),

  story: SC.FormView.row("Story:", SC.TextFieldView.design({
    layout: {width: 150, height: 20 },
    contentValueKey: 'storyHtml'
  }))

});
