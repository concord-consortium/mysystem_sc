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
  }

}) ;
