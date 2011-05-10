// ==========================================================================
// Project:   MySystem.SENTENCE_OBJECT_LINKING_SETUP
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  A transient state setting up SENTENCE_OBJECT_LINKING. 

  This state is needed in order to properly update the diagram selections without changing
  associations as would happen in the SENTENCE_OBJECT_LINKING state. Updating the selections
  here lets us silently handle the diagramSelectionChanged events, then return to the active 
  state.

*/
MySystem.SENTENCE_OBJECT_LINKING_SETUP = Ki.State.design({
  
  /**
    In this transient state, we want to ignore any selection changes made in the diagram,
    because they're most likely made by the transition itself. This event handles the
    action by doing nothing.
  */
  diagramSelectionChanged: function () {
    return YES; // handle the event, but do nothing
  },
  
  /**
    Makes the diagram "dim" by de-selecting all diagram objects, then setting the isDimmed 
    property on all links and adding the  "sentence-linking" class to the canvas (which dims 
    un-selected nodes).
  */
  dimAll: function () {
    MySystem.nodesController.unselectAll();

    // Dim all nodes via CSS
    if (MySystem.canvasView.get('classNames').indexOf('sentence-linking') < 0) {
      MySystem.canvasView.get('classNames').push('sentence-linking');
    }
    
    // Dim all links
    var allLinks = MySystem.store.find('MySystem.Link');
    allLinks.forEach( function (link) {
      link.set('isDimmed', YES);
    });
    return YES;
  },
  
  /**
    Sets up the sentence linking pane (basically the "done" button) for the sentence
    to be edited. Also selects nodes and links already associated with the sentence.
    
    @param {MySystem.StorySentence} sentence
      The sentence for which the association is being done.
  */
  setUpSentenceLinkPane: function (sentence) {
    // Setting up the sentence link pane
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    if (sentence === null) {
      sentence = MySystem.storySentenceController.get('editingSentence');
    }
    SC.Logger.log("Now editing linked nodes and links for %s", sentence.get('id'));
    var sentenceLinks = sentence.get('links'); 
    if (!diagramPane.isPaneAttached) {
      diagramPane.append();
      diagramPane.becomeFirstResponder();
    }
    MySystem.canvasView.selectObjects(sentenceLinks, true);
    MySystem.nodesController.selectObjects(sentence.get('nodes'), true);
  },
  
  /**
    Triggers all the sentence-object linking setup by calling this.dimAll() and
    this.setUpSentenceLinkPane() before sending us along to SENTENCE_OBJECT_LINKING.
  */
  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
    
    var sentence = MySystem.storySentenceController.get('editingSentence');
    
    // Dim links
    this.dimAll();

    this.setUpSentenceLinkPane(sentence);
    
    this.gotoState('SENTENCE_OBJECT_LINKING');
  },
  
  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
  }
});
