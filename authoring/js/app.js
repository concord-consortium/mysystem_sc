/*globals MSA */

Handlebars.registerHelper('debug', function(path){
	debugger;
  return 'weird';
});

MSA = SC.Application.create();

MSA.dataHashProperty = function(key, value) {
  this.get('dataHash') ? null : this.set('dataHash', {});
  return value == undefined ? this.get('dataHash')[key] : this.get('dataHash')[key] = value;
}.property();

MSA.ModelObject = SC.Object.extend({
  dataHash: null,
  defaultDataHash: null,
  init: function() {
    this._super();
    
    if(!this.get('dataHash')) {
      var dataHash = {};
      if(this.get('defaultDataHash')){
        jQuery.extend(true, dataHash, this.get('defaultDataHash'));
      };
      this.set('dataHash', dataHash); 
    }
  }
});

MSA.ModelArray = SC.ArrayProxy.extend({
  // this will point to the dataHashs represnting the models
  content: null,
  
  // this points to the cached model objects
  modelObjects: null,
  
  // type of model object to create
  modelType: null,
  
  objectAtContent: function(idx) {
    var model = this.get('modelObjects').objectAt(idx),
        data = null;
    if (!model) {
      data = this.get('content').objectAt(idx);
      model = this.get('modelType').create({dataHash: data});
      this.get('modelObjects')[idx] = model;
    }
    return model;
  },
  
  replaceContent: function(idx, amt, objects) {
    var dataObjects = null;
    if(objects){
      dataObjects = [];
      objects.forEach(function (model){
        dataObjects.push(model.get('dataHash'));
      });
    }
    this.get('content').replace(idx, amt, dataObjects);
  },

  createItem: function() {
    this.pushObject(this.get('modelType').create());
  },
  
  init: function() {
    this._super();
    this.set('modelObjects', []);
  }
  
})

MSA.Module = MSA.ModelObject.extend({
  name: MSA.dataHashProperty,
  image: MSA.dataHashProperty,

  // FIXME handle icon property
  defaultDataHash: {
     "xtype": "MySystemContainer",
     "etype": "source",
     "fields": {
        "efficiency": "1"
     }
  }
});

MSA.EnergyType = MSA.ModelObject.extend({
  label: MSA.dataHashProperty,
  color: MSA.dataHashProperty
});

MSA.SelectOption = SC.View.extend({
  tagName: 'option',
  value: null,

  render: function(buffer) {
    buffer.push(this.get('value'));
  },

  _valueDidChange: function() {
    this.$().text(this.get('value'));
  }.observes('value')
});

MSA.Select = SC.CollectionView.extend({
  tagName: 'select',
  itemViewClass: MSA.SelectOption
});

MSA.data = {
   "type": "mysystem2",
   "prompt": "How can you cook an egg?",
   "modules": [
      {
         "name": "burner",
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
         "label": "heat",
         "color": "#E97F02"
      }
   ]
}


MSA.modulesController = MSA.ModelArray.create({
  content: MSA.data.modules,
  modelType: MSA.Module
});

MSA.energyTypesController = MSA.ModelArray.create({
  content: MSA.data.energy_types,
  modelType: MSA.EnergyType
});