/*globals MySystem RaphaelViews describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor
 clickOn fillIn defineJasmineHelpers runBeforeEach runAfterEach firePointerEvent simulateDoubleClick simulateTextEntry
 simulateKeyPress*/

defineJasmineHelpers();

xdescribe ("A node with an editable label", function() {
  var appPane, diagram, palette, node, nodeView, titleView;
  var leftX, topY, offset;

  beforeEach( function() {

    // setup App:
    MySystem.setupStore(MySystem);
    MySystem.statechart.initStatechart();

    // create one test node:
    node = MySystem.store.createRecord(MySystem.Node, {
      title:    'test title',
      image:    'http://t0.gstatic.com/images?q=tbn:ANd9GcTff7_LQeEuPCEtb0AGSwAH-S5rNoQ3US7yOoxdQpjrUtlqh7zKrg',
      x:        50,
      y:        50,
      nodeType: 'MySystem2'
    });

    // create minimum set of views:
    appPane = SC.PanelPane.create({
      layout: {top: 0, bottom: 0, left: 0, right: 0 },
      contentView: SC.View.design({
        childViews: 'diagram'.w(),
        diagram: RaphaelViews.RaphaelCanvasView.design({
          layout: {top: 0, bottom: 0, left: 0, right: 0 },
          classNames: 'diagram-background',
          childViews: 'nodeView'.w(),
          diagramView: MySystem.DiagramView.design({
            content:    MySystem.store.find(MySystem.Diagrammable),
            selectionBinding: 'MySystem.nodesController.selection',
            canvasView:        SC.outlet('parentView')
          }),
          nodeView: MySystem.NodeView.design({
            content: node
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

      diagram   = appPane.getPath('contentView.diagram.diagramView');
      nodeView  = appPane.getPath('contentView.diagram.nodeView');
      titleView = appPane.getPath('contentView.diagram.nodeView.titleView');
      SC.run();
  });

  afterEach(function() {
    appPane.remove();
  });

  it("should have a node", function(){
    expect(nodeView).toBeDefined();
  });

  it("should have a label", function(){
    expect(titleView).toBeDefined();
  });

  describe("editing the label", function () {


    beforeEach( function () {
      offset = $(titleView.get('layer')).offset();
      leftX  = offset.left;
      topY   = offset.top;
    });

    describe("when not being edited", function () {
      beforeEach(function () {
        // ensure that we are not editing:
        firePointerEvent(titleView, 'mouseExited', 0, 0);
        SC.run( function () { titleView.commitEditing(); });
      });

      it("should not be in the edit mode", function () {
        expect(titleView.get('isEditing')).toEqual(NO);
      });

      it("should not have a highlighted background", function () {
        expect(titleView.getPath('editBoxView.isVisible')).toEqual(NO);
      });
    });

    describe("after a double click", function () {
      beforeEach(function () {
        // ensure that we aren't editing at the outset
        SC.run( function () { titleView.commitEditing(); });
        simulateDoubleClick(titleView);
      });

      it("should be in the edit mode", function () {
        expect(titleView.getPath('isEditing')).toEqual(YES);
      });

      it("should have a highlighted background", function () {
        expect(titleView.getPath('editBoxView.isVisible')).toEqual(YES);
      });

      describe("entering some text", function () {
        var existingText,
            textToEnter,
            expectedText,
            i;

        beforeEach( function () {
          existingText = titleView.get('text');
          textToEnter  = "testing testing\n 1 2 3";
        });

        describe("when the label is all selected", function () {
          beforeEach( function () {
            nodeView.setPath('titleView.isAllSelected', YES);
            expectedText = textToEnter;
            simulateTextEntry(titleView,textToEnter);
          });

          it("should now have the new text in the label", function () {
            expect(titleView.get('text')).toEqual(expectedText);
          });
          
          it("should have updated the model", function () {
            expect(node.get('title')).toEqual(expectedText);
          });
        });

        describe("when the label is not all selected", function () {
          beforeEach( function () {
            nodeView.setPath('labelBodyView.titleView.isAllSelected', NO);
            expectedText = existingText + textToEnter;
            for (i = 0; i < textToEnter.length; i++) {
              simulateKeyPress(titleView,textToEnter.charCodeAt(i));
            }
          });

          it("should now have the new text in the label", function () {
            expect(titleView.get('text')).toEqual(expectedText);
          });
        }); // when the label is not all selected
      });   // entering some text
    });     // after double clicking

    describe ("when the title field of the node is empty", function() {
      beforeEach(function () {
        node.set('title',"");
        SC.run( function() {
          titleView.set('isEditing',NO);
          titleView.set('isAllSelected',NO);
        });
      });

      describe("the nodes label", function() {
        it("should display 'click to edit'", function() {
          expect(titleView.get('displayText')).toMatch(/click to edit/);
        });

        it("should still present a double-clickable target which enables editing", function() {
          expect(titleView.get('isEditing')).toBe(NO);
          SC.run( function() {
            simulateDoubleClick(titleView);
          });
          // after we have double clicked title view, we shoudl be in edit mode
          expect(titleView.get('isEditing')).toBe(YES);
          expect(titleView.get('displayText')).toNotMatch(/click to edit/);
          expect(titleView.get('displayText')).toMatch(/_/);
        });
      });
    }); // title field is empty

  });
});

