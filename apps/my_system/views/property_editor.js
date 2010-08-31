// ==========================================================================
// Project:   MySystem.PropertyEditorPane
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem LinkIt SCUI Forms */

/** @class

  (Document Your View Here)

  @extends SC.Pane
*/
sc_require('core');

MySystem.PropertyEditorPane = SC.Pane.extend(
{
    layout: {
        top: 130,
        right: 0,
        width: 250,
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
        for (var i = 0; i < this.fields.length; i += 1) {
          if (this.fields[i].fieldKey == key) {
            return this.fields[i];
          }
        }
        return null;
      }
    }),

    update_everything: function() {
      var baseObject = this.get('objectToEdit');
      if (baseObject === null) {
        // Clear fields
        if (this.get('enabledLabel').parentView !== null) {
          SC.Logger.log("Clearing fields");
          this.get('enabledLabel').set('fields', []);
          this.get('enabledLabel').removeAllChildren();
        }
      } else {
        if (this.get('enabledLabel').parentView === null) {
          this.appendChild(this.getPath('enabledLabel'));
        }
        this.enabledLabel.set('content', baseObject);
        this.enabledLabel.set('fields', []);
        this.get('enabledLabel').removeAllChildren();
        // this.enabledLabel.set('childViews', []);
        // this.enabledLabel.set('_display_fields', []);
        for (var i = 0; i < baseObject.formFields.length; i += 1) {
          var field = baseObject.formFields[i];
          SC.Logger.log(field);
          // field.set('value', baseObject.get(field.key));
          // field.value = baseObject.get(field.key);
          //           SC.Logger.log(field);
          //           SC.Logger.log(field.addObserver);
          // for (var member in []) {
          //  SC.Logger.log(member);
          // }
          // SC.Logger.log(field.design);
          //           field.addObserver('value', this, 'fieldChanged');
          this.enabledLabel.set('fields', this.enabledLabel.get('fields').concat(field));
          SC.Logger.log(this.enabledLabel.get('fields'));
          SC.Logger.log(this.enabledLabel.get('childViews'));
        }
        // this.enabledLabel.fieldsDidChange();
      }
    }.observes('objectToEdit'),
    
    fieldChanged: function(target, key, value, revision) {// note value will always be null
      var field = target;
      var newValue = field.get('value');
      this.get('objectToEdit').set(key, newValue);
    }
});
