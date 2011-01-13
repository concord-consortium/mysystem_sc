// ==========================================================================
// Project:   MySystem.Activity
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Holds startup information for the MySystem activity, including the assignment
  text, models for the model palette, and energy types/colors.
  
  This may also 

  @extends SC.Record
  @version 0.1
*/
MySystem.Activity = SC.Record.extend(
/** @scope MySystem.Activity.prototype */ {

  // Items in the palette
  paletteItems: SC.Record.toMany('MySystem.PaletteItem'),
  
  // Assignment text
  assignmentText: SC.Record.attr(String),
  
  // Energy types/colors
  energyTypes: SC.Record.toMany('MySystem.EnergyType')
  

}) ;
