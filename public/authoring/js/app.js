/*globals MSA, SCUtil, InitialMySystemData*/

MSA = Ember.Application.create();



MSA.setupParentIFrame = function(dataHash, updateObject, updateFn, scoreFn) {
  if (typeof dataHash === "undefined" || dataHash === null){
    dataHash = MSA.dataController.get('data');
  }
  
  // migration from old content format
  if (!dataHash.diagram_rules) {
    dataHash.diagram_rules = [];
  } 
  if (!dataHash.rubric_categories) {
    dataHash.rubric_categories = [];
  }
  if (!dataHash.rubricExpression) {
    dataHash.rubricExpression = "true;";
  }
  if (typeof dataHash.correctFeedback === "undefined" || dataHash.correctFeedback === null){
    dataHash.correctFeedback = "";
  }
  if (typeof dataHash.minimumRequirementsFeedback === "undefined" || dataHash.minimumRequirementsFeedback === null){
    dataHash.minimumRequirementsFeedback = "";
  }
  if (typeof dataHash.enableNodeLabelDisplay === "undefined" || dataHash.enableNodeLabelDisplay === null){
    dataHash.enableNodeLabelDisplay = true;
  }
  if (typeof dataHash.enableNodeLabelEditing === "undefined" || dataHash.enableNodeLabelEditing === null){
    dataHash.enableNodeLabelEditing = false;
  }
  if (typeof dataHash.enableNodeDescriptionEditing === "undefined" || dataHash.enableNodeDescriptionEditing === null){
    dataHash.enableNodeDescriptionEditing = false;
  }
  if (typeof dataHash.enableLinkDescriptionEditing === "undefined" || dataHash.enableLinkDescriptionEditing === null){
    dataHash.enableLinkDescriptionEditing = false;
  }
  if (typeof dataHash.enableLinkLabelEditing === "undefined" || dataHash.enableLinkLabelEditing === null){
    dataHash.enableLinkLabelEditing = false;
  }
  if (typeof dataHash.enableCustomRuleEvaluator === "undefined" || dataHash.enableCustomRuleEvaluator === null){
    dataHash.enableCustomRuleEvaluator = false;
  }
  if (typeof dataHash.customRuleEvaluator === "undefined" || dataHash.customRuleEvaluator === null){
    dataHash.customRuleEvaluator = "";
  }
  if (!dataHash.minimum_requirements) {
    dataHash.minimum_requirements = [];
  }
  if (typeof dataHash.maxSubmissionClicks === "undefined" || dataHash.maxSubmissionClicks === null){
    dataHash.maxSubmissionClicks = 0;
  }
  if (typeof dataHash.maxSubmissionFeedback === "undefined" || dataHash.maxSubmissionFeedback === null){
    dataHash.maxSubmissionFeedback = "You have clicked 'submit' too many times. Please continue working without hints.";
  }
  if (typeof dataHash.feedbackPanelHeight === "undefined" || dataHash.feedbackPanelHeight === null){
    dataHash.feedbackPanelHeight = 250;
  }
  if (typeof dataHash.feedbackPanelWidth === "undefined" || dataHash.feedbackPanelWidth === null){
    dataHash.feedbackPanelWidth = 500;
  }
  if (typeof dataHash.terminalRadius === "undefined" || dataHash.terminalRadius === null){
    dataHash.terminalRadius = 14;
  }
  if (typeof dataHash.nodeWidth === "undefined" || dataHash.nodeWidth === null){
    dataHash.nodeWidth = 100;
  }
  if (typeof dataHash.nodeHeight === "undefined" || dataHash.nodeHeight === null){
    dataHash.nodeHeight = 110;
  }

  if (typeof dataHash.backgroundImage === "undefined" || dataHash.backgroundImage === null){
    dataHash.backgroundImage = null;
  }

  if (typeof dataHash.backgroundImageScaling === "undefined" || dataHash.backgroundImageScaling === null){
    dataHash.backgroundImageScaling = false;
  }

  // TODO: migrate objects to have uuids that don't already have them

  MSA.dataController.loadData(dataHash);

  MSA.dataController.addObserver('data', updateObject, updateFn);
  MSA.rubricCategoriesController.set('scoreFunction',scoreFn);
};



