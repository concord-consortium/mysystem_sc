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

  // the in-progress links originating and ending terminals
  dragLinkSrcTerminal:     null,
  dragLinkEndTerminal:     null,

  // FIXME dummy property for backward compatibility
  allSelectedBinding: 'selection',

  // FIXME dummy method for backward compatibility
  unselectAll: function() {
    this.deselectObjects(this.get('selection'));
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
