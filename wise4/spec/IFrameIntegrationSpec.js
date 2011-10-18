/*global describe it beforeEach afterEach spyOn Mysystem2 MySystem eventManager mockNode mockEventManager runs waits waitsFor*/
describe("Mysystem2 in an iframe", function(){
  var node,
      contentPanel,
      iframeId;
  
  function addScript(doc, src){
    var script = doc.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    doc.body.appendChild(script);
  }
  
  beforeEach(function(){
    var contentDoc,
        eventManager,
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
      contentPanel = document.getElementById("" + iframeId).contentWindow
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
    
  });

  afterEach(function(){
    $('#' + iframeId).remove();
  });
  
  it("loads", function(){
    runs(function(){
      contentPanel.loadContentAfterScriptsLoad(node);
    });
  });
  
  it("saving after a load does not add a nodeState", function(){
    runs(function(){
      contentPanel.loadContentAfterScriptsLoad(node);
      contentPanel.save();
    });
  });
});