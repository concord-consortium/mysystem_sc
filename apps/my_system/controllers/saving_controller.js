// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set 
  saveFunction: null,
  
  networkSave: NO,
  
  saveStatusText: function(){
    if(!this.get('networkSave')){
      return 'No Network';
    }
    return 'Unknown status';
  }.property('savingPossible', 'networkSave'),
  
  enableManualSave: function(){
    if(!this.get('networkSave')){
      // there is no point to enable manual save if there isn't a network
      return NO;
    }
    return this.get('saveFunction') ? YES : NO;
  }.property('saveFunction'),
  
  save: function() {
    if(this.get('saveFunction')) {
      this.get('saveFunction')();
    }
  }
});