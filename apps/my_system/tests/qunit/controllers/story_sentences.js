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

test("Data loading", function() {
  var store = MySystem.setupTestStore();
  expect(2);
  // Tests that sentences get loaded from the store
  var sentences = store.find(MySystem.StorySentence);
  ok(sentences.get('length') > 0, "There should be sentences in the store");
  MySystem.storySentenceController.set('content', sentences);
  equals(MySystem.storySentenceController.get('content').get('length'), sentences.get('length'), "Controller should have as many Sentences as the store");
});
