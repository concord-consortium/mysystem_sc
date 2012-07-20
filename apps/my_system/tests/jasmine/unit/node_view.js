/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor */

// defineJasmineHelpers();
NodeContent = SC.Object.create({  
  image: sc_static('resources/lightbulb_tn.png'),
  nodeWidth: 104,
  nodeHeight: 104,
  terminalRadius: 12,
  enableNodeLabelDisplay: YES,
  title: "node title",
  x: 0,
  y: 0
});


var parent_width  = 200;
var parent_height = 200;

describe("Diagram BackgroundView", function () {
  var nodeView, pane, activityController;

  beforeEach(function() {
    nodeView = MySystem.NodeView.create({
      bodyWidthBinding:  SC.Binding.oneWay("NodeContent.nodeWidth"),
      bodyHeightBinding: SC.Binding.oneWay("NodeContent.nodeHeight"),
      terminalRadiusBinding: SC.Binding.oneWay("NodeContent.terminalRadius"),
      enableNodeLabelDisplayBinding: SC.Binding.oneWay("NodeContent.enableNodeLabelDisplay"),
      content: NodeContent
    });

    pane = SC.PanelPane.create({
      
      layout: {top: 0, bottom: 0, left: 0, right: 0 },
      contentView: SC.View.design({
        childViews: 'diagram'.w(),
        diagram: RaphaelViews.RaphaelCanvasView.design({
          layout: {top: 0, bottom: 0, width: parent_width, height: parent_height },
          childViews: 'nv'.w(),
          nv: nodeView
        })
      })
    });
    pane.append();
    SC.run();
    waitsFor(function() {
      return (nodeView.get('imageHeight') > 40);
    });
  });

  afterEach(function() {
    pane.remove();
  });

  describe ('title display enabled', function() {
    beforeEach(function() {
      NodeContent.set('enableNodeLabelDisplay',YES);
    });

    it("the titled to be set", function() {
      expect($(nodeView.layer()).text()).toBe("node title");
    });
    it("the title is displayed", function() {
      expect($(nodeView.layer()).find('text').parent('g').isVisible()).toBe(true);
    });
  });

  describe ('title display disabled', function() {
    beforeEach(function() {
      SC.run(function() {
        NodeContent.set('enableNodeLabelDisplay',NO);  
      });
    });

    it("the titled is hidden", function() {
      expect($(nodeView.layer()).find('text').parent('g').isVisible()).toBe(false);
    });
  });


});
