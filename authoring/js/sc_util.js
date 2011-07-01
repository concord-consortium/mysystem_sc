SCUtil = {};

SCUtil.dataHashProperty = function(key, value) {
  this.get('dataHash') ? null : this.set('dataHash', {});
  if( value == undefined) {
    return this.get('dataHash')[key];
  } else {
    this.get('dataHash')[key] = value;
    this.set('rev', this.get('rev') + 1);
    return value;
  }
}.property();

SCUtil.ModelObject = SC.Object.extend({
  dataHash: null,
  defaultDataHash: null,
  rev: 0,
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

SCUtil.ModelArray = SC.ArrayProxy.extend({
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

SCUtil.SelectOption = SC.View.extend({
  tagName: 'option',
  value: null,

  render: function(buffer) {
    buffer.push(this.get('value'));
  },

  _valueDidChange: function() {
    this.$().text(this.get('value'));
  }.observes('value')
});

SCUtil.Select = SC.CollectionView.extend({
  tagName: 'select',
  itemViewClass: SCUtil.SelectOption
});


