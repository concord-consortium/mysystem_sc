// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set 
  saveFunction: null,
  
  dataIsDirty: NO,
  
  saveTimer: null,
  
  saveStatusText: function(){
    if(!this.get('saveFunction')){
      return 'No External Saving';
    }
    return this.get('dataIsDirty') ? 'Not saved' : "Saved";
  }.property('saveFunction', 'dataIsDirty'),
  
  enableManualSave: function(){
    return !!this.get('saveFunction') && !!this.get('dataIsDirty');
  }.property('saveFunction', 'dataIsDirty'),
  
  save: function() {
    if(this.get('saveFunction')) {
      this.get('saveFunction')();
    }
  },
  
  // Called when save function returns.
  // @param successful {Boolean}      true if the data was successfully saved
  saveSuccessful: function(successful) {
    if (successful){
      this.set('dataIsDirty', NO);
    }
  },
	
	// This timer will be scheduled to attempt to save every twenty seconds while
	// data is dirty. Once data is clean, the timer will be cancelled.
	//
	// From the point of view of the user, no data saving will happen until they modify their data,
	// then after twenty seconds a save will be triggered. Assuming the save was successful,
	// no more saving will happen until they modify their data again. If they are continuously changing
	// the diagram, the system will save every twenty seconds.
	scheduleTimer: function() {
	  if (!this.get('saveFunction')){
	    return;
	  }
	  
	  if (this.get('dataIsDirty')) {
	    if (!this.get('saveTimer')){  // if we already have a timer, don't make a new one
	      // save ten seconds after data was first made dirty
	      this.set('saveTimer', SC.Timer.schedule({
          target: this,
          action: 'save',
          interval: 20000,
          repeats: YES
        }));
	    }
	  } else {
	    if (!!this.get('saveTimer')){
	      this.get('saveTimer').invalidate();
	      this.set('saveTimer', null);
      }
	  }
	}.observes('dataIsDirty')
});