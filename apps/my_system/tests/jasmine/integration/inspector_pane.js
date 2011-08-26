/*globals MySystem describe beforeEach afterEach it RaphaelViews DiagramBuilder*/

describe("The Inspector Pane", function () {
  var appPane, diagramBuilder, nodes, links, node1, node2, link1;

  function setupStuff(extraAuthoredContent) {
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

    var authoredContent = {
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

    for (var key in extraAuthoredContent) {
      authoredContent[key] = extraAuthoredContent[key];
    }

    var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
    MySystem.activityController.set('content',activity);

    diagramBuilder = DiagramBuilder.create({
      paletteView: appPane.getPath('contentView.palette.contentView'),
      diagramView: appPane.getPath('contentView.diagram.diagramView')
    });
    SC.run();

    // reset the inspector pane each time
    var inspector = MySystem.getPath('mainPage.inspectorPane');
    if (!!inspector) { inspector.destroy(); }
    MySystem.setPath('mainPage.inspectorPane', MySystem.InspectorPane);

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
  }

  describe("Default app settings", function() {
    beforeEach( function() {
      setupStuff({});
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
        // label
        expect(diagramBuilder.getInspector().getPath('contentView.nodeForm.childViews.length')).toBe(1);
      });

      it("should update the label", function() {
        var attribute = {key: 'title', type: 'text'};
        var val = diagramBuilder.getInspectorValue(attribute);
        expect(val).toBe('obj1');
        diagramBuilder.setInspectorValue(attribute, 'Something');
        expect(node1.get('title')).toBe('Something');
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

  describe("Label and description editing enabled", function() {
    beforeEach( function() {
      setupStuff({
        "enableNodeDescriptionEditing": true,
        "enableLinkDescriptionEditing": true,
        "enableLinkLabelEditing": true
      });
    });

    afterEach(function() {
      appPane.remove();
    });

    describe("the node inspector", function (){
      beforeEach(function() {
        MySystem.nodesController.selectObject(node1);
        SC.run();
      });

      it("should have 2 items", function(){
        // label, description
        expect(diagramBuilder.getInspector().getPath('contentView.nodeForm.childViews.length')).toBe(2);
      });

      it("should update the label", function() {
        var attribute = {key: 'title', type: 'text'};
        var val = diagramBuilder.getInspectorValue(attribute);
        expect(val).toBe('obj1');
        diagramBuilder.setInspectorValue(attribute, 'Something');
        expect(node1.get('title')).toBe('Something');
      });

      // FIXME: This should work. It's exactly like the link description editing test below...
      xit("should update the description", function() {
        var attribute = {key: 'description', type: 'text'};
        var val = diagramBuilder.getInspectorValue(attribute);
        expect(val).toBe(null);
        diagramBuilder.setInspectorValue(attribute, 'Something descriptive');
        expect(node1.get('description')).toBe('Something descriptive');
      });
    });

    describe("the link inspector", function (){
      beforeEach(function() {
        MySystem.nodesController.selectObject(link1);
        SC.run();
      });

      it("should have 3 items", function(){
        // the energy radio buttons, label text field, description text area
        expect(diagramBuilder.getInspector().getPath('contentView.linkForm.childViews.length')).toBe(3);
      });

      it("should update the energy type", function() {
        var attribute = {key: 'energy', type: 'radio'};
        expect(diagramBuilder.getInspectorValue(attribute)).toBe('en2');
        diagramBuilder.setInspectorValue(attribute, 'en1');
        expect(link1.get('energyType')).toBe('en1');
      });

      it("should update the label", function() {
        var attribute = {key: 'label', type: 'text'};
        var val = diagramBuilder.getInspectorValue(attribute);
        expect(val).toBe("en2");
        diagramBuilder.setInspectorValue(attribute, 'Some label');
        expect(link1.get('text')).toBe('Some label');
      });

      it("should update the description", function() {
        var attribute = {key: 'description', type: 'text'};
        var val = diagramBuilder.getInspectorValue(attribute);
        expect(val).toBe(null);
        diagramBuilder.setInspectorValue(attribute, 'Something nifty');
        expect(link1.get('description')).toBe('Something nifty');
      });
    });
  });
});
