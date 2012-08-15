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
  canSubmit: YES,

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
    var success;
    var feedback;
    
    MySystem.rulesController.runDiagramRules();
    // for now, we can assume that if there are no suggestions the diagram is good
    success             = MySystem.rulesController.get('success');
    feedback            = MySystem.rulesController.get('feedback');

    MySystem.RuleFeedback.saveFeedback(MySystem.store, feedback, success, options.isSubmit);

    var lastFeedback        = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    this.set('lastFeedback',lastFeedback.get('feedback'));
    this.set('numOfSubmits',lastFeedback.get('numOfSubmits'));
    return [success, feedback];
  },

  // TODO: These probably should be moved to their own controller perhaps..
  // Related to a floating PalettePanel showing last feedback.
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
    this.enableFeedbackButton();
  },
  
  disableFeedbackButton: function() {
    this.set('canSubmit', NO);
  },

  enableFeedbackButton: function() {
    var selfRef = this;
    // prevent neurotic or maniacle clicking:
    setTimeout(function() { selfRef.set('canSubmit', YES); }, 1000);
  },

  // runs the rules, saves the data and pops up a message to the user
  checkButtonPressed: function () {
      
    var lastFeedback           = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    var numOfSubmits           = null;
    var maxSubmits             = this.get('maxSubmissionClicks');
    var maxSubmissionFeedback  = this.get('maxSubmissionFeedback');
    var alertPane              = SC.AlertPane.warn;
    var results                = null;
    var selfRef                = this;
    var remainingFeedback      = this.remainingFeedback();
    var submitName             = "submission";
    this.disableFeedbackButton();

    if (remainingFeedback < 1) {
      alertPane.call(SC.AlertPane, {
        description: maxSubmissionFeedback,
        delegate: {
          alertPaneDidDismiss: function(pane, status) {
            selfRef.enableFeedbackButton();
          }
        }
      });
      // we should still save, just to be safe.
      MySystem.savingController.save();
    }

    else {
      // show an alert first if the user is running out.
      if (remainingFeedback < 4) {
        if (remainingFeedback > 1) { 
          submitName = submitName + "s";
        }
        
        // alert pain
        SC.AlertPane.warn({
          message: "You only have " + remainingFeedback + " " + submitName + " left",
          description: "Click cancel to continue working without feedback. Click OK to use a submission.",
          buttons: [
            { 
              title: "OK"
            },
            {
              title: "cancel"
            }
          ],
          delegate: {
            alertPaneDidDismiss: function(pane, status) {
              switch(status) {
                case SC.BUTTON1_STATUS:
                  selfRef.doGetDiagramFeedback();
                  break;
                case SC.BUTTON2_STATUS:
                  selfRef.enableFeedbackButton();
                  break;
              }
            }
          }
        });

      }
      else {
        this.doGetDiagramFeedback();
      }
    }
  },

  remainingFeedback: function() {
    var lastFeedback           = null;
    var maxSubmits             = this.get('maxSubmissionClicks');
    var numOfSubmits           = null;
    if (maxSubmits === 0) {
      return Infinity;
    }
    lastFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    if (!lastFeedback) {
      return maxSubmits;
    }
    return maxSubmits - lastFeedback.get('numOfSubmits');
  },

  doGetDiagramFeedback: function() {
    results = this.getDiagramFeedback({isSubmit: YES});
    MySystem.savingController.submit();
    hasProblems = results[0];
    this.showFeedbackPalette();
  }
}) ;

