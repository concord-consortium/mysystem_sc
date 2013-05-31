/*globals MySystem, SCUtil, InitialMySystemData window alert SC*/
sc_require('main');
MySystem.clearCanvas = function () {
  MySystem.loadInitialDiagram();
};

MySystem.loadInitialDiagram = function() {
  var initialDiagram = MySystem.activityController.get('initialDiagramJson')|| '';
  if (initialDiagram.trim().length < 1) { return; }
  var hash = JSON.parse(initialDiagram);
  MySystem.store.setInitialDiagramHash(hash);
};

// Load canvas data for student
MySystem.loadCanvas = function () {
  MySystem.clearCanvas();
  // For now it will only load from the fixture StudentState
  var state = MySystem.store.find(MySystem.StudentState).objectAt(0);
  var json = JSON.parse(state.get('content'));
  MySystem.parseOldFormatJson(json);
};

// TODO: latestResponse is not used.
MySystem.loadWiseConfig = function(authoredContent,latestResponse) {
  SC.run( function() {
    MySystem.activityController.contentFromWiseStepDef(authoredContent);
    MySystem.loadInitialDiagram();
    MySystem.updateFromDOM();
    var lastFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    MySystem.activityController.set('lastFeedback',lastFeedback.get('feedback'));
    MySystem.activityController.set('numOfSubmits',lastFeedback.get('numOfSubmits'));
  });
};

// an external save function so that, when we are in an external application which can
// save data (Wise2...), we can save our data externally whenever we want
MySystem.registerExternalSaveFunction = function(func, context) {
  if (!!func) {
    MySystem.savingController.set('saveFunction', function(isSubmit){
      func.call(context, isSubmit);
    });
  } else {
     MySystem.savingController.set('saveFunction', null);
  }
};

// Do any processing or cleanup that ought to be done before an external application
// wants to save data and exit
MySystem.preExternalSave = function() {
  SC.RunLoop.begin();
  MySystem.activityController.getDiagramFeedback({isSubmit: NO});
  MySystem.GraphicPreview.makePreview(MySystem.store);
  SC.RunLoop.end();
};

// Set how frequently the save function is triggered, in ms. If < 0 it will never autosave
MySystem.setAutoSaveFrequency = function(ms) {
  MySystem.savingController.set('autoSaveFrequency', ms);
};

// Called by external app when an external save function returns.
// @param successful {Boolean}      true if the data was successfully saved
MySystem.externalSaveSuccessful = function(successful) {
  MySystem.savingController.saveSuccessful(successful);
};



// Expose sproutcore:
MySystem.SC = SC;

MySystem.setAuthoringDataController = function(controller) {
  MySystem._authoringDataController = controller;
};

MySystem.getAuthoringDataController = function() {
  return MySystem._authoringDataController;
};

MySystem.getAuthoringData = function() {
  return MySystem.getAuthoringDataController().get('data');
};

MySystem.getStateJson = function() {
  return SC.$('#my_system_state').text();
};

MySystem.loadInitialDiagramJson = function() {
  var dataJSON = MySystem.getStateJson();
  var data = null;
  if (dataJSON && dataJSON.trim().length > 0) {
    data = JSON.parse(dataJSON);
  }
  if (data) {
    return JSON.stringify({'MySystem.Link': data['MySystem.Link'], 'MySystem.Node': data['MySystem.Node']});
  }
};

MySystem.saveInitialDiagramJson = function(_data) {
  var previewDiagram = MySystem.loadInitialDiagramJson();
  if (previewDiagram) {
    var dataController = MySystem.getAuthoringDataController();
    dataController.saveInitialDiagramJson(previewDiagram);
  }
};

MySystem.saveInitialDiagramAsSaveFunction = function() {
  MySystem.registerExternalSaveFunction(function(data) {
    MySystem.saveInitialDiagramJson(false);
  });
};

MySystem.updateAssetPaths = function (theData) {
  if (typeof MySystem.resolveAssetPath === "function") {
    theData = MySystem.resolveAssetPath(theData);
  }
  return theData;
};

MySystem.updateRuntime = function(_data) {
  var data = _data;
  data = MySystem.getAuthoringData();

  // if (typeof data.get !== 'undefined') {
  //   console.log("why is this happening? Data Should already be a hash.");
  //   data = data.get('data');
  // }

  SC.RunLoop.begin();
    MySystem.loadWiseConfig(data, null);
  SC.RunLoop.end();

};

MySystem.reloadAuthoringData = function() {
  MySystem.saveInitialDiagramJson();
  var data = MySystem.getAuthoringData();

  SC.RunLoop.begin();
    MySystem.loadWiseConfig(data, null);
  SC.RunLoop.end();
};

MySystem.scoreDiagram = function(){
  MySystem.rubricController.displayScore();
};

function receiveMessage(message) {
  if(message.data) {

    if (message.data.command === 'loadAuthorData') {
      var author_data = JSON.parse(message.data.data);

      SC.RunLoop.begin();
        MySystem.loadWiseConfig(author_data, null);
      SC.RunLoop.end();
    }

    if (message.data.command === 'loadStudentData') {
      SC.$('#my_system_state').text(message.data.data);
      MySystem.updateFromDOM();


      SC.run(function(e) {
        MySystem.rubricController.score();
        MySystem.preExternalSave();
      });

      var rubricScore = MySystem.RubricScore.instance();
      var score = rubricScore.get('score');
      var categories = rubricScore.get('categories');

      var data = {
        'command': 'loadStudentData',
        'response': MySystem.getStateJson(),
        'stepWorkId' : message.data.stepWorkId,
        'score' : score,
        'categories': categories
        // 'svg' : MySystem.GraphicPreview.instance().get('svg')
      };
      message.source.postMessage(data,  "*");
    }
  }
}

window.addEventListener("message", receiveMessage, false);

