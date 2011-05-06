// ==========================================================================
// Project:   MySystem.nodePaletteController
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This controller holds the array of options for the palette of nodes.
  @extends SC.ArrayController
*/
MySystem.nodePaletteController = SC.ArrayController.create(
/** @scope MySystem.nodePaletteController.prototype */ {
  contentBinding: "MySystem.activityController.paletteItems"
});
