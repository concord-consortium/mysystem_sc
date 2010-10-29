// ==========================================================================
// Project:   MySystem.TransformationAnnotationPane
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  This pane allows a user to decorate transformations in the transformation
	pane with explanations (StorySentences).

  @extends SC.View
*/
sc_require('views/energy_color');

MySystem.TransformationAnnotationPane = SC.PalettePane.extend(
/** @scope MySystem.TransformationAnnotationPane.prototype */ {

  isModal: YES,
  classNames: 'transformationAnnotation'.w(),

  // Transformation we're editing a StorySentence for 
  transformation: null,

  layout: {
    centerX: 0,
    centerY: 100,
    width: 500,
    height: 200
  },

  contentView: SC.View.design({
    childViews: "label storySentenceField doneButton".w(),
    // Maybe we want some instructions on top here?
    label: SC.LabelView.design({
      layout: { top: 0, left: 0, width: 150, height: 20 },
      displayValue: "Explanation"
    }),
    storySentenceField: SC.LabelView.design({
      layout: { top: 20, left: 5, right: 5, height: 20 },
      displayValueBinding: '.parentView.parentView*transformation.annotation.bodyText',
			// displayValue: 'Enter your explanation here',
			canEditContent: YES,
			canDeleteContent: YES,
			isEditable: YES
    }),
    doneButton: SC.ButtonView.design({
      acceptsFirstResponder: YES,
      buttonBehavior: SC.PUSH_BEHAVIOR,
      layout: { centerX: 80, width: 150, bottom: 10, height:20 },
      // icon: sc_static('resources/icon_link.gif'),
      title: "Done",
      toolTip: "Click to finish and close this window",
      target: "MySystem.transformationsController",
      action: "closeTransformationAnnotater",
      theme: "capsule",
      isEnabled: YES
    })
  })
});
