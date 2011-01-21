
MySystemSCNode.prototype = new Node();
MySystemSCNode.prototype.constructor = MySystemSCNode;
MySystemSCNode.prototype.parent = Node.prototype;
MySystemSCNode.authoringToolName = "My System";
MySystemSCNode.authoringToolDescription = "Students work on a diagram where they can add images and connect them with lines";
function MySystemSCNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
};


/**
 * Overrides Node.getPrompt() function
 * Retrieves the question/prompt the student reads for this step.
 * @return a string containing the prompt. (the string may be an
 * html string)
 */
MySystemSCNode.prototype.getPrompt = function() {
	var prompt = "";
	
	if(this.content != null) {
		//get the content for the node
		var contentJSON = this.content.getContentJSON();

		//see if the node content has an assessmentItem
		if(contentJSON != null && contentJSON.prompt != null) {
			prompt = contentJSON.prompt;	
		}
	}
	
	//return the prompt
	return prompt;
};

MySystemSCNode.prototype.updateJSONContentPath = function(base, contentString){
	var rExp = new RegExp(this.filename);
	this.content.replace(rExp, base + '/' + this.filename);
};

MySystemSCNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return MYSYSTEMSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * This is called when the node is exited
 * @return
 */
MySystemSCNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		try {
			/*
			 * check if the onExit function has been implemented or if we
			 * can access attributes of this.contentPanel. if the user
			 * is currently at an outside link, this.contentPanel.onExit
			 * will throw an exception because we aren't permitted
			 * to access attributes of pages outside the context of our
			 * server.
			 */
			if(this.contentPanel.onExit) {
				try {
					//run the on exit cleanup
					this.contentPanel.onExit();					
				} catch(err) {
					//error when onExit() was called, e.g. mysystem_sc editor undefined
				}
			}	
		} catch(err) {
			/*
			 * an exception was thrown because this.contentPanel is an
			 * outside link. we will need to go back in the history
			 * and then trying to render the original node.
			 */
			history.back();
			//setTimeout(function() {thisObj.render(this.ContentPanel)}, 500);
		}
	}
};

MySystemSCNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/mysystem_sc/mysystem_sc.html');
};

NodeFactory.addNode('MySystemSCNode', MySystemSCNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mysystem_sc/MySystemSCNode.js');
};
