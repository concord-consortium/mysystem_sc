// ==========================================================================
// Project:   MySystem.TransformationCanvas
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt SCUI */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('core');
MySystem.TransformationCanvas = LinkIt.CanvasView.extend(SCUI.Cleanup, 
/** @scope MySystem.TransformationCanvas.prototype */ {
  isDropTarget: NO, 

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
        } else {
          SC.Logger.warn("MySystem.CanvasView.render(): Canvas object context is not accessible.");
        }
      } else {
        SC.Logger.warn("MySystem.CanvasView.render(): Canvas element array length is zero.");
      }
    } else {
      SC.Logger.warn("MySystem.CanvasView.render(): Canvas element is not accessible.");
    }
    return sc_super();
  }

});
