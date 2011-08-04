/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor NO YES*/

describe("DiagramRules", function () {
    
  beforeEach( function () {
    this.addMatchers({
      toPass: toPass,
      toFail: toFail
    });
    
    spyOn(SC.AlertPane, 'warn');
    spyOn(SC.AlertPane, 'info');
      
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
  
    it("should be correctly grade EXACTLY with a named type", function () {
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
  
    it("should be correctly grade EXACTLY with a generic type", function () {
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
  
    it("should be correctly grade MORE THAN with a named type", function () {
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
  
    it("should be correctly grade MORE THAN with a generic type", function () {
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
  
    it("should be correctly grade LESS THAN with a named type", function () {
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
  
    it("should be correctly grade LESS THAN with a generic type", function () {
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
  
    it("should be correctly grade --> between named nodes", function () {
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
    
    it("should be correctly grade --> between generic nodes ", function () {
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
    
    it("should be correctly grade <-- between named nodes", function () {
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
  });
  
  givenRules = function (rules) {
    $.each(rules, function(i, rule){
      if (!rule.suggestion){
        rule.suggestion = "Failed rule "+i;
      }
    });
    authoredContent.diagram_rules = rules;
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
    SC.AlertPane.info.reset();
    SC.AlertPane.warn.reset();
    
    runRules(data);
    
    var infoWasCalled = SC.AlertPane.info.callCount > 0;
    var warnWasCalled = SC.AlertPane.warn.callCount > 0;
    
    return (infoWasCalled && !warnWasCalled);
  };
  
  createStudentDataHash = function (_data) {
    var studentData = {};
    data = {};
    data.nodes = _data.nodes || [];
    data.links = _data.links || [];
    
    var objectTypesCount = {};
    
    // we add a set of nodes. Each object of type 'someObjType'
    // will get guids someObjType.0, someObjType.1...
    // this way we can distinuish them when defining links
    $.each(data.nodes, function(i, nodeType){
      if (!studentData['MySystem.Node']){
        studentData['MySystem.Node'] = {};
      }
      if (objectTypesCount[nodeType] === undefined){
        objectTypesCount[nodeType] = 0;
      } else {
        objectTypesCount[nodeType] = objectTypesCount[nodeType] + 1;
      }
      var guid = nodeType+'.'+objectTypesCount[nodeType];
      studentData['MySystem.Node'][guid] = {guid: guid, nodeType: nodeType};
    });
    
    // we add a series of links. For simplicity, all links are defined as -->, with
    // no links going the other way. For now the test author simply needs to refer
    // to the nodes by name, knowing that they will be defined as 'someObjType.0', 
    // 'someObjType.1'...
    $.each(data.links, function(i, linkDesc){
      if (!studentData['MySystem.Link']){
        studentData['MySystem.Link'] = {};
      }
      startNode = linkDesc.split("-->")[0];
      endNode = linkDesc.split("-->")[1];
      studentData['MySystem.Link']['link'+i] = {
        guid: 'link'+i,
        startNode: startNode,
        endNode: endNode,
        energyType: 'any',
        startTerminal: 'a',
        endTerminal: 'a'
      };
    });
    
    console.log(studentData)
    
    return studentData;
  };
  
  runRules = function(data) {
   
    var studentData = createStudentDataHash(data);
    
    MySystem.store.setStudentStateDataHash(studentData);
    
    MySystem.statechart.sendAction('checkDiagramAgainstConstraints');
    
  };
  
});
