/*globals MySystem IntegrationTestHelper describe beforeEach afterEach it */

describe("The learner data", function(){
  var helper = IntegrationTestHelper.create({
    learnerData: {
      "MySystem.Link": {
        "link1": {
          "guid": "link1",
          "text": "First link",
          "startNode": "1",
          "startTerminal": "a",
          "endNode": "2",
          "endTerminal": "b",
          "color": "#FF0000"
        },
        "link2": {
          "guid": "link2",
          "text": "Second link",
          "startNode": "1",
          "startTerminal": "a",
          "endNode": "3",
          "endTerminal": "b",
          "color": "#FF0000"
        }
      },
      "MySystem.Node": {
        "1": {
          "guid": "1",
          "image": "/static/my_system/en/current/source/resources/clay_red_tn.png",
          "title": "A Node",
          "inLinks": [],
          "outLinks": [
            "link1",
            "link2"
          ],
          "x": 160,
          "y": 160
        },
        "2": {
          "guid": "2",
          "image": "/static/my_system/en/current/source/resources/hand_tn.png",
          "title": "B Node",
          "inLinks": [
            "link1"
          ],
          "outLinks": [],
          "x": 310,
          "y": 10
        },
        "3": {
          "guid": "3",
          "image": "/static/my_system/en/current/source/resources/lightbulb_tn.png",
          "title": "Third Node",
          "inLinks": [
            "link2"
          ],
          "outLinks": [],
          "x": 10,
          "y": 10
        }
      },
      "MySystem.Story": {
        "1": {
          "guid": 1,
          "storyHtml": "<p>Make a system diagram to help explain how <i>both</i> the sun and people's actions affect the Earth's climate.</p><ul><li>Where does energy come from?</li><li>How does energy move?</li><li>Where does energy go?</li><li>How does energy change?</li></ul>"
        }
      },
      "MySystem.StorySentence": {
        "ss1": {
          "guid": "ss1",
          "order": 1,
          "bodyText": "First..."
        },
        "ss2": {
          "guid": "ss2",
          "order": 2,
          "bodyText": "Then..."
        },
        "ss3": {
          "guid": "ss3",
          "order": 3,
          "bodyText": "Finally..."
        }
      },
      "version": 2
    }
  });
  
  
  beforeEach(function(){
    helper.setupApp();
  });
  
  afterEach(function(){
    helper.teardownApp();
  });

  it("should load in without error", function(){
    // the main method should have loaded the learner data
    var nodes = MySystem.store.find(MySystem.Node);
    var links = MySystem.store.find(MySystem.Link);
    expect(nodes.length()).toBe(3);
    expect(links.length()).toBe(2);
  });

  it("should load again without error", function(){
    // the main method should have loaded the learner data
    var nodes = MySystem.store.find(MySystem.Node);
    var links = MySystem.store.find(MySystem.Link);
    expect(nodes.length()).toBe(3);
    expect(links.length()).toBe(2);
  });

  it("should be saved when the containing app requests it", function(){
    // preSave
    MySystem.preExternalSave();

    // pull content out of dom like containing app has too
    var savedLearnerData = helper.get('domIO').textContent;
    var parsedLearnerData = JSON.parse(savedLearnerData);
    
    // This should be updated if you change the learner data version
    expect(parsedLearnerData.version).toBe(3);
  });
});