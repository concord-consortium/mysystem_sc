/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor */

// defineJasmineHelpers();
MocActivityController = SC.Object.create({
  // backgroundImage: "http://www.vmapas.com/maps/2746-4/Satellite_Image_Western_World.jpg",
  backgroundImage: sc_static('resources/lightbulb_tn.png'),
  backgroundImageScaling: NO
});

var parent_width  = 200;
var parent_height = 200;

describe("Diagram BackgroundView", function () {
  var bgView, pane, activityController;

  beforeEach(function() {
    bgView = MySystem.DiagramBackgroundView.create({
      layout: {top: 0, bottom: 0, width: 100, height: 0 },
      imageUrlBinding: 'MocActivityController.backgroundImage',
      scalingEnabledBinding: SC.Binding.oneWay('MocActivityController.backgroundImageScaling')
    });

    pane = SC.PanelPane.create({
      
      layout: {top: 0, bottom: 0, left: 0, right: 0 },
      contentView: SC.View.design({
        childViews: 'diagram'.w(),
        diagram: RaphaelViews.RaphaelCanvasView.design({
          layout: {top: 0, bottom: 0, width: parent_width, height: parent_height },
          childViews: 'background'.w(),
          background: bgView
        })
      })
    });

    pane.append();
    SC.run();

    waitsFor(function() {
        return (bgView.get('imageDidLoad'));
    }, "Image loading", 15000);

  });

  afterEach(function() {
    pane.remove();
  });

  describe ('an unscaled image', function() {
    it("background image should load", function() {
      expect(bgView.get('imageDidLoad')).toBe(YES);  
    });

    it("should be the (small) uscaled size", function() {
      expect(bgView.layer().attributes.width.value).toBe("49");
    });
  });

  describe ('a scaled image', function() {
    beforeEach(function() {
      MocActivityController.set('backgroundImageScaling',YES);
    });
    it("background image should load", function() {
      expect(bgView.get('imageDidLoad')).toBe(YES);  
    });

    it("should be the larger, scaled-up size", function() {
      // our source image vertical in orientation.
      // so we expect the height to fit exactly.
      expect(bgView.layer().attributes.height.value).toBe(parent_height.toString());
    });

  });


});
