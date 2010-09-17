// ==========================================================================
// Project:   MySystem.Node Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.Node");

function isArray(testObject) {
  return testObject && !testObject.propertyIsEnumerable('length') && typeof testObject === 'object' && typeof testObject.length === 'number';
}

test("test title from fixture", function() {
  expect(1);
  var node   = MySystem.store.find('MySystem.Node','1');
  var fixturesTitle = 'A Node';
  equals(node.get('title'),fixturesTitle, "Its title should be '"+ fixturesTitle +"' ");
});

test("test inLinks and outLinks from fixtures", function() {
  expect(2);
  var node   = MySystem.store.find('MySystem.Node',1);
  var expectedOutLinks = 2;
  var expectedInLinks = 0;
  var foundOutlinks = node.get('outLinks').get('length');
  var foundInLinks = node.get('inLinks').get('length');
  equals(foundOutlinks, expectedOutLinks, "There should be "+ expectedOutLinks +" outlinks");
  equals(foundInLinks, expectedInLinks, "There should be "+ expectedInLinks +" inLinks");
});

test("tests connecting nodes to storySentences", function () {
  expect(3);
  var node   = MySystem.store.find('MySystem.Node',1);
  var sent   = MySystem.store.find('MySystem.StorySentence', 'ss1');
  var originalNodeConnections = node.get('sentences').get('length');
  var expectedNodeConnections = originalNodeConnections + 1;
  var originalSentenceConnections = sent.get('nodes').get('length');
  var expectedSentenceConnections = originalSentenceConnections + 1;
  sent.get('nodes').pushObject(node);
  equals(sent.get('nodes').get('length'), expectedSentenceConnections, "There should be " + expectedSentenceConnections + " node(s) associated with the sentence.");
  equals(node.get('sentences').get('length'), expectedNodeConnections, "There should be " + expectedNodeConnections + " sentence(s) associated with the node.");
  equals(sent.get('diagramObjects').get('length'), sent.get('nodes').get('length') + sent.get('links').get('length'), "The sentence's diagramObjects should equal the sum of the links and nodes.");
});

test("test links computed param from fixtures", function() {
  expect(1);
  var node   = MySystem.store.find('MySystem.Node','1');
  var foundOutlinks = node.get('outLinks').get('length');
  var foundInLinks = node.get('inLinks').get('length');
  var expectedLinks = foundOutlinks + foundInLinks;
  var foundLinks = node.get('links').get('length');
  equals(foundLinks, expectedLinks, "There should be "+ expectedLinks +" links");
});


test("test that computed 'links' are updated when inlinks or outlinks changes", function() {
  expect(1);
  var nodeA   = MySystem.store.find('MySystem.Node',1);
  var nodeB   = MySystem.store.find('MySystem.Node',2);

  var existingLinks = nodeA.get('links').get('length');
  var expectedLinks = existingLinks + 1;  

  var linkHash = {
      guid: MySystem.Link.newGuid(),
      text: 'third link'
    };

  var newLink = MySystem.store.createRecord(MySystem.Link, linkHash, linkHash.guid);
  newLink.set("startNode", nodeA);
  newLink.set("endNode", nodeB);
  newLink.set("startTerminal","a");
  newLink.set("endTerminal","b");

  var foundLinks = nodeA.get('links').get('length');
  equals(foundLinks, expectedLinks, "There should be "+ expectedLinks +" links");
});

test("nodes should have a position attribute", function() {
  expect(2);
  var node = MySystem.store.createRecord(MySystem.Node, {'title': 'Edit Title', 'image': 'http://concord.org/favicon.ico', 'position': {'x': 120, 'y': 150}, 'guid': 'testNode001'});
  equals(node.get('position').x, 120, "X position should be 120 as created");
  equals(node.get('position').y, 150, "Y position should be 150 as created");
});

test("nodes should return an array of editable form fields when asked", function() {
  expect(2);
  var ccNode = MySystem.store.find('MySystem.Node', 'testNode001');
  var formFields = ccNode.get('formFields');
  ok(isArray(formFields), "The formFields attribute should return an array");
  equals(formFields.length, 2, "Nodes should return two editable fields");
});

test("We should be able to generate a new GUID", function() {
  expect(3);
  var newGuid = MySystem.Node.newGuid();
  var newGuid2 = MySystem.Node.newGuid();
  ok(MySystem.Node.newGuid(), "The newGuid function should return a defined value");
  equals(typeof newGuid, 'string', "The newGuid function should return strings");
  ok((newGuid2 != newGuid), 'The second newGuid should not be the same as the first');
});
