sc_require('core');

MySystem.PropertyEditorPane = SC.Pane.extend(
{
    layout: {
        top: 0,
        right: 0,
        width: 200,
        height: 240
    },
    classNames: 'node'.w(),

    displayProperties: 'objectToEdit isSelected'.w(),
    objectToEdit: null,
    isSelected: false,

    childViews: ''.w(),

    // render: function(context) {
    //     sc_super();
    //     if (this.get('isSelected')) context.addClass('selected');
    // },

    // label: SC.LabelView.design({
    //     layout: {
    //         top: 5,
    //         centerX: 0,
    //         width: 100,
    //         height: 25
    //     },
    //     classNames: ['name'],
    //     textAlign: SC.ALIGN_CENTER,
    //     value: 'Property Editor',
    //     isEditable: NO,
    // }),

    enabledLabel: Forms.FormView.create({
      fields: "".w(),
      // title: Forms.FormView.row(SC.TextFieldView, {
      //  fieldKey: "title",
      //  fieldLabel: "Title:",
      //  value: "Initial title"
      // }),
      findField: function(key) {
        for (var i = 0; i < fields.length; i += 1) {
          if (fields[i].fieldKey == key)
            return fields[i];
        }
        return null;
      }
    }),

    update_everything: function() {
      baseObject = this.get('objectToEdit');
      if (baseObject == null) {
        if (this.get('enabledLabel').parentView != null) {
          this.removeChild(this.getPath('enabledLabel'));
          this.enabledLabel.fields = [];
        }
      } else {
        if (this.get('enabledLabel').parentView == null) {
          this.appendChild(this.getPath('enabledLabel'));
        }
        this.enabledLabel.set('fields', baseObject.formFields);
        for (i = 0; i < this.enabledLabel.fields.length; i += 1) {
          field = this.enabledLabel.fields[i];
          SC.Logger.log(field);
          SC.Logger.log(field.addObserver);
          field.addObserver('value', this, 'fieldChanged');
          // this.enabledLabel.addField(field);
        }
      }
    }.observes('objectToEdit'),
    
    fieldChanged: function(target, key, value, revision) {// note value will always be null
      field = target;
      newValue = field.get('value');
      this.get('objectToEdit').set(key, newValue);
    }
});
