// ==========================================================================
// Project:   MySystem.statechart
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem */

/** 

  The statechart describes the states of the systems and how they change in reaction
  to user events. Put another way, the statechart describes the user interface of the
  application.

*/
sc_require('states/diagram_editing');
sc_require('states/diagram_object_editing');
sc_require('states/sentence_object_linking');
sc_require('states/sentence_object_linking_setup');
sc_require('states/adding_link');

MySystem.statechart = SC.Object.create(SC.StatechartManager, {
  rootState: SC.State.design({
    
    initialSubstate: 'DIAGRAM_EDITING',
    
    /**
      DIAGRAM_EDITING
      
      The main state; this is where users can create and delete nodes and links and 
      manipulate the diagram.
    */
    DIAGRAM_EDITING: SC.State.plugin('MySystem.DIAGRAM_EDITING'),    
    
    /**
      DIAGRAM_OBJECT_EDITING: a state to handle the editing of properties of specific diagram objects.
      
      At the current time, that only means links (node titles can be edited in place) because link colors
      need the property editor pane for color selection. 
      
      The state opens the property editor pane and sets it up, then tears it down and returns to the 
      DIAGRAM_EDITING state when the object being edited is no longer selected.
    */
    DIAGRAM_OBJECT_EDITING: SC.State.plugin('MySystem.DIAGRAM_OBJECT_EDITING'),
    
    /** 
      SENTENCE_EDITING: the edit-in-place state of the user story sentences.
      
      This state is intended to isolate events sent to the sentences' edit-in-place editor
      from being passed down the chain to e.g. the diagram. At the current time it seems
      to be superfluous because simply having the statechart as first responder seems to
      have solved that problem.
    */
    SENTENCE_EDITING: SC.State.design({
      
      commitEdits: function () {
        this.gotoState('DIAGRAM_EDITING');
      },
      
      enterState: function () {
        SC.Logger.log("Entering state %s", this.get('name'));
      },
      
      exitState: function () {
        SC.Logger.log("Leaving state %s", this.get('name'));
      }
      
    }),
    
    ADDING_LINK: SC.State.plugin('MySystem.ADDING_LINK'),
    
    /**
      SENTENCE_OBJECT_LINKING_SETUP: A transient state setting up SENTENCE_OBJECT_LINKING. 
      
      This state is needed in order to properly update the diagram selections without changing
      associations as would happen in the SENTENCE_OBJECT_LINKING state.
    */
    SENTENCE_OBJECT_LINKING_SETUP: SC.State.plugin('MySystem.SENTENCE_OBJECT_LINKING_SETUP'),
    
    /**
      SENTENCE_OBJECT_LINKING: Designating which components of the diagram are associated with
      which sentences in the user story.
      
      In this state, the diagram should not be modifiable. When a node or link is selected, it is
      associated with the currently operative sentence; when it is de-selected it is also de-associated.
    */
    SENTENCE_OBJECT_LINKING: SC.State.plugin('MySystem.SENTENCE_OBJECT_LINKING'),
    
    // clears the canvas after asking the user
    clearCanvas: function () {
      SC.AlertPane.warn({
        description: "Are you sure you want to reset your diagram?",
        delegate: {
          alertPaneDidDismiss: function(pane, status) {
            if (status === SC.BUTTON2_STATUS){    // "yes"
              MySystem.clearCanvas();
            }
          }
        },
        buttons: [
          { title: "Cancel" },
          { title: "Yes" }
        ]
      });
    },
    
    saveButtonPressed: function () {
      MySystem.savingController.save();
    },
    
    // runs the rules, saves the data and pops up a message to the user
    checkButtonPressed: function () {
      // force focus of main pane, as author could have focus elsewhere, hit
      // checkDiagram, and then hit delete key...
      MySystem.nodesController.focusMainPane();
      MySystem.activityController.checkButtonPressed();
    },
    

    // show the user the help content...
    helpButtonPressed: function () {
      MySystem.nodesController.focusMainPane();
      MySystem.storyController.showInstructions();
    },

    // The delete key should generally be handled before this, but if not this is the place
    // of last resort to catch a Delete event before it causes the browser's BACK action.
    // Note this will only work for views with a statechart as their default responder. Any
    // view for which acceptsFirstResponder = YES will need to handle this themselves.
    keyDown: function(evt) {
      // if it's backspace, send to the canvas and consume
      if (evt.keyCode === 8) {
        var myCanvas = MySystem.canvasView;
        if (!!myCanvas){
          myCanvas.keyDown(evt);
        }
        return YES;
      } else {
        return NO;
      }
    },
    
    /**
      Delete the specified diagram object (node or link)
    */
    deleteDiagramObject: function (sender, contentObject) {
      MySystem.nodesController.deleteObject(contentObject);
      return YES;
    },
    
    deleteDiagramSelection: function () {
      MySystem.nodesController.deleteSelectedObjects();
      return YES;
    }
    
  })
});
