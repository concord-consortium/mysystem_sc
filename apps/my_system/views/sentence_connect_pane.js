// ==========================================================================
// Project:   MySystem.SentenceConnectPane
// Copyright: ©2010 Concord Coalition
// ==========================================================================
/*globals MySystem */

/** @class

  This is a pane for linking StorySentences to links and nodes in the canvas view.
  When it's active, it should allow the user to select an arbitrary number of 
  links and views (without bringing up the Property Editor pane) and append those
  to the linked sentence.

  @extends SC.PalettePane
*/
MySystem.SentenceConnectPane = SC.PalettePane.design(
/** @scope MySystem.SentenceConnectPane.prototype */ {
  layout: { top: 150, right: 5, width: 150, height: 150 },
  classNames: 'sentence-connect-pane'.w(),
  contentView: SC.View.design({
    childViews: "labelView doneButton".w(),
    labelView: SC.LabelView.design({
      layout: { left: 5, right: 5, top: 5, width: 140, height: 80 },
      value: "Select the nodes and links your sentence describes, then click the 'Done' button.",
      canEditContent: YES,
      canDeleteContent: YES,
      isEditable: NO,
      isEnabled: YES
    }),
    doneButton: SC.ButtonView.design({
      acceptsFirstResponder: YES,
      buttonBehavior: SC.PUSH_BEHAVIOR,
      layout: { left: 10, right: 10, bottom: 10, height:20 },
      // icon: sc_static('resources/icon_link.gif'),
      title: "Done",
      toolTip: "Click to link and close this window",
      target: "MySystem.storySentenceController",
      action: "turnOffOtherButtons",
      theme: "capsule",
      isEnabled: YES
    })
  })
});
