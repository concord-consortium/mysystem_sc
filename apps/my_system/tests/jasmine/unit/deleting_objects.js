
defineJasmineHelpers();

describe("Deleting objects", function (){
  
  beforeEach( function () {
      
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
          },
          {
            "name": "obj4",
            "uuid": "obj4"
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
        ],
        "diagram_rules": []
      };
    
    var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
    MySystem.activityController.set('content',activity);
  });
  
  describe("Deleting loaded work", function () {

    it("should be able to delete nodes", function () {
      dataHelper.setStudentStateDataHash(
        {
          nodes: ['obj1','obj2','obj3']
        }
      );
      
      expect(MySystem.store.find(MySystem.Node).length()).toBe(3);
      MySystem.store.find(MySystem.Node, 'obj2.0').destroy();
      expect(MySystem.store.find(MySystem.Node).length()).toBe(2);
    });
    
    it("should be able to delete linked nodes and have links be deleted", function () {
      dataHelper.setStudentStateDataHash(
        {
          nodes: ['obj1','obj2','obj3','obj4'], 
          links: ['obj1.0-->obj2.0','obj2.0-->obj3.0','obj3.0-->obj4.0']
        }
      );
      
      expect(MySystem.store.find(MySystem.Node).length()).toBe(4);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(3);
      
      MySystem.store.find(MySystem.Node, 'obj1.0').destroy();
      expect(MySystem.store.find(MySystem.Node).length()).toBe(3);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(2);
      
      MySystem.store.find(MySystem.Node, 'obj3.0').destroy();
      expect(MySystem.store.find(MySystem.Node).length()).toBe(2);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(0);
    });
    
    // https://www.pivotaltracker.com/story/show/17380029
    it("should be able to delete nodes with circular links", function () {
      dataHelper.setStudentStateDataHash(
        {
          nodes: ['obj1','obj2','obj3'], 
          links: ['obj1.0-->obj2.0','obj3.0-->obj2.0','obj2.0-->obj3.0']
        }
      );
      
      expect(MySystem.store.find(MySystem.Node).length()).toBe(3);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(3);
      MySystem.store.find(MySystem.Node, 'obj2.0').destroy();
      expect(MySystem.store.find(MySystem.Node).length()).toBe(2);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(0);
    });
    
    it("should be able to clear diagram with the clear function", function () {
      dataHelper.setStudentStateDataHash(
        {
          nodes: ['obj1','obj2','obj3'], 
          links: ['obj1.0-->obj2.0','obj3.0-->obj2.0','obj2.0-->obj3.0']
        }
      );
      
      expect(MySystem.store.find(MySystem.Node).length()).toBe(3);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(3);
      
      MySystem.clearCanvas();
      
      expect(MySystem.store.find(MySystem.Node).length()).toBe(0);
      expect(MySystem.store.find(MySystem.Link).length()).toBe(0);
    });
  });
});




