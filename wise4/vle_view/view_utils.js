/**
 * The util object for this view
 * 
 * @author patrick lawler
 */
View.prototype.utils = {};

View.prototype.utilDispatcher = function(type, args, obj) {
	if (type == 'loadConfigComplete') {
		obj.initializeSession();
	} else if (type == 'maintainConnection') {
		obj.sessionManager.maintainConnection();
	} else if (type == 'renewSession') {
		// make a request to renew the session
		obj.connectionManager.request('GET', 2, obj.config.getConfigParam('indexUrl'), {}, null, obj);
	} else if (type == 'checkSession') {
		// check if session has been expired
		obj.sessionManager.checkSession();
	} else if(type == 'forceLogout') {
		obj.forceLogout();
	};
};

/**
 * Update the max score for the given nodeId. Create a MaxScores
 * object if one does not exist.
 * @param nodeIds the ids of the nodes in the project
 * @param maxScoreValue the new max score value
 */
View.prototype.getMaxScoresSum = function(nodeIds) {
	//check if maxScores has been set
	if(this.maxScores == null) {
		//it has not been set so we will make a new MaxScores object
		return 0;
	} else {
		return this.maxScores.getMaxScoresSum(nodeIds);
	}
};

/**
 * Get the project meta data such as max score values
 */
View.prototype.getProjectMetaData = function() {
	//get the url to retrieve the project meta data
	var projectMetaDataUrl = this.getConfig().getConfigParam('projectMetaDataUrl');
	
	if(projectMetaDataUrl && projectMetaDataUrl != ""){
		var projectMetaDataCallbackSuccess = function(text, xml, args) {
			var thisView = args[0];
			
			if(text != null && text != "") {
				//thisView.processMaxScoresJSON(text);
				thisView.projectMetadata = thisView.$.parseJSON(text);
				
				var maxScores = thisView.projectMetadata.maxScores;
				if(maxScores == null || maxScores == "") {
					maxScores = "[]";
				}
				thisView.processMaxScoresJSON(maxScores);
			}
	
			thisView.projectMetaDataRetrieved = true;
			eventManager.fire("getProjectMetaDataComplete");
		};
		
		var projectMetaDataCallbackFailure = function(text, args) {
			var thisView = args[0];
			thisView.projectMetaDataRetrieved = true;
			eventManager.fire("getProjectMetaDataComplete");
		};
		
		var projectMetaDataUrlParams = {
				command:"getProjectMetaData",
				projectId:this.getConfig().getConfigParam("projectId")
		};
		this.connectionManager.request('GET', 1, projectMetaDataUrl, projectMetaDataUrlParams, projectMetaDataCallbackSuccess, [this], projectMetaDataCallbackFailure);
	};
};

/**
 * Get the run extras such as the max scores
 * @return
 */
View.prototype.getRunExtras = function() {
	//get the url to retrieve the run extras
	var getRunExtrasUrl = this.getConfig().getConfigParam('getRunExtrasUrl');
	
	var runExtrasCallbackSuccess = function(text, xml, args) {
		var thisView = args[0];
		
		if(text != null && text != "") {
			thisView.processMaxScoresJSON(text);
		}

		thisView.runExtrasRetrieved = true;
		eventManager.fire("getRunExtrasComplete");
	};
	
	var runExtrasCallbackFailure = function(text, args) {
		var thisView = args[0];
		thisView.runExtrasRetrieved = true;
		eventManager.fire("getRunExtrasComplete");
	};
	
	this.connectionManager.request('GET', 1, getRunExtrasUrl, null, runExtrasCallbackSuccess, [this], runExtrasCallbackFailure);
};



/**
 * Parses and sets or merges the new max scores
 * @param maxScoresJSON
 */
View.prototype.processMaxScoresJSON = function(maxScoresJSON) {
	//parse the max scores JSON
	var newMaxScores = MaxScores.prototype.parseMaxScoresJSONString(maxScoresJSON);
	
	//see if the max scores has already been set
	if(this.maxScores == null) {
		//it has not been set so we will set it
		this.maxScores = newMaxScores;
	} else {
		//it has been set so we will merge the new max scores
		this.maxScores.mergeMaxScores(newMaxScores);
	}
};


