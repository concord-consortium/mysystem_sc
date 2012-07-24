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
    var rule = this.find(rule_select);
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
    var rules = MySystem.activityController.get('diagramRules');
    return rules;
  },

  find: function(exampleRule) {
    var rules = this.rules().toArray(),
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
    var rule = this.find(_rule);
    var nodes = this.nodes;
    var Rules = this; // TODO: pull out rule helpers to module
    return rule.check(nodes,Rules);
  },

  // run one rule, adding suggestion if
  run: function(_rule) {
    var rule = this.find(_rule);
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

    this.suggestions = suggestions;
    this._trimFeedback();

    success  = (this.suggestions.get('length') === 0);
    feedback = success ? correctFeedback : this.suggestions.join(" \n");

    this.set('success', success);
    this.set('feedback', feedback);
  },


  _trimFeedback: function(){
    var maxFeedback = MySystem.activityController.get('maxFeedbackItems');
    if (maxFeedback && maxFeedback > 0 && this.suggestions.length > maxFeedback) {
      this.suggestions = this.suggestions.slice(0,maxFeedback);
    }
  },

  _evaluateCustomRules: function() {
    (function() {
      // provide context to the evaluator:
      var customRuleEvaluator       = MySystem.activityController.get('customRuleEvaluator');
      var nodes                     = MySystem.store.find(MySystem.Node);
      var correctFeedback           = MySystem.activityController.get('correctFeedback');
      var suggestions               = this.suggestions;
      var rules = this.rules();

      var Rules = this;

      // existing:
      // Rules.addSuggestion(string);      // add string to the suggestions.
      // Rules.addRuleSuggestion(rule_id); // add the suggestion from rule_id.
      // Rules.find(rule_id);              // find a rule with a specific name.
      // Rules.check(rule_id);             // check the given rule, dont add feedback.
      // Rules.run(rule_id);               // run the given rule, adding feedback.
      // Rules.runAll();                   // run all the rules, adding feedback.
      // Rules.hasTransformation();        // true if the diagram has transformations
      // Rules.iconsUsedOnce();            // true if the icons were only used one time.
      // Rules.extraLinks(rules=all);      // true if there are links present not defined in rules.


      // proposed:
      // Rules.any([rule-ida,rule-idb,...]);  // true if one of the named rules pass
      // Rules.all([rule-ida,rule-idb,...]);  // true if all of the named rules pass
      // Rules.none([rule-ida,rule-idb,..]);  // true if none of the named rules pass
      // Rules.iconsUnusedIcons();            // true if some icons weren't used.
      // Rules.allIconsUsed();                // true if all the icons were used.

      try {
        eval(customRuleEvaluator);
      }
      catch(e) {
        if (console && typeof console.log == 'function') {
          console.log("Error evaluating custom rule: " + e);
        }
        // WARNING:  Errors will be dispalyed to users:
        suggestions.pushObject("Rule Evaluation Error: " + e);
      }
    }).call(this);
  },


  // true if the diagram has transformations
  // transformations are any nodes which output
  // energytypes other than their input... (berk_req.)
  hasTransformation: function() {
    var nodes = this.nodes;

    // returns uuids for energytypes or 'unidenitfied_type'
    var linkTypes = function(node,linkTypes) {
      var links = node.get(linkTypes);
      return links.map( function (link) {
        return link.get('energyType') || 'unidenitfied_type';
        });
    };

    var hasTransform = function (node) {
      var inLinks = linkTypes(node,'inLinks').toArray();
      var outLinks = linkTypes(node,'outLinks').toArray();

      // we must have in and outlinks to transform
      if (inLinks.length < 1) { return false; }
      if (outLinks.length < 1) { return false; }

      // search for an outlink not in inlinks.
      for (var i = outLinks.length - 1; i >= 0; i--) {
        if (inLinks.indexOf(outLinks[i]) < 0) { return true; }
      }
      return false;
    };
    return (nodes.filter(hasTransform).length > 1);
  },

  // true if the icons were only used at most once.
  iconsUsedOnce: function() {
    var nodes = this.nodes.toArray();
    var types = {};
    var duplicates = false;
    for(i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var nodeType = node.get('nodeType');
      if (typeof types[nodeType] === 'undefined') {
        types[nodeType] = 0;
      }
      else {
        types[nodeType] = types[nodeType] + 1;
        duplicates = true;
      }
    }
    return (!duplicates);
  },

  // true if there were links not defined in rules.
  extraLinks: function(rule_names) {
    // Look for links that don't match one of the 'should' link rules
    var links          = MySystem.store.find(MySystem.Link);
    var notAllowedLink = null;
    var rules          = MySystem.activityController.get('diagramRules');

    if (rule_names !== null && typeof rule_names !== 'undefined' && rule_names.length > 0) {
      rules = rules.filter( function(rule) {
        return (rule_names.indexOf(rule.get('name')) > -1);
      });
    }

    links = links.filter(function (link) {return link.isComplete();});
    notAllowedLink = links.find(function (link) {
      var positiveLinkRules = rules.filterProperty('hasLink').filter(function(rule){return !rule.get('not');});
      var matchingRule = positiveLinkRules.find(function (rule) {
        // need to handle the link check here, in the future this should be moved into the core code
        var paletteItem = rule.paletteItem(rule.get('type')),
            otherPaletteItem = rule.paletteItem(rule.get('otherNodeType'));

        switch(rule.get('linkDirection')) {
          case '-->':
            return rule.checkLink(link, paletteItem, otherPaletteItem);
          case '<--':
            return rule.checkLink(link, otherPaletteItem, paletteItem);
          case '---':
            return rule.checkLink(link, paletteItem, otherPaletteItem) || rule.checkLink(link, otherPaletteItem, paletteItem);
          default:
            throw "Invalid linkDirection value for diagram rule.";
        }
      });
      if(!matchingRule){ return YES; }
    });

    return (notAllowedLink !== null && notAllowedLink !== 'undefined');
  }



});

