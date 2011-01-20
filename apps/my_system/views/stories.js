// ==========================================================================
// Project:   MySystem.StoriesView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.SplitView
*/
sc_require('views/user_story');

MySystem.StoriesView = SC.SplitView.extend({
  layoutDirection: SC.LAYOUT_HORIZONTAL,
  topLeftView: SC.LabelView.design({ // Assignment story
    layout: { top: 0, right: 0, left: 0 },
    anchorLocation: SC.ANCHOR_TOP,
    textAlign: SC.ALIGN_LEFT,
    backgroundColor: '#CCCCFF',
    tagName: "div",
    escapeHTML: NO,
    valueBinding: 'MySystem.storyController.content',
    canCollapse: YES
  }),
  dividerView: SC.SplitDividerView, // Divider for resizing up/down
  bottomRightView: MySystem.UserStoryView // User story
});