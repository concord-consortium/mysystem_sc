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

MySystem.RuleFeedback.saveFeedback = function(store, feedback, success){
  var lastFeedback = store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
  
  // check if it's previously been created.
  if (lastFeedback && (lastFeedback.get('status') & SC.Record.READY)){
    lastFeedback.set({feedback: feedback, success: success});
  } else {
    store.createRecord(
      MySystem.RuleFeedback, 
      {feedback: feedback, success: success}, 
      MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
    // need to flush here otherwise the lastFeedback Record won't be updated in some cases 
    // until the end of of the runloop.  At least one case where this can happen and be a problem
    // is when Store#find is called to find this lastFeedback record before it has been created, and then
    // the feedback property is read.  This will cache a null value for the feedback property.
    // then when the createRecord method is called above it will not invalidate that cached null
    // value until flush is called (which normally happens at the end of the runloop)
    store.flush();
  }
};