MSA.ActivityModel = SCUtil.ModelObject.extend({
  correctFeedback: SCUtil.dataHashProperty,
  maxFeedbackItems: SCUtil.dataHashProperty,
  minimumRequirementsFeedback: SCUtil.dataHashProperty,
  enableNodeLabelDisplay: SCUtil.dataHashProperty,
  enableNodeLabelEditing: SCUtil.dataHashProperty,
  enableNodeDescriptionEditing: SCUtil.dataHashProperty,
  enableLinkDescriptionEditing: SCUtil.dataHashProperty,
  enableLinkLabelEditing: SCUtil.dataHashProperty,
  enableCustomRuleEvaluator: SCUtil.dataHashProperty,
  customRuleEvaluator: SCUtil.dataHashProperty,
  maxSubmissionClicks: SCUtil.dataHashProperty,
  maxSubmissionFeedback: SCUtil.dataHashProperty,
  feedbackPanelWidth: SCUtil.dataHashProperty,
  feedbackPanelHeight: SCUtil.dataHashProperty,
  terminalRadius: SCUtil.dataHashProperty,
  nodeWidth: SCUtil.dataHashProperty,
  nodeHeight: SCUtil.dataHashProperty,
  backgroundImage: SCUtil.dataHashProperty,
  backgroundImageScaling: SCUtil.dataHashProperty,
  rubricExpression: SCUtil.dataHashProperty
});

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
  name: SCUtil.dataHashProperty,
  category: SCUtil.dataHashProperty,
  comparison: SCUtil.dataHashProperty,
  number: SCUtil.dataHashProperty,
  type: SCUtil.dataHashProperty,
  hasLink: SCUtil.dataHashProperty,
  linkDirection: SCUtil.dataHashProperty,
  otherNodeType: SCUtil.dataHashProperty,
  energyType: SCUtil.dataHashProperty,
  javascriptExpression: SCUtil.dataHashProperty,
  isJavascript: SCUtil.dataHashProperty,
  not: SCUtil.dataHashProperty,
  defaultDataHash: {
     "javascriptExpression": "",
     "isJavascript": false
  },
  shouldOption: function(key, value) {
    if (value){
      this.set("not", value !== "should");
    }
    return this.get("not") ? "should not" : "should";
  }.property('not'),
  toggleHasLink: function(){
    this.set('hasLink', !this.get('hasLink'));
  },
  editorWindow: null,
  helpDiv: '#ruleHelp',
  editJSRule: function() {
    var self = this;
    var myCallback = function(newValue) {
      self.set('javascriptExpression',newValue);
    }.bind(self);
    MSA.editorController.editCustomRule(this,this.get('javascriptExpression'),myCallback);
  }
});

MSA.RubricCategory = SCUtil.ModelObject.extend({
  name: SCUtil.dataHashProperty
});

MSA.RubricCategoriesController = SCUtil.ModelArray.extend({
  modelType: MSA.RubricCategory,
  scoreFunction: null,

  moveItemUp: function(button) {
    var c = this.get('content');
    var item = button.get('item');
    var i = c.indexOf(item.get('dataHash'));

    if (i > 0) {
      this.contentWillChange();
      var itemBefore = this.objectAt(i-1);
      this.replaceContent(i-1, 2, [item, itemBefore]);
      this.contentDidChange();
    }
  },

  moveItemDown: function(button) {
    var c = this.get('content');
    var item = button.get('item');
    var i = c.indexOf(item.get('dataHash'));

    if (i < (c.length-1)) {
      this.contentWillChange();
      var itemAfter = this.objectAt(i+1);
      this.replaceContent(i, 2, [itemAfter, item]);
      this.contentDidChange();
    }
  },
  
  showScore: function() {
    var scoreFunction = this.get('scoreFunction');
    if (scoreFunction) {
      scoreFunction();
    }
  }
});

MSA.RulesController = SCUtil.ModelArray.extend({
  modelType: MSA.DiagramRule,

  nodesBinding: 'MSA.modulesController.content',

  nodeTypes: function (){
    return MSA.modulesController.mapProperty('name').insertAt(0, 'node');
  }.property('MSA.modulesController.@each.name').cacheable(),

  energyTypes: function() {
    return MSA.energyTypesController.mapProperty('label').insertAt(0, 'any');
  }.property('MSA.energyTypesController.[]', 'MSA.energyTypesController.@each.label').cacheable(),

  categories: function (){
    return MSA.rubricCategoriesController.mapProperty('name').insertAt(0, 'none');
  }.property('MSA.rubricCategoriesController.[]', 'MSA.rubricCategoriesController.@each.name').cacheable(),

  comparisons: ['more than', 'less than', 'exactly'],

  shouldOptions: ['should', 'should not'],

  linkDirections: ['-->', '<--', '---'],

  moveItemUp: function(item) {
    var c = this.get('content');
    var i = c.indexOf(item);

    if (i > 0) {
      var itemBefore = this.objectAt(i-1);
      this.replaceContent(i-1, 2, [item, itemBefore]);
    }
  },

  moveItemDown: function(item) {
    var c = this.get('content');
    var i = c.indexOf(item);


    if (i < (c.length-1)) {
      var itemAfter = this.objectAt(i+1);
      this.replaceContent(i, 2, [itemAfter, item]);
    }
  }
});

