// ==========================================================================
// Project:   MySystem.StudentState
// Copyright: ©2010 Concord Consortium
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
  timestamp: SC.Record.attr(Number)

}) ;
