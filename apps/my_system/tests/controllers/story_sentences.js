// ==========================================================================
// Project:   MySystem.storySentencesController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.storySentencesController");
var contains = function(array, search) {
	debugger;
	for (var i = 0; i < array.get('length'); i += 1) {
		var element = array.objectAt(i);
		if (element === search) {
			return true;
		}	
	}
	return false;
};

// TODO: Replace with real unit test for MySystem.storySentencesController
test("test description", function() {
  var expected = "test";
  var result   = "test";
  equals(result, expected, "test should equal test");
});

test("Data loading", function() {
  expect(4);
  // Tests that nodes get loaded from the store
  var nodes = MySystem.store.find(MySystem.Node);
  MySystem.nodesController.set('content', nodes);
  ok(nodes.get('length') > 0, "There should be nodes in the store");
  equals(MySystem.nodesController.get('content').get('length'), nodes.get('length'), "Controller should have as many Nodes as the store");
	var sentences = MySystem.store.find(MySystem.StorySentence);
	ok(sentences.get('length') > 0, "There should be sentences in the store");
	MySystem.storySentenceController.set('content', sentences);
	equals(MySystem.storySentenceController.get('content').get('length'), sentences.get('length'), "Controller should have as many Sentences as the store");
});

test("test addLinksAndNodesToSentence", function() {
	expect(4);
	// MySystem.nodesController.selectObject(MySystem.nodesController.get('content').firstObject());
	var node = MySystem.nodesController.get('content').firstObject();
  var link = MySystem.store.find('MySystem.Link', 'link1');
	var sentence = MySystem.storySentenceController.get('content').firstObject();
  MySystem.storySentenceController.addLinksAndNodesToSentence([node, link], sentence);
	equals(sentence.get('nodes').get('length'), 1, "we've added one node to the sentence");
	equals(sentence.get('links').get('length'), 1, "we've added one link to the sentence");
	ok(contains(sentence.get('nodes'), node), "sentence refers to added node");
	ok(contains(sentence.get('links'), link), "sentence refers to added link");
});

