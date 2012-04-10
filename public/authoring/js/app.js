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
    "enableNodeLabelEditing": false,
    "enableNodeDescriptionEditing": false,
    "enableLinkDescriptionEditing": false,
    "enableLinkLabelEditing": false,
    "enableCustomRuleEvaluator": false,
    "customRuleEvaluator": "",
    "maxSubmissionClicks": 0,
    "maxSubmissionFeedback":  "You have clicked 'submit' too many times. Please continue working without hints.",
    "feedbackPanelWidth": 500,
    "feedbackPanelHeight": 250
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
  enableNodeLabelEditing: SCUtil.dataHashProperty,
  enableNodeDescriptionEditing: SCUtil.dataHashProperty,
  enableLinkDescriptionEditing: SCUtil.dataHashProperty,
  enableLinkLabelEditing: SCUtil.dataHashProperty,
  enableCustomRuleEvaluator: SCUtil.dataHashProperty,
  customRuleEvaluator: SCUtil.dataHashProperty,
  maxSubmissionClicks: SCUtil.dataHashProperty,
  maxSubmissionFeedback: SCUtil.dataHashProperty,
  feedbackPanelWidth: SCUtil.dataHashProperty,
  feedbackPanelHeight: SCUtil.dataHashProperty
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
  not: SCUtil.dataHashProperty,
  shouldOption: function(key, value) {
    if (value){
      this.set("not", value !== "should");
    }
    return this.get("not") ? "should not" : "should";
  }.property('not'),
  toggleHasLink: function(){
    this.set('hasLink', !this.get('hasLink'));
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
             'MSA.activity.feedbackPanelHeight')
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

MSA.customRuleController = SC.Object.create({
  editorWindow: null,

  editCustomRule: function() {
    var editorWindow = this.get('editorWindow');
    var features  = "menubar=no,location=no,titlebar=no,toolbar=no,resizable=yes,scrollbars=yes,status=no,width=400,height=600"; 
    var javascript = MSA.activity.get('customRuleEvaluator');

    // reuse existing window:
    if (editorWindow) {
      editorWindow.postMessage(javascript,"*");
      editorWindow.focus();
    }

    // or create a new one:
    else {
      editorWindow = window.open("ace.html", 'editorwindow', features);
      this.set('editorWindow', editorWindow);
      editorWindow.srcText = javascript;
      editorWindow.originParent = window;
    }
    var self = this;
    var updateMessage = function(event) {
      var message = JSON.parse(event.data);
      if (message.javascript) {
        MSA.activity.set('customRuleEvaluator',message.javascript);
      }
      if (message.windowClosed) {
        self.set('editorWindow',null);
      }
    };

    window.addEventListener("message", updateMessage, false);
  }

});
