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
sc_require('views/palette_item')

MySystem.NodePaletteView = SC.ListView.extend({ // Node Palette (left)
  layout: { top: 0, bottom: 0, left: 15 },
  // childViews: 'addDecorator addClay addHand addBulb transformationBadge linkColorChooser'.w(),
  contentBinding: 'MySystem.nodePaletteController',
  exampleView: MySystem.PaletteItemView,
  rowHeight: 127
    
  /* Temporarily removed for Berkeley 0.1 release */
  // transformationBadge: MySystem.BadgeButtonView.design({
  //   layout: { left: 20, right: 10, top: 423, width: 100, height: 120 },
  //   classNames: ['transformation-badge'],
  //   image: sc_static('resources/lightbulb_tn.png'),
  //   title: ""
  // })
});
