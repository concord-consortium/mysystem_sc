// ==========================================================================
// Project:   MySystem.Node Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

var store;

module("MySystem.Node", {
  setup: function () {
    store = MySystem.setupTestStore();
  },
  
  teardown: function () {
    
  }
});

function isArray(testObject) {
  return testObject && !testObject.propertyIsEnumerable('length') && typeof testObject === 'object' && typeof testObject.length === 'number';
}

test("test title from fixture", function() {
  expect(1);
  var node   = store.find('MySystem.Node','1');
  var fixturesTitle = 'A Node';
  equals(node.get('title'),fixturesTitle, "Its title should be '"+ fixturesTitle +"' ");
});

test("test inLinks and outLinks", function() {
  expect(2);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node2   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var newLink = store.createRecord(MySystem.Link, { 'text': 'Link to test node' });
  newLink.set("startNode", node1);
  newLink.set("endNode", node2);
  newLink.set("startTerminal","a");
  newLink.set("endTerminal","b");
  var expectedInLinks = 1;
  var expectedOutLinks = 0;
  var foundOutlinks = node2.get('outLinks').get('length');
  var foundInLinks = node2.get('inLinks').get('length');
  equals(foundOutlinks, expectedOutLinks, "There should be "+ expectedOutLinks +" outlinks");
  equals(foundInLinks, expectedInLinks, "There should be "+ expectedInLinks +" inLinks");
});

test("tests connecting nodes to storySentences", function () {
  expect(3);
  var node   = store.find('MySystem.Node',1);
  var sent   = store.find('MySystem.StorySentence', 'ss1');
  var originalNodeConnections = node.get('sentences').get('length');
  var expectedNodeConnections = originalNodeConnections + 1;
  var originalSentenceConnections = sent.get('nodes').get('length');
  var expectedSentenceConnections = originalSentenceConnections + 1;
  sent.get('nodes').pushObject(node);
  equals(sent.get('nodes').get('length'), expectedSentenceConnections, "There should be " + expectedSentenceConnections + " node(s) associated with the sentence.");
  equals(node.get('sentences').get('length'), expectedNodeConnections, "There should be " + expectedNodeConnections + " sentence(s) associated with the node.");
  equals(sent.get('diagramObjects').get('length'), sent.get('nodes').get('length') + sent.get('links').get('length'), "The sentence's diagramObjects should equal the sum of the links and nodes.");
});

test("nodes should have x and y attributes", function() {
  expect(2);
  var node = store.createRecord(MySystem.Node, {'title': 'Edit Title', 'image': 'http://concord.org/favicon.ico', 'x': 120, 'y': 150});
  equals(node.get('x'), 120, "X position should be 120 as created");
  equals(node.get('y'), 150, "Y position should be 150 as created");
});

