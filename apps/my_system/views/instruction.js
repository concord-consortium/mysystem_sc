// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================

/*globals MySystem  */
require('views/sumbissions_feedback_label');

MySystem.InstructionView = SC.View.extend({
  childViews: 'assignmentView clearButtonView numSubmissions checkButtonView saveButtonView saveStatusView '.w(),
  backgroundColor: '#eeefff',
  
  canCollapse: YES,
  
  assignmentView: SC.LabelView.design({
    valueBinding: 'MySystem.storyController.content',
  
    anchorLocation: SC.ANCHOR_TOP,  
    layout: { top: 5, right: 222, bottom: 5, left: 5 },

    tagName: "div",
    escapeHTML: NO,
    textAlign: SC.ALIGN_LEFT
  }),
  
  clearButtonView: SC.ButtonView.design({
    layout: { right: 150, bottom: 10, height: 25, width: 80 },
    title: 'Clear',
    toolTip: 'Clear everything from your diagram',
    action: 'clearCanvas'
  }),
  numSubmissions: MySystem.SubmissionsFeedbackLabel.design({
  // numSubmissions: SC.LabelView.design({
    layout: { right: 15, bottom: 40, height: 20, width: 220},
    value: 'test',
    textAlign: SC.ALIGN_RIGHT,
    valueBinding: 'MySystem.activityController.submissionInfo',
    visible:  YES
  }),
  checkButtonView: SC.ButtonView.design({
    layout: { right: 15, bottom: 10, height: 25, width: 120 },
    // NP Sept. 1, 2011: Kelley in Berkeley wanted this label changed
    // from Check to Submit.
    title: 'Submit Diagram',
    toolTip: 'Submit your diagram',
    action: 'checkButtonPressed'
  }),
  
  // this starts out not enabled so people don't think they can actually save
  saveButtonView: SC.ButtonView.design({
    layout: { right: 15, top: 5, height: 25, width: 80 },
    title: 'Save',
    isEnabledBinding: 'MySystem.savingController.enableManualSave',
    toolTip: 'Save your diagram',
    action: 'saveButtonPressed'
  }),
  
  saveStatusView: SC.LabelView.design({
    layout: { right: 100, top: 9, height: 25, width: 115 },
    textAlign: SC.ALIGN_LEFT,
		displayProperties: 'isDirty value'.w(),
    valueBinding: 'MySystem.savingController.saveStatusText',
		isDirtyBinding: 'MySystem.savingController.dataIsDirty',
		render: function(context, firstTime) {
			if (!this.get('isDirty')) {
				context.addClass('save_clean_class');
			} else {
				context.addClass('save_dirty_class');
			}
			return sc_super();
		}
  })
  
});
