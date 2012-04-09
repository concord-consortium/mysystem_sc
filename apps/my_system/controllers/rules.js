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

  success     : false,
  feedback    : "(empty feedback)",
  suggestions : [],
  nodes       : [],

  addSuggestion: function(suggestion) {
    this.suggestions.push(suggestion);
  },

  addRuleSuggestion: function(rule_select) {
    var rule = this.findRule(rule_select);
    this.addSuggestion(rule.get('suggestion'));
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

  rules: function() {
    return MySystem.activityController.get('diagramRules').toArray();
  },

  findRule: function(exampleRule) {
    var rules = this.rules(),
    rule      = null,
    found     = null,
    i         = 0;
    
    // assume that this a real rule
    if (typeof exampleRule == "object") { 
      found = exampleRule; 
    }
    
    // search by number
    if (typeof exampleRule == "number") {
      found = rules[exampleRule];
    }

    // search by name
    if (typeof exampleRule == "string") {
      for(i=0; i< rules.length; i++) {
        rule = rules[i];
        if (rule.get("name") == exampleRule) {
          found = rule;
        }
      }
    }

    // TODO: report something to the console, or to the user or something:
    if (null === found) {
      this.addSuggestion("can't find rule named " + exampleRule);
    }
    return found;
  },

  // return the eval result of the
  check: function(_rule) {
    var rule = this.findRule(_rule);
    var nodes = this.nodes;
    return rule.check(nodes);
  },
  
  // run one rule, adding suggestion if
  run: function(_rule) {
    var rule = this.findRule(_rule);
    if (!this.check(rule)) {
      this.addSuggestion(rule.get('suggestion'));
    }
  },

  runAll: function() {
    var rules = this.rules(),
    self      = this;

    rules.forEach( function (rule) {
      self.run(rule);
    });
  },

  // runDiagramRules: runs the diagram rules
  // updates "success" and "feedback" properties
  runDiagramRules: function() {
    var rules                 = this.rules(),
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
        // run custom evaluator, normal rules ignored.
        this._evaluateCustomRules();
      }
      else {
        // just run the rules in order
        this.runAll();
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
    (function() {
      // provide context to the evaluator:
      var customRuleEvaluator       = MySystem.activityController.get('customRuleEvaluator');
      var nodes                     = MySystem.store.find(MySystem.Node);
      var correctFeedback           = MySystem.activityController.get('correctFeedback');
      var suggestions               = this.suggestions;
      var rules = this.get('rules');
      var lines = customRuleEvaluator.split(/\r\n|\r|\n/);
      current_line = "";
      counter   = 0;

      // vars for convinience:
      var run   = this.run;
      var runAll = this.runAll;
      var check = this.check;
      var echo  = this.echo;
      var eva = this;

      try {
        // for (counter=0; counter < lines.length; counter++) {
        //   current_line = lines[counter];
        //   eval(current_line);
        // }
        eval(customRuleEvaluator);
      }
      catch(e) {
        if (console && typeof console.log == 'function') {
          console.log("Error evaluating custom rule, line:" + counter + 1);
          console.log("'" + current_line + "'");
          console.log(e);
        }
        // WARNING:  Errors will be dispalyed to users:
        suggestions.pushObject("Rule Evaluation Error: line " + (counter + 1));
        suggestions.pushObject("'" + current_line + "'");
        suggestions.pushObject("Check the console for more information.");      
      }
    }).call(this); // need to ourselves in here.
  },

  echo: function(message){
    alert(message);
  }

});

