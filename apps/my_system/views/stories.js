// ==========================================================================
// Project:   MySystem.StoriesView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.SplitView
*/
sc_require('views/user_story');

MySystem.StoriesView = SC.SplitView.extend({
  layoutDirection: SC.LAYOUT_HORIZONTAL,

  topLeftView: MySystem.InstructionView,
  dividerView: SC.SplitDividerView, // Divider for resizing up/down
  bottomRightView: MySystem.UserStoryView // User story
});
