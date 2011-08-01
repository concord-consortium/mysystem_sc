// ==========================================================================
// Project:   MySystem.DiagramRule Fixtures
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/diagram_rule');

MySystem.DiagramRule.FIXTURES = [
  { guid: 'dr1',
    suggestion: 'Diagram needs at least 3 nodes.',
    comparison: 'more than',
    number: 2,
    type: 'node'
  },
  
  { guid: 'dr2',
    suggestion: 'At least one node must be Clay.',
    comparison: 'more than',
    number: 0,
    type: 'Clay'
  },

  { guid: 'dr3',
    suggestion: 'At least one Clay node linked to a Hand node.',
    comparison: 'more than',
    number: 0,
    type: 'Clay',
    hasLink: true,
    linkDirection: '-->',
    otherNodeType: 'Hand'
  },
  { guid: 'dr4',
    suggestion: 'At least one Bulb node linked to a Hand node by thermal energy.',
    comparison: 'more than',
    number: 0,
    type: 'Bulb',
    hasLink: true,
    linkDirection: '-->',
    otherNodeType: 'Hand',
    energyType: "thermal energy"
  },
  { guid: 'dr5',
    suggestion: 'Diagram needs at least 2 links.',
    comparison: 'more than',
    number: 1,
    type: 'node',
    hasLink: true,
    linkDirection: '---',
    otherNodeType: 'node'
  }
];
