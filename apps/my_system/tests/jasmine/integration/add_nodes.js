/*globals MySystem describe beforeEach afterEach it RaphaelViews */

describe("Adding nodes by dragging", function () {
  var appPane, diagram, palette;
  
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

      diagram = appPane.getPath('contentView.diagram.diagramView');
      palette = appPane.getPath('contentView.palette.contentView');
      SC.run();
  });
  
  afterEach(function() {
    appPane.remove();
  });
  
  it("should have 2 palette items", function(){
    expect(palette.getPath('childViews.length')).toBe(2);
  });
  
  it("should create a new node", function(){
    var paletteItemView = palette.get('childViews').objectAt(0),
        downEvt =    SC.Event.simulateEvent(paletteItemView.get('layer'), 'mousedown', 
          {pageX: 10, pageY: 10}),
        draggedEvt = SC.Event.simulateEvent(null, 'mousedragged', 
          {pageX: 300, pageY: 300}),
        upEvt =      SC.Event.simulateEvent(null, 'mouseup', 
          {pageX: 300, pageY: 300}),
        nodes = MySystem.store.find(MySystem.Node);
        
    expect(nodes.get('length')).toBe(0);
  
    SC.RunLoop.begin();
    paletteItemView._startDrag(downEvt);
    SC.RunLoop.end();
    
    SC.RunLoop.begin();
    paletteItemView._drag.mouseDragged(draggedEvt);
    SC.RunLoop.end();
    
    SC.RunLoop.begin();
    paletteItemView._drag.mouseUp(upEvt);
    SC.RunLoop.end();
    
    expect(nodes.get('length')).toBe(1);
  });
  
  /**
    possible example of concise way to build diagram by actions
    [
      {type:'drag', source:'paletteItem[0]', down: [10,10], up: [300,300]}
      {type:'drag', source:'node[0].terminalA', down: [310,310], up: [350,350]}
      {type:'click', source:'link[0]'}
    ]
   **/
});