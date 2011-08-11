/*globals MySystem */

sc_require('models/node');

MySystem.Node.FIXTURES = [ 
{
  "guid": "1",
  "image": sc_static('resources/clay_red_tn.png'),
  "title": "A Node",
  "transformer": false,
  "inLinks": [],
  "outLinks": [
    "link1",
    "link2"
  ],
  "x": 160,
  "y": 160,
  // "transformations": [
  //   "trans1"
  // ],
  "nodeType": "030454f0-b92c-11e0-a4dd-0800200c9a66"
},
{
  "guid": "2",
  "image": sc_static('resources/hand_tn.png'),
  "title": "B Node",
  "transformer": false,
  "inLinks": [
    "link1"
  ],
  "outLinks": [],
  "x": 310,
  "y": 10,
  "nodeType": "12553af0-b92c-11e0-a4dd-0800200c9a66"
},
{
  "guid": "3",
  "image": sc_static('resources/lightbulb_tn.png'),
  "title": "Third Node",
  "transformer": false,
  "inLinks": [
    "link2"
  ],
  "outLinks": [],
  "x": 10,
  "y": 10,
  "nodeType": "1e3f7650-b92c-11e0-a4dd-0800200c9a66"
}
];