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

  selectedLinksBinding: "MySystem.mainPage.mainPane.topView.bottomRightView.bottomRightView.selectedLinks",

  allSelected: function() {
    var links  = this.get('selectedLinks');
    var resultSet = this.get('selection').clone();
    resultSet = resultSet.addObjects(links.map(function(link){return link.get('model');}));
    return resultSet;
  }.property('selectedLinks','selectedLinks.[]','selection').cacheable(),
  
  unselectAll: function() {
    var theCanvas = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.bottomRightView');
    if (theCanvas.get('selectedLinks')) {
      theCanvas.set('selectedLinks', []);
      theCanvas.linksDidChange();
    }
    var baseSet = this.get('selection').clone();
    this.deselectObjects(baseSet);
  },

  selectFirstTransformation: function(node) {
    this.unselectAll();
    var transformation = node.firstUnannotatedTransformation();
    if (transformation) {
      MySystem.nodesController.selectObject(node);
      MySystem.nodesController.selectObjects(transformation.get('inLinks'), YES);
      MySystem.nodesController.selectObjects(transformation.get('outLinks'), YES);
      this.promptForTransformationAnnotation(transformation);
    }
  },

  promptForTransformationAnnotation: function(trans) {
    SC.AlertPane.info("Annotate transformation", "You should add a sentence to the story to explain the energy transformation at this node.");
    // TODO: Add a delegate to get the "closed" action here and open a new-sentence dialog
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
    var sentenceConnect = MySystem.getPath('mainPage.sentenceLinkPane');
    if (selection.length() === 0) {
      if (propertyEditor.isPaneAttached) {
        propertyEditor.remove();
      }
      propertyEditor.set('objectToEdit', null);
    } else if (selection.length() == 1) {
      if (!propertyEditor.isPaneAttached && !sentenceConnect.isPaneAttached) {
        propertyEditor.append();
        propertyEditor.becomeFirstResponder();
      }
      propertyEditor.set('objectToEdit', selection.firstObject());
    } else {
      if (!propertyEditor.isPaneAttached && !sentenceConnect.isPaneAttached) {
        propertyEditor.append();
      }
      propertyEditor.set('objectToEdit', null);
    }
  }.observes('allSelected')
}) ;