/**
 * Returns whether the content string contains an applet by searching for
 * an open and close applet tag in the content string.
 */
View.prototype.utils.containsApplet = function(content){
	/* check for open and close applet tags */
	var str = content.getContentString();
	if(str.indexOf("<applet") != -1 && str.indexOf("</applet>") != -1) {
		return true;
	} else {
		return false;
	};
};

/**
 * Given a string of a number of bytes, returns a string of the size
 * in either: bytes, kilobytes or megabytes depending on the size.
 */
View.prototype.utils.appropriateSizeText = function(bytes){
	if(bytes>1048576){
		return this.roundToDecimal(((bytes/1024)/1024), 1) + ' mb';
	} else if(bytes>1024){
		return this.roundToDecimal((bytes/1024), 1) + ' kb';
	} else {
		return bytes + ' b';
	};
};


/**
 * Returns the given number @param num to the nearest
 * given decimal place @param decimal. (e.g if called 
 * roundToDecimal(4.556, 1) it will return 4.6.
 */
View.prototype.utils.roundToDecimal = function(num, decimal){
	var rounder = 1;
	if(decimal){
		rounder = Math.pow(10, decimal);
	};

	return Math.round(num*rounder)/rounder;
};

/**
 * Inserts the applet param into the the given content
 * @param content the content in which to insert the param
 * @param name the name of the param
 * @param value the value of the param
 */
View.prototype.utils.insertAppletParam = function(content, name, value){
	/* get the content string */
	var str = content.getContentString();
	
	/* create the param string */
	var paramTag = '<param name="' + name + '" value="' + value + '">';
	
	/* check if the param already exists in the content */
	if(str.indexOf(paramTag) == -1) {
		/* add the param right before the closing applet tag */
		content.setContent(str.replace("</applet>", paramTag + "\n</applet>"));
	};
};


/**
 * Extracts the file servlet information from the given url and returns the result.
 */
View.prototype.utils.getContentPath = function(baseUrl, url){
	return url.substring(url.indexOf(baseUrl) + baseUrl.length, url.length);
};

/**
 * Returns the value of the currently selected option in a select element
 * with the given id.
 */
View.prototype.utils.getSelectedValueById = function(id){
	var select = document.getElementById(id);
	if(select){
		var opt = select.options[select.selectedIndex];
		if(opt){
			return opt.value;
		};
	};
	
	return '';
};

/**
 * Attempts to set the correct selected option in a select element
 * with the given id that has the given value.
 */
View.prototype.utils.setSelectedValueById = function(id, value){
	var select = document.getElementById(id);
	if(select && value){
		for(var a=0;a<select.options.length;a++){
			if(select.options[a].value == value){
				select.selectedIndex = a;
			};
		};
	};
};

/**
 * If the given string is undefined, null or false, returns an empty
 * string, otherwise, returns the given string.
 */
View.prototype.utils.resolveNullToEmptyString = function(str){
	if(str == null || str == 'null'){
		return '';
	};
	
	return str;
};

/**
 * Get all elements with the given class name
 * @param node
 * @param searchClass
 * @param tag
 * @return
 */
View.prototype.getElementsByClassName = function(node,searchClass,tag) {  
	var classElements = new Array();  
	if ( node == null )  
		node = document;  
	if ( tag == null )  
		tag = '*';  
	var els = node.getElementsByTagName(tag); // use "*" for all elements  
	var elsLen = els.length;  
	var pattern = new RegExp("\\b"+searchClass+"\\b");  
	for (i = 0, j = 0; i < elsLen; i++) {  
		if ( pattern.test(els[i].className) ) {  
			classElements[j] = els[i];  
			j++;  
		}  
	}  
	return classElements;  
};


/**
 * Get the latest node state for the given node
 * @param nodeId
 * @return a node state
 */
