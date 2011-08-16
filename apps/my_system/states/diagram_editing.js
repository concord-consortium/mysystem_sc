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
    
    // Create a new node in store
    node = MySystem.store.createRecord(MySystem.Node, { 
      title:    attr.title, 
      image:    attr.image,
      x:        attr.x,
      y:        attr.y,
      nodeType: attr.nodeType
    });
    
    // De-select other diagram objects and select the new node
    MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
    MySystem.nodesController.selectObject(node);

    return YES;
  },
  
  rubberbandLinkComplete: function() {
    var node1View = MySystem.nodesController.get('dragLinkSrcTerminal').get('parentView'),
        node2View = MySystem.nodesController.get('dragLinkEndTerminal').get('parentView'),
        node1 = node1View.get('content'),
        node2 = node2View.get('content');
        
    var terminal1 = node1View.get('terminalA') === MySystem.nodesController.get('dragLinkSrcTerminal') ?
        "a" : "b";
    var terminal2 = node2View.get('terminalA') === MySystem.nodesController.get('dragLinkEndTerminal') ?
        "a" : "b";
        
    this.addLink(node1, node2, terminal1, terminal2);
  },
  
  addLink: function(node1, node2, terminal1, terminal2){
    MySystem.store.createRecord(MySystem.Link, {
      color: "#0000FF",
      startNode: node1.get('guid'),
      startTerminal: terminal1,
      endNode: node2.get('guid'),
      endTerminal: terminal2
    });
  },
  
  /**
    When a link is selected, we transition to the link-editing state.
  */
  diagramSelectionChanged: function () {
    var selection = MySystem.nodesController.get('allSelected');
    if ((selection.get('length') == 1) && selection.firstObject().get('linkStyle')) {
      // Hacky: go straight to adding_link state. If it turns out this is not a new link, adding_link state
      // will then go to diagram_object_editing. This should be refactored when we switch to raphael views.
      this.gotoState('ADDING_LINK');
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
