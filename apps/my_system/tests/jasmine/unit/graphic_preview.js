/*globals MySystem defineJasmineHelpers describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor runAfterEach runBeforeEach */

defineJasmineHelpers();

describe("GraphicPreview", function (){
  var recordType;
  var graphicPreview;

  var fake_svg                   = "<svg><fake></fake></svg>";
  var compressed_data            = new LZ77().compress(fake_svg);
  var escaped_compressed_data    = escape(compressed);

  MySystem.setupStore(MySystem);    
  describe("instance", function() {
    beforeEach( function() {
      graphicPreview = MySystem.GraphicPreview.instance(MySystem.store);
      spyOn(graphicPreview, 'getExporter').andCallFake(function (dtata) {
        return ({
          get_svg: function() {
            graphicPreview.got_svg = true;
            return fake_svg;
          }
        });
      });
    });

    describe("updatePreview", function() {
      it ("should result in compressed svg data being saved", function() {
        graphicPreview.updatePreview();
        expect(graphicPreview.get('svg')).toBe(escaped_compressed_data);
      });
    });

  });
  
});
