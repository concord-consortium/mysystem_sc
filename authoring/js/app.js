/*globals MSA, SCUtil*/

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

if (top === self) {
  // we are not in iframe so load in some fake data
  MSA.data = {
   "type": "mysystem2",
   "prompt": "How can you cook an egg?",
   "modules": [
      {
         "name": "burner_static",
         "icon": "http://dl.dropbox.com/u/73403/mysystem/images/burner-transp-70.png",
         "image": "http://dl.dropbox.com/u/73403/mysystem/images/burner-transp-70.png",
         "xtype": "MySystemContainer",
         "etype": "source",
         "fields": {
            "efficiency": "1"
         }
      },
      {
         "name": "egg",
         "icon": "http://dl.dropbox.com/u/73403/mysystem/images/egg-transp-70.png",
         "image": "http://dl.dropbox.com/u/73403/mysystem/images/egg-transp-70.png",
         "xtype": "MySystemContainer",
         "etype": "source",
         "fields": {
            "efficiency": "1"
         }
      },
      {
         "name": "pot",
         "icon": "http://dl.dropbox.com/u/73403/mysystem/images/pot.jpg",
         "image": "http://dl.dropbox.com/u/73403/mysystem/images/pot.jpg",
         "xtype": "MySystemContainer",
         "etype": "source",
         "fields": {
            "efficiency": "1"
         }
      },
      {
         "name": "water",
         "icon": "http://dl.dropbox.com/u/73403/mysystem/images/water-70.png",
         "image": "http://dl.dropbox.com/u/73403/mysystem/images/water-70.png",
         "xtype": "MySystemContainer",
         "etype": "source",
         "fields": {
            "efficiency": "1"
         }
      }
   ],
   "energy_types": [
      {
         "label": "heat_static",
         "color": "#E97F02"
      }
   ]
  };
} else {
  // we are in an iframe
  MSA.data = {
    "modules": [],
    "energy_types": []
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

MSA.dataController = SC.Object.create({
  data: function(){
    return JSON.stringify(MSA.data, null, 2);
  }.property('MSA.modulesController.[]', 'MSA.modulesController.@each.rev', 'MSA.energyTypesController.@each.rev')
});

