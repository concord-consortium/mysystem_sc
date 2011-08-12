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
*/
MySystem.DiagramView = RaphaelViews.RaphaelCollectionView.extend(
/** @scope MySystem.DiagramView.prototype */ {

  exampleView: MySystem.NodeView,
  
  selectedLinks: [],
  
  // SC.DropTarget
  //   The methods below are all part o the SC.DropTarget protocol
  //   and must be implemented to function as a drop target.
  isDropTarget: YES,
  dragStarted: function(drag, evt) {},
  dragEntered: function(drag, evt) {},
  dragUpdated: function(drag, evt) {},
  dragExited: function(drag, evt) {},
  dragEnded: function(drag, evt) {},
  acceptDragOperation: function(drag, op) {
    return YES;
  },

  computeDragOperations: function () {
    return SC.DRAG_LINK;      // TODO this happens to work, but are we using the right semantics?
  },
  
  performDragOperation: function (drag, op) {
    var canvasOffset = this.get('canvasView').$().offset(),

        // The numbers at the end are to account for the difference in size of the AddButtonView
        // compared to the Node view.  Mostly likely those could be computed.

        newNodeX = drag.location.x - drag.ghostOffset.x - canvasOffset.left + 17,
        newNodeY = drag.location.y - drag.ghostOffset.y - canvasOffset.top  + 9,
    
        newNodeAttributes = {
          title:    drag.data.title,
          image:    drag.data.image,
          x:        newNodeX,
          y:        newNodeY,
          nodeType: drag.data.uuid
        };
    
    // Create the node
    MySystem.statechart.sendEvent('addNode', newNodeAttributes);

    // De-select other diagram objects and select 
    return SC.DRAG_COPY;
  }
  
});
