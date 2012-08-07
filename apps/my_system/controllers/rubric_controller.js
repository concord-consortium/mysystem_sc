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
MySystem.rubricController = SC.ObjectController.create({

  // for now, just evaluate one rubric Item.
  // rubricExpressionBinding:    SC.Binding.oneWay('MySystem.activityController.rubricExpression'),
  categoriesBinding: SC.Binding.oneWay('MySystem.activityController.rubricCategories'),

  score: function() {
    var self = this,
        score = MySystem.RubricScore.instance(),
        expression = MySystem.activityController.get('rubricExpression') || "",
        categories = MySystem.activityController.get('rubricCategories'),
        nodes      = MySystem.nodesController.get('content'),
        rules = MySystem.activityController.get('diagramRules'),
        result = MySystem.rubricController.UNSCORED,
        ruleResults = {},
        resultsOfCategories = categories.forEach(function(c) {
          var name = c.get('name');
          var rulesInCategory = rules.filterProperty('category',name);
          if (rulesInCategory.length < 1) { 
            ruleResults[name] = false;
            return; 
          }
          var resultsOfRules  = rulesInCategory.map(function(r) {
            return r.check(nodes, MySystem.rulesController);
          });
          var resultsOfAllRules = resultsOfRules.reduce(function(prev,current) {
            return (previous || current);
          });
          ruleResults[name] = resultsOfAllRules;
        });
        context = {
          diagram: self.get('nodes'), // tbd
          // return true or false for category
          category: function(categoryName) {
            var r = ruleResults[categoryName];
            return (!!r);
          },
          result: result
        },
        errorMsg = "Rubric Evaluation Error: \n%@";

    // debugger;
    (function(){
      try {
        eval(expression);
      }
      catch(e) {
        errorMsg = errorMsg.fmt(e);
        if (console && typeof console.log == 'function') {
          console.log(errorMsg);
        }
        alert(errorMsg);
      }
    }).call(context);
    score.update(context.result, "no categories yet");
  }
});

MySystem.rubricController.UNSCORED = -1;
