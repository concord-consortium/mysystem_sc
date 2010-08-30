sc_require('core');

MySystem.PropertyEditorPane = SC.Pane.extend(
{
    layout: {
        top: 0,
        right: 0,
        width: 100,
        height: 120
    },
    classNames: 'node'.w(),

    displayProperties: 'content isSelected'.w(),
    objectToEdit: null,
    isSelected: false,

    childViews: 'label'.w(),

    // render: function(context) {
    //     sc_super();
    //     if (this.get('isSelected')) context.addClass('selected');
    // },

    label: SC.LabelView.design({
        layout: {
            bottom: 5,
            centerX: 0,
            width: 100,
            height: 25
        },
        classNames: ['name'],
        textAlign: SC.ALIGN_CENTER,
        value: '.parentView.title',
        isEditable: NO
    }),

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
