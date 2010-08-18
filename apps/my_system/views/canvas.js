// ==========================================================================
// Project:   MySystem.CanvasView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt SCUI SC*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('MySystem.NodeView');
sc_require('LinkIt.CanvasView');
sc_require('core');
MySystem.CanvasView = LinkIt.CanvasView.extend(SCUI.Cleanup, SC.DropTarget, { 
    isDropTarget: YES,
    computeDragOperations: function(drag, evt) { return SC.DRAG_COPY; },
    performDragOperation: function(drag, op) { 
      var image = drag.data.image;
      var title = drag.data.title;
      var xpos = drag.location.x;
      var ypos = drag.location.y;
      var offsetX = this.parentView.get('frame').x;
      var offsetY = this.get('frame').y;
      //( title, image, xPos, yPos )
      SC.Logger.log("drag performed");
      MySystem.nodesController.addNode(title, image, xpos - offsetX, ypos - offsetY);
      return SC.DRAG_COPY; 
    }
});
