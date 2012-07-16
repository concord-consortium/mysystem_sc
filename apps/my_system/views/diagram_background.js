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

  displayProperties: 'imageDidLoad imageUrl'.w(),

  imageUrl:     null,  // nothing for now I guess. set imageUrlBinding in parent.
  imageDidLoad: false,
  
  // place-holder for our rendered raphael image object
  _raphaelImage: null,
  width:  0,
  height: 0,
  x:      0,
  y:      0,

  reloadImage: function() {
    this._reloadImage();
  }.observes('imageUrl'),

  _reloadImage: function() {
    this.set('imageDidLoad', false);
    image = new Image();
    var self = this;
    image.onload = function() {
      self.setImageDimensions(image);
    };
    image.src = this.get('imageUrl');
  },

  isVisibile: function() {
    return !!this.get('imageUrl');
  }.property('imageUrl').cacheable(),

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
    if (this.get('isVisibile')) {
      attrs.src = this.get('imageUrl');
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
  
  setImageDimensions: function (image) {
    if (image.width > 1){
      SC.RunLoop.begin();
        this.set('width', image.width);
        this.set('height', image.height);
        this.set('imageDidLoad',true);
        image.onload = null;
      SC.RunLoop.end();
    }
  }    
});
