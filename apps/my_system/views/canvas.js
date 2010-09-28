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
MySystem.CanvasView = LinkIt.CanvasView.extend(SCUI.Cleanup, { 
    isDropTarget: YES,
    computeDragOperations: function(drag, evt) { return SC.DRAG_COPY; },
    performDragOperation: function(drag, op) { 
      var image = drag.data.image;
      var title = drag.data.title;
      var xpos = drag.location.x;
      var ypos = drag.location.y;
      var offsetX = this.parentView.get('frame').x;
      var offsetY = this.get('frame').y;
      var gX = drag.ghostOffset.x;
      var gY = drag.ghostOffset.y;
      //( title, image, xPos, yPos )
      SC.Logger.log("drag performed");
      MySystem.nodesController.addNode(title, image, xpos - offsetX - gX, ypos - offsetY - gY);
      MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
      return SC.DRAG_COPY; 
    },
    didCreateLayer: function () {
      var frame = this.get('frame');
      var canvasElem = this.$('canvas.base-layer');
      if (canvasElem) {
        canvasElem.attr('width', frame.width);
        canvasElem.attr('height', frame.height);
        if (canvasElem.length > 0) {
          var cntx = canvasElem[0].getContext('2d'); // Get the actual canvas object context
          if (cntx) {
            cntx.clearRect(0, 0, frame.width, frame.height);
            this._drawLinks(cntx);
          }
          else {
            LinkIt.log("Linkit.LayerView.render(): Canvas object context is not accessible.");
          }
        }
        else {
          LinkIt.log("Linkit.LayerView.render(): Canvas element array length is zero.");
        }
      }
      else {
        LinkIt.log("Linkit.LayerView.render(): Canvas element is not accessible.");
      }

    return sc_super();
  }
});
