// ==========================================================================
// Project:   MySystem.DIAGRAM_EDITING
// Copyright: ©2010 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  The statechart describes the states of the systems and how they change in reaction
  to user events. Put another way, the statechart describes the user interface of the
  application.

*/
MySystem.DIAGRAM_EDITING = Ki.State.design({
  
  enterState: function () {
    console.log("Entering state %s", this.get('name'));
  },
  
  exitState: function () {
    console.log("Leaving state %s", this.get('name'));
  },
  
  addNode: function (attr) {
    var node;
    var guid = MySystem.Node.newGuid();
    
    // Create a new node in store
    node = MySystem.store.createRecord(MySystem.Node, { 
      "title": attr.title, 
      "image": attr.image, 
      "position": { x: attr.x, y: attr.y },
      "guid": guid
    }, guid);
    
    // De-select other diagram objects and select the new node
    MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
    MySystem.nodesController.selectObject(node);

    return YES;
  },
  
  /**
    When a link is selected, we transition to the link-editing state.
  */
  diagramSelectionChanged: function (args) {
    var selection = MySystem.nodesController.get('allSelected');
    if ((selection.get('length') == 1) && selection.firstObject().get('linkStyle')) {
      this.gotoState('DIAGRAM_OBJECT_EDITING');
    }
    return YES;
  },
  
  /**
    When a sentence is double-clicked, we transition to the sentence-editing state.
    
    This state turns out to be superfluous.
  */
  editSentence: function () {
    this.gotoState('SENTENCE_EDITING');
    return YES;
  },
  
  /**
    When the sentence-linking pane is triggered, we transition to the sentence-linking state.
  */
  sentenceDiagramConnect: function (args) {
    MySystem.storySentenceController.set('editingSentence', args.sentence);
    this.gotoState('SENTENCE_OBJECT_LINKING_SETUP');
    return YES;
  }
});