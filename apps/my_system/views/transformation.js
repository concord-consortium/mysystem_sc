// ==========================================================================
// Project:   MySystem.TransformationView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This link works with the Transformation Builder page. Each node represents an
  energy flow; each link is a transformation.

  @extends SC.View
*/
MySystem.TransformationView = SC.View.extend(
/** @scope MySystem.TransformationView.prototype */ {

  startNode: null,
  endNode: null,
  startTerminal: 'a',
  endTerminal: 'a'

});
