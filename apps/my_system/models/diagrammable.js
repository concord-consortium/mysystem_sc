// ==========================================================================
// Project:   MySystem.Diagrammable
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Simple interface model of a MySystem diagrammable object.

  @extends SC.Record
  @version 0.1
*/
MySystem.Diagrammable = MySystem.AutoGuidRecord.extend(
/** @scope MySystem.Node.prototype */ {

  /**
    X-position (in pixels) of this node, relative to the upper left corner of the diagram

    @property {Number}
  */
  x: SC.Record.attr(Number),

  /**
    Y-position (in pixels) of this node, relative to the upper left corner of the diagram

    @property {Number}
  */
  y: SC.Record.attr(Number),
});
MySystem.Diagrammable.isPolymorphic = YES;
