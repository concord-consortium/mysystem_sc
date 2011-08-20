/*globals DiagramBuilder MySystem simulateDoubleClick simulateTextEntry simulateKeyPress simulateBackspace firePointerEvent*/
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
    // figure out how many backspaces to press
    var i, existingChars = titleView.getPath('text.length');
    for (i = 0; i < existingChars; i++) {
      simulateBackspace(titleView);
    }
    simulateTextEntry(titleView,title);
  },
  
  // Note: this will only work if there is 0 or 1 energy types
  //  otherwise a modal dialog comes up that need to be dealt with
  connect: function(startNodeIdx, startTerminal, endNodeIdx, endTerminal) {
    var startNodeView = this._nodeViewAtIndex(startNodeIdx),
        startTerminalView = startNodeView.get('terminal' + startTerminal.toUpperCase()),
        endNodeView = this._nodeViewAtIndex(endNodeIdx),
        endTerminalView = endNodeView.get('terminal' + startTerminal.toUpperCase());
    
    firePointerEvent(startTerminalView, 'mousedown', 0, 0);
    // need to trigger mouseEntered on endNode
    firePointerEvent(endTerminalView, 'mousemove', 0, 0);
    firePointerEvent(startTerminalView, 'mouseup', 0, 0);
  },
  
  _nodeViewAtIndex: function(nodeIdx) {
    var diagramItemViews = this.diagramView.get('childViews'),
        nodeViews = diagramItemViews.filter(function(v){return v instanceof MySystem.NodeView;});
        
    return nodeViews.objectAt(nodeIdx);
  }
});