// ==========================================================================
// MySystem.AddButtonView, from LinkItDemo.AddButtonView
// ==========================================================================

/*globals MySystem */
sc_require('core');

/**

  @class
  
  @extends SC.View
  @author Evin Grano
  @version ALPHA
  @since ALPHA

*/
MySystem.AddButtonView = SC.View.extend( 
  {
  layout: { top: 10, left: 20, right: 10, width: 100 },
  padding: 10,

  displayProperties: 'content isSelected'.w(),
  content: null,
  isSelected: false,

  childViews: 'frame icon label'.w(),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  frame: SC.View.design({
    classNames: 'node addbutton'.w(),
    layout: { top: 12, bottom: 10, height: 122 }
  }),

  icon: SC.ImageView.design({
    classNames: 'image',
    useImageCache: true,
    layout: { top: 30, width:50, height:70, centerX: 0},
    valueBinding: '.parentView.content.image'
  }),

  label: SC.LabelView.design({
    layout: { bottom: 5, centerX: 0, width: 100, height: 25 },
    classNames: ['name'],
    textAlign: SC.ALIGN_CENTER,    
    valueBinding: '.parentView.content.title',
    isEditable: NO
  }),
  
  dragDataForType: function(drag, dataType) { return null; },
  
  mouseDown: function(eventID) {
    // SC.Logger.log("mouseDown called");
    var self = this;
    var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
    SC.Drag.addDropTarget(myCanvas);
    var dragOpts = {
      event: eventID,
      source: self.get('parentView'),
      dragView: self,
      ghost: NO,
      slideBack: NO,
      data: {
        title: this.get('title') || 'title',
        image: this.get('image') || 'image'
      }
    };
    SC.Drag.start(dragOpts);
  },

  mouseUp: function(evt) {
    sc_super();
    var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
    SC.Drag.removeDropTarget(myCanvas);
  }
});
