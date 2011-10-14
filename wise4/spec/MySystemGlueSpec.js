/*global describe it beforeEach spyOn Mysystem2 MySystem*/
describe("Mysystem2", function(){
  var node;
  
  beforeEach(function(){
    // mock the node
    node = {
      getContent: function() {
        return {
          getContentJSON: function() {}
        };
      },
      studentWork: [],
      view: {
        eventManager: {
          subscribe: function() {}
        }
      }
    };
    
    // mock the MySystem object
    window.MySystem = {
      registerExternalSaveFunction: function(){}
    };
  });
  
  it("can be instanciated without error", function(){
    var mysys = new Mysystem2(node, null);
  });

  it("registers an external save handler when instanciated", function(){
    spyOn(MySystem, 'registerExternalSaveFunction');
    var mysys = new Mysystem2(node, null);
    
    expect(MySystem.registerExternalSaveFunction).toHaveBeenCalled();
  });
  
  describe("#getLatestState", function(){    
    var validState,
        validState2,
        invalidState;
    beforeEach(function(){
      validState = { type: 'MySystem2' };
      validState2 = { responses: 'MySystem2' };
      invalidState = { prop1: "Some answer", prop2: true };
    });
    
    it("can be called without error", function(){
      var mysys = new Mysystem2(node, null);
      mysys.getLatestState();
    });
    
    it("returns a state", function(){
      node.studentWork = [ validState ];
      var mysys = new Mysystem2(node, null);
      
      expect(mysys.getLatestState()).toBe(validState);
    });

    it("returns last state", function(){
      node.studentWork = [ validState, validState2 ];
      var mysys = new Mysystem2(node, null);
      
      expect(mysys.getLatestState()).toBe(validState2);
    });

    it("returns last valid state", function(){
      node.studentWork = [ validState, invalidState ];
      var mysys = new Mysystem2(node, null);
      
      expect(mysys.getLatestState()).toBe(validState);
    });
  });

  describe("#render", function(){
    var mysys;
    
    beforeEach(function(){
      mysys = new Mysystem2(node, null);
      
      window.SC = {
        isReady: true
      };
    });
    
    it("can be called without error", function(){
      mysys.render();
    });
  });
});