// ==========================================================================
// Project:   MySystem.Link Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

var node1, node2, store;

module("MySystem.Link", {
  setup: function () {
    store = MySystem.setupTestStore();
    node1   = store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
    node2   = store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
    store.commitRecords();
  },
  
  teardown: function () {
    
  }
});

function isArray(testObject) {   
  return testObject && !testObject.propertyIsEnumerable('length') && typeof testObject === 'object' && typeof testObject.length === 'number';
}

test("New links should pass their own sanity checks", function() {
  expect(1);
  var linkHash = {
      text: 'Test link for sanity check',
      startNode: node1.id(),
      endNode: node2.id()
    };
  var newLink = store.createRecord(MySystem.Link, linkHash);
  ok(newLink.isComplete, "The isComplete method should return true");
});

test("Links should return the nodes they're linked to", function() {
  expect(2);
  var newLink = store.createRecord(MySystem.Link, {'text': 'Test link for node returning' });
  newLink.set('startNode', node1);
  newLink.set('endNode', node2);
  equals(newLink.get('startNode'), node1, 'The link should return its start node');
  equals(newLink.get('endNode'), node2, 'The link should return its end node');
});

test("Links should return LinkIt.Link objects when asked", function() {
  expect(4);
  var linkHash = {
      text: 'Test link for LinkIt Links',
      startNode: node1.id(),
      endNode: node2.id()
    };
  var newLink = store.createRecord(MySystem.Link, linkHash);
  var linkItLink = newLink.makeLinkItLink();
  equals(linkItLink.startNode, newLink.get('startNode'), "The LinkIt Link and MySystem Link should have the same start node");
  equals(linkItLink.endNode, newLink.get('endNode'), "The LinkIt Link and MySystem Link should have the same end node");
  same(linkItLink.label, newLink.get('label'), 'The LinkIt Link and MySystem Link should have the same label');
  equals(linkItLink.model, newLink, 'The LinkIt Link should return the model it was derived from');
});

test("Link color should be editable and persistent in the store", function() {
  expect(2);
  var linkHash = {
      text: 'Test link for color change.',
      startNode: node1.id(),
      endNode: node2.id()
    };
  var link1 = store.createRecord(MySystem.Link, linkHash);
  var oldColor = link1.get('color');
  link1.set('color', '#333333');
  var newColor = link1.get('color');
  ok((oldColor != newColor), "Color was changed");
  equals(newColor, '#333333', "New color is dark grey #333");
});

test("tests connecting links to storySentences", function () {
  expect(3);
  var linkHash = {
      text: 'Test link for StorySentence linking',
      startNode: node1.id(),
      endNode: node2.id()
    };
  var newLink = store.createRecord(MySystem.Link, linkHash);
  var sent = store.find('MySystem.StorySentence', 'ss1');
  var originalLinkConnections = newLink.get('sentences').get('length');
  var expectedLinkConnections = originalLinkConnections + 1;
  var originalSentenceConnections = sent.get('links').get('length');
  var expectedSentenceConnections = originalSentenceConnections + 1;
  sent.get('links').pushObject(newLink);
  equals(sent.get('links').get('length'), expectedSentenceConnections, "There should be " + expectedSentenceConnections + " node(s) associated with the sentence.");
  equals(newLink.get('sentences').get('length'), expectedLinkConnections, "There should be " + expectedLinkConnections + " sentence(s) associated with the node.");
  equals(sent.get('diagramObjects').get('length'), sent.get('nodes').get('length') + sent.get('links').get('length'), "The sentence's diagramObjects should equal the sum of the links and nodes.");
});

test("Dimmed links should have alpha values < 1 in the color definition", function () {
  expect(5);
  var linkHash = {
      text: 'Test link for color dimming',
      startNode: node1.id(),
      endNode: node2.id(),
      color: '#336699'
    };
  var newLink = store.createRecord(MySystem.Link, linkHash);
  equals ( newLink.get('isDimmed'), NO, "The isDimmed property starts as NO");
  newLink.set('isDimmed', YES);
  equals ( newLink.get('isDimmed'), YES, "The isDimmed property should be set to YES");
  equals ( newLink.get('color'), "rgba(51, 102, 153, 0.2)", "The dimmed-link color definition should match the RGBA definition with less-than-one alpha.");
  newLink.set('isDimmed', NO);
  equals ( newLink.get('color'), "rgba(51, 102, 153, 1)", "The undimmed-link color definition should match the RGBA definition with 1.0 alpha.");
  equals ( newLink.get('isDimmed'), NO, "The isDimmed property is back to NO");
});
