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

MySystem.PropertyEditorPane = SC.PalettePane.extend(
{
  acceptsFirstResponder: YES,
  layout: {
      top: 150,
      right: 5,
      width: 250,
      height: 240
  },
  classNames: 'property-editor'.w(),

  displayProperties: 'objectToEdit isSelected'.w(),
  objectToEdit: null,
  isSelected: false,

  childViews: ''.w(),

  propertiesForm: Forms.FormView.create({
    fields: "".w(),

    findField: function(key) {
      var rightField = null;
      this.fields.forEach( function (item, index, enumerable) {
        if (item.get('fieldKey') == key) {
          rightField = item;
        }
      });
      return rightField;
    }

  }),

  // returns the index of the first occurrence of element in array, -1 if it's not there
  indexOf: function(element, array) {
    for (var i = 0; i < array.length; i += 1) {
      if (element == array[i]) return i;
    }
    return -1;
  },

  update_everything: function() {
    var form = this.get('propertiesForm');
    var baseObject = this.get('objectToEdit');
    if (baseObject === null) {
      // Clear fields
      if (form.parentView !== null) {
        form.set('fields', []);
        form.removeAllChildren();
      }
    } else {
      // Add the form if it doesn't exist
      if (form.parentView === null) {
        this.appendChild(form);
      }
      form.set('content', baseObject);
      // Clear fields before we start
      form.set('fields', []);
      form.removeAllChildren();
      // Append form rows
      form.set('fields', baseObject.get('formFields'));
      if (baseObject.kindOf(MySystem.Link)) {
        /* Color-selection code temporarily removed for Berkeley 0.1 release */
        // var startNode = baseObject.get('startNode');
        // var endNode = baseObject.get('endNode');
        // var colors = startNode.intersection(startNode.acceptableOutLinkColors(), endNode.acceptableInLinkColors());
        // FIXME: Need to work on values here
        var radioButtons = form.get('_displayFields').objectAt(0).get('_displayFields').objectAt(0).get('field');
        // if (!startNode.get('transformer')) {
        //   // TODO: Figure out a more elegant way to do this
        //   form.get('_displayFields').objectAt(0).get('_displayFields').objectAt(0).get('field').set('isEnabled', false);
        // }
        var items = radioButtons.get('items');
        for (var i = 0; i < items.get('length'); i += 1) {
          var item = items.objectAt(i);
          // if (true) { // (colors === null) {
            item.enabled = true;
          // } else {
          //   if (this.indexOf(item.value, colors) >= 0) {
          //     item.enabled = true;
          //   } else {
          //     item.enabled = false;
          //   }
          // }
        }
      }
    }
  }.observes('objectToEdit'),

  fieldChanged: function(target, key, value, revision) {// note value will always be null
    var field = target;
    var newValue = field.get('value');
    this.get('objectToEdit').set(key, newValue);
  },

  keyDown: function(evt) {
    return this.interpretKeyEvents(evt) ? YES : NO;
  },

  deleteBackward: function() {
    MySystem.canvasView.deleteSelection();
    // this.get('objectToEdit').destroy();
    return YES;
  },

  deleteForward: function() {
    MySystem.canvasView.deleteSelection();
    // this.get('objectToEdit').destroy();
    return YES;
  }
});
