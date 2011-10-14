/*globals IntegrationTestHelper SC MySystem DiagramBuilder simulateClickOnSelector*/

IntegrationTestHelper = SC.Object.extend({
  domIO: null,
  externalSaveCount: null,
  diagram: null,
  authoredContent: null,
  learnerData: null,
  
  setupApp: function (){
    // register the external save function just like a container appliction would
    this.set('externalSaveCount', 0);
    MySystem.registerExternalSaveFunction(function(){
      this.set('externalSaveCount', this.get('externalSaveCount') + 1);
    }, this);

    // turn off auto saving so timers don't keep firing after the test is done
    MySystem.setAutoSaveFrequency(-1);

    // Run the full app main method which would normally happen on page load
    SC.RunLoop.begin();
    MySystem.main();
    SC.RunLoop.end();

    // Add initial learner data dom element
    $('body').append('<div id="my_system_state"></div>');
    this.set('domIO', document.getElementById('my_system_state'));

    if(this.get('learnerData')){
      // Add initial learner data to the dom just like a container application would
      this.get('domIO').textContent = JSON.stringify(this.get('learnerData'));

      // tell MySystem to update just like a container application should
      MySystem.updateFromDOM();
    }

    if(this.get('authoredContent')){
      MySystem.loadWiseConfig(this.get('authoredContent'),null);
    }

    if(this.get('learnerData')){
      MySystem.updateFromDOM();
    }
    
    // setup diagram builder so we can manipulate the diagram
    this.set('diagram', DiagramBuilder.create({
     paletteView: MySystem.getPath('mainPage.mainPane').getPath('topView.topLeftView.contentView'),
     diagramView: MySystem.getPath('mainPage.mainPane').getPath('topView.bottomRightView.bottomRightView.diagramView')
    }));
  },
  
  teardownApp: function() {
    SC.RunLoop.begin();
    // Remove the full app ui so we can see the test results
    MySystem.getPath('mainPage.mainPane').remove();

    $('#my_system_state').remove();
    // Clear things that are not cleared from test run to test run.
    MySystem.savingController.set('dataIsDirty', NO);
    SC.RunLoop.end();
  },
  
  submitDiagram: function() {
    simulateClickOnSelector(".button:contains('Submit Diagram')");
    // click the ok button on the dialog
    simulateClickOnSelector(".button:contains('OK')");
    return this;
  },
  
  addNode: function(nodeName) {
    // need to add something to the diagram so we can save it
    this.get('diagram').add(nodeName, 100, 100);
    return this;
  },
  
  saveDiagram: function() {
    simulateClickOnSelector(".button:contains('Save')");
    return this;
  },
  
  lastFeedback: function() {
    var savedLearnerData = this.get('domIO').textContent;
    var parsedLearnerData = JSON.parse(savedLearnerData);
    return parsedLearnerData["MySystem.RuleFeedback"].LAST_FEEDBACK;
  },
  
  expectProperty: function(property) {
    return expect(this.get(property));
  }
});