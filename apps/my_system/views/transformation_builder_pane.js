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
    childViews: "inLabel inColors connect outLabel outColors doneButton".w(),
    // Maybe we want some instructions on top here?
    inLabel: SC.LabelView.design({
      layout: { top: 0, left: 0, width: 150, height: 20 },
      displayValue: "Inbound energy flows"
    }),
    inColors: SC.ListView.design({
      // List of in-link colors for this node
      layout: { top: 20, left: 0, width: 120, height: 330 },
      contentBinding: ".parentView*node.inLinkColors",
      exampleView: MySystem.EnergyColorView
    }),
    connect: SC.View.design({
      layout: { top: 0, left: 120, width: 260, height: 350 }
    }),
    outLabel: SC.LabelView.design({
      layout: { top: 0, right: 0, width: 150, height: 20 },
      displayValue: "Outbound energy flows"
    }),
    outColors: SC.ListView.design({
      // List of out-link colors for this node
      layout: { top: 20, right: 0, width: 120, height: 330 },
      contentBinding: ".parentView*node.outLinkColors",
      exampleView: MySystem.EnergyColorView
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
