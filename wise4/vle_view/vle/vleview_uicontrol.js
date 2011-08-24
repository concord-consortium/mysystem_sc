/**
 * Dispatches events that are specific to ui control
 */
View.prototype.uicontrolDispatcher = function(type,args,obj){
	if(type=='runManagerPoll'){
		obj.runManagerPoll();
	} else if(type=='lockScreenEvent'){
		if(args){
			obj.lockscreen(args[0]);
		} else {
			obj.lockscreen();
		}
	} else if(type=='unlockScreenEvent'){
		if(args){
			obj.unlockscreen(args[0]);
		} else {
			obj.unlockscreen();
		}
	} else if(type=='startVLEBegin'){
		obj.startRunManagerOnVLEStart();
	} else if(type=='logout') {
		obj.logout();
	}
};

/**
 * Creates the lockscreen dialog
 */
View.prototype.renderLockDialog = function(){
	document.body.appendChild(createElement(document,'div', {id:'lockscreen'}));
	$('#lockscreen').dialog({autoOpen:false,width:255,draggable:false,modal:true,resizable:false,closeText:'',dialogClass:'no-title'});
};

/**
 * Creates the login dialog
 */
View.prototype.renderLoginDialog = function(){
	document.body.appendChild(createElement(document,'div',{id:'loginDialog'}));
	$('#loginDialog').dialog({autoOpen:false,width:700,height:600,draggable:false,modal:true,resizable:false,closeText:'',dialogClass:'no-title'});
};

/**
 * Runs the runManager poll
 */
View.prototype.runManagerPoll = function(){
	if(this.runManager){
		this.runManager.poll();
	}
};

/**
 * Listens for the startVLEBegin event and creates and starts the run manager
 */
View.prototype.startRunManagerOnVLEStart = function(){
	if (this.config.getConfigParam('getRunInfoUrl') != null && this.config.getConfigParam('runInfoRequestInterval') != null) {
		this.runManager = new RunManager(this.config.getConfigParam('getRunInfoUrl'), parseInt(this.config.getConfigParam('runInfoRequestInterval')), this.config.getConfigParam('runId'), this);
	}
};

/**
 * Locks the user screen
 */
View.prototype.lockscreen = function(message) {
	if($('#lockscreen').size()==0){
		this.renderLockDialog();
	}
	
    if (message == null) {
    	message = "<table><tr align='center'>Your teacher has paused your screen.</tr><tr align='center'></tr><table>"
    }

    $('#lockscreen').html(message);
    $('#lockscreen').dialog('open');
};

/**
 * Unlock the user screen
 */
View.prototype.unlockscreen = function(message) {
	if($('#lockscreen').size()==0){
		this.renderLockDialog();
	}
	
	$('#lockscreen').html(message);
    $('#lockscreen').dialog('close');
};

/**
 * Logs out the user.
 */
View.prototype.logout = function() {
	//logs out the user by calling onunload with the argument true to logout
	window.onunload(true);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_uicontrol.js');
}