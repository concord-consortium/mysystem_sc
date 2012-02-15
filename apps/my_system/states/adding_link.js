// ==========================================================================
// Project:   MySystem.ADDING_LINK
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** 

  This state is entered when a new link is being added

*/
MySystem.ADDING_LINK = SC.State.design({
  
  enterState: function () {
    SC.Logger.log("Entering state %s", this.get('name'));
    this._newLink = null;
  },
  
  _newLink: null,
  
  exitState: function () {
    SC.Logger.log("Leaving state %s", this.get('name'));
    // // Detatch property editor pane and clean it up
    MySystem.nodesController.deselectObject(this._newLink);
    this.tearDownInspectorPane();
  },
  
  rubberbandLinkAbandoned: function() {
    this.gotoState('DIAGRAM_EDITING');
  },
  
  rubberbandLinkComplete: function() {
    var node1View = MySystem.nodesController.get('dragLinkSrcTerminal').get('parentView'),
        node2View = MySystem.nodesController.get('dragLinkEndTerminal').get('parentView'),
        node1 = node1View.get('content'),
        node2 = node2View.get('content');
        
    var terminal1 = node1View.get('terminalA') === MySystem.nodesController.get('dragLinkSrcTerminal') ?
        "a" : "b";
    var terminal2 = node2View.get('terminalA') === MySystem.nodesController.get('dragLinkEndTerminal') ?
        "a" : "b";
        
    this.addLink(node1, node2, terminal1, terminal2);
  },
  
  addLink: function(node1, node2, terminal1, terminal2){
    this._newLink = MySystem.store.createRecord(MySystem.Link, {
      color: "#0000FF",
      startTerminal: terminal1,
      endTerminal: terminal2
    });
    
    this._newLink.addObserver('energyType', this, '_energyTypeChanged');
    node1.addInLink(this._newLink);
    node2.addOutLink(this._newLink);
    MySystem.nodesController.selectObject(this._newLink);
    
    var allEnergyTypes = MySystem.activityController.get('energyTypes');
    if (allEnergyTypes.length() > 1){
      this.setUpInspectorPane();
    } else if (allEnergyTypes.length() === 1){
      this._newLink.set("energyType", allEnergyTypes.firstObject().get('uuid'));
    } else {
      this.gotoState('DIAGRAM_EDITING');
    }
  },
  
  /**
    Set up the property pane attributes and attach it.
  */
  setUpInspectorPane: function () {
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    inspector.set('isOptionsForNewLink', YES);
    inspector.set('isModal', YES);
    inspector.set('layout', { centerX: 0, centerY: 0, width: 270, height: 155 });
    if (!inspector.isPaneAttached) {
      inspector.append();
    }
  },
  
  _energyTypeChanged: function() {
    this._newLink.removeObserver('energyType', this, '_energyTypeChanged');
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
