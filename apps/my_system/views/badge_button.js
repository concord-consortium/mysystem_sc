// ==========================================================================
// MySystem.AddButtonView, from LinkItDemo.AddButtonView
// ==========================================================================

/*globals MySystem */
sc_require('core');

/**

  @class

  @extends SC.View
  @author John Ridgway
  @version ALPHA
  @since ALPHA

*/
MySystem.BadgeButtonView = SC.View.extend(
  {
  layout: { top: 0, left: 0, width: 100, height: 120 },
  classNames: ''.w(),

  displayProperties: 'content isSelected'.w(),
  content: null,
  isSelected: false,

  childViews: 'icon'.w(),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },

  icon: SC.ImageView.design({
    classNames: 'image',
    useImageCache: true,
    layout: { top: 20, width:68, height:68, centerX: 0},
    value: sc_static('resources/badge.png')
  }),

  mouseDown: function(eventID) {
    // SC.Logger.warn("mouseDown called");
    var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
    var childViews = myCanvas.get('childViews');
    var len = childViews.get('length');
    for (var i = 0; i < len; i += 1) {
      SC.Drag.addDropTarget(childViews.objectAt(i));
    }
    var self = this;
    var dragOpts = {
      event: eventID,
      source: self.get('parentView'),
      dragView: self,
      ghost: NO,
      slideBack: NO,
      data: {
        Boolean: true
      }
    };
    SC.Drag.start(dragOpts);
  },

  mouseUp: function(evt) {
    sc_super();
    var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
    var childViews = myCanvas.get('childViews');
    var len = childViews.get('length');
    for (var i = 0; i < len; i += 1) {
      SC.Drag.removeDropTarget(childViews.objectAt(i));
    }
  }
});
