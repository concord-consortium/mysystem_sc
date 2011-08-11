// ==========================================================================
// Project:   MySystem.nodesController Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

// Currently, this setup crashes the app with "Object SC.State has no method 'get'" despite working outside the test
// environment. (the observer method MySystem.nodesController.propertyEditing() attempts to call sendEvent on
// the uninitialized statechart MySystem.statechart.)


sc_require('lib/old_format_json_parser');

module("MySystem.nodesController", {
  setup: function () {
    MySystem.setupStore(MySystem);
  }
  
});


// This breaks, probably due to a newer SproutCore version: "Not Found" error
test("Data loading old data from JSON", function() {
  expect(2);
  
  // there should be no nodes in the store when we start because fixtures are ignored by the 
  // setupStore method above in setup
  var nodes = MySystem.store.find(MySystem.Node);
  ok(nodes.get('length') == 0, "There should be no nodes in the store");
  
  MySystem.loadCanvas(); // Clears the store and re-loads the store from old JSON in fixtures
  var nodes = MySystem.store.find(MySystem.Node); // Load nodes from store.
  ok(nodes.get('length') > 0, "There should be nodes in the store");
});
