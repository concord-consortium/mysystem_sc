// ==========================================================================
// Project:   MySystem.DiagramView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

sc_require('views/terminal');

/** @class

  Display class for displaying a MySystem diagram (a set of nodes and links) as a collection.
  Is a drop target for nodes from the NodesPaletteView, invokes statechart's 'addNode' action upon drop.

  @extends SC.View
  @extends SC.DropTarget  
*/
MySystem.DiagramView = RaphaelViews.RaphaelCollectionView.extend(SC.DropTarget,
/** @scope MySystem.DiagramView.prototype */ {

  exampleView: MySystem.NodeView,
  
  selectedLinks: [],
  
  computeDragOperations: function () {
    return SC.DRAG_LINK;      // TODO this happens to work, but are we using the right semantics?
  },
  
  performDragOperation: function (drag, op) {
    // Build the data hash
    var newNodeAttributes = {
      title:    drag.data.title,
      image:    drag.data.image,
      x:        drag.location.x - this.getPath('parentView.frame').x - drag.data.clickX,
      y:        drag.location.y - this.getPath('parentView.frame').y - drag.data.clickY,
      nodeType: drag.data.uuid
    };
    
    // Create the node
    MySystem.statechart.sendEvent('addNode', newNodeAttributes);

    // De-select other diagram objects and select 
    return SC.DRAG_COPY;
  }
  
});
