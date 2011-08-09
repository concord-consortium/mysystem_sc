// ==========================================================================
// Project:   MySystem.PaletteItem
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Describes the latest feedback the user has received from the diagram rules

  @extends SC.Record
  @version 0.1
*/
MySystem.RuleFeedback = SC.Record.extend(
/** @scope MySystem.PaletteItem.prototype */ {

  feedback: SC.Record.attr(String),
  
  /**
    Whether the feedback string is a success message
    
    @property {Boolean}
  */
  success: SC.Record.attr(Boolean)
}) ;

// we only ever want a single of these records to exist
MySystem.RuleFeedback.LAST_FEEDBACK_GUID = "LAST_FEEDBACK";
