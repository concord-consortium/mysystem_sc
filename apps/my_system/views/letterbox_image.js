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

  render: function(context, firstTime) {
    sc_super();
    if (this.get('image').width > 1){
      // debugger
      var targetWidth  = this.get('layout').width,
          targetHeight = this.get('layout').height,
          srcWidth     = this.get('image').width,
          srcHeight    = this.get('image').height;
      

      var scaledHeight =  (targetHeight / srcHeight);
      var scaledWidth  =  (targetWidth  / srcWidth);
      var scalar = scaledWidth < scaledHeight ? scaledHeight : scaledWidth; 
      var newWidth = srcWidth * scalar;
      var newHeight = srcHeight * scalar;      

      // if we're close, don't adjust or we'll keep iterating down to zero
      if (Math.abs(targetWidth - newWidth) > 2 ||
          Math.abs(targetHeight - newHeight) > 2){
        this.adjust('width', newWidth);
        this.adjust('height', newHeight);
      }
    }
  }

});
