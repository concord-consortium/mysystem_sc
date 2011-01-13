// ==========================================================================
// Project:   MySystem.EnergyType
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Defines a kind of energy transfer between nodes.

  @extends SC.Record
  @version 0.1
*/
MySystem.EnergyType = SC.Record.extend(
/** @scope MySystem.EnergyType.prototype */ {

  /** 
    The text description of this energy type.
    
    @property {String}
  */
  label: SC.Record.attr(String, { isRequired: YES, defaultValue: "Energy Flow" }),
  
  /**
    The color used to show flows of this energy as links.
    
    @property {String}
  */
  color: SC.Record.attr(String, { isRequired: YES })

}) ;
