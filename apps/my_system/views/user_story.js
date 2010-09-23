// ==========================================================================
// Project:   MySystem.UserStoryView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('views/sentence');

MySystem.UserStoryView = SC.View.extend({
  childViews: 'toolbar sentencesView'.w(),
  toolbar: SC.ToolbarView.design({
    layout: { top: 0, left: 0, right: 0, height: 30 },
    childViews: 'addButton'.w(),
    anchorLocation: SC.ANCHOR_TOP,
    addButton: SC.ButtonView.design({
      layout: { centerY: 0, height: 20, width: 150, left: 10 },
      title: "Add sentence to story",
      target: "MySystem.storySentenceController",
      action: "addStorySentence",
      toolTip: "Add a sentence to the story"
    })
    // showButton: SC.ButtonView.design({
    //   layout: { centerY: 0, height: 20, width: 180, left: 170 },
    //   title: "Connect sentence to diagram",
    //   isEnabled: NO,
    //   toolTip: "Select a sentence and click here to connect it to the diagram"
    // })
  }),
  sentencesView: SC.ScrollView.design({
    hasHorizontalScroller: NO,
    layout: { top: 30, bottom: 0, left: 0, right: 0 },
    backgroundColor: 'white',
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
  })
});