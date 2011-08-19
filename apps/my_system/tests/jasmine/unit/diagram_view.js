/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor */

describe("DiagramView", function () {
  var node1, node2, newLinkb, newLinka, diagram, diagramPane;
  beforeEach( function() {
    MySystem.setupStore(MySystem);

    node1    = MySystem.store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': '/lightbulb_tn.png', 'transformer': false });
    node2    = MySystem.store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': '/lightbulb_tn.png', 'transformer': false });
    newLinkb = MySystem.store.createRecord(MySystem.Link, { 'text': 'Link to test node' });
    newLinkb.set("endNode", node1);
    newLinkb.set("startNode", node2);
    newLinkb.set("endTerminal","a");
    newLinkb.set("startTerminal","b");

    newLinka = MySystem.store.createRecord(MySystem.Link, { 'text': 'Link to test node', 'color': '0xFF0000' });
    newLinka.set("startNode", node1);
    newLinka.set("endNode", node2);
    newLinka.set("startTerminal","a");
    newLinka.set("endTerminal","b");

    diagramPane = SC.PanelPane.create({
      layout: {top: 0, bottom: 0, left: 0, right: 0 },
      contentView: RaphaelViews.RaphaelCanvasView.design({
        layout: {top: 0, bottom: 0, left: 0, right: 0 },
        classNames: 'diagram-background',
        childViews: 'diagramView'.w(),
        diagramView: MySystem.DiagramView.design({
          content:    MySystem.store.find(MySystem.Diagrammable),
          selectionBinding: 'MySystem.nodesController.selection',
          canvasView:        SC.outlet('parentView')
        })
      })
    });

    diagramPane.append();

    diagram = diagramPane.getPath('contentView.diagramView');
  });

  afterEach(function() {
    diagramPane.remove();
  });

  it("should have both LinkView and NodeView objects in the item views", function () {
    var content = MySystem.store.find(MySystem.Diagrammable);

    var linkCount = 0;
    var nodeCount = 0;
    var dCount = 0;
    content.map(function(item) {
      var itemView = diagram.itemViewForContentObject(item);
      if (SC.kindOf(itemView, MySystem.LinkView)) { linkCount++; }
      else if (SC.kindOf(itemView, MySystem.NodeView)) { nodeCount++; }
      else { dCount++; }
    });

    expect(linkCount).toBe(2);
    expect(nodeCount).toBe(2);
    expect(dCount).toBe(0);
  });
});
