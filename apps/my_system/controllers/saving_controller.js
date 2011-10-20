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

  // computes human-readable 'Saved: <when> text'
  saveStatusText: function() {
    var saveTime = this.get('saveTime'),
        seconds  = 0,
        minutes  = 0,
        hours    = 0,
        timeNow  = new Date().getTime();

    if (!!!this.get('saveFunction')){ return 'Saving disabled.'; }
    if (!!!saveTime)                { return 'Not saved yet.'; } 

    if (!this.get('dataIsDirty')) { 
      // if we aren't dirty, we are effectively saved:
      this.set('saveTime', new Date().getTime()); 
      return 'Saved.';
    }

    seconds = (timeNow - saveTime) / 1000.0;
    minutes = seconds / 60;
    hours   = minutes / 60;

    seconds = Math.floor(seconds);
    minutes = Math.floor(minutes);
    hours   = Math.floor(hours);

    if (seconds <  60) { return ('Saved seconds ago.'); }
    if (minutes === 1) { return ('Saved ' + minutes + ' minute ago.' ); } 
    if (minutes <  60) { return ('Saved ' + minutes + ' minutes ago.'); } 
    if (hours   === 1) { return ('Saved ' + hours   + ' hour ago.' );   } 
    return ('Saved '                      + hours    + ' hours ago.');

  }.property('saveTime', 'displayTime'),

  enableManualSave: function(){
    return !!this.get('saveFunction') && !!this.get('dataIsDirty');
  }.property('saveFunction', 'dataIsDirty'),

  // Called to attempt to save the diagram. Either by pressing 'save', navigating away,
  // or when the save button is pressed.
  // IMPORANT: dataSources must call: MySystem.savingController.set('dataIsDirty', YES); 
  save: function() {
    var isSubmit = NO;
    if(this.get('saveFunction') && this.get('dataIsDirty')) {
      this.get('saveFunction')(isSubmit);
    }
  },

  // submit the diagram which tells the saving code to make sure to lock the saved
  // state so it won't be overriden
  submit: function(){
    var isSubmit = YES;
    if(this.get('saveFunction')) {
      this.get('saveFunction')(isSubmit);
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

  // Called when our dispayTimer reaches <displayFrequency> seconds
  // this will have the side-effect of calling this.saveStatusText()
  // which is observes 'displayTime'.
  updateDisplayTime: function() {
    this.set('displayTime', new Date().getTime());
  },

  setupTimers: function() {
    var saveTimer    = null,
        displayTimer = null;
        
    if (!!this.get('displayTimer')){
      this.get('displayTimer').invalidate();
      this.set('displayTimer', null);
    }
    if (!!this.get('saveTimer')){
      this.get('saveTimer').invalidate();
      this.set('saveTimer', null);
    }

    // This timer will attempt to display the last save time every <displayFrequency> seconds
    // unless the value for autoSaveFrequency is less than 1.
    if (this.get('displayFrequency') > 0) {
        this.set('displayTimer',SC.Timer.schedule({
          target:   this,
          action:   'updateDisplayTime',
          interval: this.get('displayFrequency'),
          repeats:  YES
        }));
    }

    // This timer will attempt to save dataevery <autoSaveFrequency> seconds
    // unless the value for autoSaveFrequency is less than 1.
    if (this.get('autoSaveFrequency') > 0) {
       this.set('saveTimer', SC.Timer.schedule({
          target:   this,
          action:   'save',
          interval: this.get('autoSaveFrequency'),
          repeats:  YES
        }));
    }
  }.observes('displayFrequency','autoSaveFrequency'),

  init: function() {
    sc_super();
    this.setupTimers();
  },

  destroy: function() {
    // ensure that our timers are destroyed.
    this.get('saveTimer').invalidate();
    this.set('saveTimer', null);
    this.get('displayTimer').invalidate();
    this.set('displayTimer', null);
    sc_super();
  }
});
