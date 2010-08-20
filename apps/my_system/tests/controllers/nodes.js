// ==========================================================================
// Project:   MySystem.nodesController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.nodesController");

sc_require('lib/old_format_json_parser');

test("Data loading", function() {
  // Tests that nodes get loaded from the store
  var nodes = MySystem.store.find(MySystem.Node);
  MySystem.nodesController.set('content', nodes);
  ok(nodes.get('length') > 0, "There should be nodes in the store");
  equals(MySystem.nodesController.get('content').get('length'), nodes.get('length'), "Controller should have as many Nodes as the store");
});

test("Data loading from JSON", function() {
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
