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
      var targetWidth = this.get('layout').width;
      var targetHeight = this.get('layout').height;
      var srcWidth = this.get('image').width;
      var srcHeight = this.get('image').height;
      
      var newWidth,
          newHeight;
      
      // scale to the target width
      var scaleX1 = targetWidth;
      var scaleY1 = (srcHeight * targetWidth) / srcWidth;

      // scale to the target height
      var scaleX2 = (srcWidth * targetHeight) / srcHeight;
      var scaleY2 = targetHeight;

      // now figure out which one we should use
      var scaleOnWidth = (scaleX2 > targetWidth);

      if (scaleOnWidth) {
        newWidth = Math.floor(scaleX1);
        newHeight = Math.floor(scaleY1);
      } else {
        newWidth = Math.floor(scaleX2);
        newHeight = Math.floor(scaleY2);
      }
          
      // if we're close, don't adjust or we'll keep iterating down to zero
      if (Math.abs(targetWidth - newWidth) > 2 ||
          Math.abs(targetHeight - newHeight) > 2){
        this.adjust('width', newWidth);
        this.adjust('height', newHeight);
      }
    }
  }

});
