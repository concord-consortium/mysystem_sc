// ==========================================================================
// MySystem.AddButtonView, from LinkItDemo.AddButtonView
// ==========================================================================

/*globals MySystem */
sc_require('core');
sc_require('views/letterbox_image');

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

  childViews: 'borderFrame'.w(),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  borderFrame: SC.View.design({
    classNames: 'node addbutton'.w(),
    layout: { top: 12, bottom: 10, height: 122 },
    childViews: 'icon label'.w(),
    
    icon: MySystem.LetterboxImageView.design({
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
    })
  }),
  
  dragDataForType: function(drag, dataType) { return null; },
  
  mouseDown: function(evt) {
    return YES;
  },
  
  mouseDragged: function(evt) {
    this._startDrag(evt);
  },
  
  _startDrag: function(evt) {
    var dragOpts = {
      event: evt,
      source: this,
      dragView: this,
      ghost: NO,
      slideBack: NO,
      data: {
        title: this.get('content').get('title') || 'title',
        image: this.get('content').get('image') || 'image',
        uuid: this.get('content').get('uuid')
      }
    };
    this._drag = SC.Drag.start(dragOpts);
  },
  
  touchStart: function(touch) {
    return YES;
  },
  
  touchesDragged: function(evt, touches) {
    if(this._drag) return;
    this._startDrag(evt);
  },
  
  dragDidEnd: function(drag, loc, op) {
    this._drag = null;
  }
});
