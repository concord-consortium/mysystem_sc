// ==========================================================================
// Project:   MySystem.statechart
// Copyright: ©2011 Concord Consortium
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
    DIAGRAM_EDITING: Ki.State.plugin('MySystem.DIAGRAM_EDITING'),    
    
    /**
      DIAGRAM_OBJECT_EDITING: a state to handle the editing of properties of specific diagram objects.
      
      At the current time, that only means links (node titles can be edited in place) because link colors
      need the property editor pane for color selection. 
      
      The state opens the property editor pane and sets it up, then tears it down and returns to the 
      DIAGRAM_EDITING state when the object being edited is no longer selected.
    */
    DIAGRAM_OBJECT_EDITING: Ki.State.plugin('MySystem.DIAGRAM_OBJECT_EDITING'),
    
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
        SC.Logger.log("Entering state %s", this.get('name'));
      },
      
      exitState: function () {
        SC.Logger.log("Leaving state %s", this.get('name'));
      }
      
    }),
    
    /**
      SENTENCE_OBJECT_LINKING_SETUP: A transient state setting up SENTENCE_OBJECT_LINKING. 
      
      This state is needed in order to properly update the diagram selections without changing
      associations as would happen in the SENTENCE_OBJECT_LINKING state.
    */
    SENTENCE_OBJECT_LINKING_SETUP: Ki.State.plugin('MySystem.SENTENCE_OBJECT_LINKING_SETUP'),
    
    /**
      SENTENCE_OBJECT_LINKING: Designating which components of the diagram are associated with
      which sentences in the user story.
      
      In this state, the diagram should not be modifiable. When a node or link is selected, it is
      associated with the currently operative sentence; when it is de-selected it is also de-associated.
    */
    SENTENCE_OBJECT_LINKING: Ki.State.plugin('MySystem.SENTENCE_OBJECT_LINKING'),
    
    checkDiagramAgainstConstraints: function () {
      var rules = MySystem.activityController.get('diagramRules'),
          nodes = MySystem.store.find(MySystem.Node),
          suggestions = [];

      rules.forEach( function (rule) {
        if (!rule.check(nodes)) {
          suggestions.pushObject(rule.get('suggestion'));
        }
      });
      
      if (suggestions.get('length') > 0){
        SC.AlertPane.warn({
          description: suggestions.join(" \n")
        });
      }
      else {
        SC.AlertPane.info({
          description: "Your diagram has no obvious problems."
        });
      }
    }
    
  })
});
