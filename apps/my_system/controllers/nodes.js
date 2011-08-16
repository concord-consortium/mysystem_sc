// ==========================================================================
// Project:   MySystem.nodesController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  The whole set of nodes in the system.

  @extends SC.Object
*/
MySystem.nodesController = SC.ArrayController.create( SC.CollectionViewDelegate, 
/** @scope MySystem.nodesController.prototype */ {

  // the in-progress links originating terminal
  dragLinkSrcTerminal:     null,

  selectedLinksBinding: "MySystem.canvasView.selectedLinks",

  allSelected: function() {
    var links  = MySystem.canvasView.get('selectedLinks');
    var resultSet = this.get('selection').clone();
    resultSet = resultSet.addObjects(links.map(function(link){return link.get('model');}));

    return resultSet;
  }.property('selectedLinks','selection').cacheable(),
  
  unselectAll: function() {
    // De-select links
    if (this.selectedLinks) {
      this.set('selectedLinks', []);
      MySystem.canvasView.linksDidChange();
    }
    
    // De-select nodes
    var baseSet = this.get('selection').clone();
    this.deselectObjects(baseSet);
  },

  /* We'll need to refactor this when we get back to transformations */
  // selectFirstTransformation: function(node) {
  //   this.unselectAll();
  //   var transformation = node.firstUnannotatedTransformation();
  //   if (transformation) {
  //     MySystem.nodesController.selectObject(node);
  //     MySystem.nodesController.selectObjects(transformation.get('inLinks'), YES);
  //     MySystem.nodesController.selectObjects(transformation.get('outLinks'), YES);
  //     this.promptForTransformationAnnotation(transformation);
  //   }
  // },
  
  collectionViewDeleteContent: function (view, content, indices) {
    // destroy the records
    var recordsToDestroy = indices.map( function (idx) {
      return this.objectAt(idx);
    }, this);

    recordsToDestroy.invoke('destroy');
  },

  collectionViewSelectionForProposedSelection: function(view, sel) {
    // Is this a shift-click?
    if (view.get('mouseDownInfo') && view.get('mouseDownInfo').event.shiftKey) {
      return null ; // No change to selection
    }
    else {
      return sel ; // Accept new selected set
    }
  },

  propertyEditing: function() {
    MySystem.statechart.sendEvent('diagramSelectionChanged', { });
  }.observes('allSelected')
});