MSA.rubricCategoriesController = MSA.RubricCategoriesController.create({});


MSA.modulesController = SCUtil.ModelArray.create({
  modelType: MSA.Module
});

MSA.energyTypesController = SCUtil.ModelArray.create({
  modelType: MSA.EnergyType
});


MSA.diagramRulesController = MSA.RulesController.create({});



MSA.minRequirementsController = MSA.RulesController.create({
  updateHasRequirements: function() {
    this.set('hasRequirements', (this.get('content.length') > 0));
  }.observes('content.length'),
  hasRequirements: false
});

MSA.dataController = Ember.Object.create({

  modulesBinding: 'MSA.modulesController.content',
  energyTypesBinding: 'MSA.energyTypesController.content',
  minRequirementsBinding: 'MSA.minRequirementsController.content',
  diagramRulesBinding: 'MSA.diagramRulesController.content',
  rubricCategoriesBinding: 'MSA.rubricCategoriesController.content',

  defaultDataHash: function() {
    var defaults = {
      "modules"                      : [],
      "energy_types"                 : [],
      "diagram_rules"                : [],
      "rubric_categories"            : [],
      "rubricExpression"             : "true;",
      "correctFeedback"              : "Your diagram has no obvious problems.",
      "minimum_requirements"         : [],
      "maxFeedbackItems"             : 0,
      "minimumRequirementsFeedback"  : "You need to work more on your diagram to get feedback!",
      "enableNodeLabelDisplay"       : true,
      "enableNodeLabelEditing"       : false,
      "enableNodeDescriptionEditing" : false,
      "enableLinkDescriptionEditing" : false,
      "enableLinkLabelEditing"       : false,
      "enableCustomRuleEvaluator"    : false,
      "customRuleEvaluator"          : "",
      "maxSubmissionClicks"          : 0,
      "maxSubmissionFeedback"        :  "You have clicked 'submit' too many times. Please continue working without hints.",
      "feedbackPanelWidth"           : 500,
      "feedbackPanelHeight"          : 250,
      "terminalRadius"               : 14,
      "nodeHeight"                   : 110,
      "nodeWidth"                    : 110,
      "backgroundImage"              : null,
      "backgroundImageScaling"       : false
    };

    if (top === self) {
      // TODO: (test this, is it still needed?)
      // we are not in iframe so load in some fake data
      defaults = InitialMySystemData;
    }
    return defaults;
  }.property().cacheable(),

  data: function() {
    var activity = this.get('activity');
    var data;
    if(Ember.none(activity)) {
      data = this.get('defaultDataHash');
    }
    else {
      data = activity.get('dataHash');
    }

    data.modules              = this.get('modules').mapProperty('dataHash');       
    data.energy_types         = this.get('energyTypes').mapProperty('dataHash');   
    data.minimum_requirements = this.get('minRequirements').mapProperty('dataHash');
    data.diagram_rules        = this.get('diagramRules').mapProperty('dataHash');  
    data.rubric_categories    = this.get('rubricCategories').mapProperty('dataHash');  
    return data;
  }.property( 'activity.rev',
    'energyTypes.@each.rev',
    'modules.@each.rev', 
    'minRequirements.@each.rev',
    'diagramRules.@each.rev',
    'rubricCategories.@each.rev'
  ).cacheable(),

  dataJson: function() {
    return JSON.stringify(this.get('data'),null,2);
  }.property('data').cacheable(),


  loadData: function(dataHash) {
    var data = dataHash;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    // old authored data hasn't specified this.
    // authoring interface incorrectly checks a box
    data.diagram_rules.forEach(function(rule) {
      if ((typeof rule.isJavascript === 'undefined')) {
        rule.isJavascript = false;
      }
    });
    
    MSA.modulesController.contentFromHashArray(data.modules);
    MSA.energyTypesController.contentFromHashArray(data.energy_types);
    MSA.diagramRulesController.contentFromHashArray(data.diagram_rules);
    MSA.rubricCategoriesController.contentFromHashArray(data.rubric_categories);
    MSA.minRequirementsController.contentFromHashArray(data.minimum_requirements);

    var activity = MSA.ActivityModel.create();
    var item;
    for (item in data) {
      activity.set(item,data[item]);
    }
    this.set('activity',activity);
  }
});

