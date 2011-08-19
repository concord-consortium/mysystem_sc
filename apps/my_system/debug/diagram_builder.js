/*globals DiagramBuilder MySystem simulateDoubleClick simulateTextEntry*/
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
        paletteItemView = this.paletteView.itemViewForContentObject(paletteItem),
        paletteItemOffset = paletteItemView.$().offset(),
        diagramOffset = this.diagramView.$().offset(),
        downEvt, draggedEvt, upEvt;

    // The offset is adjusted so the resulting node.x and node.y matches exactly what is passed in
    diagramX = diagramX + diagramOffset.left - MySystem.NodeView.DROP_OFFSET.x;
    diagramY = diagramY + diagramOffset.top -  MySystem.NodeView.DROP_OFFSET.y;
    
    downEvt =    SC.Event.simulateEvent(paletteItemView.get('layer'), 'mousedown', 
      {pageX: paletteItemOffset.left, pageY: paletteItemOffset.top});
    draggedEvt = SC.Event.simulateEvent(null, 'mousedragged', 
      {pageX: diagramX, pageY: diagramY});
    upEvt =      SC.Event.simulateEvent(null, 'mouseup', 
      {pageX: diagramX, pageY: diagramY});

    SC.RunLoop.begin();
    paletteItemView._startDrag(downEvt);
    SC.RunLoop.end();

    SC.RunLoop.begin();
    paletteItemView._drag.mouseDragged(draggedEvt);
    SC.RunLoop.end();

    SC.RunLoop.begin();
    paletteItemView._drag.mouseUp(upEvt);
    SC.RunLoop.end();
  },
  
  title: function(nodeIdx, title) {
    var diagramItemViews = this.diagramView.get('childViews'),
        nodeViews = diagramItemViews.filter(function(v){return v instanceof MySystem.NodeView;}),        
        nodeView = nodeViews.objectAt(nodeIdx),
        titleView = nodeView.get('titleView');
    
    simulateDoubleClick(titleView);
    simulateTextEntry(titleView,title);
  }
});