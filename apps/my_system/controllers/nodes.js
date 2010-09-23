// ==========================================================================
// Project:   MySystem.nodesController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  The whole set of nodes in the system.

  @extends SC.Object
*/
MySystem.nodesController = SC.ArrayController.create( SC.CollectionViewDelegate, 
/** @scope MySystem.nodesController.prototype */ {
  linkSelection: null,

  allSelected: function() {
    var link  = this.get('linkSelection');
    var resultSet = this.get('selection').clone();   
    if (link) {
      resultSet.addObject(link.get('model'));
    }
    return resultSet;
  }.property('linkSelection','selection').cacheable(),
  
  collectionViewDeleteContent: function (view, content, indices) {
    // destroy the records
    var recordsToDestroy = indices.map( function (idx) {
      return this.objectAt(idx);
    }, this);

    recordsToDestroy.invoke('destroy');
  },

  collectionViewSelectionForProposedSelection: function(view, sel) {
    // Is this a shift-click?
    if (view.get('mouseDownInfo') && view.get('mouseDownInfo').event.shiftKey) {
      return null ; // No change to selection
    }
    else {
      return sel ;
    }
  },

  addNode: function ( title, image, xPos, yPos ) {
    var node;
    var guid = MySystem.Node.newGuid();
    // Create a new node in store
    node = MySystem.store.createRecord(MySystem.Node, { 
      "title": title, 
      "image": image, 
      "position": { x: xPos, y: yPos },
      "guid":guid
    }, guid);

    return YES;
  },

  propertyWindowSelection: function() {
    var selection = MySystem.nodesController.get('allSelected');
    var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
    if (selection.length() === 0) {
      if (propertyEditor.isPaneAttached) {
        propertyEditor.remove();
      }
      propertyEditor.set('objectToEdit', null);
    } else if (selection.length() == 1) {
      if (!propertyEditor.isPaneAttached) {
        propertyEditor.append();
        propertyEditor.becomeFirstResponder();
      }
      propertyEditor.set('objectToEdit', selection.firstObject());
    } else {
      if (!propertyEditor.isPaneAttached) {
        propertyEditor.append();
      }
      propertyEditor.set('objectToEdit', null);
    }
  }.observes('allSelected'),

  showAlert: function() {
    MySystem.nodesController.showTextAlert("Pretend I'm a property editor");
  },

  showTextAlert: function(text) {
    SC.AlertPane.warn("property editor", text.toString(), "(please)", "No.", "What?", MySystem.nodesController);

    // SC.PickerPane.create({
    //   layout: { width: 400, height: 200 },
    //   contentView: SC.View.extend({})  // use some other view here
    // }).popup(this.get('selection'));
    // 
    // SC.PanelPane.create({
    //   layout: { width: 400, height: 200, centerX: 0, centerY: 0 },
    //   contentView: SC.View.extend({})
    // }).append();
    // 
  }
}) ;
