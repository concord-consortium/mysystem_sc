// ==========================================================================
// Project:   MySystem Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.AddButtonView");

var addButton = MySystem.AddButtonView.create();

test("add button was created", function() {
  expect(5);
  ok(addButton !== null, "addButton should not be null");
  ok(addButton.kindOf(MySystem.AddButtonView), "addButton should be an AddButtonView.");
  equals(addButton.get('childViews').length, 3, "addButton should have three children.");
  ok(addButton.get('icon').kindOf(SC.ImageView), "icon should be a SproutCore ImageView");
  ok(addButton.get('label').kindOf(SC.LabelView), "label should be a SproutCore LabelView");
});

