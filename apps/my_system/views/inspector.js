// ==========================================================================
// Project:   MySystem.InspectorPane
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  This pane shows the attributes of a diagram object as a form, allowing them to be edited if they can't
  be easily edited in place.

  @extends SC.PalettePane
*/
sc_require('core');
sc_require('views/link_form');

MySystem.InspectorPane = SC.PalettePane.design({
  defaultResponder: 'MySystem.statechart',
  layout: { top: 150, right: 5, width: 270, height: 240 },
  classNames: 'property-editor'.w(),
  
  // the contenView property should be updated with the view that is correct
  // for the current object
  contentView: MySystem.LinkFormView
});
