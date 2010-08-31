// ==========================================================================
// Project:   MySystem Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.PropertyEditorPane");

var propEdit = MySystem.PropertyEditorPane.create();

test("Edit pane was created", function() {
  expect(3);
  ok(propEdit !== null, "propEdit should not be null");
  ok(propEdit.kindOf(MySystem.PropertyEditorPane), "propEdit should be a PropertyEditorPane");
  equals(propEdit.get('childViews').get('length'), 0, "propEdit should have no children");
});

test("Edit pane with a node", function() {
  expect();
  var node = MySystem.store.find('MySystem.Node', 1);
  propEdit.set('objectToEdit', node);
  same(propEdit.get('objectToEdit'), node, "propEdit should be editing the node");
  ok(propEdit.get('childViews').get('length') > 0, "propEdit should have children");
  equals(propEdit.get('childViews').firstObject().get('childViews').firstObject().get('fieldLabel'), 'Image:', "First field should be labeled Image");
});

test("Edit pane with a link", function() {
  expect();
  var link = MySystem.store.find('MySystem.Link', 'link1');
  propEdit.set('objectToEdit', link);
  same(propEdit.get('objectToEdit'), link, "propEdit should be editing the link");
  ok(propEdit.get('childViews').get('length') > 0, "propEdit should have children");
  equals(propEdit.get('childViews').firstObject().get('childViews').firstObject().get('fieldLabel'), 'Color:', "First field should be labeled Color");
});

