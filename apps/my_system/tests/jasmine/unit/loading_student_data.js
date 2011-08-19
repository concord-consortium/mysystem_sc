/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor NO YES*/

describe("LoadingStudentData", function () {
  
  beforeEach( function () {
    MySystem.setupStore(MySystem);    
  });
  
  it("should load and corrrectly migrate version-1 student nodes and links", function () {
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
              text: "test",
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
        },
        
        migratedData = MySystem.migrations.migrateLearnerData(studentData);

    MySystem.store.setStudentStateDataHash(migratedData);
    
    var nodes = MySystem.store.find(MySystem.Node);
    var links = MySystem.store.find(MySystem.Link);
    expect(nodes.length()).toBe(2);
    expect(links.length()).toBe(1);
    
    var firstNode = MySystem.store.find(MySystem.Node, "node100");
    var secondNode = MySystem.store.find(MySystem.Node, "node101");
    var link = MySystem.store.find(MySystem.Link, "link100");
    expect(firstNode).toBeDefined();
    expect(secondNode).toBeDefined();
    expect(link).toBeDefined();
    
    expect(firstNode.get('title')).toBe("Hand");
    expect(firstNode.get('image')).toBe("hand_tn.png");
    expect(firstNode.get('x')).toBe(169);
    expect(firstNode.get('y')).toBe(101);
    expect(firstNode.get('nodeType')).toBe("12553af0-b92c-11e0-a4dd-0800200c9a66");
    expect(firstNode.get('inLinks').length()).toBe(0);
    expect(firstNode.get('outLinks').length()).toBe(1);
    expect(firstNode.get('outLinks').objectAt(0)).toBe(link);
    
    expect(link.get('startNode')).toBe(firstNode);
    expect(link.get('endNode')).toBe(secondNode);
    expect(link.get('startTerminal')).toBe("a");
    expect(link.get('endTerminal')).toBe("b");
    expect(link.get('text')).toBe("test");
    expect(link.get('energyType')).toBe("12553af0-b92c-11e0-a4dd-0800200c9a66");
    expect(link.isSelected).toBeUndefined();
    
    expect(secondNode.get('outLinks').length()).toBe(0);
    expect(secondNode.get('inLinks').length()).toBe(1);
    expect(secondNode.get('inLinks').objectAt(0)).toBe(link);
    
  });
  
  it("should allow new nodes and links to be created", function () {
    var studentData = {
          'MySystem.Link': {
            link100: {
              startNode: "node100",
              startTerminal: "a",
              endNode: "node101",
              endTerminal: "b",
              guid: "link100",
              isSelected: true,
              text: "test",
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
            }
          },
          'MySystem.Story': {},
          'MySystem.StorySentence': {}
        },
        
        migratedData = MySystem.migrations.migrateLearnerData(studentData);
        
    MySystem.store.setStudentStateDataHash(migratedData);
    var link = MySystem.store.createRecord(MySystem.Link, {});
    expect(link).toNotBe(null);
    expect(link.get('id')).toBeDefined();
    var node = MySystem.store.createRecord(MySystem.Node, {});
    expect(node).toNotBe(null);
    expect(node.get('id')).toBeDefined();
  });
  
});
