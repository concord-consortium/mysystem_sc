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

MySystem.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  MySystem.getPath('mainPage.mainPane').append() ;

  SC.ExceptionHandler = MySystem.ExceptionHandler;

  // The following loads data from an old WireIt format layer data
  //MySystem.loadCanvas();
  var nodes = MySystem.store.find(MySystem.Node);
  //Set the content property on the primary controller
  MySystem.nodesController.set('content', nodes);
  var activity = MySystem.store.find(MySystem.Activity, 'assign1');
  MySystem.storyController.set('content', activity.get('assignmentText'));
  MySystem.nodePaletteController.set('content', activity.get('paletteItems'));
  MySystem.energyTypes = [];
  activity.get('energyTypes').forEach( function(et) {
    MySystem.energyTypes.push({'label': et.get('label'), 'color': et.get('color'), 'isEnabled': et.get('isEnabled') } );
  });
  
  var storyQuery = SC.Query.local(MySystem.StorySentence, { orderBy: 'order' });
  var storySentences = MySystem.store.find(storyQuery);
  MySystem.storySentenceController.set('content', storySentences);
  var transformations = MySystem.store.find(MySystem.Transformation);

  // MySystem.linkColorChooser = MySystem.mainPage.mainPane.childViews.objectAt(0).topLeftView.childViews.objectAt(5);
  // MySystem.linkColorChooser.set('content', 'red');
  MySystem.canvasView = MySystem.mainPage.mainPane.topView.bottomRightView.bottomRightView;
  MySystem.transformationsCanvasView = MySystem.getPath('mainPage.transformationBuilderPane').get('childViews').objectAt(0).get('childViews').objectAt(2);
  MySystem.transformationAnnotaterPane = MySystem.getPath('mainPage.transformationAnnotaterPane');
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
