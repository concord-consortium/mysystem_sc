// ==========================================================================
// Project:   MySystem.StudentState Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.StudentState");

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

test("Student state should return an array of editable form fields when asked", function() {
  expect(2);
  var state = MySystem.store.find('MySystem.StudentState', 1);
  var formFields = state.get('formFields');
  ok(isArray(formFields), "The formFields attribute should return an array");
  equals(formFields.length, 0, "StudentState should not return any editable fields");
});