View.prototype.getLatestStateForNode = function(nodeId) {
	var nodeState = null;
	
	if(this.state != null) {
		for (var i=this.state.visitedNodes.length - 1; i>=0 ; i--) {
			var nodeVisit = this.state.visitedNodes[i];
			if (nodeVisit.getNodeId() == nodeId) {
				for (var j=nodeVisit.nodeStates.length - 1; j>=0; j--) {
					nodeState = nodeVisit.nodeStates[j];
					return nodeState;
				}
			}
		}	
	}
	
	return nodeState;
};

/**
 * Checks if the latest node state for the given node is locked
 * @param nodeId
 * @return whether the latest node state for the given node is locked
 */
View.prototype.isLatestNodeStateLocked = function(nodeId) {
	//get the latest node state for the given node
	var nodeState = this.getLatestStateForNode(nodeId);

	if(nodeState != null && nodeState.locked != null) {
		//return the locked value
		return nodeState.locked;
	} else {
		return false;
	}
};

/**
 * Returns the state for the current step
 * If the current step is not {HTML step || MySystem step || Draw step || MW step}, do nothing.
 */
View.prototype.getLatestStateForCurrentNode = function() {
	var currentNode = this.getCurrentNode();
	if (currentNode.type != "HtmlNode" 
			&& currentNode.type != "MySystemNode" 
			&& currentNode.type != "SVGDrawNode"
			&& currentNode.type != "MWNode") {
		return;
	} 
	var stringSoFar = "";   // build the data
	
	if(this.state != null) {
		var allNodeVisitsForCurrentNode = this.state.getNodeVisitsByNodeId(currentNode.id);
		for (var i=0; i<allNodeVisitsForCurrentNode.length; i++) {
			var nodeStates = allNodeVisitsForCurrentNode[i].nodeStates;
			if (nodeStates != null) {
				for (var j=0; j < nodeStates.length; j++) {
					if (nodeStates[j].data != "") {
						stringSoFar = nodeStates[j].data;
					}
				}
			}
		}
	}

	return stringSoFar;
};

/**
 * Save the max score the teacher has specified
 * @param runId
 * @param nodeId
 */
View.prototype.saveMaxScore = function(runId, nodeId) {
	/*
	 * updates the local copy of the max scores after the server
	 * has successfully updated it on the server
	 */
	var postMaxScoreCallback = function(text, xml, args) {
		var thisView = args[0];
		var maxScoreObj = null;
		
		try {
			//parse the json that is returned
			maxScoreObj = $.parseJSON(text);
		} catch(error) {
			//do nothing
		}
		
		if(maxScoreObj == null) {
			if(text == 'ERROR:LoginRequired') {
				//the user is not logged in because their session has timed out
				alert("Your latest grade has not been saved.\n\nYou have been inactive for too long and have been logged out. Please log back in to continue.");
				
				//redirect the user to the login page
				parent.window.location = "/webapp/j_spring_security_logout";
			} else {
				//there was a server error
				
				var nodeId = args[1];

				//revert the max score value to its previous value
				thisView.revertMaxScore(nodeId);
			}
		} else {
			//get the node id the max score is for
			var nodeId = maxScoreObj.nodeId;
			
			//get the value for the max score
			var maxScoreValue = maxScoreObj.maxScoreValue;
			
			//update the max score in the maxScores object
			thisView.updateMaxScore(nodeId, maxScoreValue);
		}
	};
	
	var postMaxScoreCallbackFail = function(text, args) {
		var thisView = args[0];
		var nodeId = args[1];
		
		//revert the max score value to its previous value
		thisView.revertMaxScore(nodeId);
	};
	
	//get the new max score the teacher has entered for this nodeId
	var maxScoreValue = document.getElementById("maxScore_" + nodeId).value;
	
	//parse the value from the text box to see if it is a valid integer
	var maxScoreValueInt = parseInt(maxScoreValue);
	
	//check that the value entered is a number greater than or equal to 0
	if(isNaN(maxScoreValueInt) || maxScoreValueInt < 0) {
		//the value is invalid so we will notify the teacher
		alert("Error: invalid Max Score value, please enter a value 0 or greater");
		
		//set the value back to the previous value
		document.getElementById("maxScore_" + nodeId).value = this.getMaxScoreValueByNodeId(nodeId);
		
		return;
	}
	
	//create the args used to update the max score on the server
	var postMaxScoreParams = {command: "postMaxScore", projectId: this.getProjectId(), nodeId: nodeId, maxScoreValue: maxScoreValue};
	
	//send the new max score data back to the server
	this.connectionManager.request('POST', 1, this.getConfig().getConfigParam('projectMetaDataUrl'), postMaxScoreParams, postMaxScoreCallback, [this, nodeId], postMaxScoreCallbackFail);
};

