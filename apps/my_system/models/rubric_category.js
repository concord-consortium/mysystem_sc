// ==========================================================================
// Project:   MySystem.DiagramRule
// Copyright: ©2011 My Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.RubricCategory = SC.Record.extend(
/** @scope MySystem.RubricCategory.prototype */ {

  name:       SC.Record.attr(String),
  ruleNames:  SC.Record.attr(String),
  
  rules: function () {
    var rules = this.get('ruleNames');
    var query;
    var items = [];
    if (rules && rules.split(",")) {
      rules = rules.split(",");
      names = rules.forEach(function(ruleName) {
        query = SC.Query.local(MySystem.DiagramRule, 'name = {name}', { name: ruleName });
        items.push(MySystem.store.find(query));
      });
    }
    return items;
  }.property('ruleNames').cacheable(),

  addRule: function(rule) {
    var rules = this.get("ruleNames") || "";
    rules = rules.split(',');
    rules.push(rule);
    this.set("ruleNames",rules.join(","));
  },

  getRules: function() {
    return this.get('rules');
  },

  check: function(nodes,evaluator) {
    var rules = this.getRules();
    var results = false;
    rules.forEach(function(rule) {
      if (rule.check(nodes,evaluator)) {
        results =  true;
      }
    });
    return results;
  }

}) ;
