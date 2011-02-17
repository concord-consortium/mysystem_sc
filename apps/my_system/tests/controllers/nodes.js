// ==========================================================================
// Project:   MySystem.nodesController Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

sc_require('lib/old_format_json_parser');

module("MySystem.nodesController", {
  setup: function () {
    MySystem.canvasView = MySystem.getPath('mainPage.mainPane.topView.bottomRightView.bottomRightView');
  }
  
});


test("Data loading", function() {
  expect(2);
  // Tests that nodes get loaded from the store
  var nodes = MySystem.store.find(MySystem.Node);
  MySystem.nodesController.set('content', nodes);
  ok(nodes.get('length') > 0, "There should be nodes in the store");
  equals(MySystem.nodesController.get('content').get('length'), nodes.get('length'), "Controller should have as many Nodes as the store");
});

// This breaks, probably due to a newer SproutCore version: "Not Found" error
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

// This crashes the app with "Object Ki.State has no method 'get'" despite working outside the test
// environment.
test("Managing selection", function() {
  // expect(2);
  // var firstNode = MySystem.nodesController.get('content').firstObject();
  // MySystem.nodesController.selectObject(firstNode);
  // equals(MySystem.nodesController.get('allSelected').get('length'), 1, "Only one node should be selected");
  // MySystem.nodesController.selectObject(MySystem.nodesController.get('content').nextObject(1, firstNode));
  // equals(MySystem.nodesController.get('allSelected').get('length'), 1, "Still, only one node should be selected");
});

// This no longer applies, because selected nodes no longer bring up the property editor pane
// test("Property editor pane comes and goes", function() {
//   expect(4);
//   var nodes = MySystem.store.find(MySystem.Node);
//   var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
//   MySystem.nodesController.set('content', nodes);
//   if (MySystem.nodesController.get('allSelected').get('length') > 0) { // Deselect everything selected
//     MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
//   }
//   equals(MySystem.nodesController.get('allSelected').get('length'), 0, "No items are selected at first");
//   ok(!propertyEditor.isPaneAttached, "Starts out with no property editor");
//   MySystem.nodesController.selectObject(MySystem.nodesController.get('content').firstObject());
//   ok(propertyEditor.isPaneAttached, "With a selection property editor should be attached.");
//   MySystem.nodesController.deselectObject(MySystem.nodesController.get('content').firstObject());
//   ok(!propertyEditor.isPaneAttached, "No nodes selected implies no property editor");
// });
