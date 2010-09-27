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

  acceptsFirstResponder: NO,
  acceptsKeyPane: NO,
  layout: { top: 150, right: 5, width: 150, height: 150 },
  classNames: 'sentence-connect-pane'.w(),
  // The sentence which is currently being linked to.
  activeSentence: null,
  selectedObjectsBinding: 'MySystem.nodesController.allSelected'

  // updateObjects: function() {
  //   // Reset the relationships before setting new
  //   this.activeSentence.get('links').set('length', 0);
  //   this.activeSentence.get('nodes').set('length', 0);
  //   MySystem.storySentenceController.addLinksAndNodesToSentence(this.selectedObjects, this.activeSentence);
  // }.observes('selectedObjects')
});