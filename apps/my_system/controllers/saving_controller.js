// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set 
  saveFunction: null,
  
  dataIsDirty: NO,
  
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
  }
});