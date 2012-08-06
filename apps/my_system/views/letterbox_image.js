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

    parentWidth  = this.clippingFrame().width - 2;
    parentHeight = this.clippingFrame().height - 2;
    parentWidth  = (parentWidth < 2) ? 2 : parentWidth;
    parentHeight  = (parentHeight < 2) ? 2 : parentHeight;
    hRatio  = parentWidth / image.width;
    vRatio  = parentHeight / image.height;
    ratio = hRatio > vRatio ?  vRatio : hRatio;
    newWidth  = image.width * ratio;
    newHeight = image.height * ratio;
    
    this.adjust({
      'left': 0, 
      'top': 0,
      'width': newWidth,
      'height': newHeight
    });
  
  }

});
