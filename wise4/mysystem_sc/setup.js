var coreScripts = [
	'vle/node/mysystem/MySystemNode.js',
	'vle/node/mysystem/mySystemEvents.js',
	/* 
     * the following are needed here for showallwork 
     */
	'vle/node/mysystem/mysystem_complete.js',
    'vle/node/mysystem/mysystem_print.js'
];

var studentVLEScripts = [
	'vle/node/mysystem/mysystem_complete.js',
	'vle/node/mysystem/mysystem_print.js',
	'vle/jquery/js/jquery-1.4.2.min.js',
	'vle/jquery/js/jquery-ui-1.8.custom.min.js',
	'vle/jquery/js/jsonplugin.js'
];

var authorScripts = [
	'vle/node/mysystem/authorview_mysystem.js'
];

var gradingScripts = [
	'vle/node/mysystem/mysystemstate.js'
];

var dependencies = [
	{child:"vle/node/mysystem/MySystemNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	'vle/node/mysystem/css/YUI/reset-font-grids.css',
	'vle/node/mysystem/css/YUI/base-min.css',
	'vle/node/mysystem/css/YUI/sam.css',
	'vle/node/mysystem/css/WireIt.css',
	'vle/node/mysystem/css/WireItEditor.css',
	'vle/node/mysystem/css/mysystem.css'
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('mysystem', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('mysystem', css);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mysystem/setup.js');
};