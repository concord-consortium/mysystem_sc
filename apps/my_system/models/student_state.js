// ==========================================================================
// Project:   MySystem.StudentState
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.StudentState = SC.Record.extend(
/** @scope MySystem.StudentState.prototype */ {

  content: SC.Record.attr(String),
  timestamp: SC.Record.attr(Number),
  
  // return a hash of editable attributes for the property editor
  formFields: {
    
  }
  
}) ;
