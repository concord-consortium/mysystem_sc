// ==========================================================================
// Project:   MySystem.DIAGRAM_EDITING
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem */

/** 

  The main state; this is where users can create and delete nodes and links and 
  manipulate the diagram.

*/
MySystem.DIAGRAM_EDITING = SC.State.design({
  
  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
  },
  
  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
  },
  
  /**
    Adds a node to the store and diagram, then de-selects other diagram objects 
    and selects the new node.
    
    @param attr
    
    @param {String} attr.title
      The title of the new node.
    @param {String} attr.image
      The URL/URI of the image to be used in the new node
    @param {Integer} attr.x
      The x-coordinate of the location of the new node on the canvas.
    @param {Integer} attr.y
      The y-coordinate of the location of the new node on the canvas.
  */
  addNode: function (attr) {
    var node;
    var guid = MySystem.Node.newGuid();
    
    // Create a new node in store
    node = MySystem.store.createRecord(MySystem.Node, { 
      title:    attr.title, 
      image:    attr.image, 
      x:        attr.x,
      y:        attr.y,
      guid:     guid,
      nodeType: attr.nodeType
    }, guid);
    
    // De-select other diagram objects and select the new node
    MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
    MySystem.nodesController.selectObject(node);

    return YES;
  },
  
  /**
    When a link is selected, we transition to the link-editing state.
  */
  diagramSelectionChanged: function () {
    var selection = MySystem.nodesController.get('allSelected');
    if ((selection.get('length') == 1) && selection.firstObject().get('linkStyle')) {
      this.gotoState('DIAGRAM_OBJECT_EDITING');
    }
    return YES;
  },
  
  /**
    When a sentence is double-clicked, we transition to the sentence-editing state.
    
    (That state turns out to be superfluous.)
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
