// ==========================================================================
// Project:   MySystem.nodesController Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

// Currently, this setup crashes the app with "Object SC.State has no method 'get'" despite working outside the test
// environment. (the observer method MySystem.nodesController.propertyEditing() attempts to call sendEvent on
// the uninitialized statechart MySystem.statechart.)


// sc_require('lib/old_format_json_parser');
// 
// module("MySystem.nodesController", {
//   setup: function () {
//     MySystem.canvasView = MySystem.getPath('mainPage.mainPane.topView.bottomRightView.bottomRightView');
//   }
//   
// });
// 
// 
// // This breaks, probably due to a newer SproutCore version: "Not Found" error
// test("Data loading from JSON", function() {
//   expect(2);
//   var oldFirstNode = MySystem.store.find(MySystem.Node).firstObject().toString();
//   // To prove we're loading from JSON we should test that the nodes
//   // loaded here are different from those loaded from the store.
//   // We've serialized the first of the old nodes in order to save the value;
//   // if the following function works it would overwrite the original node.
//   MySystem.loadCanvas(); // Clears the store and re-loads the store from JSON.
//   var nodes = MySystem.store.find(MySystem.Node); // Load nodes from store.
//   ok(nodes.get('length') > 0, "There should be nodes in the store");
//   ok(!(nodes.firstObject().toString() === oldFirstNode), "The JSON objects shouldn't be the same as the fixture objects");
// });
// 
// 
// test("Managing selection", function() {
//   expect(2);
//   var firstNode = MySystem.nodesController.get('content').firstObject();
//   MySystem.nodesController.selectObject(firstNode);
//   equals(MySystem.nodesController.get('allSelected').get('length'), 1, "Only one node should be selected");
//   MySystem.nodesController.selectObject(MySystem.nodesController.get('content').nextObject(1, firstNode));
//   equals(MySystem.nodesController.get('allSelected').get('length'), 1, "Still, only one node should be selected");
// });
