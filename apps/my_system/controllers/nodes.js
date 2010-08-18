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

  collectionViewDeleteContent: function (view, content, indices) {
    // destroy the records
    var recordsToDestroy = indices.map( function (idx) {
      return this.objectAt(idx);
    }, this);

    recordsToDestroy.invoke('destroy');
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

  showAlert: function() {
    SC.AlertPane.warn("property editor", "Pretend this is a property editor.", "(please)", "No.", "What?", MySystem.nodesController);

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
