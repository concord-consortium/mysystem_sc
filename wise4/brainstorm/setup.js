var coreScripts = [
	'vle/node/brainstorm/BrainstormNode.js',
	'vle/node/brainstorm/brainstormEvents.js'
];

var studentVLEScripts = [
	'vle/jquery/js/jquery-1.4.4.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/node/common/nodehelpers.js',
	'vle/common/helperfunctions.js',
	'vle/node/brainstorm/brainstorm.js',
	'vle/node/brainstorm/brainstormstate.js',
	'vle/data/nodevisit.js'
];

var authorScripts = [
	'vle/node/brainstorm/authorview_brainstorm.js'
];

var gradingScripts = [
	'vle/node/brainstorm/brainstormstate.js'
];

var dependencies = [
	{child:"vle/node/brainstorm/BrainstormNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/brainstorm/brainstorm.css",
	"vle/node/common/css/niftyCorners.css"
];

var nodeClasses = [
	{nodeClass:'brainstorm', nodeClassText:'Brainstorm session'},
	{nodeClass:'qadiscuss', nodeClassText:'Q&A Discussion'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('brainstorm', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('brainstorm', css);

componentloader.addNodeClasses('BrainstormNode', nodeClasses);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/brainstorm/brainstormTemplate.bs',
		nodeExtension:'bs'
	}
];

componentloader.addNodeTemplateParams('BrainstormNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/brainstorm/setup.js');
};