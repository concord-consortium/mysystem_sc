/*globals MySystem defineJasmineHelpers describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor runAfterEach runBeforeEach */

defineJasmineHelpers();

describe("LinkInspector", function (){
  
  describe("link model", function () {
    beforeEach( function() {
      MySystem.setupStore(MySystem);
      var studentData = {
        'MySystem.Link': {
          link100: {
            startNode: "node100",
            startTerminal: "a",
            endNode: "node101",
            endTerminal: "b",
            label: {
              text: "something interesting",
              fontSize: 12,
              fontFamily: "sans-serif",
              fontStyle: "normal",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: 4
            },
            guid: "link100",
            isSelected: true,
            text: "tester text",
            energyType: "12553af0-b92c-11e0-a4dd-0800200c9a66"
          },
          link101: {
            startNode: "node101",
            startTerminal: "a",
            endNode: "node100",
            endTerminal: "b",
            label: {
              text: "something interesting",
              fontSize: 12,
              fontFamily: "sans-serif",
              fontStyle: "normal",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: 4
            },
            guid: "link101",
            isSelected: true,
            text: "my text",
            extendedText: "my description",
            energyType: "12553af0-b92c-11e0-a4dd-0800200c9a66"
          }
        },
        'MySystem.Node': {
          node100: {
            title: "Hand",
            image: "hand_tn.png",
            position: {
              x: 169,
              y: 101
            },
            guid: "node100",
            nodeType: "12553af0-b92c-11e0-a4dd-0800200c9a66",
            outLinks: [
              "link100"
            ]
          },
          node101: {
            title: "Bulb",
            image: "lightbulb_tn.png",
            position: {
              x: 384,
              y: 112
            },
            guid: "node101",
            nodeType: "1e3f7650-b92c-11e0-a4dd-0800200c9a66",
            inLinks: [
              "link100"
            ]
          }
        },
        'MySystem.Story': {},
        'MySystem.StorySentence': {}
      };
      MySystem.store.setStudentStateDataHash(studentData)
    });

    it("should load the old-style hash in correctly", function () {
      var oldLink = MySystem.store.find(MySystem.Link, "link100");
      expect(oldLink).toNotBe(null);
      expect(oldLink.get('text')).toBe("tester text");
      expect(oldLink.get('extendedText')).toBe(null);
    });

    it("should load the new-style hash in correctly", function () {
      var newLink = MySystem.store.find(MySystem.Link, "link101");
      expect(newLink).toNotBe(null);
      expect(newLink.get('text')).toBe("my text");
      expect(newLink.get('extendedText')).toBe("my description");
    });

    MySystem.store = null;
    store = null;
  });

});
