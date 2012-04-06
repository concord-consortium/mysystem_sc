//  ==========================================================================
//  Project:   MySystem
//  Copyright: ©2011 Concord Consortium
//  ==========================================================================

/*globals MySystem */


/**
 @class MySystem.rulController 
  Description: orchestrates rule evaluation, with rules, nodes, and custom expressions.
  @extends SC.ObjectController
*/
MySystem.rulesController = SC.ObjectController.create({
  success:  false,
  feedback: "(empty feedback)",

  // runs the diagram rules, saves the results to the learner data and returns
  // an array containing a success boolean and a feedback string
  runDiagramRules: function() {
    var rules                 = MySystem.activityController.get('diagramRules'),
    minimumRequirements       = MySystem.activityController.get('minimumRequirements'),
    minimumRequirementsFB     = MySystem.activityController.get('minimumRequirementsFeedback'),
    customRuleEvaluator       = MySystem.activityController.get('customRuleEvaluator'),
    enableCustomRuleEvaluator = MySystem.activityController.get('enableCustomRuleEvaluator'),
    correctFeedback           = MySystem.activityController.get('correctFeedback'),
    nodes                     = MySystem.store.find(MySystem.Node),
    success                   = this.get('success'),
    feedback                  = this.get('feedback'),
    suggestions               = [];

    var reqFails = 0;
    minimumRequirements.forEach( function(rule) {
      if (!rule.check(nodes)) {
        reqFails++;
      }
    });

    // abort if any of the minimum requirement rules fails
    if (reqFails > 0) {
      suggestions.pushObject(minimumRequirementsFB);
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

    this._trimFeedback(suggestions);

    success  = (suggestions.get('length') === 0);
    feedback = success ? correctFeedback : suggestions.join(" \n");
    this.set('success', success);
    this.set('feedback', feedback);
  },

  _trimFeedback: function(suggestions){
    var maxFeedback = MySystem.activityController.get('maxFeedbackItems');
    if (maxFeedback && maxFeedback > 0 && suggestions.length > maxFeedback) {
      suggestions = suggestions.slice(0,maxFeedback);
    }
  }

});

