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
  
  // The version is bumped here but no actual migrations are necessary
  // the change is that the rule_feedback now has a numOfSubmits
  // the different version is useful for any reports that are trying to count submits
  data.version = 3;
  
  return data;

};
