// ==========================================================================
// Project:   MySystem
// MySystem.RuleFeedback
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class MySystem.RuleFeedback

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
  success: SC.Record.attr(Boolean),
  
  /**
    How many times submit button has been pressed
    
    @property {Number}
  */
  numOfSubmits: SC.Record.attr(Number, {defaultValue: 0}),
  timeStamp:    SC.Record.attr(String),
  timeStampMs:  SC.Record.attr(Number)
});

// we only ever want a single of these records to exist
MySystem.RuleFeedback.LAST_FEEDBACK_GUID = "LAST_FEEDBACK";

MySystem.RuleFeedback.saveFeedback = function(store, feedback, success, isSubmit, counts){
  var lastFeedback = store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
  var timeStamp = new Date();
  var timeStampMs = timeStamp.getTime();
  
  // check if it's previously been created.
  if (lastFeedback && (lastFeedback.get('status') & SC.Record.READY)){
    lastFeedback.set({
      feedback: feedback, 
      success: success,
      timeStamp: timeStamp,
      timeStampMs: timeStampMs
    });

    if(isSubmit && counts) {
      lastFeedback.set('numOfSubmits', lastFeedback.get('numOfSubmits') + 1);
    }
  } else {
    store.createRecord(
      MySystem.RuleFeedback, 
      {
        feedback: feedback,
        success: success,
        numOfSubmits: (isSubmit && counts) ? 1 : 0,
        timeStamp: timeStamp,
        timeStampMs: timeStampMs
      }, 
      MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
  }

  // need to flush here otherwise the lastFeedback Record won't be updated in some cases 
  // until the end of of the runloop.  At least one case where this can happen and be a problem
  // is when Store#find is called to find this lastFeedback record before it has been created, and then
  // the feedback property is read.  This will cache a null value for the feedback property.
  // then when the createRecord method is called above it will not invalidate that cached null
  // value until flush is called (which normally happens at the end of the runloop)
  store.flush();

  // need to commit here so the changes are pushed into the dom (which is how the are stored)
  // this will also mark the datastore as dirty, so calls then calls to savingController.save 
  // will actually save the data.  This is the path that happens in the checkButtonPressed action,
  store.commitRecords();
};
