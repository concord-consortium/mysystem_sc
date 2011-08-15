// ==========================================================================
// Project:   MySystem.DIAGRAM_OBJECT_EDITING
// Copyright: ©2011 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem */

/** 

  This state is entered when a new link is being added

*/
MySystem.ADDING_LINK = SC.State.design({
  
  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
    
    var selection = MySystem.nodesController.get('allSelected');
    if ((selection.get('length') == 1) && selection.firstObject().get('linkStyle') && !selection.firstObject().get('energyType')) {
      // Set up the property editor pane and attach it
      this.setUpInspectorPane();
      
      this._selectedLink = selection.firstObject();
      this._selectedLink.addObserver('energyType', this, '_energyTypeChanged');
    } else {
      this.gotoState('DIAGRAM_OBJECT_EDITING');
    }
  },
  
  _selectedLink: null,
  
  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
    // Detatch property editor pane and clean it up
    this.tearDownInspectorPane();
  },
  
  /**
    Set up the property pane attributes and attach it.
  */
  setUpInspectorPane: function () {
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    inspector.set('isOptionsForNewLink', YES);
    inspector.set('isModal', YES);
    if (!inspector.isPaneAttached) {
      inspector.append();
    }
  },
  
  _energyTypeChanged: function() {
    this._selectedLink.removeObserver('energyType', this, '_energyTypeChanged');
    this.gotoState('DIAGRAM_OBJECT_EDITING');
  },
  
  /**
    Re-set the property pane attributes and remove it from the page.
  */
  tearDownInspectorPane: function () {
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    if (inspector.isPaneAttached) {
      inspector.remove();
    }
  }
});
