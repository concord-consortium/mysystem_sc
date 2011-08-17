/*globals MySystem RaphaelViews describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor
 clickOn fillIn defineJasmineHelpers runBeforeEach runAfterEach */

defineJasmineHelpers();
var itShouldBehaveCorrectly, itShouldDragCorrectly;
$(function () { $('body').css('overflow', 'auto'); });


describe("LabelView behavior", function () {

  var pane = SC.MainPane.create(),
      nodeController,
      diagramView,
      xAxis,
      yAxis;

  beforeEach( function () {
    this.addMatchers({

      toBeInside: function (element) {
        if (element.jquery) element = element[0];
        return $.contains(element, this.actual);
      },

      toApproximatelyEqual: function (qty, tolerance) {
        if (tolerance === undefined) tolerance = 0.001;
        return Math.abs(qty - this.actual) < tolerance;
      },

      toBeNonzero: function () {
        return (parseFloat(this.actual) === this.actual) && (Math.abs(this.actual) > 0);
      },

      toHaveColor: function (hexColor) {
        var actual = this.actual.jquery ? this.actual : $(this.actual);
        return actual.css('color') === $('<div>').css('color', hexColor).css('color');
      },

      toBeVisible: function () {
        return !!this.actual.get('isVisible');
      },

      toBeWithinOneUnitOf: function (value) {
        return Math.abs(this.actual - value) <= 1;
      },
    }); // addMatchers

  }); // beforeEach


  runBeforeEach( function () {
    nodeController = MySystem.NodeController.create();
    nodeController.clear();

    diagramView = MySystem.DiagramView.create({ 
        nodeController: nodeController,
        layout: { 
          width: 800, 
          height: 600 
        }
    });

    pane.append();
    pane.appendChild(diagramView);
  });

  runAfterEach( function () {
    pane.removeAllChildren();
    pane.remove();
  });

  describe("when a label annotation has been added to the graph controller", function () {

    var store,
    nodeRecord;

    runBeforeEach( function () {
      store = SC.Store.create().from(SC.FixturesDataSource.create());

      nodeRecord = store.createRecord(MySystem.Node, {
        name: 'the name of the label',
        text: 'test text',
        x: 1,
        y: 2,
      });

    });

    describe("the node view", function () {
      var nodeView;

      beforeEach( function () {
        nodeView = diagramView.getPath('annotationsHolder.childViews').objectAt(0);
      });

      it("should be the correct class for a Node object", function () {
        expect(nodeView).toBeA(MySystem.Node.viewClass);
      });

      // describe("editing the label", function () {
      //   var leftX,
      //   topY,
      //   offset,
      //   labelTextView,
      //   target;

      //   function fireEvent(el, eventName, x, y) {
      //     var evt = SC.Event.simulateEvent(el, eventName, { pageX: leftX + x, pageY: topY + y });
      //     SC.Event.trigger(el, eventName, evt);
      //   }

      //   function simulateKeyPress(el, letter) {
      //     var evt = SC.Event.simulateEvent(el, 'keydown', { charCode: letter, which: letter });
      //     SC.Event.trigger(el, 'keydown', evt);
      //     evt = SC.Event.simulateEvent(el, 'keypress', { charCode: letter, which: letter });
      //     SC.Event.trigger(el, 'keypress', evt);
      //     evt = SC.Event.simulateEvent(el, 'keyup', { charCode: letter, which: letter });
      //     SC.Event.trigger(el, 'keyup', evt);
      //   }

      //   beforeEach( function () {
      //     target = nodeView.get('labelBodyView');
      //     offset = $(target.get('layer')).offset();
      //     leftX  = offset.left;
      //     topY   = offset.top;
      //   });

      //   describe("when not being edited", function () {
      //     beforeEach(function () {
      //       labelTextView = nodeView.getPath('labelBodyView.labelTextView');
      //       fireEvent(target.get('layer'), 'mouseExited', 0, 0);
      //       SC.run( function () { labelTextView.commitEditing(); });
      //     });
      //     it("should not be in the edit mode", function () {
      //       expect(nodeView.getPath('labelBodyView.labelTextView.isEditing')).toEqual(NO);
      //     });

      //     it("should not have a highlighted background", function () {
      //       expect(nodeView.getPath('labelBodyView.labelTextView.editBoxView.isVisible')).toEqual(NO);
      //     });
      //   });

      //   describe("after a double click", function () {
      //     beforeEach(function () {
      //       labelTextView = nodeView.getPath('labelBodyView.labelTextView');
      //       // ensure that we aren't editing at the outset
      //       SC.run( function () { labelTextView.commitEditing(); });
      //       fireEvent(target.get('layer'), 'mousedown', 10,10);
      //       fireEvent(target.get('layer'), 'mouseup', 10,10);
      //       fireEvent(target.get('layer'), 'mousedown', 10,10);
      //       fireEvent(target.get('layer'), 'mouseup', 10,10);
      //     });

      //     it("should be in the edit mode", function () {
      //       expect(nodeView.getPath('labelBodyView.labelTextView.isEditing')).toEqual(YES);
      //     });

      //     it("should have a highlighted background", function () {
      //       expect(nodeView.getPath('labelBodyView.labelTextView.editBoxView.isVisible')).toEqual(YES);
      //     });

      //     describe("entering some text", function () {
      //       var existingText,
      //       textToEnter,
      //       expectedText,
      //       i;

      //       beforeEach( function () {
      //         existingText = labelTextView.get('text');
      //         textToEnter  = "testing testing\n 1 2 3";
      //       });

      //       describe("when the label is all selected", function () {
      //         beforeEach( function () {
      //           nodeView.setPath('labelBodyView.labelTextView.isAllSelected', YES);
      //           expectedText = textToEnter;
      //           for (i = 0; i < textToEnter.length; i++) {
      //             simulateKeyPress(target.get('layer'),textToEnter.charCodeAt(i));
      //           }
      //         });

      //         it("should now have the new text in the label", function () {
      //           expect(labelTextView.get('text')).toEqual(expectedText);
      //         });
      //       });

      //       describe("when the label is not all selected", function () {
      //         beforeEach( function () {
      //           nodeView.setPath('labelBodyView.labelTextView.isAllSelected', NO);
      //           expectedText = existingText + textToEnter;
      //           for (i = 0; i < textToEnter.length; i++) {
      //             simulateKeyPress(target.get('layer'),textToEnter.charCodeAt(i));
      //           }
      //         });

      //         it("should now have the new text in the label", function () {
      //           expect(labelTextView.get('text')).toEqual(expectedText);
      //         });

      //       });

      //       describe("leaving editing mode", function () {
      //         var x,
      //         y;

      //         beforeEach( function () {
      //           x = labelTextView.get("x");
      //           y = labelTextView.get("y");
      //           SC.run( function () { labelTextView.commitEditing(); });
      //         });

      //         it ("the label text should not change its position after editing", function () {
      //           expect(labelTextView.get("x")).toBeWithinOneUnitOf(x);
      //           expect(labelTextView.get("y")).toBeWithinOneUnitOf(y);
      //         });

      //       });

      //     });
      //   });
      // }); // editing the label

    });
  });
});

