// ==========================================================================
// Project:   MySystem.EnergyFlow
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  This object isn't a true model, because it doesn't extend SC.Record and isn't
  in the Store. Instead, objects of this class only exist in memory, for the sake
  of putting nodes on the LinkIt canvas of the Transformation Builder pane.

  @extends SC.Object
  @version 0.1
*/
MySystem.EnergyFlow = SC.Object.extend( LinkIt.Node,
/** @scope MySystem.EnergyFlow.prototype */ {

  color: null,
  side: 'in',
  position: {}

}) ;
