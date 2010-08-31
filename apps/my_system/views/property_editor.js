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

    propertiesForm: Forms.FormView.create({
      fields: "".w(),
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
        if (this.get('propertiesForm').parentView !== null) {
          SC.Logger.log("Clearing fields");
          this.get('propertiesForm').set('fields', []);
          this.get('propertiesForm').removeAllChildren();
        }
      } else {
        // Add the form if it doesn't exist
        if (this.get('propertiesForm').parentView === null) {
          this.appendChild(this.getPath('propertiesForm'));
        }
        this.get('propertiesForm').set('content', baseObject);
        // Clear fields before we start
        this.get('propertiesForm').set('fields', []);
        this.get('propertiesForm').removeAllChildren();
        // Add form rows
        for (var i = 0; i < baseObject.formFields.length; i += 1) {
          var field = baseObject.formFields[i];
          this.enabledLabel.set('fields', this.get('propertiesForm').get('fields').concat(field));
        }
      }
    }.observes('objectToEdit'),

    fieldChanged: function(target, key, value, revision) {// note value will always be null
      var field = target;
      var newValue = field.get('value');
      this.get('objectToEdit').set(key, newValue);
    }
});
