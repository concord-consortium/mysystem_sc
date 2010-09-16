// ==========================================================================
// Project:   MySystem.storySentencesController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
MySystem.storySentenceController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope MySystem.storySentencesController.prototype */ {

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

  addStorySentence: function() {
    var sentence;

    // Create a new sentence in the store
    sentence = MySystem.store.createRecord(MySystem.StorySentence, {
      "guid": MySystem.StorySentence.newGuid(),
      "bodyText": "Describe a new step in the story."
    });

    // Select the sentence in the UI
    this.selectObject(sentence);

    // Activate the editor once the UI repaints
    this.invokeLater(function() {
      var contentIndex = this.indexOf(sentence);
      var list = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView.contentView');
      var listItem = list.itemViewForContentIndex(contentIndex);
      listItem.beginEditing();
    });

    return YES ;
  }
}) ;
