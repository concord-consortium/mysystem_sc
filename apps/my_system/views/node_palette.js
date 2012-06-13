// ==========================================================================
// Project:   MySystem.NodePaletteView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('core');
sc_require('views/palette_item');

MySystem.NodePaletteView = SC.ListView.extend( { // Node Palette (left)
  layout: { top: 0, bottom: 0, left: 0 },
  // childViews: 'addDecorator addClay addHand addBulb'.w(),
  contentBinding: 'MySystem.nodePaletteController',
  exampleView: MySystem.PaletteItemView,
  rowDelegate: MySystem.nodePaletteController
});