/**
 * Revert the max score value for a specific step
 * @param nodeId the id of the node that we are reverting the max score value for
 */
View.prototype.revertMaxScore = function(nodeId) {
	//display a message telling the teacher the max score value will be reverted back
	alert("Failed to save max score, the max score will be reverted back to its previous value.");
	
	//set the value back to the previous value
	document.getElementById("maxScore_" + nodeId).value = this.getMaxScoreValueByNodeId(nodeId);
};

/**
 * Get the max score for the specified step/nodeId
 * If there are no max scores or there is no max score
 * for the step/nodeId we will just return ""
 * @param nodeId the step/nodeId
 * @return the max score for the step/nodeId or ""
 */
View.prototype.getMaxScoreValueByNodeId = function(nodeId) {
	var maxScore = "0";
	
	//check if the max scores object has been set
	if(this.maxScores != null) {
		//get the max score for this step
		maxScore = this.maxScores.getMaxScoreValueByNodeId(nodeId) + "";	
	}
	
	return maxScore;
};

View.prototype.updateMaxScore = function(nodeId, maxScoreValue) {
	//check if maxScores has been set
	if(this.maxScores == null) {
		//it has not been set so we will make a new MaxScores object
		this.maxScores = new MaxScores();
	}
	
	//update the score for the given nodeId
	this.maxScores.updateMaxScore(nodeId, maxScoreValue);
};

View.prototype.getProjectId = function() {
	var projectId = "";
	
	if(this.portalProjectId != null) {
		//for when we are in authoring tool
		projectId = this.portalProjectId;
	} else {
		//for when we are in grading or student vle mode
		projectId = this.getConfig().getConfigParam("projectId");
	}
	
	if(projectId != null && projectId != "") {
		//parse the project to an int
		projectId = parseInt(projectId);
	}
	
	return projectId;
};

/**
 * Replaces the \n with a <br>
 * @param studentWork the student work, this may be a string or
 * an array with one element that is a string
 * @return a string with \n replaced with <br>
 */
View.prototype.replaceSlashNWithBR = function(studentWork) {
	
	if(studentWork == null) {
		//do nothing
	} else if (studentWork.constructor.toString().indexOf("Array") == -1) {
		//studentWork is not an array
		studentWork = studentWork.replace(/\n/g, "<br>");
	} else {
		//studentWork is an array
		studentWork = studentWork[0].replace(/\n/g, "<br>");
	}
	
	return studentWork;
};

/**
 * Logs the user out of the vle. We use this when their session has timed
 * out so that they don't continue working since their work won't save
 * after their session has timed out.
 */
View.prototype.forceLogout = function() {
	alert("You have been inactive for too long and have been logged out. Please log back in to continue.");
	parent.window.location = "/webapp/j_spring_security_logout";
};

/**
 * Get the idea basket for the given workgroup id
 * @param workgroupId the id of the workgroup we want the idea basket from
 * @return the idea basket from the given workgroup or null if not found
 */
