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
    var self = this,
        rubricScore = MySystem.RubricScore.instance(),
        expression = MySystem.activityController.get('rubricExpression') || "",
        categories = MySystem.activityController.get('rubricCategories'),
        nodes      = MySystem.nodesController.get('content'),
        rules      = MySystem.activityController.get('diagramRules'),
        result     = MySystem.rubricController.UNSCORED,

        ruleResults = [],

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
          }
          ruleResults.push({name: name, value: value});
        }),

        category = function(categoryName) {
          var category = ruleResults.findProperty('name',categoryName);
          if (category) {
            return category.value;
          }
          return false;
        },

        hasScored = false,

        score = function(_score) {
          if(!hasScored) {
            hasScored = true;
            result = _score;
          }
        },

        categoryReduce = function(args,comparefunc) {

          // call like this: result = all('a','b','c',function(){...});
          var results = args.reduce(function(previousValue,current) {
            var a = previousValue,
                b = current;

            // convert items to booleans
            if (typeof a === 'string')   { a = category(a); }
            if (typeof b === 'string')   { b = category(b); }

            // run conditional block
            if (typeof b === 'function') {
              if (a === true) {
                b.apply(this);
                return a;
              }
            }

            // set score if last argument.
            if (typeof b === 'number') {
              if (a === true) {
                score(b);
                return a;
              }
            }

            // coerce to true or false
            return (!!comparefunc(a,b));
          });
          return results;
        },


        any = function() {
          var args = [].slice.apply(arguments);
          categoryReduce(args,function(a,b) {
            return (a||b);
          });
        },

        all = function() {
          var args = [].slice.apply(arguments);
          categoryReduce(args,function(a,b) {
            return (a&&b);
          });
        },

        errorMsg = "Rubric Evaluation Error: \n%@";


    (function(){
      try {
        //var script = CoffeeScript.compile(expression,{thing: 10});
        eval(expression);
      }
      catch(e) {
        errorMsg = errorMsg.fmt(e);
        if (console && typeof console.log == 'function') {
          console.log(errorMsg);
        }
        alert(errorMsg);
      }
    }).call(self);

    rubricScore.update(result, ruleResults.filterProperty('value').mapProperty('name'));
  },
  displayScore: function() {
    MySystem.rubricController.score();
    rubricScore = MySystem.RubricScore.instance();
    alert("score: %@\ncategories: %@\nTime: %@".fmt(rubricScore.get('score'),rubricScore.get('categories'),rubricScore.get('timeStamp')));
  }
});

MySystem.rubricController.UNSCORED = -1;
