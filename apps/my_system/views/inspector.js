// ==========================================================================
// Project:   MySystem.InspectorPane
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem SCUI Forms */

/** @class

  This pane shows the attributes of a diagram object as a form, allowing them to be edited if they can't
  be easily edited in place.

  @extends SC.PalettePane
*/
sc_require('core');
sc_require('views/link_form');

MySystem.InspectorPane = SC.PalettePane.design({
  defaultResponder: 'MySystem.statechart',
  isOptionsForNewLink: NO,
  layout: { top: 150, right: 5, width: 270, height: 200 },
  classNames: 'property-editor'.w(),
  
  // the contenView property should be updated with the view that is correct
  // for the current object
  contentView: SC.View.design({
    childViews: 'title form'.w(),
    title: SC.LabelView.design({
      value: function() {
        if (this.getPath('parentView.parentView.isOptionsForNewLink')){
          return "Pick an energy type for your new link";
        }
        return "Energy type of your link:";
      }.property('parentView.parentView.isOptionsForNewLink'),
      layout: {top: 0, left: 0, right: 0, height: 22}
    }),
    form: MySystem.LinkFormView.design({
      layout: {top: 22, left: 0, right: 0}
    })
  })
});
