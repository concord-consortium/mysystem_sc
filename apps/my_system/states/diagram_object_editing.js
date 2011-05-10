// ==========================================================================
// Project:   MySystem.DIAGRAM_OBJECT_EDITING
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  A state to handle the editing of properties of specific diagram objects.

  At the current time, that only means links (node titles can be edited in place) because link colors
  need the property editor pane for color selection. 

  The state opens the property editor pane and sets it up, then tears it down and returns to the 
  DIAGRAM_EDITING state when the object being edited is no longer selected.

*/
MySystem.DIAGRAM_OBJECT_EDITING = Ki.State.design({
  
  /**
    Set up the property pane attributes and attach it.
  */
  setUpPropertyPane: function () {
    var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
    var selectedObject = MySystem.nodesController.get('allSelected').firstObject();
    if (!propertyEditor.isPaneAttached) {
      propertyEditor.append();
    }
    propertyEditor.set('objectToEdit', selectedObject);
  },
  
  /**
    Delete the object being edited.
  */
  deleteObject: function () {
    var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
    propertyEditor.get('objectToEdit').destroy();
    return YES;
  },
  
  /**
    Re-set the property pane attributes and remove it from the page.
  */
  tearDownPropertyPane: function () {
    var propertyEditor = MySystem.getPath('mainPage.propertyViewPane');
    if (propertyEditor.isPaneAttached) {
      propertyEditor.remove();
    }
    propertyEditor.set('objectToEdit', null);
  },

  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
    // Set up the property editor pane and attach it
    this.setUpPropertyPane();
  },
  
  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
    // Detatch property editor pane and clean it up
    this.tearDownPropertyPane();
  },
  
  /**
    Deal with diagram selection update events.
  */
  diagramSelectionChanged: function () {
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
    return YES;
  }
});
