/*globals MySystem defineJasmineHelpers describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor NO YES*/

defineJasmineHelpers();

describe("DiagramRules", function () {
    
  beforeEach( function () {
    this.addMatchers({
      toPass: toPass,
      toFail: toFail
    });
    
    MySystem.setupStore(MySystem);
    MySystem.statechart.initStatechart();
    
    studentData = {};
    
    authoredContent = 
      {
        "type": "mysystem2",
        "prompt": "",
        "modules": [
          {
            "name": "obj1",
            "uuid": "obj1"
          },
          {
            "name": "obj2",
            "uuid": "obj2"
          },
          {
            "name": "obj3",
            "uuid": "obj3"
          }
        ],
        "energy_types": [
          {
            "label": "en1",
            "uuid": "en1"
          },
          {
            "label": "en2",
            "uuid": "en2"
          }
        ]
      };
  });
  
  describe("Counting Nodes", function () {
  
    it("should correctly grade EXACTLY with a named type", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1"
          }
        ]
      );
    
      // we pass in a hash representing a high-level form of the student's
      // data, which gets parsed by the test
      expect({nodes: ['obj1']}).toPass();
    
      expect({nodes: ['obj1', 'obj2']}).toPass();
    
      expect({nodes: []}).toFail();
   
      expect({nodes: ['obj2']}).toFail();
    
      expect({nodes: ['obj1', 'obj1']}).toFail();
    
    });
  
    it("should correctly grade EXACTLY with a generic type", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "node"
          }
        ]
      );
    
      expect({nodes: ['obj1']}).toPass();
      expect({nodes: ['obj2']}).toPass();
      expect({nodes: ['obj1', 'obj2']}).toFail();
      expect({nodes: []}).toFail();
    
    });
  
    it("should correctly grade MORE THAN with a named type", function () {
      givenRules(
        [
          {
            "comparison": "more than",
            "number": "1",
            "type": "obj1"
          }
        ]
      );
    
      expect({nodes: ['obj1', 'obj1']}).toPass();
      expect({nodes: []}).toFail();
      expect({nodes: ['obj1']}).toFail();
      expect({nodes: ['obj1', 'obj2']}).toFail();
      expect({nodes: ['obj2', 'obj2']}).toFail();
    
    });
  
    it("should correctly grade MORE THAN with a generic type", function () {
      givenRules(
        [
          {
            "comparison": "more than",
            "number": "1",
            "type": "node"
          }
        ]
      );
    
      expect({nodes: ['obj1', 'obj1']}).toPass();
      expect({nodes: []}).toFail();
      expect({nodes: ['obj1']}).toFail();
      expect({nodes: ['obj1', 'obj2']}).toPass();
      expect({nodes: ['obj2', 'obj2']}).toPass();
    
    });
  
    it("should correctly grade LESS THAN with a named type", function () {
      givenRules(
        [
          {
            "comparison": "less than",
            "number": "2",
            "type": "obj1"
          }
        ]
      );
    
      expect({nodes: []}).toPass();
      expect({nodes: ['obj1']}).toPass();
      expect({nodes: ['obj1', 'obj2']}).toPass();
      expect({nodes: ['obj1', 'obj1']}).toFail();
    
    });
  
    it("should correctly grade LESS THAN with a generic type", function () {
      givenRules(
        [
          {
            "comparison": "less than",
            "number": "2",
            "type": "node"
          }
        ]
      );
    
      expect({nodes: []}).toPass();
      expect({nodes: ['obj1']}).toPass();
      expect({nodes: ['obj1', 'obj1']}).toFail();
      expect({nodes: ['obj1', 'obj2']}).toFail();
    
    });
  });
  
  describe("Counting Nodes with Links", function () {
  
    it("should correctly grade --> between named nodes", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          }
        ]
      );
      
      // Here we can define links between nodes in the student data. Knowing that 
      // the objects will be named obj1.0, obj1.1, obj2.0, in the order that we add
      // them, we can simply define a link between two named nodes
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0']}).toPass();
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0','obj2.0-->obj1.0']}).toPass();
      expect({nodes: ['obj1','obj2']}).toFail();
      expect({nodes: ['obj1','obj2'], links: ['obj2.0-->obj1.0']}).toFail();
      expect({nodes: ['obj1','obj1'], links: ['obj1.0-->obj1.1']}).toFail();
    
    });
    
    it("should correctly grade --> between generic nodes ", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "node"
          }
        ]
      );
      
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0']}).toPass();
      expect({nodes: ['obj1','obj1'], links: ['obj1.0-->obj1.1']}).toPass();
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0','obj2.0-->obj1.0']}).toPass();
      expect({nodes: ['obj1','obj1', 'obj2'], links: ['obj1.0-->obj2.0','obj1.1-->obj2.0']}).toFail();
      expect({nodes: ['obj1','obj2'], links: ['obj2.0-->obj1.0']}).toFail();
    
    });
    
    it("should correctly grade <-- between named nodes", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "<--",
            "otherNodeType": "obj2"
          }
        ]
      );
      
      expect({nodes: ['obj1','obj2'], links: ['obj2.0-->obj1.0']}).toPass();
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0']}).toFail();
    
    });
    
    it("should correctly grade --> between nodes with a set energy", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "en1",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          }
        ]
      );
      
      // we can set the energy type of a link after a colon
      // NOTE: In runtime a student trying to change the energy of a link
      // does not work. This is a runtime bug somewhere
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en1']}).toPass();
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en2']}).toFail();
    
    });
  });
  
  describe("Handling NOT rules", function () {
  
    it("should correctly grade NOT rules", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "not": true,
            "type": "obj1"
          }
        ]
      );
      
      expect({nodes: []}).toPass();
      expect({nodes: ['obj1']}).toFail();
      expect({nodes: ['obj1', 'obj1']}).toPass();
    
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "not": true,
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          }
        ]
      );
      
      
      expect({nodes: ['obj1', 'obj2']}).toPass();
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0']}).toFail();
    });
  });
  
  describe("Handle invalid Diagram Rules", function () {
    it("should handle a invalid node type", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj3",
            "hasLink": false,
          }
        ]
      );
      
      // It isn't clear if it should fail or do something worse when there
      // is an invalid node type
      expect({nodes: ['obj1']}).toFail();    
    });

    it("should handle a invalid other node type", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj3",
            "hasLink": true,
            "linkDirection": "---",
            "otherNodeType": "obj4"
          }
        ]
      );
      
      // It isn't clear if it should fail or do something worse when there
      // is an invalid node type
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en1']}).toFail();    
    });

    it("should handle a invalid energy type", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "linkDirection": "---",
            "otherNodeType": "obj2",
            "energyType": "en3"
          }
        ]
      );
      
      // It isn't clear if it should fail or do something worse when there
      // is an invalid node type
      expect({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en1']}).toFail();    
    });
  });
  
  describe("Saving learner data", function () {
    it("should add the latest feedback to the learner data", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "hasLink": false,
          }
        ]
      );
      
      var ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      expect(ruleFeedback.get('feedback')).toBeNull();
      
      runRules({nodes: ['obj1']});
      expect(ruleFeedback.get('feedback')).toBe("Failed rule 0");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
      
      runRules({nodes: ['obj2']});
      expect(ruleFeedback.get('feedback')).toBe("Your diagram has no obvious problems."); // this should be a static variable
      expect(ruleFeedback.get('success')).toBe(true);
      
    });
    
    it("should try to save data externally when check button is pressed", function () {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "hasLink": false,
          }
        ]
      );
      
      var callCount = 0;
      MySystem.registerExternalSaveFunction(function() {callCount++});
      
      expect(callCount).toBe(0);
      runRules({nodes: ['obj1']});
      expect(callCount).toBe(1);
    });
  });

  describe("Limiting number of feedback items", function() {
    it('should not limit feedback by default', function() {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj1"
          }
        ]
      );

      MySystem.store.commitRecords();
      var ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      expect(ruleFeedback.get('feedback')).toBeNull();

      runRules({nodes: ['obj1']});
      expect(ruleFeedback.get('feedback')).toBe("Failed rule 1 \nFailed rule 2 \nFailed rule 3");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
    });

    it('should limit feedback when too many failures', function() {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj1"
          }
        ], 2
      );

      var ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      expect(ruleFeedback.get('feedback')).toBeNull();
      runRules({nodes: ['obj1']});
      expect(ruleFeedback.get('feedback')).toBe("Failed rule 1 \nFailed rule 2");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
    });

    it('should not limit feedback when failures are fewer than limit', function() {
      givenRules(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj1"
          }
        ], 2
      );

      var ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      expect(ruleFeedback.get('feedback')).toBeNull();

      runRules({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en1']});
      expect(ruleFeedback.get('feedback')).toBe("Failed rule 3");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
    });
  });

  describe("Minimum requirements", function() {
    var ruleFeedback;

    beforeEach(function() {
      givenRequirements(
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2"
          }
        ],
        [
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj2"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "hasLink": true,
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "obj1"
          }
        ]
      );

      MySystem.store.commitRecords();
      ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    });

    it('should fail if no requirements are met', function() {
      expect(ruleFeedback.get('feedback')).toBeNull();

      runRules({nodes: []});
      expect(ruleFeedback.get('feedback')).toBe("Minimum requirements failed.");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
    });

    it('should fail if only some requirements are met', function() {
      expect(ruleFeedback.get('feedback')).toBeNull();

      runRules({nodes: ['obj1']});
      expect(ruleFeedback.get('feedback')).toBe("Minimum requirements failed.");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
    });

    it('should fail normal rules if all requirements are met', function() {
      expect(ruleFeedback.get('feedback')).toBeNull();

      runRules({nodes: ['obj1','obj2']});
      expect(ruleFeedback.get('feedback')).toBe("Failed rule 0 \nFailed rule 1");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(false);
    });

    it('should pass if all requirements and normal rules are met', function() {
      expect(ruleFeedback.get('feedback')).toBeNull();

      runRules({nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en1','obj2.0-->obj1.0:en1']});
      expect(ruleFeedback.get('feedback')).toBe("Your diagram has no obvious problems.");   // see givenRules() function
      expect(ruleFeedback.get('success')).toBe(true);
    });

  });

  describe("Custom Rule Evaluation", function() {
    var customEvaluationString;
    var ruleFeedback;
    beforeEach(function() {
       givenRules([
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj1",
            "suggestion": "failed rule_a"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj2",
            "suggestion": "failed rule_b"
          },
          {
            "comparison": "exactly",
            "number": "1",
            "type": "obj3",
            "suggestion": "failed rule_c"
          }
      ]);
      customEvaluationString = "";
      customEvaluationString += "var rule_a = rules.objectAt(0).check(nodes);";
      customEvaluationString += "var rule_b = rules.objectAt(1).check(nodes);";
      customEvaluationString += "var rule_c = rules.objectAt(2).check(nodes);";
      customEvaluationString += "if(! ((rule_a && rule_b) || rule_c)) {";
      customEvaluationString += "   suggestions.pushObject('custom rule evaluation failed.');";
      customEvaluationString += "}";
    });

    describe("Using a custom Evaluator ((a & b) || c) => succuess function", function() {
      beforeEach(function() {
        MySystem.activityController.set('enableCustomRuleEvaluator',YES);
        MySystem.activityController.set('customRuleEvaluator', customEvaluationString);
        MySystem.store.commitRecords();
        ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      });
      
      describe("failing systems", function() {
        it("should fail diagrams only containing just one 'a' node", function() {
          runRules({nodes: ['obj1'], links: []});
          expect(ruleFeedback.get('feedback')).toBe('custom rule evaluation failed.');
        });
        it("should fail diagrams containing just one 'b' node", function() {
          runRules({nodes: ['obj2'], links: []});
          expect(ruleFeedback.get('feedback')).toBe('custom rule evaluation failed.');
        });
      });

      describe("passing systems", function() {
        it("should pass systems containg one 'a' node & one 'b' node", function() {
          runRules({nodes: ['obj1','obj2'], links: []});
          expect(ruleFeedback.get('feedback')).toBe("Your diagram has no obvious problems.");   // see givenRules() function
          expect(ruleFeedback.get('success')).toBe(true);
        });
        it("should pass systems a single 'c' node", function() {
          runRules({nodes: ['obj3'], links: []});
          expect(ruleFeedback.get('feedback')).toBe("Your diagram has no obvious problems.");   // see givenRules() function
          expect(ruleFeedback.get('success')).toBe(true);
        });
      });
    });

    describe("Without a custom rule evaluator", function() {
      beforeEach(function() {
        MySystem.activityController.set('enableCustomRuleEvaluator',NO);
        MySystem.activityController.set('customRuleEvaluator', customEvaluationString);
        MySystem.activityController.set('maxFeedbackItems',1);
        MySystem.store.commitRecords();
        ruleFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      });

      it("should fail diagrams for which the simple conditions are not met", function() {
        // fail (no obj2)
        runRules({nodes: ['obj1'], links: []});
        expect(ruleFeedback.get('feedback')).toBe('failed rule_b');
        // fail (no obj1)
        runRules({nodes: ['obj2'], links: []});
        expect(ruleFeedback.get('feedback')).toBe('failed rule_a');
      });

      it("should pass diagrams for which the simple conditions are met", function() {
        // succeed (obj1 & obj2)
        runRules({nodes: ['obj1','obj2','obj3'], links: []});
        expect(ruleFeedback.get('feedback')).toBe("Your diagram has no obvious problems.");   // see givenRules() function
        expect(ruleFeedback.get('success')).toBe(true);
      });
    });
  });

  givenRules = function (rules, maxFeedback) {
    $.each(rules, function(i, rule){
      if (!rule.suggestion){
        rule.suggestion = "Failed rule "+i;
      }
    });
    authoredContent.diagram_rules = rules;
    if (maxFeedback) {
      authoredContent.maxFeedbackItems = maxFeedback;
    } else {
      authoredContent.maxFeedbackItems = 0;
    }
    var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
    MySystem.activityController.set('content',activity);
  };

  givenRequirements = function (reqs, rules) {
    $.each(reqs, function(i, rule){
      if (!rule.suggestion){
        rule.suggestion = "Failed rule "+i;
      }
    });
    if (!!rules) {
      $.each(rules, function(i, rule){
        if (!rule.suggestion){
          rule.suggestion = "Failed rule "+i;
        }
      });
      authoredContent.diagram_rules = rules;
    } else {
      authoredContent.diagram_rules = [];
    }
    authoredContent.minimum_requirements = reqs;
    authoredContent.minimumRequirementsFeedback = "Minimum requirements failed.";
    authoredContent.maxFeedbackItems = 0;

    var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
    MySystem.activityController.set('content',activity);
  };
  
  toPass = function() {
    return rulesPassed(this.actual);
  };
  
  // could do not.toPass instead of toFail, but expect(x).toFail
  // looks clearer to me when viewing a long list of assetions
  toFail = function() {
    return !(rulesPassed(this.actual));
  };
  
  rulesPassed = function(data) {  
    runRules(data);
  
    results = MySystem.activityController.getDiagramFeedback({isSubmit: false})[0];
    return results;
  };
  
  runRules = function(data) {
    dataHelper.setStudentStateDataHash(data);
    MySystem.statechart.sendAction('checkButtonPressed');
  };
  
});
