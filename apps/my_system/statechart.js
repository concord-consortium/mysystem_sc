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
      
      /**
        When a link is selected, we transition to the link-editing state.
      */
      linkSelected: function () {
        this.gotoState('DIAGRAM_OBJECT_EDITING');
      },
      
      /**
        When a sentence is double-clicked, we transition to the sentence-editing state.
      */
      editSentence: function () {
        this.gotoState('SENTENCE_EDITING');
      },
      
      /**
        When the sentence-linking pane is triggered, we transition to the sentence-linking state.
      */
      sentenceLinking: function () {
        this.gotoState('SENTENCE_OBJECT_LINKING');
      }
    }),
    
    DIAGRAM_OBJECT_EDITING: Ki.State.design({
      
      enterState: function () {
        console.log("Entering state %s", this.get('name'));
        // Set up the property editor pane and attach it
      },
      
      exitState: function () {
        // Detatch property editor pane and clean it up
        console.log("Leaving state %s", this.get('name'));
      },
      
      selectionChanged: function (newSelection) {
        if (newSelection.get('length') > 1) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else if (newSelection.get('length') < 1) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else if (!newSelection.firstObject().kindOf(MySystem.Link)) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else {
          // Update the property editor pane
        }
      }
    }),
    
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
    
    SENTENCE_OBJECT_LINKING: Ki.State.design({
      
      sentenceLinkButton: function (sentence) {
        if (sentence == this.current_sentence) {
          this.gotoState('DIAGRAM_EDITING');
        }
        else {
          // save current sentence object links
          // re-set-up linking with new sentence
        }
      },
      
      closeButton: function () {
        // save current sentence object links
        this.gotoState('DIAGRAM_EDITING');
      },
      
      enterState: function () {
        console.log("Entering state %s", this.get('name'));
        // Set up sentence and linked diagram objects
        // Open linking pane
        // Change diagram classnames
        // Change diagram highlighting
      },
      
      exitState: function () {
        console.log("Leaving state %s", this.get('name'));
        // Close linking pane
        // Clean up sentence, linked diagram objects
        // Restore diagram highlighting
        // Restore diagram classnames
      }
      
    })
  })
});