// ==========================================================================
// Project:   MySystem.TransformationBuilderPane
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  This pane allows a user to designate transformations (in-link color, out-link color, and
  create annotations/StorySentences) on a given node.

  @extends SC.View
*/
sc_require('views/energy_color');

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
    childViews: "inLabel outLabel connect annotateButton doneButton".w(),
    // Maybe we want some instructions on top here?
    inLabel: SC.LabelView.design({
      layout: { top: 0, left: 0, width: 150, height: 20 },
      displayValue: "Inbound energy flows"
    }),
    outLabel: SC.LabelView.design({
      layout: { top: 0, right: 0, width: 150, height: 20 },
      displayValue: "Outbound energy flows"
    }),
    connect: LinkIt.CanvasView.design({
      layout: { top: 20, left: 0, width: 500, height: 330 },
      exampleView: MySystem.EnergyColorView
      // Need to get the colors on here: push to content
      // and transformations <=> links
    }),
    // inColors: SC.ListView.design({
    //   // List of in-link colors for this node
    //   layout: { top: 20, left: 0, width: 80, height: 330 },
    //   // This should be linked to the node's inLinkColors property
    //   content: "green purple red".w(), // ".parentView.parentView*node.inLinkColors",
    //   exampleView: MySystem.EnergyColorView
    // }),
    // outColors: SC.ListView.design({
    //   // List of out-link colors for this node
    //   layout: { top: 20, right: 0, width: 80, height: 330 },
    //   // This should be linked to the node's outLinkColors property
    //   content: ["green", "blue"],
    //   exampleView: MySystem.EnergyColorView
    // }),
    annotateButton: SC.ButtonView.design({
      acceptsFirstResponder: YES,
      buttonBehavior: SC.PUSH_BEHAVIOR,
      layout: { centerX: -80, width: 150, bottom: 10, height: 20 },
      title: "Annotate",
      toolTip: "Describe selected transformation",
      // target: "",
      // action: "",
      theme: "capsule",
      isEnabled: YES
    }),
    doneButton: SC.ButtonView.design({
      acceptsFirstResponder: YES,
      buttonBehavior: SC.PUSH_BEHAVIOR,
      layout: { centerX: 80, width: 150, bottom: 10, height:20 },
      // icon: sc_static('resources/icon_link.gif'),
      title: "Done",
      toolTip: "Click to finish and close this window",
      target: "MySystem.transformationsController",
      action: "closeTransformationBuilder",
      theme: "capsule",
      isEnabled: YES
    })
  })
});
