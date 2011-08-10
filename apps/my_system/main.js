// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//

sc_require('lib/old_format_json_parser');

// MySystem.studentMode = MySystem.NOVICE_STUDENT;
MySystem.studentMode = MySystem.ADVANCED_STUDENT;

MySystem.setupStore = function setupStore(obj) {

  obj.dataSource = SC.CascadeDataSource.create({
    dataSources: ['studentStateDataSource', 'fixturesDataSource'],

    studentStateDataSource: MySystem.MergedHashDataSource.create({
      handledRecordTypes: [MySystem.Link, MySystem.Node, MySystem.Story, MySystem.StorySentence, MySystem.RuleFeedback],

      // write the updated student-state data to the DOM whenever it changes
      // New: Write the updated student-state data to a variable whenever it changes.
      dataStoreDidUpdateDataHash: function () {
        var textRep = JSON.stringify(this.get('dataHash'), null, 2);
        SC.$('#my_system_state').text(textRep);
      }
    }),

    fixturesDataSource: SC.FixturesDataSource.create({
      // Patch. CascadeDataSource's commitRecords naively has each data source attempt to commit the same records.
      // (This results in an internal inconsistency error on record creation, because the fixturesDataSource tries to
      // create the same record that the studentStateDataSource has just created, and whose storeKey is therefore in
      // the wrong state -- READY instead of BUSY)
      commitRecords: function () { return YES; }
    })
  });

  // the store passes student state data to the student state data source
  obj.store = SC.Store.create({
    commitRecordsAutomatically: YES,

    setStudentStateDataHash: function (hash) {
      this.dataSource.studentStateDataSource.setDataHash(this, hash);
    },
    getStudentStateDataHash: function() {
      var dataHash = this.dataSource.studentStateDataSource.dataHash();
      return JSON.stringify(dataHash,null,2);
    }
  }).from(obj.dataSource);
};

MySystem.main = function main() {
  MySystem.setupStore(MySystem);

  // load the initial data from the DOM (see core.js)
  MySystem.updateFromDOM();

  MySystem.getPath('mainPage.mainPane').append();

  SC.ExceptionHandler = MySystem.ExceptionHandler;

  //Set the content property on the primary controller
  var nodes = MySystem.store.find(MySystem.Node);
  MySystem.nodesController.set('content', nodes);

  // Configured activity
  var activity = MySystem.store.find(MySystem.Activity, 'assign1');
  MySystem.activityController.set('content',activity);

  // User story
  var storyQuery = SC.Query.local(MySystem.StorySentence, { orderBy: 'order' });
  var storySentences = MySystem.store.find(storyQuery);
  MySystem.storySentenceController.set('content', storySentences);

  var transformations = MySystem.store.find(MySystem.Transformation);

  // MySystem.linkColorChooser = MySystem.mainPage.mainPane.childViews.objectAt(0).topLeftView.childViews.objectAt(5);
  // MySystem.linkColorChooser.set('content', 'red');
  MySystem.canvasView = MySystem.mainPage.mainPane.topView.bottomRightView.bottomRightView;
  MySystem.transformationsCanvasView = MySystem.getPath('mainPage.transformationBuilderPane').get('childViews').objectAt(0).get('childViews').objectAt(2);
  MySystem.transformationAnnotaterPane = MySystem.getPath('mainPage.transformationAnnotaterPane');

  MySystem.statechart.initStatechart();
};

function main() { MySystem.main(); }

MySystem.clearCanvas = function () {
  var i;
  var nodes = MySystem.store.find(MySystem.Node);
  for (i = 0; i < nodes.get('length'); ++i) {
      nodes.objectAt(i).destroy();
  }
  var links = MySystem.store.find(MySystem.Link);
  for (i = 0; i < links.get('length'); ++i) {
      links.objectAt(i).destroy();
  }
};

// Load canvas data for student
MySystem.loadCanvas = function () {
  MySystem.clearCanvas();
  // For now it will only load from the fixture StudentState
  var state = MySystem.store.find(MySystem.StudentState).objectAt(0);
  var json = JSON.parse(state.get('content'));
  MySystem.parseOldFormatJson(json);
};

MySystem.loadWiseConfig = function(authoredContent,latestResponse) {
  SC.run( function() {
    var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
    MySystem.activityController.set('content',activity);
    MySystem.updateFromDOM();
  });
};

// an external save function so that, when we are in an external application which can
// save data (Wise2...), we can save our data externally whenever we want
MySystem.externalSaveFunction = null;

MySystem.registerExternalSaveFunction = function(func, context) {
  MySystem.externalSaveFunction = function(){
    func.call(context);
  };
};

