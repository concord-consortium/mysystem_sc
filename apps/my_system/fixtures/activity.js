// ==========================================================================
// Project:   MySystem.Activity Fixtures
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('models/activity');

MySystem.Activity.FIXTURES = [

  { guid: 'assign1',
    paletteItems: [ 'pi1', 'pi2', 'pi3' ],
    assignmentText: "<p>Make a diagram and story to help explain how <i>both</i> the sun and people's actions affect the Earth's climate.</p><ul><li>Where does the energy originally come from?</li><li>How does the energy move through the system?</li><li>How does the energy change as it moves through the system?</li><li>Where does the energy go in the end?</li></ul>",
    energyTypes: [ 'et1', 'et2', 'et3', 'et4', 'et5' ]
  	}
  
];