MSA.NodeTypesView = Ember.CollectionView.extend({
  tagName: 'ul',
  contentBinding: "MSA.diagramRulesController.nodes"
});

// add missing textarea tag attributes
MSA.TextArea = Ember.TextArea.extend({
  attributeBindings: ['rows', 'cols', 'wrap'],
  // reasonable defaults?
  cols: 50,
  rows: 4,
  wrap: "off"
});

// add size attribute to text field
MSA.TextField = Ember.TextField.extend({
  attributeBindings: ['type', 'value', 'size'],
  type: "text",
  size: null
});

MSA.editorController = Ember.Object.create({
  owner: null,
  editorWindow: null,
  value: '',
  callback: function() {},

  
  editCustomRule: function(owner,value,callback) {
    this.registerWindowCallbacks();
    this.save();// save the previous data back to whomever.
    this.set('owner',owner);
    this.set('value',value);
    this.set('callback',callback);

    var editorWindow = this.get('editorWindow');
    var features  = "menubar=false,location=false,titlebar=false,toolbar=false,resizable=yes,scrollbars=yes,status=false,width=750,height=650"; 

    // reuse existing window:
    if (editorWindow) {
      editorWindow.postMessage(value,"*");
      editorWindow.focus();
      editorWindow.setHelp(owner.helpDiv);
    }

    // or create a new one:
    else {
      editorWindow = window.open("ace.html", 'editorwindow', features);
      this.set('editorWindow', editorWindow);
      editorWindow.srcText = value;
      editorWindow.helpSelector = owner.helpDiv;
      editorWindow.originParent = window;
    }
    
  },

  registerWindowCallbacks: function() {
    if(this.hasregisteredCallbacks) {
      return;
    }
    var self = this;
    var updateMessage = function(event) {
      var message = JSON.parse(event.data);
      if (message.javascript) {
        self.set('value',message.javascript);
        self.save();
      }
      if (message.windowClosed) {
        self.set('editorWindow',null);
      }
    }.bind(self);
    window.addEventListener("message", updateMessage, false);
    this.hasregisteredCallbacks = true;
  },

  save: function() {
    var value = this.get('value');
    var callback = this.get("callback");
    if (callback) {
      callback(value);
    }
    else {
      console.log("false callback defined");
    }
  }
});

MSA.customRuleController = Ember.Object.create({
  helpDiv: '#evalHelp',
  editCustomRule: function() {
    var value = MSA.dataController.activity.get('customRuleEvaluator');
    var callback = function(value) {
      MSA.dataController.activity.set('customRuleEvaluator',value);
    }.bind(this);
    MSA.editorController.editCustomRule(this,value,callback);
  }
});

MSA.NodeView = Ember.View.extend({
  templateName: 'node-template',
  remove: function() {
    MSA.modulesController.removeObject(this.get('node'));
  }
});

MSA.LinkView = Ember.View.extend({
  templateName: 'link-template',
  remove: function() {
    MSA.energyTypesController.removeObject(this.get('link'));
  }
});

MSA.RuleView = Ember.View.extend({
  templateName: 'rule-template',
  showName: true,
  showSuggestion: true,
  ruleType: "Diagram Rule",
  remove: function() {
    MSA.diagramRulesController.removeObject(this.get('rule'));
  },
  moveItemUp: function() {
   MSA.diagramRulesController.moveItemUp(this.get('rule')); 
  },
  moveItemDown: function() {
   MSA.diagramRulesController.moveItemDown(this.get('rule')); 
  },
  toggleHasLink: function() {
    var rule   = this.get('rule');
    rule.toggleHasLink();
  },
  editJSRule: function() {
    var rule   = this.get('rule');
    rule.editJSRule();
  }
});

MSA.RubricExpressionView = Ember.View.extend({
  templateName: 'rubricExpression-template',
  showScore: function() {
    MSA.rubricCategoriesController.showScore();
  }
});

MSA.MinRequirementView = Ember.View.extend({
  templateName: 'rule-template',
  showName: false,
  showSuggestion: false,
  ruleType: "Requirement",
  remove: function() {
    MSA.minRequirementsController.removeObject(this.get('rule'));
  },
  moveItemUp: function() {
   MSA.minRequirementsController.moveItemUp(this.get('rule')); 
  },
  moveItemDown: function() {
   MSA.minRequirementsController.moveItemDown(this.get('rule')); 
  },
  toggleHasLink: function() {
    var rule   = this.get('rule');
    rule.toggleHasLink();
  }
});
