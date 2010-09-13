// ==========================================================================
// Project:   MySystem.StorySentences
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.StorySentence = SC.Record.extend(
/** @scope MySystem.StorySentences.prototype */ {

  bodyText: SC.Record.attr(String)

}) ;

MySystem.StorySentence.GuidCounter = 100;
MySystem.StorySentence.newGuid = function() { return "ss" + MySystem.Node.GuidCounter++;};
