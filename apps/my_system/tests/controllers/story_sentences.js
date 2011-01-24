// ==========================================================================
// Project:   MySystem.storySentencesController Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.storySentencesController");

var contains = function(array, search) {
  for (var i = 0; i < array.get('length'); i += 1) {
    var element = array.objectAt(i);
    if (element === search) {
      return true;
    }
  }
  return false;
};

// TODO: Replace with real unit test for MySystem.storySentencesController

test("Data loading", function() {
  expect(2);
  // Tests that sentences get loaded from the store
  var sentences = MySystem.store.find(MySystem.StorySentence);
  ok(sentences.get('length') > 0, "There should be sentences in the store");
  MySystem.storySentenceController.set('content', sentences);
  equals(MySystem.storySentenceController.get('content').get('length'), sentences.get('length'), "Controller should have as many Sentences as the store");
});

test("test addLinksAndNodesToSentence", function() {
  expect(4);
  var node = MySystem.nodesController.get('content').firstObject();
  var link = MySystem.store.find('MySystem.Link', 'link1');
  var sentence = MySystem.storySentenceController.get('content').firstObject();
  MySystem.storySentenceController.addLinksAndNodesToSentence([node, link], sentence);
  equals(sentence.get('nodes').get('length'), 1, "we've added one node to the sentence");
  equals(sentence.get('links').get('length'), 1, "we've added one link to the sentence");
  ok(contains(sentence.get('nodes'), node), "sentence refers to added node");
  ok(contains(sentence.get('links'), link), "sentence refers to added link");
});

