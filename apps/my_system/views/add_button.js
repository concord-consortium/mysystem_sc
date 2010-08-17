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
MySystem.AddButtonView = SC.View.extend( // SCUI.SimpleButton, // TODO: Add button function
  {
  layout: { top: 0, left: 0, width: 100, height: 120 },
  classNames: 'node'.w(),

  displayProperties: 'content isSelected'.w(),
  content: null,
  isSelected: false,

  childViews: 'icon label'.w(),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  icon: SC.ImageView.design({
    classNames: 'image',
    useImageCache: true,
    layout: { top: 20, width:50, height:70, centerX: 0},
    // value: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png',
    valueBinding: '.parentView.image'
  }),

  label: SC.LabelView.design({
    layout: { bottom: 5, centerX: 0, width: 100, height: 25 },
    classNames: ['name'],
    textAlign: SC.ALIGN_CENTER,    
    valueBinding: '.parentView.title',
    isEditable: NO
  }),
  
  dragDataForType: function(drag, dataType) { return null; },
  
  mouseDown: function(eventID) {
    SC.Logger.log("mouseDown called");
    var self = this;
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
  }
});
