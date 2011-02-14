// ==========================================================================
// Project:   MySystem.SENTENCE_OBJECT_LINKING_SETUP
// Copyright: ©2010 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  The statechart describes the states of the systems and how they change in reaction
  to user events. Put another way, the statechart describes the user interface of the
  application.

*/
MySystem.SENTENCE_OBJECT_LINKING_SETUP = Ki.State.design({
  
  diagramSelectionChanged: function () {
    return YES; // handle the event, but do nothing
  },
  
  /**
    TODO: Document this
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
    TODO: Document this
  */
  setUpSentenceLinkPane: function (sentence) {
    // Setting up the sentence link pane
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    if (sentence === null) {
      sentence = MySystem.storySentenceController.get('editingSentence');
    }
    console.log("Now editing linked nodes and links for %s", sentence.get('id'));
    var sentenceLinks = sentence.get('links'); 
    if (!diagramPane.isPaneAttached) {
      diagramPane.append();
      diagramPane.becomeFirstResponder();
    }
    MySystem.canvasView.selectObjects(sentenceLinks, true);
    MySystem.nodesController.selectObjects(sentence.get('nodes'), true);
  },
  
  enterState: function () {
    console.log("Entering state %s", this.get('name'));
    
    var sentence = MySystem.storySentenceController.get('editingSentence');
    
    // Clear previous state selections
    MySystem.nodesController.unselectAll();

    // Dim links
    this.dimAll();

    this.setUpSentenceLinkPane(sentence);
    
    this.gotoState('SENTENCE_OBJECT_LINKING');
  },
  
  exitState: function () {
    console.log("Leaving state %s", this.get('name'));
    
  }
});
