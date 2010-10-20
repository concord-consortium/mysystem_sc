// ==========================================================================
// Project:   MySystem.TransformationBuilderPane
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This pane allows a user to designate transformations (in-link color, out-link color, and
  create annotations/StorySentences) on a given node.

  @extends SC.View
*/
MySystem.TransformationBuilderPane = SC.PalettePane.extend(
/** @scope MySystem.TransformationBuilderPane.prototype */ {

  isModal: YES,
  classNames: 'transformationBuilder'.w(),

  // Node we're editing transformations for
  node: null,

  layout: {
    centerX: 0,
    centerY: 0,
    width: 500,
    height: 400
  },

  contentView: SC.View.design({
    childViews: "inColors connect outColors doneButton".w(),
    inColors: SC.View.design({
      layout: { top: 0, left: 0, width: 120, height: 350 }
      // List of in-link colors for this node
    }),
    connect: SC.View.design({
      layout: { top: 0, left: 120, width: 260, height: 350 }
    }),
    outColors: SC.View.design({
      layout: { top: 0, left: 0, width: 120, height: 350 }
      // List of out-link colors for this node
    }),
    doneButton: SC.ButtonView.design({
      acceptsFirstResponder: YES,
      buttonBehavior: SC.PUSH_BEHAVIOR,
      layout: { centerX: 0, width: 150, bottom: 10, height:20 },
      // icon: sc_static('resources/icon_link.gif'),
      title: "Done",
      toolTip: "Click to finish and close this window",
      target: "MySystem.nodesController",
      action: "closeTransformationBuilder",
      theme: "capsule",
      isEnabled: YES
    })
  })
});
