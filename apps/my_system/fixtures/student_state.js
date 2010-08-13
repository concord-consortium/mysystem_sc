// ==========================================================================
// Project:   MySystem.StudentState Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/student_state');
sc_require('resources/student_data_example.js')

MySystem.StudentState.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

  { guid: 1,
    content: JSON.stringify(MySystem._tempStudentData),
    timestamp: 1281630733000 }

];
