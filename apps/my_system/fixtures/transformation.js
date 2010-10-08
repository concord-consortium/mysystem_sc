// ==========================================================================
// Project:   MySystem.Transformation Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

sc_require('models/transformation');

MySystem.Transformation.FIXTURES = [

  { guid: 'trans1',
    node: 1,
    inLinkColor: '#ff0000',
    outLinkColor: '#00ff00'
  }
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

  // { guid: 1,
  //   firstName: "Michael",
  //   lastName: "Scott" },
  //
  // { guid: 2,
  //   firstName: "Dwight",
  //   lastName: "Schrute" },
  //
  // { guid: 3,
  //   firstName: "Jim",
  //   lastName: "Halpert" },
  //
  // { guid: 4,
  //   firstName: "Pam",
  //   lastName: "Beesly" },
  //
  // { guid: 5,
  //   firstName: "Ryan",
  //   lastName: "Howard" }

];
