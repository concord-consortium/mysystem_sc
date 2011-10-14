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
  
  // runs the diagram rules, saves the results to the learner data and returns
  // an array containing a success boolean and a feedback string
  runDiagramRules: function() {
    var rules                 = this.get('diagramRules'),
    minimumRequirements       = this.get('minimumRequirements'),
    customRuleEvaluator       = this.get('customRuleEvaluator'),
    enableCustomRuleEvaluator = this.get('enableCustomRuleEvaluator'),
    nodes                     = MySystem.store.find(MySystem.Node),
    suggestions               = [];

    var reqFails = 0;
    minimumRequirements.forEach( function(rule) {
      if (!rule.check(nodes)) {
        reqFails++;
      }
    });

    // abort if any of the minimum requirement rules fails
    if (reqFails > 0) {
      suggestions.pushObject(this.get('minimumRequirementsFeedback'));
      return suggestions;
    }

    // allow custom JS eval here in this context.
    if (enableCustomRuleEvaluator) {
      try {
        // TODO: Sanatize or sandbox this!
        eval(customRuleEvaluator);
      }
      catch(e) {
        if (console && typeof console.log == 'function') {
          console.log("Error evaluating custom rule:");
          console.log(e);
          console.log(customRuleEvaluator);
          // TODO: Should the end user see this error?
          // For now, maybe yeah, we fail early.
          suggestions.pushObject("The custom rule evaluator for this activity is causing an error.");
          suggestions.pushObject("Check the console for more information.");
        }
        else {
          alert('Error evaluating custom rule, please use firebug and have a look at the console.');
        }
      }
    }

    else {
      rules.forEach( function (rule) {
        if (!rule.check(nodes)) {
          suggestions.pushObject(rule.get('suggestion'));
        }
      });
    }

    var maxFeedback = this.get('maxFeedbackItems');

    if (maxFeedback && maxFeedback > 0 && suggestions.length > maxFeedback) {
      return suggestions.slice(0,maxFeedback);
    }
    
    return suggestions;
  },
  
  getDiagramFeedback: function (options) {
    var suggestions = this.runDiagramRules();
    
    // for now, we can assume that if there are no suggestions the diagram is good
    var success = (suggestions.get('length') === 0);
    var feedback = success ? this.get('correctFeedback') : suggestions.join(" \n");
    
    MySystem.RuleFeedback.saveFeedback(MySystem.store, feedback, success, options.isSubmit);
    
    return [success, feedback];
  }
}) ;

