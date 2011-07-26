/*globals SCUtil */

SCUtil = {};

SCUtil.dataHashProperty = function(key, value) {
  if( !this.get('dataHash')) {
    this.set('dataHash', {});
  }
  if( value === undefined) {
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
      }
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
    var data = this.get('content').objectAt(idx),
        model = null;

    this.get('modelObjects').forEach(function (cur_model){
      if(cur_model.get('dataHash') === data){
        model = cur_model;
      }
    });

    if (!model) {
      model = this.get('modelType').create({dataHash: data});
      this.get('modelObjects').add(model);
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

    // we should clean up the cached model objects
    // we don't need to actually add the model objects they will be created as they are requested
  },

  createItem: function() {
    this.pushObject(this.get('modelType').create());
  },

  removeItem: function(button){
    this.removeObject(button.get('item'));
  },

  init: function() {
    this._super();
    this.set('modelObjects', SC.Set.create());
  },

  _contentWillChange: function () {
    this.get('modelObjects').forEach(function(model){
      model.destroy();
    });
    this.set('modelObjects', SC.Set.create());
  }.observesBefore('content')
});

SCUtil.SelectOption = SC.View.extend({
  tagName: 'option',
  content: null,

  render: function(buffer) {
    buffer.push(this.getPath('content'));
  },

  _contentDidChange: function() {
    this.$().text(this.get('content'));
  }.observes('content')
});

SCUtil.Select = SC.CollectionView.extend({
  tagName: 'select',
  itemViewClass: SCUtil.SelectOption,
  attributeBindings: ['value'],
  
  // make sure the model value matches what is displayed to the user
  // we can't do it in init because the html isn't rendered yet...
  didInsertElement: function() {
    this.set('value', this.$().val());
  },
  
  change: function(event) {
    this.set('value', this.$().val());
    return false;
  }
});


