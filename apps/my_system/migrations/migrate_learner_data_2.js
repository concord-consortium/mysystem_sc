// ==========================================================================
// Project:   MySystem.migrations
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('migrations/migrations');

/** @scope MySystem.migrations 
  
    Migrate learner data from format 2 to format 3
    
    Migrations needed for ongoing work should go here, *not* to migrateLearnerData1
*/
MySystem.migrations.migrateLearnerData2 = function (data) {
  
  return data;

};
