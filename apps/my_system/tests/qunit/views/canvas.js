// ==========================================================================
// Project:   MySystem.CanvasView Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.CanvasView");

var canvasView = MySystem.CanvasView.create();

test("canvas was created", function() {
  expect(3);
  ok(canvasView !== null, "canvasView should not be null");
  ok(canvasView.kindOf(MySystem.CanvasView), "canvasView should be a CanvasView.");
  equals(canvasView.get('childViews').length, 0, "canvasView should not have any children.");
});
