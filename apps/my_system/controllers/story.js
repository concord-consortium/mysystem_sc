// ==========================================================================
// Project:   MySystem.story
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
MySystem.storyController = SC.ObjectController.create(
/** @scope MySystem.story.prototype */ {

  // TODO: Add your own code here.
	turnOffOtherButtons: function(buttonToLeaveOn) {
		// TODO: There's got to be a better way than this:
		var storyView = MySystem.mainPage.mainPane.childViews[0].bottomRightView.topLeftView.bottomRightView.childViews[1];
		var sentenceViews = storyView.get('contentView').childViews;
		sentenceViews.forEach(function(sentenceView) {
			sentenceView.childViews.forEach(function(childView) {
				if (childView.kindOf(SC.ButtonView) && childView != buttonToLeaveOn) {
					childView.set('value', NO);
				}
			});
		});
	},
	
	doneButtonPushed: function() {
		debugger;
		var storyView = MySystem.mainPage.mainPane.childViews[0].bottomRightView.topLeftView.bottomRightView.childViews[1];
		var sentenceViews = storyView.get('contentView').childViews;
		sentenceViews.forEach(function(sentenceView) {
			sentenceView.childViews.forEach(function(childView) {
				if (childView.kindOf(SC.ButtonView)) {
					childView.set('value', NO);
				}
			});
		});
	}
}) ;
