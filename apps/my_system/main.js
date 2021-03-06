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
sc_require('api');

// MySystem.studentMode = MySystem.NOVICE_STUDENT;
MySystem.studentMode = MySystem.ADVANCED_STUDENT;

MySystem.setupStore = function (obj, ignoreUndeclaredFields) {
  // clear the ids counters on the AutoId record types
  // typically this won't matter at runtime but it will matter during testing
  delete MySystem.Node._nextIdIndex;
  delete MySystem.Link._nextIdIndex;

  if (typeof ignoreUndeclaredFields === 'undefined') ignoreUndeclaredFields = NO;

  obj.dataSource = SC.CascadeDataSource.create({
    dataSources: ['authorContentDataSource','studentStateDataSource', 'fixturesDataSource'],

    authorContentDataSource: MySystem.MergedHashDataSource.create({
      ignoreUndeclaredFields: ignoreUndeclaredFields,
      handledRecordTypes: [
        MySystem.EnergyType,
        MySystem.PaletteItem,
        MySystem.Activity,
        MySystem.RubricCategory,
        MySystem.DiagramRule],
    }),

    studentStateDataSource: MySystem.MergedHashDataSource.create({
      ignoreUndeclaredFields: ignoreUndeclaredFields,
      
      handledRecordTypes: [
        MySystem.Link, 
        MySystem.Node, 
        MySystem.Story, 
        MySystem.StorySentence, 
        MySystem.RuleFeedback, 
        MySystem.GraphicPreview,
        MySystem.RubricScore],

      // write the updated student-state data to the DOM whenever it changes
      // New: Write the updated student-state data to a variable whenever it changes.
      dataStoreDidUpdateDataHash: function () {
        // include a 'version' field in the saved data. The WISE4 glue code will warn users if 
        // MySystem.learnerDataVersion === DEVELOPMENT_HEAD; hopefully, this will prevent students from
        // actually using a MySystem version that saves learner data with 'version' field === DEVELOPMENT_HEAD
        this.get('dataHash').version = MySystem.learnerDataVersion; 
        var textRep = JSON.stringify(this.get('dataHash'), null, 2);
        SC.$('#my_system_state').text(textRep);
        MySystem.savingController.set("dataIsDirty", YES);
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

    setInitialDiagramHash: function(hash) {
      this.dataSource.studentStateDataSource.setDataHash(this,hash,true);
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
  var nodes = MySystem.store.find(MySystem.Diagrammable);
  MySystem.nodesController.set('content', nodes);

  // Configured activity
  var activity = MySystem.store.find(MySystem.Activity, 'assign1');
  MySystem.activityController.set('content',activity);

  // User story
  var storyQuery = SC.Query.local(MySystem.StorySentence, { orderBy: 'order' });
  var storySentences = MySystem.store.find(storyQuery);
  MySystem.storySentenceController.set('content', storySentences);

  MySystem.canvasView = MySystem.mainPage.mainPane.get('diagramView');    // TODO rename to 'diagramView' project-wide RPK 8-11-11

  MySystem.statechart.initStatechart();
  MySystem.storyController.showInstructions();
  SC.RootResponder.CAPTURE_BACKSPACE_KEY = YES;
};

function main() { MySystem.main(); }

