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
    var counts;

    MySystem.rulesController.runDiagramRules();
    // for now, we can assume that if there are no suggestions the diagram is good
    success             = MySystem.rulesController.get('success');
    feedback            = MySystem.rulesController.get('feedback');
    counts              = MySystem.rulesController.get('counts');

    MySystem.RuleFeedback.saveFeedback(MySystem.store, feedback, success, options.isSubmit, counts);

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
    // TODO: where are results and hasProblems defined, where are they used?
    results = this.getDiagramFeedback({isSubmit: YES});
    MySystem.savingController.submit();
    hasProblems = results[0];
    this.showFeedbackPalette();
  },

  contentFromWiseStepDef: function(wiseStepDef) {
    var actguid = MySystem.Activity.newGuid("actvitiy");
    var modules = wiseStepDef.modules;
    var paletteItem = null;
    var module= null;

    var activity = MySystem.store.createRecord(
      MySystem.Activity, {
      assignmentText: wiseStepDef.prompt,
      maxFeedbackItems: (wiseStepDef.maxFeedbackItems || 0),
      enableNodeLabelDisplay: (wiseStepDef.enableNodeLabelDisplay || false),
      enableNodeLabelEditing: (wiseStepDef.enableNodeLabelEditing || false),
      enableNodeDescriptionEditing: (wiseStepDef.enableNodeDescriptionEditing || false),
      enableLinkDescriptionEditing: (wiseStepDef.enableLinkDescriptionEditing || false),
      enableLinkLabelEditing: (wiseStepDef.enableLinkLabelEditing || false),
      minimumRequirementsFeedback: (wiseStepDef.minimumRequirementsFeedback || "You need to work more on your diagram to get feedback!"),
      correctFeedback: (wiseStepDef.correctFeedback || "Your diagram has no obvious problems."),
      guid: MySystem.Activity.newGuid("activity"),
      enableCustomRuleEvaluator: (wiseStepDef.enableCustomRuleEvaluator || false),
      customRuleEvaluator:   (wiseStepDef.customRuleEvaluator || "" ),
      maxSubmissionClicks:   (wiseStepDef.maxSubmissionClicks || 0  ),
      maxSubmissionFeedback: (wiseStepDef.maxSubmissionFeedback || "You have clicked 'submit' too many times. Please continue working without hints."),
      feedbackPanelWidth:    (wiseStepDef.feedbackPanelWidth  || 500),
      feedbackPanelHeight:   (wiseStepDef.feedbackPanelHeight || 250),
      terminalRadius:        (wiseStepDef.terminalRadius      || 14 ),
      nodeHeight:            (wiseStepDef.nodeHeight          || 110),
      nodeWidth:             (wiseStepDef.nodeWidth           || 100),
      backgroundImage:       (wiseStepDef.backgroundImage     || null),
      backgroundImageScaling:(wiseStepDef.backgroundImageScaling|| false),
      rubricExpression:      (wiseStepDef.rubricExpression || ""),
      feedbackRules:         (wiseStepDef.feedbackRules || ""),
      initialDiagramJson:    (wiseStepDef.initialDiagramJson   || "")
    });
    this.set("content",activity);


    // now delete old entities?
    var deleteAllRecords = function(recordType) {
      var ids = MySystem.store.find(recordType).mapProperty('id').toArray();
        MySystem.store.destroyRecords(recordType,ids);
    };
    deleteAllRecords(MySystem.PaletteItem);
    deleteAllRecords(MySystem.EnergyType);
    deleteAllRecords(MySystem.DiagramRule);
    deleteAllRecords(MySystem.RubricCategory);

    var size = modules.length;
    var i = 0;
    for (i=0; i < size; i++) {
      module = modules[i];
      paletteItem = MySystem.store.createRecord(
        MySystem.PaletteItem, {
          title: module.name,
          image: module.image,
          uuid: module.uuid},
          MySystem.Activity.newGuid("palette_item")
      );
      activity.get('paletteItems').pushObject(paletteItem);
    }

    var energy_types = wiseStepDef.energy_types;
    size = energy_types.length;
    var type = '';
    var newEnergyType = null;
    for (i=0; i < size; i++) {
      type = energy_types[i];
      newEnergyType = MySystem.store.createRecord(
        MySystem.EnergyType, {
          label: type.label,
          color: type.color,
          isEnabled: YES,
          uuid: type.uuid
        },
        MySystem.Activity.newGuid("energyType")
      );
      activity.get('energyTypes').pushObject(newEnergyType);
    }
    var minimum_requirements = (wiseStepDef.minimum_requirements || []);
    size = minimum_requirements.length;
    var newDiagramRule = null;
    var rule = null;
    for (i=0; i < size; i++) {
      rule = minimum_requirements[i];
      newDiagramRule = MySystem.store.createRecord(
        MySystem.DiagramRule,
        rule,
        MySystem.Activity.newGuid("diagramRule")
      );
      activity.get('minimumRequirements').pushObject(newDiagramRule);
    }

    var diagram_rules = wiseStepDef.diagram_rules;
    size = diagram_rules.length;
    newDiagramRule = null;
    rule = null;
    for (i=0; i < size; i++) {
      rule = diagram_rules[i];
      newDiagramRule = MySystem.store.createRecord(
        MySystem.DiagramRule,
        rule,
        MySystem.Activity.newGuid("diagramRule")
      );
      activity.get('diagramRules').pushObject(newDiagramRule);
    }

    var rubric_categories = wiseStepDef.rubric_categories;
    var newCategory = null;
    if (rubric_categories) {
      size = rubric_categories.length;
      newCategory = null;
      rule = null;
      for (i=0; i < size; i++) {
        rule = rubric_categories[i];
        newCategory = MySystem.store.createRecord(
          MySystem.RubricCategory,
          rule,
          MySystem.Activity.newGuid("rubricCategory")
        );
        activity.get('rubricCategories').pushObject(newCategory);
      }
    }
  }
});

