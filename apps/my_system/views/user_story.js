// ==========================================================================
// Project:   MySystem.UserStoryView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('views/sentence');

MySystem.UserStoryView = SC.View.extend({
  childViews: 'sentencesView addButtonView'.w(),

  backgroundColor: '#eeefff',
        
  sentencesView: SC.ScrollView.design({
    hasHorizontalScroller: NO,
    layout: { top: 5, right: 5, bottom: 30, left: 5 },
    contentView: SC.ListView.design({
      contentBinding: 'MySystem.storySentenceController.arrangedObjects',
      selectionBinding: 'MySystem.storySentenceController.selection',
      contentValueKey: "bodyText",
      rowHeight: 20,
      exampleView: MySystem.SentenceView,
      canEditContent: YES,
      canDeleteContent: YES,
      canReorderContent: YES
    })
  }),
  
  addButtonView: SC.ButtonView.design({
    layout: { bottom: 10, right: 15, height: 20, width: 150 },
    title: "Add sentence to story",
    target: "MySystem.storySentenceController",
    action: "addStorySentence",
    toolTip: "Add a sentence to the story"
  })
});
