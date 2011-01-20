// ==========================================================================
// Project:   MySystem.NodePaletteView
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('core');

MySystem.NodePaletteView = SC.ListView.extend({ // Node Palette (left)
  layout: { top: 0, bottom: 0, left: 15 },
  // childViews: 'addDecorator addClay addHand addBulb transformationBadge linkColorChooser'.w(),
  contentBinding: 'MySystem.nodePaletteController.content',
  exampleView: MySystem.AddButtonView,
  rowHeight: 140
    
  /* Temporarily removed for Berkeley 0.1 release */
  // transformationBadge: MySystem.BadgeButtonView.design({
  //   layout: { left: 20, right: 10, top: 423, width: 100, height: 120 },
  //   classNames: ['transformation-badge'],
  //   image: sc_static('resources/lightbulb_tn.png'),
  //   title: ""
  // })
  // 
  // linkColorChooser: MySystem.ColorChooserView.design({
  //   layout: { left: 0, right: 10, top: 553, width: 200, height: 120 },
  //   classNames: ['color-chooser']
  // })
});
