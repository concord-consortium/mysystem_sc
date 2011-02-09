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

  selectedLinksBinding: "MySystem.canvasView.selectedLinks",

  allSelected: function() {
    var links  = this.get('selectedLinks');
    var resultSet = this.get('selection').clone();
    resultSet = resultSet.addObjects(links.map(function(link){return link.get('model');}));

    // TODO: Following chunk should get refactored out
      // Check dimming
      if (MySystem.getPath('mainPage.sentenceLinkPane').isPaneAttached) {
        if (resultSet.get('length') === 0) {
          var allLinks = MySystem.store.find(MySystem.Link);
          allLinks.forEach( function (link) {
            link.set('isDimmed', YES);
          });
        }
        else {
          resultSet.forEach( function (item) {
            if (item.kindOf(MySystem.Link)) {
              item.set('isDimmed', NO);
            }
          });
        }
      }

    return resultSet;
  }.property('selectedLinks','selectedLinks.[]','selection').cacheable(),
  
  unselectAll: function() {
    // De-select links
    if (this.selectedLinks) {
      this.set('selectedLinks', []);
      MySystem.canvasView.linksDidChange();
    }
    
    // De-select nodes
    var baseSet = this.get('selection').clone();
    this.deselectObjects(baseSet);
  },

  /* We'll need to refactor this when we get back to transformations */
  // selectFirstTransformation: function(node) {
  //   this.unselectAll();
  //   var transformation = node.firstUnannotatedTransformation();
  //   if (transformation) {
  //     MySystem.nodesController.selectObject(node);
  //     MySystem.nodesController.selectObjects(transformation.get('inLinks'), YES);
  //     MySystem.nodesController.selectObjects(transformation.get('outLinks'), YES);
  //     this.promptForTransformationAnnotation(transformation);
  //   }
  // },
  
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
});
