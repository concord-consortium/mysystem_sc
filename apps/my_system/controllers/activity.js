// ==========================================================================
// Project:   MySystem.activityController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */

/**
  @class

  Description:
  ------------
  Tracks the current activity.

  @extends SC.ObjectController
*/


MySystem.activityController = SC.ObjectController.create({

  lastFeedback: '',
  numOfSubmits: 0,

  submissionInfo: function(_feedback) {
    var maxSubmissionClicks = this.get('maxSubmissionClicks');
    var submitCount         = 0;
    var lastFeedback        = this.get('lastFeedback');
    var feedback            = '';
    // if maximum submissions are enabled for the activity,
    // display the count to the student.
    if (maxSubmissionClicks && maxSubmissionClicks > 0) {
      submitCount =  this.get('numOfSubmits');
      feedback    = "# of submissions: %@/%@".fmt(submitCount,maxSubmissionClicks);
    }
    return feedback;
  }.property('lastFeedback','maxSubmissionClicks','numOfSubmits'),

  getDiagramFeedback: function (options) {
    
    MySystem.rulesController.runDiagramRules();
    // for now, we can assume that if there are no suggestions the diagram is good
    var success             = MySystem.rulesController.get('success');
    var feedback            = MySystem.rulesController.get('feedback');
    MySystem.RuleFeedback.saveFeedback(MySystem.store, feedback, success, options.isSubmit);

    var lastFeedback        = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    this.set('lastFeedback',lastFeedback.get('feedback'));
    this.set('numOfSubmits',lastFeedback.get('numOfSubmits'));
    return [success, feedback];
  },

  // TODO: These probably should be moved to their own controller perhaps..
  // Related to a floating PalettePan showing last feedback.
  feedbackPalette: null,
  showFeedbackPalette: function() {
    var palette = this.get('feedbackPalette');
    if(!!! palette) {
      palette = MySystem.SubmissionsFeedbackPallet.create({});
      this.set('feedbackPalette', palette);
    }
    palette.append();
  },

  // TODO: These probably should be moved to their own controller perhaps..
  // Related to a floating PalettePan showing last feedback.
  hideFeedbackPalette: function() {
    var palette = this.get('feedbackPalette');
    if(palette) {
      palette.remove();
    }
  }
}) ;

