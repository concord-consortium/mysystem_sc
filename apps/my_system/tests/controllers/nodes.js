// ==========================================================================
// Project:   MySystem.nodesController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.nodesController");

sc_require('lib/old_format_json_parser');

test("Data loading", function() {
  expect(2);
  // Tests that nodes get loaded from the store
  var nodes = MySystem.store.find(MySystem.Node);
  MySystem.nodesController.set('content', nodes);
  ok(nodes.get('length') > 0, "There should be nodes in the store");
  equals(MySystem.nodesController.get('content').get('length'), nodes.get('length'), "Controller should have as many Nodes as the store");
});

test("Data loading from JSON", function() {
  expect(2);
  var oldFirstNode = MySystem.store.find(MySystem.Node).firstObject().toString();
  // To prove we're loading from JSON we should test that the nodes
  // loaded here are different from those loaded from the store.
  // We've serialized the first of the old nodes in order to save the value;
  // if the following function works it would overwrite the original node.
  MySystem.loadCanvas(); // Clears the store and re-loads the store from JSON.
  var nodes = MySystem.store.find(MySystem.Node); // Load nodes from store.
  ok(nodes.get('length') > 0, "There should be nodes in the store");
  ok(!(nodes.firstObject().toString() == oldFirstNode), "The JSON objects shouldn't be the same as the fixture objects");
});

test("Adding nodes", function() {
  expect(2);
  var oldNodeCount = MySystem.store.find(MySystem.Node).get('length');
  MySystem.nodesController.addNode("QUnit Test Node", "http://blog.concord.org/uploads/icons/software-badge.thumb.jpg", 100, 100);
  var newNodeCount = MySystem.store.find(MySystem.Node).get('length');
  equals(newNodeCount, oldNodeCount + 1, "There should be one more node in the store.");
  // The method tolerates empty arguments
  MySystem.nodesController.addNode();
  equals(MySystem.store.find(MySystem.Node).get('length'), newNodeCount+1, "Adding with no arguments should still create a new node.");
});

test("Deleting nodes on-canvas", function() {
  expect(1);
  ok(true, "This might be better tested by Lebowski.");
});

test("Managing the selected array", function() {
  expect(2);
  var oldSelected = MySystem.nodesController.get('allSelected').get('length');
  equals(oldSelected, 0, "No items are selected at first");
  MySystem.nodesController.selectObject(MySystem.nodesController.get('content').firstObject());
  var newSelected = MySystem.nodesController.get('allSelected').get('length');
  equals(newSelected,oldSelected+1,"One item is selected");
  // Testing link selection isn't easy for QUnit at this point
  // MySystem.nodesController.linkSelected = MySystem.store.find('MySystem.Link', 'link1');
  // newSelected = MySystem.nodesController.get('allSelected').get('length');
  // equals(newSelected,oldSelected+2,"A node and a link are selected");
});

test("Multi-select is disabled", function() {
  expect(2);
  var firstNode = MySystem.nodesController.get('content').firstObject();
  MySystem.nodesController.selectObject(firstNode);
  equals(MySystem.nodesController.get('allSelected').get('length'), 1, "Only one node should be selected");
  MySystem.nodesController.selectObject(MySystem.nodesController.get('content').nextObject(1, firstNode));
  equals(MySystem.nodesController.get('allSelected').get('length'), 1, "Only one node should be selected");
});

test("Property editor pane comes and goes", function() {
  expect(4);
  var nodes = MySystem.store.find(MySystem.Node);
  MySystem.nodesController.set('content', nodes);
  if (MySystem.nodesController.get('allSelected').get('length') > 0) { // Deselect everything selected
    MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
  }
  equals(MySystem.nodesController.get('allSelected').get('length'), 0, "No items are selected at first");
  ok(!MySystem.getPath('mainPage.propertyViewPane').isPaneAttached, "Starts out with no property editor");
  MySystem.nodesController.selectObject(MySystem.nodesController.get('content').firstObject());
  ok(MySystem.getPath('mainPage.propertyViewPane').isPaneAttached, "With a selection property editor should be attached.");
  MySystem.nodesController.deselectObject(MySystem.nodesController.get('content').firstObject());
  ok(!MySystem.getPath('mainPage.propertyViewPane').isPaneAttached, "No nodes selected implies no property editor");
});
