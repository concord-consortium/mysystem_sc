// ==========================================================================
// Project:   MySystem Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem Forms module test ok equals same stop start */

module("MySystem.PropertyEditorPane", {
  setup: function () {
    store = MySystem.setupTestStore();
  },
  
  teardown: function () {
    
  }
});

var propEdit = MySystem.PropertyEditorPane;

test("Edit pane was created", function() {
  expect(2);
  ok(propEdit !== null, "propEdit should not be null");
  equals(propEdit.get('childViews').get('length'), 0, "propEdit should have no children");
});

test("Edit pane with a node", function() {
  expect(2);
  var node   = store.createRecord(MySystem.Node, { 'guid': MySystem.Node.newGuid(), 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  propEdit.set('objectToEdit', node);
  same(propEdit.get('objectToEdit'), node, "propEdit should be editing the node");
  ok(propEdit.get('propertiesForm').get('fields').get('length') > 0, "The form should have fields");
  // equals(propEdit.get('propertiesForm').get('fields').firstObject()[0], 'Image:', "First field should be labeled Image");
});

test("Edit pane with a link", function() {
  expect(2);
  var link = store.createRecord(MySystem.Link, {'guid': MySystem.Link.newGuid(), 'text': 'Test link for form editing' });
  var node1   = store.createRecord(MySystem.Node, { 'guid': MySystem.Node.newGuid(), 'title': 'Test node 1', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  var node2   = store.createRecord(MySystem.Node, { 'guid': MySystem.Node.newGuid(), 'title': 'Test node 2', 'image': 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png', 'transformer': false });
  link.set('startNode', node1);
  link.set('endNode', node2);
  propEdit.set('objectToEdit', link);
  same(propEdit.get('objectToEdit'), link, "propEdit should be editing the link");
  ok(propEdit.get('propertiesForm').get('fields').get('length') > 0, "The form should have fields");
  // equals(propEdit.get('propertiesForm').get('fields').firstObject()[0], 'Color:', "First field should be labeled Color");
  // ok(propEdit.get('propertiesForm').get('fields').firstObject().kindOf(MySystem.ImprovedRadioView), "First field should be a radio button");
  // ok(!propEdit.get('childViews').firstObject().get('childViews').firstObject().get('childViews').firstObject().get('field').get('isEnabled'), "Color editing should be disabled");
  // propEdit.set('objectToEdit', link.get('startNode'));
  // link.get('startNode').set('transformer', true);
  // propEdit.set('objectToEdit', link);
  // ok(propEdit.get('childViews').firstObject().get('childViews').firstObject().get('childViews').firstObject().get('field').get('isEnabled'), "Color editing should be enabled");
});

