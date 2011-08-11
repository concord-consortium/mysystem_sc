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

test("test links computed param", function() {
  expect(1);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node2   = store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node3   = store.createRecord(MySystem.Node, { 'title': 'Test node 3', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var newLink1 = store.createRecord(MySystem.Link, { 'text': 'First test link' });
  newLink1.set("startNode", node1);
  newLink1.set("endNode", node2);
  newLink1.set("startTerminal","a");
  newLink1.set("endTerminal","b");
  var newLink2 = store.createRecord(MySystem.Link, { 'text': 'Second test link' });
  newLink2.set("startNode", node2);
  newLink2.set("endNode", node3);
  newLink2.set("startTerminal","a");
  newLink2.set("endTerminal","b");
  var foundOutlinks = node2.get('outLinks').get('length');
  var foundInLinks = node2.get('inLinks').get('length');
  var expectedLinks = foundOutlinks + foundInLinks;
  var foundLinks = node2.get('links').get('length');
  equals(foundLinks, expectedLinks, "There should be "+ expectedLinks +" links");
});

test("test that computed 'links' are updated when inlinks or outlinks changes", function() {
  expect(2);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node2   = store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node3   = store.createRecord(MySystem.Node, { 'title': 'Test node 3', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var newLink1 = store.createRecord(MySystem.Link, { 'text': 'First test link' });
  newLink1.set("startNode", node1);
  newLink1.set("endNode", node2);
  newLink1.set("startTerminal","a");
  newLink1.set("endTerminal","b");
  var newLink2 = store.createRecord(MySystem.Link, { 'text': 'Second test link' });
  newLink2.set("startNode", node2);
  newLink2.set("endNode", node3);
  newLink2.set("startTerminal","a");
  newLink2.set("endTerminal","b");
  var expectedLinks = 2;
  var foundLinks = node2.get('links').get('length');
  equals(foundLinks, expectedLinks, "There should be "+ expectedLinks +" links");
  var newLink3 = store.createRecord(MySystem.Link, { 'text': 'Third test link' });
  newLink3.set("startNode", node2);
  newLink3.set("endNode", node1);
  newLink3.set("startTerminal","a");
  newLink3.set("endTerminal","b");
  expectedLinks++;
  foundLinks = node2.get('links').get('length');
  equals(foundLinks, expectedLinks, "Then there should be " + expectedLinks + " links");
});

test("nodes should have a position attribute", function() {
  expect(2);
  var node = store.createRecord(MySystem.Node, {'title': 'Edit Title', 'image': 'http://concord.org/favicon.ico', 'position': {'x': 120, 'y': 150}});
  equals(node.get('position').x, 120, "X position should be 120 as created");
  equals(node.get('position').y, 150, "Y position should be 150 as created");
});

test("inLinkColors and ouLinkColors should return arrays of link colors", function() {
  expect(4);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node2   = store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node3   = store.createRecord(MySystem.Node, { 'title': 'Test node 3', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var newLink1 = store.createRecord(MySystem.Link, { 'text': 'First test link', 'color': 'red' });
  newLink1.set("startNode", node1);
  newLink1.set("endNode", node2);
  newLink1.set("startTerminal","a");
  newLink1.set("endTerminal","b");
  var newLink2 = store.createRecord(MySystem.Link, { 'text': 'Second test link', 'color': 'green' });
  newLink2.set("startNode", node1);
  newLink2.set("endNode", node3);
  newLink2.set("startTerminal","a");
  newLink2.set("endTerminal","b");
  equals(node2.get('inLinkColors').get('length'), 1, "There should be one color returned");
  same(node2.get('inLinkColors'), ["red"], "It should be red");
  equals(node1.get('outLinkColors').get('length'), 2, "There should be two colors returned");
  same(node1.get('outLinkColors'), ["red", "green"], "They should be red and green");
});

test("Checking transformation colors should return arrays of link colors", function() {
  expect(0);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var trans1  = store.createRecord(MySystem.Transformation, { 'guid': MySystem.Transformation.newGuid(), 'node': node1.id(), 'inLinkColor': 'red', 'outLinkColor': 'green' });
  var trans2  = store.createRecord(MySystem.Transformation, { 'guid': MySystem.Transformation.newGuid(), 'node': node1.id(), 'inLinkColor': 'red', 'outLinkColor': 'blue' });
  // equals(node1.get('inLinkColorsWithTransformations').get('length'), 2, "There should be two colors returned");
  // same(node1.get('inLinkColorsWithTransformations'), ["red", "red"], "They should both be red");
  // equals(node1.get('outLinkColorsWithTransformations').get('length'), 2, "There should be two colors returned");
  // same(node1.get('outLinkColorsWithTransformations'), ["green", "blue"], "They should be blue and green");
});

test("Checking for implied transformations", function() {
  expect(1);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node2   = store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node3   = store.createRecord(MySystem.Node, { 'title': 'Test node 3', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var newLink1 = store.createRecord(MySystem.Link, { 'text': 'First test link', 'color': 'red' });
  newLink1.set("startNode", node1);
  newLink1.set("endNode", node2);
  newLink1.set("startTerminal","a");
  newLink1.set("endTerminal","b");
  var newLink2 = store.createRecord(MySystem.Link, { 'text': 'Second test link', 'color': 'green' });
  newLink2.set("startNode", node1);
  newLink2.set("endNode", node3);
  newLink2.set("startTerminal","a");
  newLink2.set("endTerminal","b");
  ok(!node1.get('hasImpliedTransformations'), 'There should not be implied transformations');
  var newLink3 = store.createRecord(MySystem.Link, { 'text': 'Third test link', 'color': 'red' });
  newLink2.set("startNode", node3);
  newLink2.set("endNode", node2);
  newLink2.set("startTerminal","a");
  newLink2.set("endTerminal","b");
  // ok(node3.get('hasImpliedTransformations'), 'There should be an implied transformation');
});

test("Checking transformation annotations", function() {
  expect(0);
  var node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var trans1  = store.createRecord(MySystem.Transformation, { 'guid': MySystem.Transformation.newGuid(), 'node': node1.id(), 'inLinkColor': 'red', 'outLinkColor': 'green' });
  // ok(!node1.get('transformationsAreAllAnnotated'), "The transformation is not annotated");
  trans1.set('annotation', store.createRecord(MySystem.StorySentence, { 'guid': MySystem.StorySentence.newGuid(), 'bodyText': 'lorem ipsum' }));
  // ok(node1.get('transformationsAreAllAnnotated'), "The transformation is annotated");
});
