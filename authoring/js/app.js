/*globals MSA, SCUtil, InitialMySystemData*/

MSA = SC.Application.create();

MSA.Module = SCUtil.ModelObject.extend({
  name: SCUtil.dataHashProperty,
  image: SCUtil.dataHashProperty,

  // FIXME handle icon property
  defaultDataHash: {
     "xtype": "MySystemContainer",
     "etype": "source",
     "fields": {
        "efficiency": "1"
     }
  }
});

MSA.EnergyType = SCUtil.ModelObject.extend({
  label: SCUtil.dataHashProperty,
  color: SCUtil.dataHashProperty
});

MSA.DiagramRule = SCUtil.ModelObject.extend({
  suggestion: SCUtil.dataHashProperty,
  comparison: SCUtil.dataHashProperty,
  number: SCUtil.dataHashProperty,
  type: SCUtil.dataHashProperty
});

if (top === self) {
  // we are not in iframe so load in some fake data
  MSA.data = InitialMySystemData;
} else {
  // we are in an iframe
  MSA.data = {
    "modules": [],
    "energy_types": [],
    "rules": []
  };
}


MSA.modulesController = SCUtil.ModelArray.create({
  content: MSA.data.modules,
  modelType: MSA.Module
});

MSA.energyTypesController = SCUtil.ModelArray.create({
  content: MSA.data.energy_types,
  modelType: MSA.EnergyType
});

MSA.rulesController = SCUtil.ModelArray.create({
  content: MSA.data.rules,
  modelType: MSA.DiagramRule,

  // somehow this needs to include all modules as well as "node", which represents the null type
  // and it needs to update when the types change
  nodeTypes: function (){
    return MSA.modulesController.mapProperty('name').insertAt(0, 'node');
  }.property('MSA.modulesController.[]', 'MSA.modulesController.@each.name').cacheable(),
  
  comparisons: ['more than', 'less than', 'exactly']
});

MSA.dataController = SC.Object.create({
  data: function(){
    return JSON.stringify(MSA.data, null, 2);
  }.property('MSA.modulesController.[]', 
             'MSA.modulesController.@each.rev', 
             'MSA.energyTypesController.@each.rev', 
             'MSA.rulesController.@each.rev')
});

MSA.NodeTypesView = SC.CollectionView.extend({
  tagName: 'ul',
  contentBinding: "MSA.rulesController.nodeTypes"
});

