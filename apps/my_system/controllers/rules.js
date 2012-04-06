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

  rulesBinding: SC.Binding.oneWay('MySystem.activityController.diagramRules'),
  success     : false,
  feedback    : "(empty feedback)",
  suggestions : [],
  nodes       : [],

  addSuggestion: function(suggestion) {
    this.suggestions.push(suggestion);
  },

  checkMinimumFeedback: function() {
    var reqFails          = 0,
    nodes                 = this.nodes;
    minimumRequirements   = MySystem.activityController.get('minimumRequirements'),
    minimumRequirementsFB = MySystem.activityController.get('minimumRequirementsFeedback');

    minimumRequirements.forEach( function(rule) {
      if (!rule.check(nodes)) {
        reqFails++;
      }
    });

    // abort if any of the minimum requirement rules fails
    if (reqFails > 0) {
      this.addSuggestion(minimumRequirementsFB);
      return false;
    }
    return true;
  },

  findRule: function(name) {
    var rules = this.get('rules'),
    rule      = null,
    i         = 0;

    for(i=0; i< rules.length; i++) {
      rule = rules[i];
      if (rule.get('name') == name) return rule;
    }
    return null;
  },

  // run one rule:
  runRule: function(rule) {
    if (typeof rule == "string") {
      rule = this.findRule(rule);
    }

    var nodes = this.nodes;
    if (!rule.check(nodes)) {
      this.addSuggestion(rule.get('suggestion'));
    }
  },

  runAllRules: function() {
    var rules = MySystem.activityController.get('diagramRules'),
    self      = this;

    rules.forEach( function (rule) {
      self.runRule(rule);
    });
  },

  // runDiagramRules: runs the diagram rules
  // updates "success" and "feedback" properties
  runDiagramRules: function() {
    var rules                 = this.get('rules'),
    enableCustomRuleEvaluator = MySystem.activityController.get('enableCustomRuleEvaluator'),
    correctFeedback           = MySystem.activityController.get('correctFeedback'),
    success                   = this.get('success'),
    feedback                  = this.get('feedback');

    // clear out previous data:
    var suggestions = this.suggestions = [];

    // it would be nice if there was a nodes(only) controller:
    var nodes = this.nodes = MySystem.store.find(MySystem.Node);
    
    if (this.checkMinimumFeedback()) {
      if (enableCustomRuleEvaluator) {
        this._evaluateCustomRules(this.suggestions);
      }
      else {
        this.runAllRules();
      }
    }

    this._trimFeedback(suggestions);

    success  = (this.suggestions.get('length') === 0);
    feedback = success ? correctFeedback : suggestions.join(" \n");

    this.set('success', success);
    this.set('feedback', feedback);
  },


  _trimFeedback: function(suggestions){
    var maxFeedback = MySystem.activityController.get('maxFeedbackItems');
    if (maxFeedback && maxFeedback > 0 && suggestions.length > maxFeedback) {
      suggestions = suggestions.slice(0,maxFeedback);
    }
  },

  _evaluateCustomRules: function() {
      // provide context to the evaluator:
      var customRuleEvaluator       = MySystem.activityController.get('customRuleEvaluator');
      var nodes                     = MySystem.store.find(MySystem.Node);
      var correctFeedback           = MySystem.activityController.get('correctFeedback');
      var suggestions               = this.suggestions;

      var lines = customRuleEvaluator.split(/\r\n|\r|\n/);
      current_line = "";
      counter   = 0;
      try {
        for (counter=0; counter < lines.length; counter++) {
          current_line = lines[counter];
          eval(current_line);
        }
      }
      catch(e) {
        if (console && typeof console.log == 'function') {
          console.log("Error evaluating custom rule, line:" + counter + 1);
          console.log("'" + current_line + "'");
          console.log(e);
          console.log(customRuleEvaluator);  // so that it can be inspected.
        }
        // WARNING:  Errors will be dispalyed to users:
        suggestions.pushObject("Rule Evaluation Error: line " + (counter + 1));
        suggestions.pushObject("'" + current_line + "'");
        suggestions.pushObject("Check the console for more information.");      
      }
  }

});

