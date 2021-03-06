// ==========================================================================
// MySystem.PaletteItemView
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
MySystem.PaletteItemView = SC.View.extend( {
  layout: { top: 10, centerX: 0, width: 50 },
 
  displayProperties: 'content isSelected width height enableNodeLabelDisplay'.w(),
  content:           null,
  isSelected:        false,

  widthBinding:      SC.Binding.oneWay("MySystem.activityController.content.nodeWidth"),
  heightBinding:     SC.Binding.oneWay("MySystem.activityController.content.nodeHeight"),
  enableNodeLabelDisplayBinding: SC.Binding.oneWay("MySystem.activityController.content.enableNodeLabelDisplay"),
    
  childViews: 'borderFrame'.w(),

  widthChanged: function() {
    this.adjust('width', this.get('width') + 20);
  }.observes('width'),

  heightChanged: function() {
    this.adjust('height', this.get('height') + 20);
  }.observes('height'),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },  

  borderFrame: SC.View.design({
    classNames: 'node addbutton'.w(),
    layout: { left: 0.12, right: 0.12, top: 6, bottom: 6},
    childViews: 'icon label'.w(),
 
    icon: MySystem.LetterboxImageView.design({
      classNames: ['image'],
      useCanvas: NO,
      layout: { bottom: 16, top: 0, width: 100, centerX: 0},
      valueBinding: '.parentView.parentView.content.image'
    }),

    label: SC.LabelView.design({
      layout: {height: 14, bottom: 2, left: 2, right: 2},
      classNames: ['name'],
      textAlign: SC.ALIGN_CENTER,    
      valueBinding: '.parentView.parentView.content.title',
      isVisibleBinding: '.parentView.parentView.enableNodeLabelDisplay',
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
