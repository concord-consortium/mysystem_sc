// ==========================================================================
// Project:   MySystem.Link Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/link');

MySystem.Link.FIXTURES = [

  { guid: 'link1',
    text: 'First link',
    startNode: '1',
    startTerminal: 'a',
    endNode: '2',
    endTerminal: 'b',
    color: '#00ff00'
  },

  { guid: 'link2',
    text: 'Second link',
    startNode: '1',
    startTerminal: 'a',
    endNode: '3',
    endTerminal: 'b',
    color: '#ff0000'
  }

];
