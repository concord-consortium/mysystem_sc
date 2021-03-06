/*globals MySystem */
sc_require('migrations/migrations');
MySystem.migrations.testCases = MySystem.migrations.testCases || [];

MySystem.migrations.testCases.push({
  name: "example1",

  // explicitly specify which version we're converting from, so that our test of a single migration method doesn't have 
  // to know how to infer the learner data version from the input data (which it shouldn't have to do; and besides
  // which it might do wrong)
  inputVersion: 1,

  input: {
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
        "transformer": false,
        "inLinks": [],
        "outLinks": [
          "link1",
          "link2"
        ],
        "position": {
          "x": 160,
          "y": 160
        },
        "transformations": [
          "trans1"
        ]
      },
      "2": {
        "guid": "2",
        "image": "/static/my_system/en/current/source/resources/hand_tn.png",
        "title": "B Node",
        "transformer": false,
        "inLinks": [
          "link1"
        ],
        "outLinks": [],
        "position": {
          "x": 310,
          "y": 10
        }
      },
      "3": {
        "guid": "3",
        "image": "/static/my_system/en/current/source/resources/lightbulb_tn.png",
        "title": "Third Node",
        "transformer": false,
        "inLinks": [
          "link2"
        ],
        "outLinks": [],
        "position": {
          "x": 10,
          "y": 10
        }
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
    }
  }
});
