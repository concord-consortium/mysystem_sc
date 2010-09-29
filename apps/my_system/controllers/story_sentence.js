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

  allowsMultipleSelection: NO,

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
  },

  addLinksAndNodesToSentence: function (linksAndNodes, sentence) {
    linksAndNodes.forEach( function (item, index, enumerable) {
      if (item instanceof MySystem.Link) {
        sentence.get('links').pushObject(item);
      } else if (item instanceof MySystem.Node) {
        sentence.get('nodes').pushObject(item);
      } else {
        SC.Logger.log('Bad item type ' + item);
      }
    });
  },

  // Open the SentenceConnectPane
  addDiagramConnectPane: function (sentence) {
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    MySystem.nodesController.unselectAll();
    if (!diagramPane.isPaneAttached) {
      diagramPane.append();
      diagramPane.becomeFirstResponder();
    }
    MySystem.nodesController.selectObjects(sentence.get('links'), true);
    MySystem.nodesController.selectObjects(sentence.get('nodes'), true);
    diagramPane.set('activeSentence', sentence);
  },

  closeDiagramConnectPane: function () {
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    var diagramObjects = diagramPane.get('selectedObjects');
    var activeSentence = diagramPane.get('activeSentence');
    if (activeSentence) {
      // Remove previously associated nodes and links
      activeSentence.get('nodes').removeObjects(activeSentence.get('nodes'));
      activeSentence.get('links').removeObjects(activeSentence.get('links'));
      this.addLinksAndNodesToSentence(diagramObjects, activeSentence);
    }
    if (diagramPane.isPaneAttached) {
      diagramPane.remove();
    }
    MySystem.nodesController.unselectAll();
    diagramPane.set('activeSentence', null);
  },

  turnOffOtherButtons: function(buttonToLeaveOn) {
    var storyView = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView');
    var sentenceViews = storyView.get('contentView').get('childViews');
    sentenceViews.forEach( function (sentenceView) {
      if (sentenceView.get('linkButton') != buttonToLeaveOn) {
          sentenceView.get('linkButton').set('value', NO);
      }
    });
  },

  doneButtonPushed: function() {
    this.closeDiagramConnectPane();
    this.turnOffOtherButtons(null);
  },

  // Turns on and off a "link this to diagram" button in the top toolbar (not currently included)
  activateLinkingButton: function() {
    if (this.get('selection').get('length') !== 0) {
      // Turn on button
      MySystem.mainPage.mainPane.topView.bottomRightView.topLeftView.bottomRightView.toolbar.showButton.set('isEnabled', YES);
    } else {
      // Turn off button
      MySystem.mainPage.mainPane.topView.bottomRightView.topLeftView.bottomRightView.toolbar.showButton.set('isEnabled', NO);
    }
  }.observes('selection')

}) ;
