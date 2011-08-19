/*globals MySystem */
sc_require('migrations/migrations');
MySystem.migrations.testCases = MySystem.migrations.testCases || [];

MySystem.migrations.testCases.push({
  name: "example1",
  
  output: {
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
