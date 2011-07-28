/*globals MSA, SCUtil, InitialMySystemData*/

MSA = SC.Application.create();

MSA.setupParentIFrame = function(dataHash, updateObject, updateFn) {
  // migration from old content format
  if (!dataHash.diagram_rules) {
    dataHash.diagram_rules = [];
  }

  // TODO: migrate objects to have uuids that don't already have them

  MSA.data = dataHash;

  MSA.modulesController.setExternalContent(dataHash.modules);
  MSA.energyTypesController.setExternalContent(dataHash.energy_types);
  MSA.diagramRulesController.setExternalContent(dataHash.diagram_rules);

  MSA.dataController.addObserver('data', updateObject, updateFn);
};

MSA.Module = SCUtil.ModelObject.extend( SCUtil.UUIDModel, {
  name: SCUtil.dataHashProperty,
  image: SCUtil.dataHashProperty,

  defaultDataHash: {
     "xtype": "MySystemContainer",
     "etype": "source",
     "fields": {
        "efficiency": "1"
     }
  }
});

MSA.EnergyType = SCUtil.ModelObject.extend( SCUtil.UUIDModel, {
  label: SCUtil.dataHashProperty,
  color: SCUtil.dataHashProperty
});

// it would be useful to support polymorphic 
// so there are different types of rule 
MSA.DiagramRule = SCUtil.ModelObject.extend({
  suggestion: SCUtil.dataHashProperty,
  comparison: SCUtil.dataHashProperty,
  number: SCUtil.dataHashProperty,
  type: SCUtil.dataHashProperty,
  hasLink: SCUtil.dataHashProperty,
  linkDirection: SCUtil.dataHashProperty,
  otherNodeType: SCUtil.dataHashProperty,
  toggleHasLink: function(){
    this.set('hasLink', !this.get('hasLink'));
  }
});

if (top === self) {
  // we are not in iframe so load in some fake data
  MSA.data = InitialMySystemData;
} else {
  // we are in an iframe
  MSA.data = {
    "modules": [],
    "energy_types": [],
    "diagram_rules": []
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

MSA.diagramRulesController = SCUtil.ModelArray.create({
  content: MSA.data.diagram_rules,
  modelType: MSA.DiagramRule,

  nodeTypes: function (){
    return MSA.modulesController.mapProperty('name').insertAt(0, 'node');
  }.property('MSA.modulesController.[]', 'MSA.modulesController.@each.name').cacheable(),
  
  comparisons: ['more than', 'less than', 'exactly'],
  linkDirections: ['-->', '<--', '---']
});

MSA.dataController = SC.Object.create({
  data: function(){
    return JSON.stringify(MSA.data, null, 2);
  }.property('MSA.modulesController.[]', 
             'MSA.modulesController.@each.rev', 
             'MSA.energyTypesController.@each.rev', 
             'MSA.diagramRulesController.@each.rev')
});

MSA.NodeTypesView = SC.CollectionView.extend({
  tagName: 'ul',
  contentBinding: "MSA.diagramRulesController.nodeTypes"
});

