// ==========================================================================
// Project:   MySystem.Node Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/node');

MySystem.Node.FIXTURES = [

  { guid: '1',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png',
    title: 'First Node',
    inputs: [],
    outputs: [2,3]
  },
  
  { guid: '2',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
    title: 'Second Node',
    inputs: [1],
    output: []
  },
  
  { guid: '3',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
    title: 'Third Node',
    inputs: [1],
    output: []
  }
];
