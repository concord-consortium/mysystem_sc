// ==========================================================================
// Project:   MySystem.Link Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.Link");

function isArray(testObject) {   
  return testObject && !testObject.propertyIsEnumerable('length') && typeof testObject === 'object' && typeof testObject.length === 'number';
}

test("New links should pass their own sanity checks", function() {
  expect(1);
  var linkHash = {
      guid: 'link3',
      text: 'third link'
    };
  var newLink = MySystem.store.createRecord(MySystem.Link, linkHash, linkHash.guid);
  ok(newLink.isComplete, "The isComplete method should return true");
});

test("Links should return the nodes they're linked to", function() {
  expect(2);
  var thisLink = MySystem.store.find('MySystem.Link','link2');
  var nodeA   = MySystem.store.find('MySystem.Node','1');
  var nodeB   = MySystem.store.find('MySystem.Node','3');
  equals(thisLink.get('startNode'), nodeA, 'The link should return its start node');
  equals(thisLink.get('endNode'), nodeB, 'The link should return its end node');
});

test("Links should return LinkIt.Link objects when asked", function() {
  expect(4);
  var newLink = MySystem.store.find('MySystem.Link', 'link1');
  var linkItLink = newLink.makeLinkItLink();
  equals(linkItLink.startNode, newLink.get('startNode'), "The LinkIt Link and MySystem Link should have the same start node");
  equals(linkItLink.endNode, newLink.get('endNode'), "The LinkIt Link and MySystem Link should have the same end node");
  same(linkItLink.label, newLink.get('label'), 'The LinkIt Link and MySystem Link should have the same label');
  equals(linkItLink.model, newLink, 'The LinkIt Link should return the model it was derived from');
});

test("Links should return an array of editable form fields when asked", function() {
  expect(2);
  var newLink = MySystem.store.find("MySystem.Link", 'link1');
  var formFields = newLink.get('formFields');
  ok(isArray(formFields), "The formFields attribute should return an array");
  equals(formFields.length, 2, "Links should return two editable fields");
});

test("We should be able to generate a new GUID", function() {
  expect(3);
  var newGuid = MySystem.Link.newGuid();
  var newGuid2 = MySystem.Link.newGuid();
  ok(MySystem.Link.newGuid(), "The newGuid function should return a defined value");
  equals(typeof newGuid, 'string', "The newGuid function should return strings");
  ok((newGuid2 != newGuid), 'The second newGuid should not be the same as the first');
});