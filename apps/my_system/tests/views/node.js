// ==========================================================================
// Project:   MySystem.NodeView Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.NodeView");

var node = MySystem.NodeView.create();

// TODO: Replace with real unit test for MySystem.NodeView
test("Node was allocated.", function() {
	ok(node !== null, "node is not null.");
	ok(node.kindOf(MySystem.NodeView), "node is actually a NodeView");
	ok(node.classNames.indexOf('node') != -1, "node has appropriate class.");
});

