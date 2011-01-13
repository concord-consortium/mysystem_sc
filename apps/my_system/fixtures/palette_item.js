// ==========================================================================
// Project:   MySystem.PaletteItem Fixtures
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('models/palette_item');

MySystem.PaletteItem.FIXTURES = [

  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

  { guid: "pi1", 
    title: "Clay",
    image: sc_static('resources/clay_red_tn.png') },

  { guid: 'pi2',
    title: "Hand",
    image: sc_static('resources/hand_tn.png') },
    
  { guid: 'pi3',
    title: "Bulb",
    image: sc_static('resources/lightbulb_tn.png') }

];
