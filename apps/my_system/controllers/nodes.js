// ==========================================================================
// Project:   MySystem.nodesController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  The whole set of nodes in the system.

  @extends SC.Object
*/
MySystem.nodesController = SC.ArrayController.create( SC.CollectionViewDelegate, 
/** @scope MySystem.nodesController.prototype */ {

  // the in-progress links originating and ending terminals
  dragLinkSrcTerminal:     null,
  dragLinkEndTerminal:     null,

  // FIXME dummy method for backward compatibility
  unselectAll: function() {
    this.deselectObjects(this.get('selection'));
  },

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
      return sel ; // Accept new selected set
    }
  },

  propertyEditing: function() {
    MySystem.statechart.sendEvent('diagramSelectionChanged', { });
  }.observes('selection'),
  
  // If the selection changes on nodes or links, grab the top layer and call focus().
  // This forces the browser focus back onto the application, which ensures that
  // keyboard and other events are properly directed here if we are embedding in an iframe.
  //
  // We need to focus again on every selection change, to account for an author who is
  // going back and forth between an author iframe and preview iframe.
  //
  // Having it here is a bit of a hack, and there might be some more stardard way of dealing
  // with the issue that the selection of svg elements doesn't cause browser to track focus.
  //
  // Why blur after? Who knows? But if we don't, dialog boxes don't correctly swallow backspace
  // events. This is a mystery.
  focusMainPane: function() {
    if (MySystem.mainPage.get('mainPane') && MySystem.mainPage.get('mainPane').get('layer')){
      MySystem.mainPage.getPath('mainPane').get('layer').focus();
      MySystem.mainPage.getPath('mainPane').get('layer').blur();
    }
  }.observes('selection')
});
