// ==========================================================================
// Project:   MySystem.DiagramBackgroundView
// Copyright: @2011 Concord Consortium
// ==========================================================================
/*globals MySystem RaphaelViews */

/** @class

  Display A ackground image in the diagram.

  @extends SC.RaphaelView
*/
MySystem.DiagramBackgroundView = RaphaelViews.RaphaelView.extend(SC.ContentDisplay,
/** @scope MySystem.DiagramBackgroundView.prototype */ {

  displayProperties: 'imageDidLoad imageUrl width height'.w(),

  imageUrl:       null,  // nothing for now I guess. set imageUrlBinding in parent.
  imageDidLoad:   false,
  scalingEnabled: false, // disable background image scaling.

  // place-holder for our rendered raphael image object
  _raphaelImage: null,
  width:  0,
  height: 0,
  x:      0,
  y:      0,
  
  reloadImage: function() {
    this._reloadImage();
  }.observes('imageUrl'),
  
  changeScale: function() {
    this._reloadImage();
  }.observes('scalingEnabled'),

  _reloadImage: function() {
    this.set('imageDidLoad', false);
    image = new Image();
    this.set('width',0);
    this.set('height',0);
    this.set('isVisibile',false);
    var self = this;
    image.onload = function() {
      self.setImageDimensions(image);
      self.set('isVisibile',true);
    };
    image.src = this.get('imageUrl');
  },

  // RENDER METHODS
  renderCallback: function (raphaelCanvas, attrs) {
    this._raphaelImage = raphaelCanvas.image();
    this._raphaelImage.attr(attrs);
    return raphaelCanvas.set().push(this._raphaelImage);
  },
  
  render: function (context, firstTime) {
    var attrs = {
      'x': this.get('x'),
      'y': this.get('y'),
      'width': this.get('width'),
      'height': this.get('height')
    };

    // dont load 'blank' images.
    var imageUrl = this.get('imageUrl');
    if (typeof imageUrl === 'string') {
      var nowhite = imageUrl.replace(/\s+/,"");
      if (nowhite.length > 0) {
        attrs.src = imageUrl;
      }
    }
    
    if (firstTime) {
      this._reloadImage();
      context.callback(this, this.renderCallback, attrs);
      this.renderChildViews(context,firstTime);
    }
    else {
      this._raphaelImage.attr(attrs);
    }
  },
  
  parentViewDidResize: function() {
    this._reloadImage();
  },

  setImageDimensions: function (image) {
    if (image.width > 1){
      var parentWidth = this.parentView.clippingFrame().width;
      var parentHeight = this.parentView.clippingFrame().height;
      
      var hRatio  = parentWidth / image.width;
      var vRatio  = parentHeight / image.height;
      var ratio = hRatio > vRatio ? vRatio : hRatio;
      
      // if we aren't scaling, just use 1
      ratio = (this.get('scalingEnabled') === true) ? ratio : 1;

      // debugger;
      SC.RunLoop.begin();
        this.set('width', image.width * ratio);
        this.set('height', image.height * ratio);
        this.set('imageDidLoad',true);
        image.onload = null;
      SC.RunLoop.end();
    }
  }    
});
