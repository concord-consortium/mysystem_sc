// ==========================================================================
// Project:   MySystem.LetterboxImageView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This view is a subclass of ImageView which simply rescales itself so that the
  aspect ratio of the source image is maintained, while never being larger than
  the original layout specified. If the image is a different aspect ratio than the
  original layout, the image will be "letterboxed" to fit.

  @extends SC.View
*/
MySystem.LetterboxImageView = SC.ImageView.extend(
/** @scope MySystem.LetterboxImageView.prototype */ {
  useImageQueue: NO,

  didLoad: function (image) {
    sc_super();
    this.adjustLetterBox();
  },

  adjustLetterBox: function() {
    var parentWidth =0;
    var parentHeight=0;
    var hRatio=0;
    var vRatio=0;
    var newWidth=0;
    var newHeight=0;

    var image = this.get('image');

    
    this.adjust({
      'left': 0, 
      'top': 0
    });

    parentWidth  = this.clippingFrame().width;
    parentHeight = this.clippingFrame().height;
    
    hRatio  = parentWidth / image.width;
    vRatio  = parentHeight / image.height;
    ratio = hRatio > vRatio ?  vRatio : hRatio;
    newWidth  = image.width * ratio + 1;
    newHeight = image.height * ratio + 1;
    
    this.adjust({
      'width': newWidth,
      'height': newHeight
    });
  
  },

  parentViewDidResize: function() {
    sc_super();
    this.adjustLetterBox();
    this.set('layerNeedsUpdate',YES);
    this.updateLayerIfNeeded();
  }

});
