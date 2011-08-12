// ==========================================================================
// Project:   MySystem.Activity
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Holds startup information for the MySystem activity, including the assignment
  text, models for the model palette, and energy types/colors.

  This may also

  @extends SC.Record
  @version 0.1
*/
MySystem.Activity = SC.Record.extend(
/** @scope MySystem.Activity.prototype */ {

  // Items in the palette
  paletteItems: SC.Record.toMany('MySystem.PaletteItem'),

  // Assignment text
  assignmentText: SC.Record.attr(String),

  // Energy types/colors
  energyTypes: SC.Record.toMany('MySystem.EnergyType'),
  
  // Rules for evaluating the digram
  diagramRules: SC.Record.toMany('MySystem.DiagramRule'),

  // The maximum number of pieces of feedback to give to the user
  maxFeedbackItems: SC.Record.attr(Number, {defaultValue: 0})
});

MySystem.Activity.GuidCounter = 100;
MySystem.Activity.newGuid = function(type) { return type + MySystem.Activity.GuidCounter++;};


/**
  Given an object representing the wise4 step, create a new activity object,
  @param {Object} wiseStepDef       A POJSO in the following format

  sample format:
  -------------
      "type": "Mysystem_sc",
         "TODO": "Be sure to add the necessary fields to this JSON file for your new step type, a copy of the contents of this file will be copied to the new step file when an author creates a new instance of your step in the authoring tool, you may delete this TODO field",
         "prompt": "What do you want to do?",
         "modules": [
            {
               "name": "thing",
               "icon": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Bongo.jpg/120px-Bongo.jpg",
               "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Bongo.jpg/120px-Bongo.jpg",
               "xtype": "MySystemContainer",
               "etype": "source",
               "fields": {
                  "efficiency": "1"
               }
            }
         ]
      }
*/
MySystem.Activity.fromWiseStepDef = function(wiseStepDef) {
  var actguid = MySystem.Activity.newGuid("actvitiy");
  var modules = wiseStepDef["modules"];
  var paletteItem = null;
  var module= null;
  var maxFeedbackItems = wiseStepDef["maxFeedbackItems"] || 0

  var activity = MySystem.store.createRecord(
    MySystem.Activity, {
    assignmentText: wiseStepDef["prompt"],
    maxFeedbackItems: maxFeedbackItems,
    guid: MySystem.Activity.newGuid("activity")
  });
  var size = modules.length;
  var i = 0;
  for (i=0; i < size; i++) {
    module = modules[i];
    paletteItem = MySystem.store.createRecord(
      MySystem.PaletteItem, {
        title: module["name"],
        image: module["image"],
        uuid: module["uuid"]},
        MySystem.Activity.newGuid("palette_item")
    );
    activity.get('paletteItems').pushObject(paletteItem);
  }
  var energy_types = wiseStepDef["energy_types"];
  size = energy_types.length;
  var type = '';
  var newEnergyType = null;
  for (i=0; i < size; i++) {
    type = energy_types[i];
    newEnergyType = MySystem.store.createRecord(
      MySystem.EnergyType, {
        label: type["label"],
        color: type["color"],
        isEnabled: YES,
        uuid: type['uuid']},
        MySystem.Activity.newGuid("energyType")
    );
    activity.get('energyTypes').pushObject(newEnergyType);
  }
  var diagram_rules = wiseStepDef["diagram_rules"];
  size = diagram_rules.length;
  var newDiagramRule = null;
  var rule = null;
  for (i=0; i < size; i++) {
    rule = diagram_rules[i];
    newDiagramRule = MySystem.store.createRecord(
      MySystem.DiagramRule,
      rule, 
      MySystem.Activity.newGuid("diagramRule")
    );
    activity.get('diagramRules').pushObject(newDiagramRule);
  }
  return activity;
};

