// ==========================================================================
// Project:   MySystem.statechart
// Copyright: ©2010 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  The statechart describes the states of the systems and how they change in reaction
  to user events. Put another way, the statechart describes the user interface of the
  application.

*/

MySystem.statechart = Ki.Statechart.create({
  rootState: Ki.State.design({
    
    initialSubstate: 'DIAGRAM_EDITING',
    
    /**
      DIAGRAM_EDITING
      
      The main state; this is where users can create and delete nodes and links and 
      manipulate the diagram.
    */
    DIAGRAM_EDITING: Ki.State.design({
      
      enterState: function () {
        console.log("Entering state %s", this.get('name'));
      },
      
      exitState: function () {
        console.log("Leaving state %s", this.get('name'));
      },
      
      addNode: function (attr) {
        var node;
        var guid = MySystem.Node.newGuid();
        
        // Create a new node in store
        node = MySystem.store.createRecord(MySystem.Node, { 
          "title": attr.title, 
          "image": attr.image, 
          "position": { x: attr.x, y: attr.y },
          "guid": guid
        }, guid);
        
        // De-select other diagram objects and select the new node
        MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
        MySystem.nodesController.selectObject(node);

        return YES;
      },
      
      /**
        When a link is selected, we transition to the link-editing state.
      */
      diagramSelectionChanged: function (args) {
        var selection = MySystem.nodesController.get('allSelected');
        if ((selection.get('length') == 1) && selection.firstObject().get('linkStyle')) {
          this.gotoState('DIAGRAM_OBJECT_EDITING');
        }
        return YES;
      },
      
      /**
        When a sentence is double-clicked, we transition to the sentence-editing state.
        
        This state turns out to be superfluous.
      */
      editSentence: function () {
        this.gotoState('SENTENCE_EDITING');
        return YES;
      },
      
      /**
        When the sentence-linking pane is triggered, we transition to the sentence-linking state.
      */
      sentenceDiagramConnect: function (args) {
        MySystem.storySentenceController.set('editingSentence', args.sentence);
        this.gotoState('SENTENCE_OBJECT_LINKING');
        return YES;
      }
    }),
    
    /**
      DIAGRAM_OBJECT_EDITING: a state to handle the editing of properties of specific diagram objects.
      
      At the current time, that only means links (node titles can be edited in place) because link colors
      need the property editor pane for color selection. 
      
      The state opens the property editor pane and sets it up, then tears it down and returns to the 
      DIAGRAM_EDITING state when the object being edited is no longer selected.
    */
    DIAGRAM_OBJECT_EDITING: Ki.State.design({
      
      setUpPropertyPane: function () {
        var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
        var selectedObject = MySystem.nodesController.get('allSelected').firstObject();
        if (!propertyEditor.isPaneAttached) {
          propertyEditor.append();
        }
        propertyEditor.set('objectToEdit', selectedObject);
      },
      
      tearDownPropertyPane: function () {
        var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
        if (propertyEditor.isPaneAttached) {
          propertyEditor.remove();
        }
        propertyEditor.set('objectToEdit', null);
      },

      enterState: function () {
        console.log("Entering state %s", this.get('name'));
        // Set up the property editor pane and attach it
        this.setUpPropertyPane();
      },
      
      exitState: function () {
        console.log("Leaving state %s", this.get('name'));
        // Detatch property editor pane and clean it up
        this.tearDownPropertyPane();
      },
      
      diagramSelectionChanged: function (args) {
        var newSelection = MySystem.nodesController.get('allSelected');
        if (newSelection.get('length') !== 1) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else if (!newSelection.firstObject().get('linkStyle')) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else {
          // Update the property editor pane
          this.setUpPropertyPane();
        }
      }
    }),
    
    /** 
      SENTENCE_EDITING: the edit-in-place state of the user story sentences.
      
      This state is intended to isolate events sent to the sentences' edit-in-place editor
      from being passed down the chain to e.g. the diagram. At the current time it seems
      to be superfluous because simply having the statechart as first responder seems to
      have solved that problem.
    */
    SENTENCE_EDITING: Ki.State.design({
      
      commitEdits: function () {
        this.gotoState('DIAGRAM_EDITING');
      },
      
      enterState: function () {
        console.log("Entering state %s", this.get('name'));
      },
      
      exitState: function () {
        console.log("Leaving state %s", this.get('name'));
      }
      
    }),
    
    /**
      
    */
    SENTENCE_OBJECT_LINKING: Ki.State.design({
      
      // TODO: Use this or remove it
      sentenceLinkButton: function (sentence) {
        if (sentence == this.current_sentence) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else {
          // save current sentence object links
          // re-set-up linking with new sentence
        }
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
        var selectedLinks = MySystem.nodesController.get('selectedLinks');
        
        // Un-dim links
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
      setUpSentenceLinkPane: function (sentence) {
        var diagramPane = MySystem.getPath('mainPage.sentenceLinkPane');
        var sentenceLinks = sentence.get('links');
        if (!diagramPane.isPaneAttached) {
          diagramPane.append();
          diagramPane.becomeFirstResponder();
        }
        MySystem.canvasView.selectObjects(sentenceLinks, true);
        MySystem.nodesController.selectObjects(sentence.get('nodes'), true);
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
      
      // TODO: Use this or remove it
      closeButton: function () {
        // Turn off all buttons
        this.gotoState('DIAGRAM_EDITING');
      },
      
      // Ensures there is only one active sentence-linking button at a time
      turnOffOtherButtons: function (buttonToLeaveOn) {
        console.log("Turn off other buttons!");
        var storyView = MySystem.mainPage.getPath('mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView');
        var sentenceViews = storyView.get('contentView').get('childViews');
        sentenceViews.forEach( function (sentenceView) {
          if (sentenceView.get('linkButton') != buttonToLeaveOn) {
              sentenceView.get('linkButton').set('value', NO);
          }
        });
        return YES;
      },

      enterState: function () {
        console.log("Entering state %s", this.get('name'));
        var sentence = MySystem.storySentenceController.get('editingSentence');
        
        // Clear previous state selections
        MySystem.nodesController.unselectAll();

        // Dim links
        this.dimAll();

        // Attach the pane and select appropriate nodes and links
        this.setUpSentenceLinkPane(sentence);
        
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

        // Restore diagram classnames
        MySystem.canvasView.get('classNames').pop(); // TODO: This is brittle; if we've added another classname, it gets that instead of 'sentence-linking' which is what we want

      }
      
    })
  })
});