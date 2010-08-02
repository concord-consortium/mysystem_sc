// ==========================================================================
// Project:   MySystem.Node Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/node');

MySystem.Node.FIXTURES = [

  { guid: '1',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png',
    title: 'A Node',
    inLinks: [],
    outLinks: ['link1', 'link2']
  },
  
  { guid: '2',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
    title: 'B Node',
    inLinks: ['link1'],
    outLinks: []
  },
  
  { guid: '3',
    image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png',
    title: 'Third Node',
    inLinks: ['link2'],
    outLinks: []
  }
];
