// ==========================================================================
// Project:   MySystem.Story Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

var store;

module("MySystem.Story", {
  setup: function () {
    store = MySystem.setupTestStore();
  },
  
  teardown: function () {
    
  }
});

function isArray(testObject) {
  return testObject && !testObject.propertyIsEnumerable('length') && typeof testObject === 'object' && typeof testObject.length === 'number';
}

test("Story creation", function() {
  expect(2);
  var newStory = store.createRecord(MySystem.Story, {'storyHtml': '<p>Morbi non erat non ipsum pharetra tempus. Donec orci. Proin in ante. Pellentesque sit amet purus. Cras egestas diam sed ante. Etiam imperdiet urna sit amet risus. Donec ornare arcu id erat. Aliquam ultrices scelerisque sem. In elit nulla, molestie vel, ornare sit amet, interdum vel, mauris. Etiam dignissim imperdiet metus.</p>'}, '2');
  ok(newStory, 'The story should have been created');
  equals(typeof newStory.get('storyHtml'), 'string', 'The Story HTML should be a string');
});

