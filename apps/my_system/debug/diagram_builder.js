/*globals DiagramBuilder MySystem simulateDoubleClick simulateTextEntry simulateKeyPress simulateBackspace firePointerEvent 
          simulateClickOnSelector*/
sc_require('debug/event_simulation');

/*
    add('obj1', 100, 100);
    title(0, 'node label');
    add('obj1', 200, 100);
    connect('0.a', '1.b');  // not implemented yet
*/
DiagramBuilder = SC.Object.extend({
  paletteView: null,
  diagramView: null,
  
  // Add a new node to the diagram by dragging it from the paletteView
  add: function(paletteItemTitle, diagramX, diagramY) {
    var query = SC.Query.local(MySystem.PaletteItem, "title = %@", [paletteItemTitle]),
        paletteItem = MySystem.store.find(query).objectAt(0),
        paletteItemView = this.paletteView.itemViewForContentObject(paletteItem);

    // The offset is adjusted so the resulting node.x and node.y matches exactly what is passed in
    diagramX = diagramX - MySystem.NodeView.DROP_OFFSET.x;
    diagramY = diagramY - MySystem.NodeView.DROP_OFFSET.y;
    
    firePointerEvent(paletteItemView, 'mousedown', 0, 0);
    firePointerEvent(paletteItemView, 'mousemove', 0, 0);

    // we have to get the parentView for a consistant offset.  JQueries offset function returns
    // the offset of the visible node so for an svg group that appears to the be offset of its
    // items bounding box.  When there are no items then it is the offset of the parent.
    // not sure if the mousemove is necessary
    firePointerEvent(this.diagramView.get('parentView'), 'mousemove', diagramX, diagramY);
    firePointerEvent(this.diagramView.get('parentView'), 'mouseup', diagramX, diagramY);
  },
  
  title: function(nodeIdx, title) {
    var nodeView = this._nodeViewAtIndex(nodeIdx),
        titleView = nodeView.get('titleView');
    
    simulateDoubleClick(titleView);
    this._replaceText(titleView, title);
  },
  
  // Note: this will only work if there is 0 or 1 energy types
  //  otherwise a modal dialog comes up that need to be dealt with
  connect: function(startNodeIdx, startTerminal, endNodeIdx, endTerminal, energyTypeLabel) {
    var startNodeView = this._nodeViewAtIndex(startNodeIdx),
        startTerminalView = startNodeView.get('terminal' + startTerminal.toUpperCase()),
        endNodeView = this._nodeViewAtIndex(endNodeIdx),
        endTerminalView = endNodeView.get('terminal' + startTerminal.toUpperCase());
    
    firePointerEvent(startTerminalView, 'mousedown', 0, 0);
    // need to trigger mouseEntered on endNode
    firePointerEvent(endTerminalView, 'mousemove', 0, 0);
    firePointerEvent(startTerminalView, 'mouseup', 0, 0);
    
    // select energy type
    this.setInspectorValue({key: 'energy', type: 'radio'}, energyTypeLabel);
  },

  getInspector: function() {
    return MySystem.getPath('mainPage.inspectorPane');
  },

  // attribute is a hash:
  // { key: 'content value key', type: 'type value' }
  // key is the attribute name in which a form view row is stored within the form.
  // currently supported types: 'text', 'radio'
  getInspectorValue: function(attribute) {
    var ret = this._inspectorAttributeControl(attribute, function(inspector, control) {
      if (attribute.type == 'text') {
        return control.get('value');
      } else if (attribute.type == 'radio') {
        return control.get('value');
      }
    });
    return ret;
  },

  setInspectorValue: function(attribute, value) {
    return this._inspectorAttributeControl(attribute, function(inspector, control) {
      SC.Logger.log("control: ", control, " type: ", attribute.type);
      if (attribute.type == 'text') {
        this._replaceText(control, value);
      } else if (attribute.type == 'radio') {
        var radioGroupId = control.getPath('layer.id');
        simulateClickOnSelector('#' + radioGroupId + ' div[role="radio"]:contains(' + value + ')');
      }

      // remove the inspector pane to avoid confusion
      inspector.remove();
      return null;
    });
  },

  _inspectorAttributeControl: function(attribute, callback) {
    var inspector = this.getInspector();
    var ret = null;
    if (inspector.isPaneAttached){
      // first, find the right one
      var forms = inspector.getPath('contentView.childViews');
      found:
      for (var i = 0; i < forms.get('length'); i++) {
        var controls = forms.objectAt(i).get('childViews');
        for (var j = 0; j < controls.get('length'); j++) {
          var attributeControl = controls.objectAt(j);
          if (attributeControl.get('formKey') == attribute.key) {
            SC.Logger.log("Found matching form control: ", attributeControl);
            // call the callback with the actual control, not the form row
            ret = callback.call(this, inspector, attributeControl.getPath('childViews.1'));
            break found;
          }
        }
      }
    }
    return ret;
  },

  _replaceText: function(view, text) {
    if (view instanceof MySystem.EditableLabelView) {
      // figure out how many backspaces to press
      var i, existingChars = view.getPath('text.length');
      for (i = 0; i < existingChars; i++) {
        simulateBackspace(view);
      }
      simulateTextEntry(view, text);
    } else {
      view.set('value', text);
    }
  },

  _nodeViewAtIndex: function(nodeIdx) {
    var diagramItemViews = this.diagramView.get('childViews'),
        nodeViews = diagramItemViews.filter(function(v){return v instanceof MySystem.NodeView;});

    return nodeViews.objectAt(nodeIdx);
  }
});
