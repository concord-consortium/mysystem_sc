// ==========================================================================
// Project:   MySystem.SentenceView Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.SentenceView");

// View should have two child views
// View should be a SentenceView
// Child views should be of appropriate type

var sentence = MySystem.SentenceView.create();

test("View is of correct type", function() {
  expect(2);
  ok(sentence !== null, "View is not null");
  ok(sentence.kindOf(MySystem.SentenceView), "View is actually a MySystem.SentenceView");
});

test("View settings are appropriate", function() {
  expect(2);
  ok(sentence.classNames.indexOf('story-sentence') != -1, "View has appropriate class names");
  equals(sentence.get('childViews').get('length'), 2, "View has two child views");
});

test("Child views check out", function() {
  expect(5);
  var sText = sentence.get('sentenceText');
  var lButton = sentence.get('linkButton');
  ok(sText.kindOf(SC.LabelView), "Sentence text is a LabelView");
  ok(lButton.kindOf(SC.ButtonView), "LinkButton is a ButtonView");
  equals(lButton.get('toolTip'), "Link this sentence with part of the diagram", "Button has tooltip explaining function");
  ok(sText.get('canEditContent'), "Sentence text can be edited");
  ok(sText.get('canDeleteContent'), "Sentence text can be deleted");
});