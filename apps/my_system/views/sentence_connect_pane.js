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
MySystem.SentenceConnectPane = SC.PalettePane.extend(
/** @scope MySystem.SentenceConnectPane.prototype */ {
  isEnabled: YES,
  acceptsFirstResponder: YES,
  acceptsKeyPane: YES,
  layout: { top: 150, right: 5, width: 150, height: 150 },
  classNames: 'sentence-connect-pane'.w(),
  // The sentence which is currently being linked to.
  activeSentence: null,
  // The selected objects in the diagram
  selectedObjectsBinding: 'MySystem.nodesController.allSelected',
  contentView: SC.View.design({
    //  acceptsFirstResponder: YES,
    //  acceptsKeyPane: YES,
    //  isEnabled: YES,
    childViews: "labelView doneButton".w(),
    labelView: SC.LabelView.create({
      layout: { left: 5, right: 5, top: 5, width: 140, height: 80 },
      value: "Select the nodes and links your sentence describes, then click the 'Done' button.",
      canEditContent: YES,
      canDeleteContent: YES,
      isEditable: YES,
      mouseDown: function(evt) {console.log("label mouse down"); return YES;}
    }),
    doneButton: SC.ButtonView.create({
      acceptsFirstResponder: YES,
      buttonBehavior: SC.PUSH_BEHAVIOR,
      layout: { left: 10, right: 10, bottom: 10, height:20 },
      // icon: sc_static('resources/icon_link.gif'),
      title: "Done",
      toolTip: "Click to link and close this window",
      target: MySystem.storyController,
      action: "doneButtonPushed",
      theme: "capsule",
      value: NO,
      isEnabled: YES
      // mouseDown: function(evt) { console.log("mouse down in button"); return YES; },
      // mouseUp: function(evt) { console.log("mouse up in button"); return NO; }
    }),
    doneButtonPushed: function() { console.log("Done button pushed in contentView"); return YES; },
    mouseDown: function(evt) { console.log("mouse down in contentView"); return YES; },
    mouseUp: function(evt) { console.log("mouse up in contentView"); return NO; }
  })
});