View.prototype.getIdeaBasketByWorkgroupId = function(workgroupId) {
	var ideaBasket = null;
	
	if(this.getUserAndClassInfo().getWorkgroupId() == workgroupId) {
		//the user wants their own basket
		ideaBasket = this.ideaBasket;
	} else {
		//check if we have retrieved the idea baskets
		if(this.ideaBaskets != null) {
		
			//loop through all the idea baskets
			for(var x=0; x<this.ideaBaskets.length; x++) {
				var tempIdeaBasket = this.ideaBaskets[x];
				
				//compare the workgroup id of the idea basket
				if(tempIdeaBasket.workgroupId == workgroupId) {
					//we have found a match so we will break out of the for loop
					ideaBasket = tempIdeaBasket;
					break;
				}
			}
		}
	}
	
	return ideaBasket;
};

/**
 * Determines whether a nodeType knows how to render its grading view
 * @param nodeType the type of the node
 * @return whether this node type implements renderGradingView()
 */
View.prototype.isSelfRenderingGradingViewNodeType = function(nodeType) {
	var isSelfRenderingGradingView = false;
	
	if(nodeType != 'HtmlNode' && 
			nodeType != 'BrainstormNode' && 
			nodeType != 'FillinNode' && 
			nodeType != 'MatchSequenceNode' && 
			nodeType != 'MultipleChoiceNode' && 
			nodeType != 'NoteNode' && 
			nodeType != 'JournalEntryNode' && 
			nodeType != 'OutsideUrlNode' && 
			nodeType != 'OpenResponseNode' && 
			nodeType != 'BlueJNode' && 
			nodeType != 'DrawNode' && 
			nodeType != 'DataGraphNode' && 
			nodeType != 'MySystemNode' && 
			nodeType != 'SVGDrawNode' && 
			nodeType != 'MWNode' && 
			nodeType != 'AssessmentListNode' && 
			nodeType != 'ChallengeNode' && 
			nodeType != 'BranchNode') {
		isSelfRenderingGradingView = true;
	}
	
	return isSelfRenderingGradingView;
};

/**
 * Get the max possible score for the project
 * @return the max possible score for the project
 */
View.prototype.getMaxScoreForProject = function() {
	var maxScoreForProject = 0;
	
	//get all the node ids in the project
	var nodeIdsInProject = this.getProject().getNodeIds();
	
	if(this.maxScores != null) {
		//get the max scores sum for all the node ids 
		maxScoreForProject = this.maxScores.getMaxScoresSum(nodeIdsInProject);
	}
	
	return maxScoreForProject;
};

/**
 * Given a filename, returns the extension of that filename
 * if it exists, null otherwise.
 */
View.prototype.utils.getExtension = function(text){
	var ndx = text.lastIndexOf('.');
	if(ndx){
		return text.substring(ndx + 1, text.length);
	};

	return null;
};

/**
 * Callback function for when the dynamically created frame for uploading assets has recieved
 * a response from the request. Notifies the response and removes the frame.
 */
View.prototype.assetUploaded = function(e){
	var htmlFrame = e.target;
	var frame = window.frames[e.target.id];
	
	if(frame.document && frame.document.body && frame.document.body.innerHTML != ''){
		notificationManager.notify(frame.document.body.innerHTML, 3);
		
		/* set source to blank in case of page reload */
		htmlFrame.src = 'about:blank';
		
		/* cancel fired to clean up and hide the dialog */
		//eventManager.fire('assetUploadCancel');
		
		// refresh edit asset dialog
		if (e.target.getAttribute('type')=="student") {
			eventManager.fire('viewStudentAssets');			
		} else {
			eventManager.fire('viewAssets');
		}
		$('#assetProcessing').hide();
		
		/* change cursor back to default */
		document.body.style.cursor = 'default';
		
		document.getElementById('uploadAssetFile').setAttribute("name", 'uploadAssetFile');
	} else {
		document.body.removeChild(htmlFrame);
	}
};

/**
 * Initializes Session for currently logged in user.
 */
View.prototype.initializeSession = function(){
	this.sessionManager = new SessionManager(eventManager, this);
};

/**
 * Returns true if the given name is an allowed file type
 * to upload as asset, false otherwise.
 */
View.prototype.utils.fileFilter = function(extensions,name){
	return extensions.indexOf(this.getExtension(name).toLowerCase()) != -1;
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/view_utils.js');
};