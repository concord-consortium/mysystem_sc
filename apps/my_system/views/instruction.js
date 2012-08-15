// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================

/*globals MySystem  */
require('views/sumbissions_feedback_label');

MySystem.InstructionView = SC.View.extend({
  childViews: 'helpButtonView clearButtonView numSubmissions checkButtonView saveButtonView saveStatusView '.w(),
  backgroundColor: '#eeefff',
  
  canCollapse: YES,
  
  helpButtonView: SC.ButtonView.design({
    layout: { left: 5, top: 5, height: 25, width: 145 },
    title: 'Show instructions',
    toolTip: 'Show instructions',
    icon: 'sc-icon-info-16',
    action: 'helpButtonPressed'
  }),

  checkButtonView: SC.ButtonView.design({
    layout: { left: 155, top: 5, height: 25, width: 135 },
    // NP Sept. 1, 2011: Kelley in Berkeley wanted this label changed
    // from Check to Submit.
    title: 'Submit Diagram',
    toolTip: 'Submit your diagram',
    icon: 'sc-icon-bookmark-16',
    isEnabledBinding: 'MySystem.activityController.canSubmit',
    action: 'checkButtonPressed'
  }),
  
  numSubmissions: MySystem.SubmissionsFeedbackLabel.design({
    layout: { left: 5, top: 35, height: 20, width: 220},
    value: 'test',
    textAlign: SC.ALIGN_LEFT,
    valueBinding: 'MySystem.activityController.submissionInfo',
    visible:  YES
  }),
  
  clearButtonView: SC.ButtonView.design({
    layout: { left: 350, top: 5, height: 25, width: 80 },
    title: 'Clear',
    icon: 'sc-icon-trash-16',
    toolTip: 'Clear everything from your diagram',
    action: 'clearCanvas'
  }),

  // this starts out not enabled so people don't think they can actually save
  saveButtonView: SC.ButtonView.design({
    layout: { left: 440, top: 5, height: 25, width: 80 },
    title: 'Save',
    isEnabledBinding: 'MySystem.savingController.enableManualSave',
    toolTip: 'Save your diagram',
    icon: 'sc-icon-folder-16',
    action: 'saveButtonPressed'
  }),
  
  saveStatusView: SC.LabelView.design({
    layout: { left: 350 , top: 40, height: 25, width: 170 },
    textAlign: SC.ALIGN_RIGHT,
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
