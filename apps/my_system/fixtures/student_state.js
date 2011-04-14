// ==========================================================================
// Project:   MySystem.StudentState Fixtures
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('models/student_state');
sc_require('resources/student_data_example.js')

MySystem.StudentState.FIXTURES = [

  { guid: 1,
    content: JSON.stringify(MySystem._tempStudentData),
    timestamp: 1281630733000 }

];
