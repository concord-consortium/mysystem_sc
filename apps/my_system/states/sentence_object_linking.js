// ==========================================================================
// Project:   MySystem.SENTENCE_OBJECT_LINKING
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  In this state, the user may designate which components of the diagram are associated with
  which sentences in the user story.

  In this state, the diagram should not be modifiable. When a node or link is selected, it is
  associated with the currently operative sentence; when it is de-selected it is also de-associated.

*/
MySystem.SENTENCE_OBJECT_LINKING = Ki.State.design({
  
  /**
    Taking a sentence argument, adjusts the sentence being edited in the controller, then 
    moves state to SENTENCE_OBJECT_LINKING_SETUP to manage the transition to the new sentence.
    
    @param args
    
    @param {MySystem.StorySentence} args.sentence
      The new sentence which is to be linked with diagram objects.
  */
  sentenceDiagramConnect: function (args) {
    MySystem.storySentenceController.set('editingSentence', args.sentence);
    this.gotoState('SENTENCE_OBJECT_LINKING_SETUP');
    return YES;
  },

  /**
    Adds a class to the canvas view which changes the CSS for nodes (thus dimming un-selected ones),
    de-selects all nodes and links, and sets the isDimmed property on all links to YES.
  */
  dimAll: function () {
    MySystem.nodesController.unselectAll();

    // Dim all nodes via CSS
    MySystem.canvasView.get('classNames').push('sentence-linking');
    
    // Dim all links
    var allLinks = MySystem.store.find('MySystem.Link');
    allLinks.forEach( function (link) {
      SC.Logger.log("Dimming link %s", link.get('id'));
      link.set('isDimmed', YES);
    });
    return YES;
  },
  
  /**
    Updates the dimmed/not dimmed settings of all links on the diagram
    depending on their selected state.
  */
  updateHighlighting: function () {
    var isLink = function (x) {
      // returns true if x is a MySystem.Link
      return x.kindOf(MySystem.Link);
    };
    var allLinks = MySystem.store.find('MySystem.Link');
    var selectedLinks = MySystem.nodesController.get('allSelected').filter(isLink);
    
    allLinks.forEach( function (link) {
      if (selectedLinks.indexOf(link) > -1) {
        SC.Logger.log("Un-dimming link %s", link.get('id'));
        link.set('isDimmed', NO);
      }
      else {
        SC.Logger.log("Dimming link %s", link.get('id'));
        link.set('isDimmed', YES);
      }
    });
    
    // Nodes are un-dimmed by virtue of selection CSS
    return YES;
  },
  
  /**
    If the set of selected diagram objects has changed, this event is sent to the 
    statechart. Here we update the nodes and links associated with the currently-active
    sentence to match the set of selected nodes and links.
  */
  diagramSelectionChanged: function () {
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
    Remove the linking pane and remove all selections from the diagram.
  */
  tearDownSentenceLinkPane: function () {
    var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
    if (diagramPane.isPaneAttached) {
      diagramPane.remove();
    }
    // De-select nodes
    MySystem.nodesController.unselectAll();
    // TODO: Need to de-select links, too.
  },
  
  /** 
    In response to the "close" button click, set the active sentence to null and return to diagram editing.
  */
  closeButton: function () {
    SC.Logger.log("Got the closeButton event");
    MySystem.storySentenceController.set('editingSentence', null);
    this.gotoState('DIAGRAM_EDITING');
    return YES;
  },
  
  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
    
    // Make sure all selected stuff is un-dimmed
    this.updateHighlighting();

  },
  
  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
    var allLinks = MySystem.store.find(MySystem.Link);

    // Close linking pane
    this.tearDownSentenceLinkPane();

    // Un-dim all links
    allLinks.forEach( function (link) {
      link.set('isDimmed', NO);
    });

    // Restore diagram classnames
    if (MySystem.canvasView.get('classNames').indexOf('sentence-linking') === MySystem.canvasView.get('classNames').get('length')-1) {
      MySystem.canvasView.get('classNames').pop();
    }
    else if (MySystem.canvasView.get('classNames').indexOf('sentence-linking') > -1) {
      // remove "sentence-linking"
      MySystem.canvasView.get('classNames').splice(MySystem.canvasView.get('classNames').indexOf('sentence-linking'));
    }

  }
  
});
