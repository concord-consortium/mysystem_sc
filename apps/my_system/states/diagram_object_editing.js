// ==========================================================================
// Project:   MySystem.DIAGRAM_OBJECT_EDITING
// Copyright: ©2010 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

/** 

  The statechart describes the states of the systems and how they change in reaction
  to user events. Put another way, the statechart describes the user interface of the
  application.

*/
MySystem.DIAGRAM_OBJECT_EDITING = Ki.State.design({
  
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
});