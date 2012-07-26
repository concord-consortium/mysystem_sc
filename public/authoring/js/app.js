/*globals MSA, SCUtil, InitialMySystemData*/

MSA = SC.Application.create();

if (top === self) {
  // we are not in iframe so load in some fake data
  MSA.data = InitialMySystemData;
} else {
  // we are in an iframe
  MSA.data = {
    "modules": [],
    "energy_types": [],
    "diagram_rules": [],
    "correctFeedback": "Your diagram has no obvious problems.",
    "minimum_requirements": [],
    "maxFeedbackItems": 0,
    "minimumRequirementsFeedback": "You need to work more on your diagram to get feedback!",
    "enableNodeLabelDisplay": true,
    "enableNodeLabelEditing": false,
    "enableNodeDescriptionEditing": false,
    "enableLinkDescriptionEditing": false,
    "enableLinkLabelEditing": false,
    "enableCustomRuleEvaluator": false,
    "customRuleEvaluator": "",
    "maxSubmissionClicks": 0,
    "maxSubmissionFeedback":  "You have clicked 'submit' too many times. Please continue working without hints.",
    "feedbackPanelWidth": 500,
    "feedbackPanelHeight": 250,
    "terminalRadius": 14,
    "nodeHeight": 110,
    "nodeWidth": 110,
    "backgroundImage": null,
    "backgroundImageScaling": false
  };
}

MSA.setupParentIFrame = function(dataHash, updateObject, updateFn) {
  if (typeof dataHash === "undefined" || dataHash === null){
    dataHash = MSA.data;
  }
  
  // migration from old content format
  if (!dataHash.diagram_rules) {
    dataHash.diagram_rules = [];
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

  MSA.loadData(dataHash);

  MSA.dataController.addObserver('data', updateObject, updateFn);
};

MSA.loadData = function(dataHash) {
  MSA.data = dataHash;

  MSA.set('activity', MSA.ActivityModel.create({dataHash: MSA.data}));
  MSA.modulesController.setExternalContent(dataHash.modules);
  MSA.energyTypesController.setExternalContent(dataHash.energy_types);
  MSA.diagramRulesController.setExternalContent(dataHash.diagram_rules);
  MSA.minRequirementsController.setExternalContent(dataHash.minimum_requirements);
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
  backgroundImageScaling: SCUtil.dataHashProperty
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

MSA.modulesController = SCUtil.ModelArray.create({
  content: MSA.data.modules,
  modelType: MSA.Module
});

MSA.energyTypesController = SCUtil.ModelArray.create({
  content: MSA.data.energy_types,
  modelType: MSA.EnergyType
});

MSA.RulesController = SCUtil.ModelArray.extend({
  modelType: MSA.DiagramRule,

  nodeTypes: function (){
    return MSA.modulesController.mapProperty('name').insertAt(0, 'node');
  }.property('MSA.modulesController.[]', 'MSA.modulesController.@each.name').cacheable(),

  energyTypes: function() {
    return MSA.energyTypesController.mapProperty('label').insertAt(0, 'any');
  }.property('MSA.energyTypesController.[]', 'MSA.energyTypesController.@each.label').cacheable(),

  comparisons: ['more than', 'less than', 'exactly'],

  shouldOptions: ['should', 'should not'],

  linkDirections: ['-->', '<--', '---'],

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
  }
});

MSA.diagramRulesController = MSA.RulesController.create({
  content: MSA.data.diagram_rules
});

MSA.minRequirementsController = MSA.RulesController.create({
  content: MSA.data.minimum_requirements,
  updateHasRequirements: function() {
    this.set('hasRequirements', (this.getPath('content.length') > 0));
  }.observes('content.length'),
  hasRequirements: NO
});

MSA.dataController = SC.Object.create({
  data: function(){
    return JSON.stringify(MSA.data, null, 2);
  }.property('MSA.modulesController.[]', 
             'MSA.modulesController.@each.rev', 
             'MSA.energyTypesController.@each.rev', 
             'MSA.diagramRulesController.@each.rev',
             'MSA.minRequirementsController.@each.rev',
             'MSA.activity.correctFeedback',
             'MSA.activity.minimumRequirementsFeedback',
             'MSA.activity.enableNodeLabelDisplay',
             'MSA.activity.enableNodeLabelEditing',
             'MSA.activity.enableNodeDescriptionEditing',
             'MSA.activity.enableLinkDescriptionEditing',
             'MSA.activity.enableLinkLabelEditing',
             'MSA.activity.maxFeedbackItems',
             'MSA.activity.enableCustomRuleEvaluator',
             'MSA.activity.customRuleEvaluator',
             'MSA.activity.maxSubmissionClicks',
             'MSA.activity.maxSubmissionFeedback',
             'MSA.activity.feedbackPanelWidth',
             'MSA.activity.feedbackPanelHeight',
             'MSA.activity.terminalRadius',
             'MSA.activity.nodeWidth',
             'MSA.activity.nodeHeight',
             'MSA.activity.backgroundImage',
             'MSA.activity.backgroundImageScaling')
});

MSA.NodeTypesView = SC.CollectionView.extend({
  tagName: 'ul',
  contentBinding: "MSA.diagramRulesController.nodeTypes"
});

// add missing textarea tag attributes
MSA.TextArea = SC.TextArea.extend({
  attributeBindings: ['rows', 'cols', 'wrap'],
  // reasonable defaults?
  cols: 50,
  rows: 4,
  wrap: "off"
});

// add size attribute to text field
MSA.TextField = SC.TextField.extend({
  attributeBindings: ['type', 'value', 'size'],
  type: "text",
  size: null
});

MSA.editorController = SC.Object.create({
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
    var features  = "menubar=no,location=no,titlebar=no,toolbar=no,resizable=yes,scrollbars=yes,status=no,width=750,height=650"; 

    // reuse existing window:
    if (editorWindow) {
      editorWindow.postMessage(value,"*");
      editorWindow.focus();
    }

    // or create a new one:
    else {
      editorWindow = window.open("ace.html", 'editorwindow', features);
      this.set('editorWindow', editorWindow);
      editorWindow.srcText = value;
      editorWindow.originParent = window;
    }
    editorWindow.setHelp(owner.helpDiv);
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
      console.log("no callback defined");
    }
  }
});

MSA.customRuleController = SC.Object.create({
  helpDiv: '#evalHelp',
  editCustomRule: function() {
    var value = MSA.activity.get('customRuleEvaluator');
    var callback = function(value) {
      MSA.activity.set('customRuleEvaluator',value);
    }.bind(this);
    MSA.editorController.editCustomRule(this,value,callback);
  }
});
