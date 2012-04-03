// ==========================================================================
// Project:   MySystem.migrations
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('migrations/migrations');

/** @scope MySystem.migrations 
  
    Migrate learner data from format 4 to format 5
    
    Migrations needed for ongoing work should go here, *not* to migrateLearnerData1
*/
MySystem.migrations.migrateLearnerData4 = function (data) {
  
  // The version is bumped here but no actual migrations are necessary
  // the change is a new write-only singleton data object called "MySystem.GraphicPreview"
  // it defines the following single record, which may be absent:
  //
  // MySystem.GraphicPreview.LAST_FEEDBACK_GUID = "LAST_GRAPHIC_PREVIEW";
  //
  // attributes: 
  //   timeStamp:    SC.Record.attr(String),  // timestamp
  //   svg:          SC.Record.attr(String),  // svg markup
  //   png:          SC.Record.attr(String),  // base64 encoded png data (big)
  
  data.version = 5;
  
  return data;

};
