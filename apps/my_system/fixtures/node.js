// ==========================================================================
// Project:   MySystem.Node Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/node');

MySystem.Node.FIXTURES = [

  { guid: '1',
    image: '',
    title: 'First Node',
    inputs: ['2'],
    outputs: ['2']
  },
  
  { guid: '2',
    image: '',
    title: 'Second Node',
    inputs: ['1'],
    output: ['1']
  }
  
];
