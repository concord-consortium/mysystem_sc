/*globals View componentloader eventManager */

/*
 * This handles events and calls the appropriate function to handle
 * the event.
 */
View.prototype.mysystemDispatcher = function(type,args,obj){
  if(type === 'mysystemPromptChanged'){
    console.log('mysystemPromptChanged');
    //  obj.Mysystem2Node.AddNewModule();
  }
  if(type === 'mysystemFieldUpdated'){
    console.log('mysystemFieldUpdated');
    obj.Mysystem2Node.fieldUpdated(args[0], args[1]);
  }
  if(type === 'mysystemRemoveMod'){
    console.log('mysystemRemoveMod');
    obj.Mysystem2Node.removeMod(args[0]);
  }
  if(type === 'mysystemAddNewModule'){
    console.log('mysystemAddNewModule');
    obj.Mysystem2Node.AddNewModule();
  }
  if(type === 'mysystemAddNewEnergyType'){
    console.log('mysystemAddNewEnergyType');
    obj.Mysystem2Node.AddNewEnergyType();
  }
  if(type === 'mysystemEnergyFieldUpdated'){
    console.log('mysystemEnergyFieldUpdated');
    obj.Mysystem2Node.fieldEnergyUpdated(args[0], args[1]);
  }
  if(type === 'mysystemRemoveEtype'){
    console.log('mysystemRemoveEtype');
    obj.Mysystem2Node.removeEtype(args[0]);
  }
};

/*
 * this is a list of events that can be fired. when the event is fired,
 * the dispatcher function above will be called and then call the
 * appropriate function to handle the event.
 */
var events = [
  /*
   * TODO: rename templateUpdatePrompt
   * wait until you implement the authoring before you rename this
   */
  'mysystemFieldUpdated', //",["name","' + a + '"])'});
  'mysystemEnergyFieldUpdated',
  'mysystemRemoveMod',     //"' + a + '")'});
  'mysystemRemoveEtype',
  'mysystemAddNewModule',
  'mysystemAddNewEnergyType',
  'templateUpdatePrompt'
];

/*
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 */
for (var x=0; x<events.length; x++) {
  componentloader.addEvent(events[x], 'mysystemDispatcher');
}

// used to notify scriptloader that this script has finished loading
if (typeof eventManager != 'undefined') {
  eventManager.fire('scriptLoaded', 'vle/node/mysystem2/mysystem2Events.js');
}



