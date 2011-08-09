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

  childViews: 'frame'.w(),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  frame: SC.View.design({
    classNames: 'node addbutton'.w(),
    layout: { top: 12, bottom: 10, height: 122 },
    childViews: 'icon label'.w(),
    
    icon: SC.ImageView.design({
      classNames: ['image'],
      // useImageQueue: YES,
      useCanvas: NO,
      layout: { top: 18, width:50, height:70, centerX: 0},
      valueBinding: '.parentView.parentView.content.image'
    }),

    label: SC.LabelView.design({
      layout: { bottom: 5, centerX: 0, width: 100, height: 25 },
      classNames: ['name'],
      textAlign: SC.ALIGN_CENTER,    
      valueBinding: '.parentView.parentView.content.title',
      isEditable: NO
    }),
  }),
  
  dragDataForType: function(drag, dataType) { return null; },
  
  mouseDown: function(evt) {
    var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
    SC.Drag.addDropTarget(myCanvas);
    
    return YES;
  },
  
  mouseDragged: function(evt) {
    // Figure ghost offset
    var localOffsetX = evt.clientX - 70; // Hardwired left margin is in CSS (ugh)
    var localOffsetY = evt.clientY - this.layout.top - 50; // 10 for CSS margin

    var dragOpts = {
      event: evt,
      source: this,
      dragView: this,
      ghost: NO,
      slideBack: NO,
      ghostActsLikeCursor: YES,
      data: {
        title: this.get('content').get('title') || 'title',
        image: this.get('content').get('image') || 'image',
        uuid: this.get('content').get('uuid'),
        clickX: localOffsetX,
        clickY: localOffsetY
      }
    };
    SC.Drag.start(dragOpts);
  },

  mouseUp: function(evt) {
    var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
    SC.Drag.removeDropTarget(myCanvas);
  }
});
