// ==========================================================================
// Project:   MySystem.SENTENCE_OBJECT_LINKING
// Copyright: ©2010 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  The statechart describes the states of the systems and how they change in reaction
  to user events. Put another way, the statechart describes the user interface of the
  application.

*/
MySystem.SENTENCE_OBJECT_LINKING = Ki.State.design({
  
  /**
    TODO: Document this
  */
  sentenceDiagramConnect: function (args) {
    MySystem.storySentenceController.set('editingSentence', args.sentence);
    this.gotoState('SENTENCE_OBJECT_LINKING_SETUP');
    return YES;
  },

  /**
    TODO: Document this
  */
  dimAll: function () {
    MySystem.nodesController.unselectAll();

    // Dim all nodes via CSS
    MySystem.canvasView.get('classNames').push('sentence-linking');
    
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
  updateHighlighting: function (sentence) {
    var allLinks = MySystem.store.find('MySystem.Link');
    var selectedLinks = MySystem.nodesController.get('selectedLinks');
    
    // Update link dimming
    // TODO: Need to dim newly un-selected links, but this crashes the app.
    // allLinks.forEach( function (link) {
    //   link.set('isDimmed', YES);
    // });
    selectedLinks.forEach( function (link) {
        link.set('isDimmed', NO);
    });
    
    // Nodes are un-dimmed by virtue of selection CSS
    return YES;
  },
  
  /**
    TODO: Document this
  */
  diagramSelectionChanged: function () {
    // Update items linked to sentence
    var selection = MySystem.nodesController.get('allSelected');
    var sentence = MySystem.storySentenceController.get('editingSentence');

    // Remove existing links
    sentence.get('links').removeObjects(sentence.get('links'));
    // Remove existing nodes
    sentence.get('nodes').removeObjects(sentence.get('nodes'));
    
    selection.forEach( function (item) {
      if (item.instanceOf(MySystem.Link)) {
        sentence.get('links').pushObject(item);
      } else if (item.instanceOf(MySystem.Node)) {
        sentence.get('nodes').pushObject(item);
      } else {
        SC.Logger.log('Bad item type ' + item);
      }
    });
    
    // Update highlighting
    this.updateHighlighting();
    return YES;
  },
  
  /**
    TODO: Document this
  */
  tearDownSentenceLinkPane: function () {
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    if (diagramPane.isPaneAttached) {
      diagramPane.remove();
    }
    MySystem.nodesController.unselectAll();
  },
  
  // TODO: Document this
  closeButton: function () {
    console.log("Got the closeButton event");
    MySystem.storySentenceController.set('editingSentence', null);
    this.gotoState('DIAGRAM_EDITING');
    return YES;
  },
  
  enterState: function () {
    console.log("Entering state %s", this.get('name'));
    
    // Make sure all selected stuff is un-dimmed
    this.updateHighlighting();

  },
  
  exitState: function () {
    console.log("Leaving state %s", this.get('name'));
    var allLinks = MySystem.store.find(MySystem.Link);

    // Close linking pane
    this.tearDownSentenceLinkPane();

    // Un-dim all links
    allLinks.forEach( function (link) {
      link.set('isDimmed', NO);
    });
    MySystem.nodesController.unselectAll();

    // Restore diagram classnames
    if (MySystem.canvasView.get('classNames').indexOf('sentence-linking') === MySystem.canvasView.get('classNames').get('length')-1) {
      MySystem.canvasView.get('classNames').pop();
    }
    else if (MySystem.canvasView.get('classNames').indexOf('sentence-linking') > -1) {
      console.log("Removing class name at %d", MySystem.canvasView.get('classNames').indexOf('sentence-linking'));
      // remove "sentence-linking"
      MySystem.canvasView.get('classNames').splice(MySystem.canvasView.get('classNames').indexOf('sentence-linking'));
    }

  }
  
});
