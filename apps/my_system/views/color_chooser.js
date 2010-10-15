// ==========================================================================
// MySystem.AddButtonView, from LinkItDemo.AddButtonView
// ==========================================================================

/*globals MySystem, Forms */
sc_require('core');

/**

  @class

  @extends SC.View
  @author John Ridgway
  @version ALPHA
  @since ALPHA

*/
MySystem.ColorChooserView = SC.View.extend(
  {
  layout: { top: 0, left: 0, width: 120, height: 120 },
  classNames: ''.w(),

  displayProperties: 'content isSelected'.w(),
  content: null,
  isSelected: false,

  childViews: 'chooser'.w(),

  render: function (context) {
    sc_super();
    if (this.get('isSelected')) context.addClass('selected');
  },

  createChildViews: function() {
    sc_super();
    this.childViews[0].childViews[0].childViews[0].childViews[1].bind('value', this, 'content');
  },

  chooser: Forms.FormView.design({
    fields: "color".w(),
    color:
    // Forms.FormView.row(SC.RadioView, {
    Forms.FormView.row(MySystem.ImprovedRadioView, {
		  layout: {width: 160, height: 120},
      value: null,
      fieldKey: "color",
      fieldLabel: "Color:",
      items: [{ title: "Thermal Energy", value: 'red', enabled: YES },
              { title: "Light Energy", value: 'green', enabled: YES },
              { title: "Mechanical Energy", value: 'blue', enabled: YES }],
      itemTitleKey: 'title',
      itemValueKey: 'value',
      itemIsEnabledKey: 'enabled',
      layoutDirection: SC.LAYOUT_VERTICAL
    })
  })

  // mouseDown: function(eventID) {
  //   SC.Logger.log("mouseDown called");
  //   var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
  //   var childViews = myCanvas.get('childViews');
  //   var len = childViews.get('length');
  //   for (var i = 0; i < len; i += 1) {
  //     SC.Drag.addDropTarget(childViews.objectAt(i));
  //   }
  //   var self = this;
  //   var dragOpts = {
  //     event: eventID,
  //     source: self.get('parentView'),
  //     dragView: self,
  //     ghost: NO,
  //     slideBack: NO,
  //     data: {
  //       Boolean: true
  //     }
  //   };
  //   SC.Drag.start(dragOpts);
  // },
  //
  // mouseUp: function(evt) {
  //   sc_super();
  //   var myCanvas = MySystem.getPath('mainPage.mainPane.childViews').objectAt(0).getPath('bottomRightView.bottomRightView');
  //   var childViews = myCanvas.get('childViews');
  //   var len = childViews.get('length');
  //   for (var i = 0; i < len; i += 1) {
  //     SC.Drag.removeDropTarget(childViews.objectAt(i));
  //   }
  // }
});
