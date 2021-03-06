// ==========================================================================
// Project:   MySystem.Activity
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Holds startup information for the MySystem activity, including the assignment
  text, models for the model palette, and energy types/colors.

  This may also

  @extends SC.Record
  @version 0.1
*/
MySystem.Activity = SC.Record.extend(
/** @scope MySystem.Activity.prototype */ {

  // Items in the palette
  paletteItems: SC.Record.toMany('MySystem.PaletteItem'),

  // Assignment text
  assignmentText: SC.Record.attr(String),

  // Energy types/colors
  energyTypes: SC.Record.toMany('MySystem.EnergyType'),
  
  // Rules for evaluating the digram
  diagramRules: SC.Record.toMany('MySystem.DiagramRule'),
  rubricCategories: SC.Record.toMany('MySystem.RubricCategory'),
  rubricExpression: SC.Record.attr(String),
  feedbackRules: SC.Record.attr(String),
  initialDiagramJson: SC.Record.attr(String),
  minimumRequirements: SC.Record.toMany('MySystem.DiagramRule'),
  minimumRequirementsFeedback: SC.Record.attr(String),

  // Toggle editing for various things
  enableNodeLabelDisplay: SC.Record.attr(Boolean, {defaultValue: true}),
  enableNodeLabelEditing: SC.Record.attr(Boolean, {defaultValue: false}),
  enableNodeDescriptionEditing: SC.Record.attr(Boolean, {defaultValue: false}),
  enableLinkDescriptionEditing: SC.Record.attr(Boolean, {defaultValue: false}),
  enableLinkLabelEditing: SC.Record.attr(Boolean, {defaultValue: false}),

  // The maximum number of pieces of feedback to give to the user
  maxFeedbackItems: SC.Record.attr(Number, {defaultValue: 0}),
  
  // Feedback to be shown if all rules pass
  correctFeedback: SC.Record.attr(String, {defaultValue: "Your diagram has no obvious problems."}),

  // Allow custom JS evaluation of rules?
  enableCustomRuleEvaluator: SC.Record.attr(Boolean, {defaultValue: false}),

  // javascript text for evaluator function
  customRuleEvaluator: SC.Record.attr(String),
  
  // Limit the number of user submissions
  maxSubmissionClicks: SC.Record.attr(Number, {defaultValue: 0}),
  maxSubmissionFeedback: SC.Record.attr(String, {defaultValue: "You have clicked 'submit' too many times. Please continue working without hints."}),
  feedbackPanelWidth:  SC.Record.attr(Number, {defaultValue: 500}),
  feedbackPanelHeight: SC.Record.attr(Number, {defaultValue: 250}),
  terminalRadius: SC.Record.attr(Number, {defaultValue: 10}),
  nodeHeight: SC.Record.attr(Number, {defaultValue: 110}),
  nodeWidth: SC.Record.attr(Number,  {defaultValue: 100}),
  backgroundImage: SC.Record.attr(String, {defaultValue: null}),
  backgroundImageScaling: SC.Record.attr(Boolean, {defaultValue: false})
});

MySystem.Activity.GuidCounter = 100;
MySystem.Activity.newGuid = function(type) { return type + MySystem.Activity.GuidCounter++;};


/**
  Given an object representing the wise4 step, create a new activity object,
  @param {Object} wiseStepDef       A POJSO in the following format

  sample format:
  -------------
      "type": "Mysystem_sc",
         "TODO": "Be sure to add the necessary fields to this JSON file for your new step type, a copy of the contents of this file will be copied to the new step file when an author creates a new instance of your step in the authoring tool, you may delete this TODO field",
         "prompt": "What do you want to do?",
         "modules": [
            {
               "name": "thing",
               "icon": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Bongo.jpg/120px-Bongo.jpg",
               "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Bongo.jpg/120px-Bongo.jpg",
               "xtype": "MySystemContainer",
               "etype": "source",
               "fields": {
                  "efficiency": "1"
               }
            }
         ]
      }
*/


