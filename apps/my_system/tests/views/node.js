// ==========================================================================
// Project:   MySystem.NodeView Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt SC module test ok equals same stop start */

module("MySystem.NodeView");

var node = MySystem.NodeView.create();

test("Node was allocated.", function() {
  expect(8);
  ok(node !== null, "node is not null.");
  ok(node.kindOf(MySystem.NodeView), "node is actually a NodeView");
  ok(node.classNames.indexOf('node') != -1, "node has appropriate class.");
  equals(node.get('childViews').length, 5, "addButton should have five children.");
  ok(node.get('icon').kindOf(SC.ImageView), "icon should be a SproutCore ImageView");
  ok(node.get('transformationIcon').kindOf(SC.ImageView), "Transformation Icon should be a SproutCore ImageView");
  ok(node.get('label').kindOf(SC.LabelView), "label should be a SproutCore LabelView");
  ok(node.get('aTerminal').kindOf(SC.View), "Terminals should be SproutCore Views");
});

