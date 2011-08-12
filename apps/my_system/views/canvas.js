// ==========================================================================
// Project:   MySystem.CanvasView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt SCUI SC*/

/** @class

  TODO: Remove this file when RaphaelViews conversion is complete. RPK 8-11-11

  @extends SC.View
*/
sc_require('views/node');
sc_require('core');

MySystem.CanvasView = SC.View.extend({
  
  keyDown: function () {
    console.log("canvasView keyDown event");
  }
  
});

// MySystem.CanvasView = LinkIt.CanvasView.extend({ 
//   allowMultipleSelection: YES,
//   isDropTarget: YES,
//   computeDragOperations: function(drag, evt) { return SC.DRAG_COPY; },
//   performDragOperation: function(drag, op) { 
//     // Figure the new node's x and y locations
//     var pv = this.get('parentView'), frame = this.get('frame');
//     var newFrame = pv ? pv.convertFrameToView(frame, null) : frame;
//     
//     // The numbers at the end are to account for the difference in size of the AddButtonView
//     // compared to the Node view.  Mostly likely those could be computed.
//     var newNodeX = drag.location.x - drag.ghostOffset.x - newFrame.x + 17;
//     var newNodeY = drag.location.y - drag.ghostOffset.y - newFrame.y + 9;
//     
//     // Build the data hash
//     var newNodeAttributes = {
//       'title': drag.data.title,
//       'image': drag.data.image,
//       'x': newNodeX,
//       'y': newNodeY,
//       'nodeType': drag.data.uuid
//     };
//     
//     // Create the node
//     MySystem.statechart.sendEvent('addNode', newNodeAttributes);
// 
//     // De-select other diagram objects and select 
//     return SC.DRAG_COPY; 
//   },
//   didCreateLayer: function () {
//     var frame = this.get('frame');
//     var canvasElem = this.$('canvas.base-layer');
//     if (canvasElem) {
//       canvasElem.attr('width', frame.width);
//       canvasElem.attr('height', frame.height);
//       if (canvasElem.length > 0) {
//         var cntx = canvasElem[0].getContext('2d'); // Get the actual canvas object context
//         if (cntx) {
//           cntx.clearRect(0, 0, frame.width, frame.height);
//           this._drawLinks(cntx);
//         } else {
//           SC.Logger.warn("MySystem.CanvasView.render(): Canvas object context is not accessible.");
//         }
//       } else {
//         SC.Logger.warn("MySystem.CanvasView.render(): Canvas element array length is zero.");
//       }
//     } else {
//       SC.Logger.warn("MySystem.CanvasView.render(): Canvas element is not accessible.");
//     }
//     return sc_super();
//   },
// 
//   /* Override selection behavior from CollectionView. */
//   select: function(indexes, extend) {
//     if (extend && (indexes === null || indexes.length === 0)) return;
//     return sc_super();
//   },
//   
//   mouseDown: function(evt) {
//     var oldEditable = this.get('isEditable');
//     this.set('isEditable', YES); // set isEditable to force dragging everything
//     
//     if (!!evt.shiftKey){
//       evt.shiftKey = NO;
//       evt.ctrlKey = YES;
//     }
//     sc_super();
//     this.set('isEditable', oldEditable);
// 
//     return YES;
//   },
// 
//   selectLink: function(link) {
//      link.set('isSelected', true);
//      this.set('linkSelection', link);
//      this.set('selectedLinks', [link]);
//   }
// });
