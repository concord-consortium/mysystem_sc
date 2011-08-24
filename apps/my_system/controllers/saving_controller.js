// ==========================================================================
// Project:   MySystem.savingController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */
MySystem.savingController = SC.Object.create({
  // this should be set 
  saveFunction: null,
  
  saveStatusText: function(){
    if(!this.get('saveFunction')){
      return 'No External Saving';
    }
    return 'Unknown status';
  }.property('saveFunction'),
  
  save: function() {
    if(this.get('saveFunction')) {
      this.get('saveFunction')();
    }
  }
});