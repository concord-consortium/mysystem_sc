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
    image: sc_static('resources/clay_red_tn.png'),
    uuid:  "030454f0-b92c-11e0-a4dd-0800200c9a66"},

  { guid: 'pi2',
    title: "Hand",
    image: sc_static('resources/hand_tn.png'),
    uuid: "12553af0-b92c-11e0-a4dd-0800200c9a66" },
    
  { guid: 'pi3',
    title: "Bulb",
    image: sc_static('resources/lightbulb_tn.png'),
    uuid: "1e3f7650-b92c-11e0-a4dd-0800200c9a66" }

];
