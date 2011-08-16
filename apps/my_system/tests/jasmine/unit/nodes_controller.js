/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor */

describe("NodesController", function () {
  beforeEach( function() {
    MySystem.setupStore(MySystem);

    node1    = MySystem.store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': '/lightbulb_tn.png', 'transformer': false });
    node2    = MySystem.store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': '/lightbulb_tn.png', 'transformer': false });
    newLinkb = MySystem.store.createRecord(MySystem.Link, { 'text': 'Link to test node' });
    newLinkb.set("endNode", node1);
    newLinkb.set("startNode", node2);
    newLinkb.set("endTerminal","a");
    newLinkb.set("startTerminal","b");

    newLinka = MySystem.store.createRecord(MySystem.Link, { 'text': 'Link to test node' });
    newLinka.set("startNode", node1);
    newLinka.set("endNode", node2);
    newLinka.set("startTerminal","a");
    newLinka.set("endTerminal","b");

    MySystem.nodesController.set('content', MySystem.store.find(MySystem.Diagrammable));
  });

  it("should have both Link and Node objects in the content array", function () {
    var content = MySystem.nodesController.get('content');
    expect(content.length()).toBe(4);

    var linkCount = 0;
    var nodeCount = 0;
    var dCount = 0;
    content.map(function(item) {
      if (SC.kindOf(item, MySystem.Link)) { linkCount++; }
      if (SC.kindOf(item, MySystem.Node)) { nodeCount++; }
      if (SC.kindOf(item, MySystem.Diagrammable)) { dCount++; }
    });

    expect(linkCount).toBe(2);
    expect(nodeCount).toBe(2);
    expect(dCount).toBe(4);
  });
});
