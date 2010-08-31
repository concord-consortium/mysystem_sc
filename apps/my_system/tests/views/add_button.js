// ==========================================================================
// Project:   MySystem Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.AddButtonView");

var addButton = MySystem.AddButtonView.create();

test("add button was created", function() {
  expect(5);
  ok(addButton !== null, "addButton should not be null");
  ok(addButton.kindOf(MySystem.AddButtonView), "addButton should be an AddButtonView.");
  equals(addButton.get('childViews').length, 2, "addButton should have two children.");
  ok(addButton.get('icon').kindOf(SC.ImageView), "icon should be a SproutCore ImageView");
  ok(addButton.get('label').kindOf(SC.LabelView), "label should be a SproutCore LabelView");
});

