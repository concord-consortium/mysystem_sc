// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set 
  saveFunction:      null,
  saveTime:          null,
  displayTime:       null,
  saveTimer:         null,
  autoSaveFrequency: 20000, // save every          20 seconds
  displayFrequency:   5000, // update disaply every 5 seconds 

  saveStatusText: function() {
    var saveTime = this.get('saveTime'),
        seconds  = 0,
        minutes  = 0,
        hours    = 0,
        timeNow  = new Date().getTime();
    
    if (!!!saveTime) { return 'not yet saved'; }

    seconds = (timeNow - saveTime) / 1000.0;
    minutes = seconds / 60;
    hours   = minutes / 60;

    if (seconds < 10) { return ('Saved: just now'); }
    if (seconds < 60) { return ('Saved: ' + Math.round(seconds) + ' seconds ago'); }
    if (minutes < 60) { return ('Saved: ' + Math.round(minutes) + ' minutes ago'); }
    return ('Saved: '                     + Math.round(hours)   + ' hours ago');

  }.property('saveTime', 'displayTime'),

  enableManualSave: function(){
    return !!this.get('saveFunction') && !!this.get('dataIsDirty');
  }.property('saveFunction', 'dataIsDirty'),
  
  save: function() {
    if(this.get('saveFunction')) {
      this.get('saveFunction')();
      this.set('saveTime', new Date().getTime());
    }
  },
  
  // Called when save function returns.
  // @param successful {Boolean}      true if the data was successfully saved
  saveSuccessful: function(successful) {
    if (successful){
      this.set('dataIsDirty', NO);
      this.set('saveTime', new Date().getTime());
    }
  },
  
	
	// This timer will be scheduled to attempt to save every twenty seconds while
	// data is dirty. Once data is clean, the timer will be cancelled.
	//
	// From the point of view of the user, no data saving will happen until they modify their data,
	// then after twenty seconds a save will be triggered. Assuming the save was successful,
	// no more saving will happen until they modify their data again. If they are continuously changing
	// the diagram, the system will save every twenty seconds.
	scheduleAutoSave: function() {
	  if (!this.get('saveFunction')){  return; }

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
	}.observes('dataIsDirty', 'autoSaveFrequency'),
  

  updateDisplayTime: function() {
    this.set('displayTime', new Date().getTime());
  },

  saveSuccess: function() {
    var time = new Date().getTime();
    this.set('saveTime',time);
  },

  init: function() {
    sc_super();
    var timer = SC.Timer.schedule({
                  target:   this,
                  action:   'updateDisplayTime',
                  interval: this.get('displayFrequency'),
                  repeats:  YES
                });

    this.set('displayTimer', timer);
  },

  destroy: function() {
    this.get('saveTimer').invalidate();
    this.set('saveTimer', null);
    this.get('displayTimer').invalidate();
    this.set('displayTimer', null);
    sc_super();
  }
});
