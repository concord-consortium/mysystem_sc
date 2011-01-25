var coreScripts = [
  'vle/node/mysystem_sc/MySystemNode.js',
  'vle/node/mysystem_sc/mySystemEvents.js',
  /* 
     * the following are needed here for showallwork 
     */
  'vle/node/mysystem_sc/mysystem_complete.js',
  'vle/node/mysystem_sc/mysystem_print.js'
  //TODO use some template engine, and recurse through files.
];

var studentVLEScripts = [
  'vle/node/mysystem_sc/mysystem_complete.js',
  'vle/node/mysystem_sc/mysystem_print.js',
  'vle/jquery/js/jquery-1.4.2.min.js',
  'vle/jquery/js/jquery-ui-1.8.custom.min.js',
  'vle/jquery/js/jsonplugin.js'
];

var authorScripts = [
  'vle/node/mysystem_sc/authorview_mysystem.js'
];

var gradingScripts = [
  'vle/node/mysystem_sc/mysystemstate.js'
];

var dependencies = [
  {child:"vle/node/mysystem_sc/MySystemNode.js", parent:["vle/node/Node.js"]}
];

var css = [
  'vle/node/mysystem_sc/css/YUI/reset-font-grids.css',
  'vle/node/mysystem_sc/css/YUI/base-min.css',
  'vle/node/mysystem_sc/css/YUI/sam.css',
  'vle/node/mysystem_sc/css/WireIt.css',
  'vle/node/mysystem_sc/css/WireItEditor.css',
  'vle/node/mysystem_sc/css/mysystem.css'
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('mysystem', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('mysystem', css);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
  eventManager.fire('scriptLoaded', 'vle/node/mysystem_sc/setup.js');
};
