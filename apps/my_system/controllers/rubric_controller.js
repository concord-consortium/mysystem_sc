// ==========================================================================
// Project:   MySystem.DiagramRule
// Copyright: ©2011 My Concord Consortium
// ==========================================================================
/*globals alert MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.rubricController = SC.ObjectController.create({

  // for now, just evaluate one rubric Item.
  // rubricExpressionBinding:    SC.Binding.oneWay('MySystem.activityController.rubricExpression'),
  categoriesBinding: SC.Binding.oneWay('MySystem.activityController.rubricCategories'),


  // An example rubric:
  // all ('noah-transform','storage','source','release', 6);
  // all ('noah-transform','storage', 5);
  // all ('noah-transform','source', 5);
  // all ('noah-transform','release', 5);
  // all ('noah-transform',4);
  // any('source','storage','release',3);
  // any('link',2);
  // score(1);
  score: function(submit) {
    var self       = this,
        rulesC     = MySystem.rulesController,
        rubricScore= MySystem.RubricScore.instance(),
        expression = MySystem.activityController.get('rubricExpression') || "",
        categories = MySystem.activityController.get('rubricCategories'),
        nodes      = MySystem.store.find(MySystem.Node),
        rules      = MySystem.activityController.get('diagramRules'),
        result     = MySystem.rubricController.UNSCORED,
        hasScored  = false,

        categoryResults = {},
        trueCategories  = [],

        resultsOfCategories = categories.forEach(function(c) {
          var name  = c.get('name'),
              value = false,
              found = null,
              rulesInCategory = rules.filterProperty('category',name);

          found = rulesInCategory.find(function(r) {
            if (r.check(nodes, MySystem.rulesController) === true) {
              return true;
            }
          });
          if (found) {
            value = true;
            trueCategories.push(name);
          }
          categoryResults[name] = value;

        }),

        rule = function(ruleName)      { return rulesC.check(ruleName);        },
        hasTransformation = function() { return rulesC.hasTransformation();    },
        iconsUsedOnce = function()     { return rulesC.iconsUsedOnce();        },
        extraLinks = function()        { return rulesC.extraLinks();           },
        allIconsUsed = function()      { return rulesC.allIconsUsed.call(self);},

        category = function(categoryName) {
          return categoryResults[categoryName] || false;
        },

        categoryExists = function(name) {
          return (typeof categoryResults[name] === 'undefined') ? false : true;
        },

        valueFromArgument = function(argument) {
          if (typeof argument === 'string')   {
            return categoryExists(argument) ? category(argument) : rule(argument);
          }
          if (typeof argument === 'function') { return argument.apply(self); }
          return argument; // hopefully a boolean
        },

        any = function() {
          var args = [].slice.apply(arguments);
          return args.reduce(function(a,b) {
             a = valueFromArgument(a);
             b = valueFromArgument(b);
            return (a||b);
          }, false);
        },

        all = function() {
          var args = [].slice.apply(arguments);
          return args.reduce(function(a,b) {
             a = valueFromArgument(a);
             b = valueFromArgument(b);
            return (a&&b);
          }, true);
        },

        not_any = function() {
          return (! any.apply(self,arguments));
        },
        none = not_any,

        not_all = function() {
          return (! all.apply(self,arguments));
        },


        score = function(_score) {
          if(!hasScored) {
            hasScored = true;
            result = _score;
          }
        },

        makeScoreFunction = function(func) {
          return function() {
            var args = Array.prototype.slice.call(arguments,0,-1);
            var _score = Array.prototype.slice.call(arguments,-1);
            var results = func.apply(self, args);
            if (results) {
              score(_score);
            }
          };
        },

        all_s     = makeScoreFunction(all),
        any_s     = makeScoreFunction(any),
        not_any_s = makeScoreFunction(not_any),
        none_s    = makeScoreFunction(none),
        not_all_s = makeScoreFunction(not_all),

        errorMsg = "Rubric Evaluation Error: \n%@";

    (function(){
      try {
        //var script = CoffeeScript.compile(expression,{thing: 10});
        eval(expression);
      }
      catch(e) {
        errorMsg = errorMsg.fmt(e);
        if (console && typeof console.log === 'function') {
          console.log(errorMsg);
        }
        alert(errorMsg);
      }
    }).call(self);

    rubricScore.update(result, trueCategories);
  },
  displayScore: function() {
    MySystem.rubricController.score();
    var rubricScore = MySystem.RubricScore.instance();
    alert("score: %@\ncategories: %@\nTime: %@".fmt(rubricScore.get('score'),rubricScore.get('categories'),rubricScore.get('timeStamp')));
  }
});

MySystem.rubricController.UNSCORED = -1;
