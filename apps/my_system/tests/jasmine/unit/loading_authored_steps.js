/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor NO YES*/

describe("LoadingAuthoredSteps", function () {
  
  beforeEach( function () {
    MySystem.setupStore(MySystem);
    
    // this is an example of real authored content. Note that none of the module (paletteItem) properties
    // except name, image and uuid are used
    var authoredContent = 
      {
        "type": "mysystem2",
        "prompt": "",
        "modules": [
          {
            "name": "testObject",
            "icon": "testIcon.png",
            "image": "testImage.png",
            "xtype": "MySystemContainer",
            "etype": "source",
            "fields": {
              "efficiency": "1"
            },
            "uuid": "c183d424-fae7-43f6-a57f-b969de0ed6e6"
          },
          {
            "name": "testObject2",
            "icon": "testIcon2.png",
            "image": "testImage2.png",
            "xtype": "MySystemContainer",
            "etype": "source",
            "fields": {
              "efficiency": "1"
            },
            "uuid": "a233d424-fae7-43f6-a57f-b969de0ed6ef"
          }
        ],
        "energy_types": [
          {
            "label": "testEnergy",
            "color": "#E97F02",
            "uuid": "9c685b8c-8a87-4e96-a911-fbd0abbe473f"
          },
          {
            "label": "testEnergy2",
            "color": "#000000",
            "uuid": "a8685b8c-8a87-4e96-a911-fbd0abbe473f"
          }
        ],
        "diagram_rules": [
          {
            "comparison": "exactly",
            "type": "testObject",
            "number": "1",
            "suggestion": "suggestion"
          },
          {
            "comparison": "less than",
            "type": "node",              // generic node name.
            "number": "1",
            "suggestion": "suggestion2"
          },
          {
            "comparison": "more than",
            "type": "testObject",
            "number": "1",
            "suggestion": "suggestion2",
            "hasLink": true,            // link with defined energy type
            "energyType": "testEnergy",
            "linkDirection": "-->",
            "otherNodeType": "testObject2"
          },
          {
            "comparison": "more than",
            "type": "node",
            "number": "1",
            "suggestion": "suggestion2",
            "hasLink": true,            // link with generic energy type
            "energyType": "any",
            "linkDirection": "-->",
            "otherNodeType": "testObject2"
          },
          {
            "comparison": "more than",
            "type": "testObject",
            "number": "1",
            "suggestion": "suggestion2",
            "hasLink": true,            // link and no energy type
            "linkDirection": "-->",
            "otherNodeType": "testObject2"
          }
        ]
      };
      
      var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
      MySystem.activityController.set('content',activity);
  });
  
  it("should be able to load a step with authored palette items", function () {
    
    expect(MySystem.activityController.get('paletteItems').length()).toBe(2);
    
    var firstItem   = MySystem.activityController.get('paletteItems').firstObject();
    expect(firstItem).toBeDefined();
    expect(firstItem.get('title')).toBe("testObject");
    expect(firstItem.get('image')).toBe("testImage.png");
    expect(firstItem.get('uuid')).toBe("c183d424-fae7-43f6-a57f-b969de0ed6e6");
    
    var secondItem   = MySystem.activityController.get('paletteItems').objectAt(1);
    expect(secondItem.get('title')).toBe("testObject2");
  });
  
  it("should be able to load a step with authored energy types", function () {
    
    expect(MySystem.activityController.get('energyTypes').length()).toBe(2);
    
    var firstEnergy   = MySystem.activityController.get('energyTypes').firstObject();
    expect(firstEnergy).toBeDefined();
    expect(firstEnergy.get('label')).toBe("testEnergy");
    expect(firstEnergy.get('color')).toBe("#E97F02");
    expect(firstEnergy.get('uuid')).toBe("9c685b8c-8a87-4e96-a911-fbd0abbe473f");
    expect(firstEnergy.get('isEnabled')).toBe(YES);
    
    var secondEnergy   = MySystem.activityController.get('energyTypes').objectAt(1);
    expect(secondEnergy.get('label')).toBe("testEnergy2");
  });
  
  it("should be able to load a step with authored diagram rules", function () {
    
    expect(MySystem.activityController.get('diagramRules').length()).toBe(5);
    
    var rules = MySystem.activityController.get('diagramRules').toArray();
    
    expect(rules[0].get('comparison')).toBe("exactly");
    expect(rules[0].get('type')).toBe("testObject");
    expect(rules[0].get('number')).toBe(1);
    expect(rules[0].get('suggestion')).toBe("suggestion");
    expect(rules[0].get('hasLink')).toBe(null);
    expect(rules[0].get('energyType')).toBe(null);
    expect(rules[0].get('linkDirection')).toBe(null);
    expect(rules[0].get('otherNodeType')).toBe(null);
    
    expect(rules[1].get('type')).toBe("node");        // this may break after we handle generic names better
    
    expect(rules[2].get('hasLink')).toBe(YES);
    expect(rules[2].get('energyType')).toBe("testEnergy");
    expect(rules[2].get('linkDirection')).toBe("-->");
    expect(rules[2].get('otherNodeType')).toBe("testObject2");
    
    expect(rules[3].get('energyType')).toBe("any");   // this may break after we handle generic names better
    
    expect(rules[4].get('hasLink')).toBe(YES);
    expect(rules[4].get('energyType')).toBe(null);    
  });
  
  it("should be able to load a step with no items at all", function () {
    
    var authoredContent = 
      {
        "type": "mysystem2",
        "prompt": "",
        "modules": [],
        "energy_types": [],
        "diagram_rules": []
      };
      
      var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
      MySystem.activityController.set('content',activity);   
      
      expect(MySystem.activityController.get('paletteItems').length()).toBe(0);
      expect(MySystem.activityController.get('energyTypes').length()).toBe(0);
      expect(MySystem.activityController.get('diagramRules').length()).toBe(0);
  });
  
  it("should be able to load a step with assignment text", function () {
    
    var authoredContent = 
      {
        "type": "mysystem2",
        "prompt": "prompt1",
        "modules": [],
        "energy_types": [],
        "diagram_rules": []
      };
      
      var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
      MySystem.activityController.set('content',activity);   
      
      expect(MySystem.activityController.get('assignmentText')).toBe("prompt1");
  });
  
});
