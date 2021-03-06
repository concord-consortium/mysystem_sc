// ==========================================================================
// Project:   MySystem.StudentState Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.StudentState", {
  setup: function () {
    store = MySystem.setupTestStore();
  },
  
  teardown: function () {
    
  }
});

sc_require('resources/student_data_example.js');

function isArray(testObject) {
  return testObject && !testObject.propertyIsEnumerable('length') && typeof testObject === 'object' && typeof testObject.length === 'number';
}

test("Testing model definition of Student State", function() {
  expect(3);
  // Imports the same data as the fixture
  var state = MySystem.StudentState.create( { "content": JSON.stringify(MySystem._tempStudentData), "timestamp": 1281630733000 } );
  var timestamp = new Date(state.timestamp);
  equals(typeof state.content, "string", "Content should be a string");
  equals(typeof state.timestamp, "number", "Timestamp should be a number");
  equals(timestamp.getDate(), 12, "Date should be the 12th");
});

