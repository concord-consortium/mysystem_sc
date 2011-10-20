/*global describe it beforeEach afterEach spyOn Mysystem2 MySystem eventManager mockNode mockEventManager runs waits waitsFor*/
describe("Mysystem2 in an iframe", function(){
  var node,
      eventManager,
      contentPanel,
      iframeId,
      newNodeIndex = 0;
  
  beforeEach(function(){
    var contentDoc,
        htmlTemplate = null;
        
    runs(function(){
      $.ajax({
        async: true, 
        dataType: 'html',
        url: 'vle/node/mysystem2/mysystem2.html',
        success: function(data) {
          htmlTemplate = data;
        },
        error: function() {
          alert("Failed to load in data for some reason");
        }
      });

      // htmlTemplate = "<html><head></head><body>Hello There</body></html>";

    });
    
    waitsFor(function(){
      return htmlTemplate !== null;
    }, 10000, "failed getting html template");
    
    runs(function(){
      iframeId = Math.floor(Math.random() * 1000000);
      $('body').append("<iframe id='" + iframeId + "' name='" + iframeId + "' width='100%'>[Sorry, your browser does not support iFrames.]</iframe>");
      contentPanel = document.getElementById("" + iframeId).contentWindow;
      contentDoc = contentPanel.document;

      // need to inject the base tag so relative references can be found
      // normally this is done by the wise4 vle
      htmlTemplate = htmlTemplate.replace('<head>', "<head><base href='http://" + window.location.host + "/vle/node/mysystem2/'>");
  
      // need to insert the 2 scripts needed by the iframe
      // at runtime this is done by the scriptLoader but using that would mean pulling
      // in the VLE runtime
      htmlTemplate = htmlTemplate.replace('</body>', 
        "<script type='text/javascript' src='mysystem2.js'></script>"+
        "<script type='text/javascript' src='mysystem2State.js'></script>"+
        "</body>");

      // hack to prevent dialog box complaining about learner data version
      htmlTemplate = htmlTemplate.replace('TESTING = false', 'TESTING = true');
      
      contentDoc.open();
      contentDoc.write(htmlTemplate);
      contentDoc.close();

      // contentDoc.open();
      // contentDoc.write("<html><head></head><body>Hello There</body></html>");
      // contentDoc.close();

      // might need to use some Jasmine async stuff here to give the browser time
      // to update scripts and dom

      // mock the Wise4 eventManager
      eventManager = mockEventManager();
      contentPanel.eventManager = eventManager;

      // mock the Wise4 Node
      node = mockNode(eventManager);

      // setup some fake authored content
      spyOn(node.getContent(), 'getContentJSON').andReturn({
         "type": "mysystem2",
         "prompt": "",
         "modules": [
           {
             "name": "obj1",
             "uuid": "obj1"
           }
         ],
         "energy_types": [
           {
             "label": "en1",
             "uuid": "en1"
           }
         ],
         "diagram_rules": []
       });
    });
    
    waitsFor(function(){
      return contentPanel.loadContentAfterScriptsLoad && contentPanel.MYSYSTEM2STATE;
    }, 1000, "Iframe scripts haven't been run");
    
    runs(function(){
      contentPanel.loadContentAfterScriptsLoad(node);
    });
  });

  afterEach(function(){
    $('#' + iframeId).remove();
  });
  
  it("does not add a nodeSate if there are no changes", function(){
    runs(function(){
      expect(contentPanel.MySystem.savingController.get('dataIsDirty')).toBeFalsy();
      contentPanel.save();

      expect(contentPanel.MySystem.savingController.get('dataIsDirty')).toBeFalsy();
      expect(node.studentWork.length).toBe(0);
    });
  });

  it("adds a nodeState after making a change and wise4 initiated save", function(){
    runs(function(){
      makeAChange();
      
      contentPanel.save();
      expect(contentPanel.MySystem.savingController.get('dataIsDirty')).toBe(true);
      expect(node.studentWork.length).toBe(1);
    });
  });

  it("adds only 1 nodeState after making a change hitting the save button and a wise4 initiated save", function(){
    runs(function(){
      makeAChange();
      pressSaveButton();
      
      expect(contentPanel.MySystem.savingController.get('dataIsDirty')).toBe(false);

      contentPanel.save();
      expect(node.studentWork.length).toBe(1);
    });
  });

  it("adds only 1 nodeState after making a change hitting the save button and then the submit button", function(){
    runs(function(){
      makeAChange();
      pressSaveButton();
      pressSubmitButton();

      expect(node.studentWork.length).toBe(1);
    });
  });

  it("adds only 1 nodeState after making a change, saving, making a change, and saving", function(){
    runs(function(){
      makeAChange();
      pressSaveButton();
      makeAChange();
      pressSaveButton();
      
      expect(node.studentWork.length).toBe(1);
    });
  });
  
  // this is a hacky way to make a change
  // it would be better to drag something onto the diagram
  function makeAChange(){
    contentPanel.SC.run(function(){
      contentPanel.MySystem.store.createRecord(contentPanel.MySystem.Node, { 'title': 'Test node ' + newNodeIndex, 'image': '/lightbulb_tn.png' });
    });
    newNodeIndex += 1;
  }
  
  function pressSaveButton(){
    contentPanel.SC.run(function(){
      contentPanel.MySystem.statechart.sendAction('saveButtonPressed');
    });

    // let MySystem know the save was successful Wise4 will call this after a
    // node.view.postCurrentNodeVisit call
    eventManager.subscriptions['processPostResponseComplete']();
  }
  
  function pressSubmitButton(){
    contentPanel.SC.run(function(){
      contentPanel.MySystem.statechart.sendAction('checkButtonPressed');
    });

    // let MySystem know the save was successful Wise4 will call this after a
    // node.view.postCurrentNodeVisit call
    eventManager.subscriptions['processPostResponseComplete']();
  }
});