// ==========================================================================
// Project:   MySystem.StorySentences Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.StorySentence");

test("test that computed diagramObjects array is updated when node or link associations change", function() {
  expect(4);
  var node = MySystem.store.find('MySystem.Node',1);
  var link = MySystem.store.find('MySystem.Link', 'link1');
  var sent = MySystem.store.find('MySystem.StorySentence', 'ss1');
  var originalSentenceConnections = sent.get('diagramObjects').get('length');
  var expectedAfterNode = originalSentenceConnections + 1;
  var expectedAfterLink = expectedAfterNode + 1;
  equals(sent.get('nodes').get('length') + sent.get('links').get('length'), originalSentenceConnections, "The sentence's diagramObjects should equal the sum of the links and nodes.");
  sent.get('nodes').pushObject(node);
  equals(sent.get('diagramObjects').get('length'), expectedAfterNode, "Adding a node should increase the sentence's diagramObjects by one");
  sent.get('links').pushObject(link);
  equals(sent.get('diagramObjects').get('length'), expectedAfterLink, "Adding a link should increase the sentence's diagramObjects by one");
  equals(sent.get('nodes').get('length') + sent.get('links').get('length'), expectedAfterLink, "The sentence's diagramObjects should equal the sum of the links and nodes.");
});

test("We should be able to generate a new GUID", function() {
  expect(3);
  var newGuid = MySystem.StorySentence.newGuid();
  var newGuid2 = MySystem.StorySentence.newGuid();
  ok(MySystem.StorySentence.newGuid(), "The newGuid function should return a defined value");
  equals(typeof newGuid, 'string', "The newGuid function should return strings");
  ok((newGuid2 != newGuid), 'The second newGuid should not be the same as the first');
});
