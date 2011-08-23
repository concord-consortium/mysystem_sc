/*globals MySystem describe beforeEach afterEach it RaphaelViews DiagramBuilder*/

describe("The Inspector Pane", function () {
  var appPane, diagramBuilder, nodes, links, node1, node2, link1;

  beforeEach( function() {
    MySystem.setupStore(MySystem);
    MySystem.statechart.initStatechart();

    appPane = SC.PanelPane.create({

      layout: {top: 0, bottom: 0, left: 0, right: 0 },
      contentView: SC.View.design({
        childViews: 'palette diagram'.w(),
        palette: SC.ScrollView.design({
          contentView: MySystem.NodePaletteView.design({
            layout: { top: 0, bottom: 0, width: 140}
          }) 
        }),

        diagram: RaphaelViews.RaphaelCanvasView.design({
          layout: {top: 0, bottom: 0, left: 140, right: 0 },
          classNames: 'diagram-background',
          childViews: 'diagramView'.w(),
          diagramView: MySystem.DiagramView.design({
            content:    MySystem.store.find(MySystem.Diagrammable),
            selectionBinding: 'MySystem.nodesController.selection',
            canvasView:        SC.outlet('parentView')
          })
        })
      })
    });

    appPane.append();

    var authoredContent =
      {
        "type": "mysystem2",
        "prompt": "",
        "modules": [
          {
            "name": "obj1",
            "uuid": "obj1"
          },
          {
            "name": "obj2",
            "uuid": "obj2"
          }
        ],
        "energy_types": [
          {
            "label": "en1",
            "uuid": "en1"
          },
          {
            "label": "en2",
            "uuid": "en2"
          }
        ],
        "diagram_rules": []
      };

      var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
      MySystem.activityController.set('content',activity);

      diagramBuilder = DiagramBuilder.create({
        paletteView: appPane.getPath('contentView.palette.contentView'),
        diagramView: appPane.getPath('contentView.diagram.diagramView')
      });
      SC.run();

      // add a couple of nodes to work with
      diagramBuilder.add('obj1', 100, 100);
      diagramBuilder.add('obj2', 300, 100);

      // and a link between them
      diagramBuilder.connect(0, 'a', 1, 'b', 'en2');

      nodes = MySystem.store.find(MySystem.Node);
      links = MySystem.store.find(MySystem.Link);

      node1 = nodes.firstObject();
      node2 = nodes.lastObject();
      link1 = links.firstObject();
  });

  afterEach(function() {
    appPane.remove();
  });

  describe("the node inspector", function (){
    beforeEach(function() {
      MySystem.nodesController.selectObject(node1);
      SC.run();
    });

    it("should have 1 item", function(){
      expect(diagramBuilder.getInspector().getPath('contentView.nodeForm.childViews.length')).toBe(1);
    });

    it("should update the label", function() {
      var attribute = {key: 'title', type: 'text'};
      var val = diagramBuilder.getInspectorValue(attribute);
      expect(val).toBe('obj1');
      diagramBuilder.setInspectorValue(attribute, 'Something');
      expect(node1.get('title')).toBe('Something');
    });

    xit("should update the description", function() {
      var attribute = {key: 'description', type: 'text'};
      expect(diagramBuilder.getInspectorValue(attribute)).toBe(null);
      diagramBuilder.setInspectorValue(attribute, 'Something');
      expect(node1.get('description')).toBe('Something');
    });
  });

  describe("the link inspector", function (){
    beforeEach(function() {
      MySystem.nodesController.selectObject(link1);
      SC.run();
    });

    it("should have 1 item", function(){
      // the energy radio buttons
      expect(diagramBuilder.getInspector().getPath('contentView.linkForm.childViews.length')).toBe(1);
    });

    it("should update the energy type", function() {
      var attribute = {key: 'energy', type: 'radio'};
      expect(diagramBuilder.getInspectorValue(attribute)).toBe('en2');
      diagramBuilder.setInspectorValue(attribute, 'en1');
      expect(link1.get('energyType')).toBe('en1');
    });
  });
});
