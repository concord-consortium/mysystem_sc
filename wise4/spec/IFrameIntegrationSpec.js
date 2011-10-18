/*global describe it beforeEach afterEach spyOn Mysystem2 MySystem eventManager mockNode mockEventManager runs waits*/
describe("Mysystem2 in an iframe", function(){
  var node,
      contentPanel;
  
  
  beforeEach(function(){
    var contentDoc,
        eventManager;
    runs(function(){
      $('body').append("<iframe id='ifrm'></iframe>");
      contentPanel = window.frames['ifrm'];
      contentDoc = contentPanel.document;

      // need to track down the path to the html page
      $.ajax({
        async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
        dataType: 'html',
        url: 'vle/node/mysystem2/mysystem2.html',
        success: function(data) {
          // need to inject the base tag so relative references can be found
          // normally this is done by the wise4 vle
          data = data.replace('<head>', "<head><base href='vle/node/mysystem2/'/>");

          // need to insert the 2 scripts needed by the iframe
          // at runtime this is done by the scriptLoader but using that would mean pulling
          // in the VLE runtime
          data = data.replace('</body>', 
            "<script type='text/javascript' src='mysystem2.js'></script>"+
            "<script type='text/javascript' src='mysystem2State.js'></script>"+
            "</body>");
          contentDoc.open();
          contentDoc.write(data);
          contentDoc.close();
        }
      });

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
    
    waits(100);
    
  });

  afterEach(function(){
    runs(function(){
      $('#ifrm').remove();
    });
  });
  
  it("loads", function(){
    runs(function(){
      contentPanel.$(function(){
        contentPanel.loadContentAfterScriptsLoad(node);
      });
    });
  });
  
  it("saving after a load does not add a nodeState", function(){
    runs(function(){
      contentPanel.loadContentAfterScriptsLoad(node);
      contentPanel.save();
    });
  });
});