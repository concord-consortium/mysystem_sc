// ==========================================================================
// Project:   MySystem.storySentencesController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
MySystem.storySentenceController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope MySystem.storySentencesController.prototype */ {

  allowsMultipleSelection: NO,
  
  editingSentence: null,

  collectionViewDeleteContent: function(view, content, indexes) {
    // Destroy the records
    var records = indexes.map(function(idx) {
      return this.objectAt(idx);
    }, this);
    records.invoke('destroy');

    var selIndex = indexes.get('min')-1;
    if (selIndex<0) selIndex = 0;
    this.selectObject(this.objectAt(selIndex));

    return YES ;
  },

  collectionViewPerformDragOperation: function(view, drag, op, proposedInsertionIndex, proposedDropOperation) {
    var movingSentence = drag.get('source').get('selection').firstObject();
    movingSentence.set('order', proposedInsertionIndex);
    this.incrementOrderValues(proposedInsertionIndex);
    return SC.DRAG_REORDER ;
  },

  addStorySentence: function() {
    var sentence;
    sentence = this.addStorySentenceNoEdit();

    // Select the sentence in the UI
    this.selectObject(sentence);

    // Activate the editor once the UI repaints
    this.invokeLater(function() {
      var contentIndex = this.indexOf(sentence);
      var list = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView.contentView');
      var listItem = list.itemViewForContentIndex(contentIndex);
      listItem.get('sentenceText').beginEditing();
    });

    return sentence ;
  },

  addStorySentenceNoEdit: function() {
    var sentence;

    this._incrementOrderValues(0);

    // Create a new sentence in the store
    sentence = MySystem.store.createRecord(MySystem.StorySentence, {
      "guid": MySystem.StorySentence.newGuid(),
      "order": 0,
      "bodyText": "Describe a new step in the story."
    });

    return sentence ;
  },

  // TODO: This function was created for the transformation editor, to facilitate explaining transformations.
  // As that gets transferred to statecharts, this will go to that relevant state.
  createSentence: function(node) {
    var sentence = this.addStorySentence();
    this.addLinksAndNodesToSentence([node], sentence);
    // This actually adds ALL links for a node to the sentence
    this.addLinksAndNodesToSentence(node.get('links').map(function(link){return link.model;}), sentence);
  },

  // Utility function for managing the list order.
  _incrementOrderValues: function(startAt) {
    this.content.forEach( function (item, index, enumerable) {
      if (item.get('order') >= startAt) {
        item.set('order', item.get('order') + 1);
      }
    });
  }
}) ;
