/*globals MySystem describe beforeEach afterEach it RaphaelViews DiagramBuilder*/

describe("The Diagram", function () {
  var appPane, diagramBuilder;
  
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
  });
  
  afterEach(function() {
    appPane.remove();
  });
  
  describe("the palette", function (){
    it("should have 2 items", function(){
      expect(diagramBuilder.paletteView.getPath('childViews.length')).toBe(2);
    });    
  });
  
  describe("dragging a node onto the diagram", function () {
    it("should create a new node", function(){
      var nodes = MySystem.store.find(MySystem.Node);

      expect(nodes.get('length')).toBe(0);

      diagramBuilder.add('obj1', 100, 100);

      expect(nodes.get('length')).toBe(1);

      var node = nodes.objectAt(0);
      expect(node.get('x')).toBe(100);
      expect(node.get('y')).toBe(100);
    });    
  });
  
  describe("editing a node title", function () {
    it("should set the title of the node", function () {
      var nodes = MySystem.store.find(MySystem.Node);
      expect(nodes.get('length')).toBe(0);
      diagramBuilder.add('obj1', 100, 100);
      expect(nodes.get('length')).toBe(1);
      var node = nodes.objectAt(0);
      var newTitle = "new title";
      diagramBuilder.title(0, newTitle);
      expect(node.get('title')).toBe(newTitle);
    });
  });
});