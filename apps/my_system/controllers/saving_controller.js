// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set 
  saveFunction: null,
  saveTime: null,
  saveStatusText: 'not yet saved',

  timer: SC.Timer.schedule({ 
            target:   'MySystem.savingController',
            action:   'tick',
            interval: 5000,
            repeats:  YES }),

  tick: function() {
    var timeNow  = new Date().getTime(),
        saveTime = this.get('saveTime'),
        seconds  = 0,
        minutes  = 0,
        hours    = 0;
    if (!!!saveTime) { return; }
    seconds = (timeNow - saveTime) / 1000.0;
    minutes = seconds / 60;
    hours   = minutes / 60;

    if (seconds < 10) {
      this.set('saveStatusText', 'Saved: just now');
      return;
    }
    if (seconds < 60) {
      this.set('saveStatusText', 'Saved: ' + Math.round(seconds) + ' seconds ago');
      return;
    }
    if (minutes < 60) {
      this.set('saveStatusText', 'Saved: ' + Math.round(minutes) + ' minutes ago');
      return;
    }
    this.set('saveStatusText',   'Saved: ' + Math.round(hours) +   ' hours ago');
  },
  
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
  
  autoSaveFrequency: 20000,
	
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

	  if (this.get('dataIsDirty') && this.get('autoSaveFrequency') > 0) {
	    if (!this.get('saveTimer')){  // if we already have a timer, don't make a new one
	      // save ten seconds after data was first made dirty
	      this.set('saveTimer', SC.Timer.schedule({
          target: this,
          action: 'save',
          interval: this.get('autoSaveFrequency'),
          repeats: YES
        }));
	    }
	  } else {
	    if (!!this.get('saveTimer')){
	      this.get('saveTimer').invalidate();
	      this.set('saveTimer', null);
      }
	  }
	}.observes('dataIsDirty', 'autoSaveFrequency')
});  },

  saveSuccess: function() {
    var time = new Date().getTime();
    this.set('saveTime',time);
  }
});
