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

  addNode: function () {
    var node;

    // Create a new node in store
    node = MySystem.store.createRecord(MySystem.Node, { "title": "Edit Title", "image": 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png' } );

    return YES;
  }

}) ;
