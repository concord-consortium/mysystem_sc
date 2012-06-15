loadWiseConfig/*global describe it beforeEach afterEach spyOn Mysystem2 MySystem eventManager mockEventManager mockNode*/
describe("Mysystem2", function(){
  var node,
      nodeContent,
      learnerDataElement;
  
  beforeEach(function(){
    // mock the Wise4 eventManager
    window.eventManager = mockEventManager();
    
    // mock the Wise4 Node
    node = mockNode(eventManager);
    nodeContent = node.getContent();
    
    // mock the MySystem object
    window.MySystem = {
      externalSaveFunction: null,
      externalSaveFunctionContext: null,
      registerExternalSaveFunction: function(f, context){
        MySystem.externalSaveFunction = f;
        MySystem.externalSaveFunctionContext = context;
      },
      updateFromDOM: function(){},
      loadWiseConfig: function(){},
      preExternalSave: function(){}
    };

    // Add empty learner data dom element
    learnerDataElement = document.createElement('div');
    learnerDataElement.id = 'my_system_state';
    document.getElementsByTagName('body')[0].appendChild(learnerDataElement);
  });
  
  afterEach(function(){
    document.getElementsByTagName('body')[0].removeChild(learnerDataElement);
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
      // setup a valid student work state to test the dom population
      node.studentWork = [ { type: 'mysystem2' } ];
      
      window.SC = {
        isReady: true
      };

    });
    
    it("can be called without error", function(){
      mysys = new Mysystem2(node, null);
      mysys.render();
    });
    
    it("calls loadWiseConfig if there is authored content", function(){
      spyOn(MySystem, 'loadWiseConfig');
      mysys = new Mysystem2(node, null);
      mysys.render();
      
      expect(MySystem.loadWiseConfig).toHaveBeenCalled();
    });
    
    it("does not call loadWiseConfig if there is no authored content", function(){
      spyOn(MySystem, 'loadWiseConfig');
      spyOn(nodeContent, 'getContentJSON').andReturn(null);
      mysys = new Mysystem2(node, null);
      mysys.render();
      
      expect(MySystem.loadWiseConfig).not.toHaveBeenCalled();
    });
    
  });
  
  describe("#save", function(){
    it("can be called without error", function(){
      var mysys = new Mysystem2(node, null);
      mysys.save();
    });
    
    it("does not post the current node visit", function(){
      spyOn(node.view,'postCurrentNodeVisit');
      var mysys = new Mysystem2(node, null);
      mysys.save();
      
      expect(node.view.postCurrentNodeVisit).not.toHaveBeenCalled();
    });
  });
  
  describe("the external save function", function(){
    it("runs without error", function(){
      var mysys = new Mysystem2(node, null);
      MySystem.externalSaveFunction.call(MySystem.externalSaveFunctionContext, false);
    });
    
    it("calls save and posts the current node visit", function(){
      spyOn(node.view, 'postCurrentNodeVisit');
      var mysys = new Mysystem2(node, null);
      MySystem.externalSaveFunction.call(MySystem.externalSaveFunctionContext, false);
      
      expect(node.view.postCurrentNodeVisit).toHaveBeenCalled();
    });
  });
  
  describe("lifecycle", function(){
    it("should complete without error", function(){
      // after the scripts are loaded the window.loadContentAfterScriptsLoad (defined in mysystem2.html)
      // this then calls
      var mysystem2 = new Mysystem2(node, node.view);
      mysystem2.render();
      
      // now the step is used by the user
      // which might result in some callbacks being called
      // TODO call some of them
      
      // now the user leaves the step
      // this apparently calls Mysystem2Node#onExit which is in the outer iframe
      // Mysystem2Node implements this to call window.save on the inner frame
      // that then calls the following methods
      mysystem2.preSave();
      mysystem2.save();
    });
  });
});