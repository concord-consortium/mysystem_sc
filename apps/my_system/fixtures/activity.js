// ==========================================================================
// Project:   MySystem.Activity Fixtures
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('models/activity');

MySystem.Activity.FIXTURES = [

  { guid: 'assign1',
    paletteItems: [ 'pi1', 'pi2', 'pi3' ],
    assignmentText: "<p>Make a system diagram to explain how energy from the sun and the things people do BOTH contribute to global climate.</p><ul><li>Where does energy come from?</li><li>How does energy move?</li><li>Where does energy go?</li><li>How does energy change?</li></ul>",
    energyTypes: [ 'et1', 'et2', 'et3', 'et4', 'et5' ]
  	}
  
];
