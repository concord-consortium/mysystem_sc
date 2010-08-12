// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
MySystem.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  MySystem.getPath('mainPage.mainPane').append() ;

  // Set the content property on the primary controller
	var nodeQuery = SC.Query.create({
		conditions: '(guid = "1") OR (guid = "2") OR (guid = "3")',
		recordType: MySystem.Node }); // Get the first three fixtures for display
  var nodes = MySystem.store.find(nodeQuery);
  MySystem.nodesController.set('content', nodes);
	var story = MySystem.store.find(MySystem.Story, 1);
	MySystem.storyController.set('content', story);

} ;

function main() { MySystem.main(); }
