
/**
 * A representation of a Brainstorm which can be either 
 * open_response or single_choice (not implemented) and
 * can run with a server or serverless
 * 
 * @author: patrick lawler
 */
function BRAINSTORM(node){
	this.node = node;
	this.content = node.getContent().getContentJSON();
	this.states = [];
	this.recentResponses = new Array();
	this.subscribed = false;
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};

};

/**
 * Prepares the html elements with the appropriate starter
 * options. NOTE: Assumes either brainlite.html or brainfull.html
 * are loaded.
 */
BRAINSTORM.prototype.prepareStarterSentence = function(){
	/* set starter sentence html element values */
	if(this.content.starterSentence.display=='2'){
		this.showStarter();
	};
	
	if(this.content.starterSentence.display!='1'){
		document.getElementById('starterParent').innerHTML = '';
	} else {
		document.getElementById('starterParent').innerHTML = "<div id='starterSentenceDiv' class='starterSentence'><a onclick='showStarter()'>Show Starter Sentence</a></div>";
	};
};

/**
 * Loads the serverless version that this brainstorm represents
 * 
 * @param frameDoc
 * @return
 */
BRAINSTORM.prototype.brainliteLoaded = function(frameDoc){
	var parent = frameDoc.getElementById('main');
	var nextNode = frameDoc.getElementById('studentResponseDiv');
	var old = frameDoc.getElementById('questionPrompt');
	
	if(old){
		parent.removeChild(old);
	};
	
	var newQuestion = createElement(frameDoc, 'div', {id: 'questionPrompt'});
	newQuestion.innerHTML = this.content.assessmentItem.interaction.prompt;
	
	parent.insertBefore(newQuestion, nextNode);
	
	/* clear any lingering responses */
	frameDoc.getElementById('studentResponse').value = '';
	
	//get the starterSentence from the xml if any
	this.prepareStarterSentence();

	if (this.states!=null && this.states.length > 0) {
		/*
		 * if the student has posted a response previously, we will display
		 * the canned responses as well as the responses the student has
		 * posted
		 */
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
		this.showCannedResponses(frameDoc);
		
		for(var x=0; x<this.states.length; x++) {
			var state = this.states[x];
			this.addStudentResponse(frameDoc, this.states[x].response, this.node.view.getWorkgroupId(), "responsestates" + x, this.node.view);
		}
	} else if(!this.content.isGated) {
		/*
		 * if the student has not posted before, but this brainstorm
		 * is not gated, we will display the canned responses for
		 * the student to see before they have posted any responses
		 * themselves 
		 */
		this.showCannedResponses(frameDoc);
	};
	
	/* start the rich text editor if specified */
	if(this.content.isRichTextEditorAllowed){
		var loc = window.location.toString();
		var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
		
		this.richTextEditor = new tinymce.Editor('studentResponse', 
				{theme:'advanced',
				plugins: 'safari,emotions',
				theme_advanced_buttons1: 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,emotions,|,forecolor,backcolor,|,formatselect,fontselect,fontsizeselect',
				theme_advanced_buttons2: '',
				theme_advanced_buttons3: '',
				relative_urls: false,
				remove_script_host: true,
				document_base_url: vleLoc,
				theme_advanced_toolbar_location : 'top',
				theme_advanced_toolbar_align : 'left'});
		
		/* render the rich text editor */
		this.richTextEditor.render();
	}
	
	this.node.view.eventManager.fire('contentRenderComplete', this.node.getNodeId(), this.node);
};

/**
 * Handles brainstorm when it has a server backend
 * @param frameDoc the dom object for the brainstorm html interface
 */
BRAINSTORM.prototype.brainfullLoaded = function(frameDoc) {
	//post the current node visit to the db without an end time
	if (this.state) {
		this.postCurrentNodeVisit(this.state.getCurrentNodeVisit());
	}
	this.recentResponses = new Array();
	var parent = frameDoc.getElementById('main');
	var nextNode = frameDoc.getElementById('studentResponseDiv');
	var old = frameDoc.getElementById('questionPrompt');
	
	if(old){
		parent.removeChild(old);
	};
	
	/*
	 * create the element that will display the question for the student to
	 * respond to
	 */
	var newQuestion = createElement(frameDoc, 'div', {id: 'questionPrompt'});
	newQuestion.innerHTML = this.content.assessmentItem.interaction.prompt;
	
	parent.insertBefore(newQuestion, nextNode);
	
	/* clear any lingering responses */
	frameDoc.getElementById('studentResponse').value = '';
	
	//get the starterSentence from the xml if any
	this.prepareStarterSentence();
	
	if (this.states!=null && this.states.length > 0) {
		/*
		 * if the student has previously posted a response to this brainstorm
		 * we will display all the canned and classmate responses. we do not
		 * need to display the responses in the states because all previous
		 * responses should have been posted to the server so they should
		 * show up from calling showClassmateResponses()
		 */
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
		this.showCannedResponses(frameDoc);
		this.showClassmateResponses(frameDoc);
		this.enableRefreshResponsesButton();
	} else if(!this.content.isGated) {
		/*
		 * if this brainstorm is not gated we will display all the canned
		 * and classmate responses
		 */
		this.showCannedResponses(frameDoc);
		this.showClassmateResponses(frameDoc);
		this.enableRefreshResponsesButton();
	};
	
	/* start the rich text editor if specified */
	if(this.content.isRichTextEditorAllowed){
		var loc = window.location.toString();
		var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
		
		this.richTextEditor = new tinymce.Editor('studentResponse', 
				{theme:'advanced',
				plugins: 'safari,emotions',
				theme_advanced_buttons1: 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,emotions,|,forecolor,backcolor,|,formatselect,fontselect,fontsizeselect',
				theme_advanced_buttons2: '',
				theme_advanced_buttons3: '',
				relative_urls: false,
				remove_script_host: true,
				document_base_url: vleLoc,
				theme_advanced_toolbar_location : 'top',
				theme_advanced_toolbar_align : 'left'});
		
		/* render the rich text editor */
		this.richTextEditor.render();
	} 
	
	this.node.view.eventManager.fire('contentRenderComplete', this.node.id, this.node);
};

/**
 * Displays the responses class mates have posted
 * @param frameDoc the dom object for the brainstorm html interface
 */
BRAINSTORM.prototype.showClassmateResponses = function(frameDoc){
	if (this.node.view.config.getConfigParam('mode') == "run") {
		//make the request to get posts made by class mates and then display those posts
		this.node.view.connectionManager.request(
				'GET', 
				2, 
				this.node.view.config.getConfigParam('getStudentDataUrl'), 
				{type: 'brainstorm', periodId: this.node.view.userAndClassInfo.getPeriodId(), 
					inOrder: true, 
					userId: this.node.view.userAndClassInfo.getWorkgroupId() + ":" + this.node.view.userAndClassInfo.getClassmateIdsByPeriodId(this.node.view.userAndClassInfo.getPeriodId()), 
					runId:  this.node.view.config.getConfigParam('runId'), 
					nodeId: this.node.getNodeId()
				}, 
				getClassmateResponsesCallback, 
				{frameDoc: frameDoc, 
					recentResponses: this.recentResponses, 
					vle: this.node.view
				}
		);
	};
};

/**
 * A response callback function that calls the showClassmateResponses function
 * @param eventName the name of the event
 * @param fireArgs the args passed to the event when the event is fired
 * @param subscribeArgs the args passed to the event when the event is
 * 		subscribed to 
 */
BRAINSTORM.prototype.showClassmateResponsesCallback = function(eventName, fireArgs, subscribeArgs) {
	subscribeArgs.bs.showClassmateResponses(subscribeArgs.frameDoc);
};

/**
 * This function is used by array.sort(function) which sorts an array
 * using the function that is passed in.
 * This function looks at the timestamp attribute of objects and 
 * sorts them in chronological order, from oldest to newest.
 */
function sortByTimestamp(object1, object2) {
	//get the timestamp values
	var timestamp1 = object1.timestamp;
	var timestamp2 = object2.timestamp;
	
	/*
	 * return a negative value if 1 comes before 2
	 * return 0 if values are the same
	 * return a positive value if 1 comes after 2
	 */
	return timestamp1 - timestamp2;
}

/**
 * The callback function for displaying class mate posts. After it displays
 * all the class mate posts, we will display the student's recent post from
 * the recentResponses array.
 * @param responseText the response text from the async request
 * @param responseXML the response xml from the async request
 * @param handlerArgs the extra arguments used by this function
 */
function getClassmateResponsesCallback(responseText, responseXML, handlerArgs) {
	
	if(responseText) {
		//the responseText should be json
		
		//parse the json
		visits = $.parseJSON(responseText);
		
		//used for adding responses to the student UI
		var frameDoc = handlerArgs.frameDoc;
		var responsesParent = frameDoc.getElementById('responses');
		
		/*
		 * the array that holds objects that represent a response. the
		 * object contains a userId, responseText, timestamp 
		 */
		var responseStates = new Array();
		
		//loop through the visits
		for(var x=0; x<visits.length; x++) {
			//obtain a visit
			var visitObj = visits[x];
			
			//create a node visit object from the json data
			var nodeVisitObj = NODE_VISIT.prototype.parseDataJSONObj(visitObj.data, handlerArgs.vle);
			
			//set the id of the node visit object
			nodeVisitObj.id = visitObj.stepWorkId;
			
			//obtain the userId
			var userId = visitObj.userId;
			
			//loop through the states in the visit
			for(var y=0; y<nodeVisitObj.nodeStates.length; y++) {
				//obtain a state
				var nodeState = nodeVisitObj.nodeStates[y];
				
				/*
				 * create an object that will contain the userId, responseText,
				 * and timestamp
				 */ 
				var responseState = new Object();
				responseState.userId = userId;
				responseState.responseText = nodeState.getStudentWork();
				responseState.timestamp = nodeState.timestamp;
				
				//add the responseState object to the array
				responseStates.push(responseState);
			}
		}
		
		//sort the array by timestamp using the function we wrote
		responseStates.sort(sortByTimestamp);
		
		//loop through the responseStates
		for(var z=0; z<responseStates.length; z++) {
			//obtain a responseState
			var responseState = responseStates[z];
			
			//obtain the userId and responseText
			var userId = responseState.userId;
			var responseText = responseState.responseText;
			
			//create a DOM id for the response we will add to the student's UI
			var localResponseId = "response" + responsesParent.childNodes.length;
			
			//add the response to the UI
			BRAINSTORM.prototype.addStudentResponse(frameDoc, responseText, userId, localResponseId, handlerArgs.vle);
		}
	} else {
		/*
		 * obtain the frameDoc from the handlerArgs. the frameDoc is the
		 * dom object for the brainstorm html interface
		 */
		var frameDoc = handlerArgs.frameDoc;
		
		/*
		 * retrieve the response(s) the student has posted during this current
		 * node visit
		 */ 
		var recentResponses = handlerArgs.recentResponses;
		
		//the student's vle
		var vle = handlerArgs.vle;
		
		//obtain the dom object that holds all the responses
		var responsesParent = frameDoc.getElementById('responses');
		
		/*
		 * node_visits are wrapped in a workgroup tag, the same workgroup may show
		 * up multiple times in the xml if that workgroup posted multiple times
		 */
		var workgroups = responseXML.getElementsByTagName("workgroup");

		//loop through all the workgroups
		for(var x=0; x<workgroups.length; x++) {
			//obtain the userId (same as workgroupId)
			var userId = workgroups[x].attributes.getNamedItem("userId").nodeValue;
			
			//the data is the node state xml text
			var data = workgroups[x].getElementsByTagName("data")[0];
			if(data != null && data != "") {
				/*
				 * obtain all the responses from the node state data. each node
				 * state can have multiple response tags if the student posted
				 * multiple times in a single node visit
				 */
				var responses = data.getElementsByTagName("response");

				//loop through the responses in this node visit
				for(var y=0; y<responses.length; y++) {
					//obtain the text the student wrote and posted
					var postText = responses[y].firstChild.nodeValue;

					//create a unique dom id for the response
					var localResponseId = "response" + responsesParent.childNodes.length;

					//add the posted response to the user interface
					BRAINSTORM.prototype.addStudentResponse(frameDoc, postText, userId, localResponseId, vle);
				};
			};
		};
		
		BRAINSTORM.prototype.showRecentResponses(frameDoc, recentResponses, responsesParent, vle);
	};
};

/**
 * This displays the responses made by the author/teacher. This
 * is used in server as well as serverless mode.
 * @param frameDoc the dom object that contains all the brainstorm
 * 		elements
 */
BRAINSTORM.prototype.showCannedResponses = function(frameDoc){
	/* get parent */
	var responsesParent = frameDoc.getElementById('responses');
	
	/* remove any old children */
	while(responsesParent.firstChild){
		responsesParent.removeChild(responsesParent.firstChild);
	};
	
	if (this.content.cannedResponses) {
		/* create new response elements for each response in canned responses and append to parent */
		for(var p=0;p<this.content.cannedResponses.length;p++){
			var response = createElement(frameDoc, 'div', {rows: '7', cols:  '100', disabled: true, id: this.content.cannedResponses[p].name});
			var responseTitle = createElement(frameDoc, 'div', {id: 'responseTitle_' + this.content.cannedResponses[p].name});
			responseTitle.innerHTML = 'Posted By: &nbsp;' + this.content.cannedResponses[p].name;
			responseTitle.appendChild(createElement(frameDoc, 'br'));
			responseTitle.appendChild(response);
			responseTitle.setAttribute('class', 'responseTitle');
			response.innerHTML = this.content.cannedResponses[p].response;
			response.setAttribute('class', 'responseTextArea');

			responsesParent.appendChild(responseTitle);
			responsesParent.appendChild(createElement(frameDoc, 'br'));
		};
	};
	
};

/**
 * Displays the responses made by the student during this node visit.
 * These responses have not been posted back to the server yet which
 * is why we need to keep a local copy of them until they have been
 * posted back to the server. This is only used in server mode.
 * @param frameDoc the dom object that contains all the brainstorm
 * 		elements
 * @param recentResponses an array of responses that the student has
 * 		made during this node visit
 * @param responsesParent the dom object of the parent element for 
 * 		the brainstorm
 * @param vle this student's vle
 */
BRAINSTORM.prototype.showRecentResponses = function(frameDoc, recentResponses, responsesParent, vle) {
	/*
	 * loop through all the response(s) the student has posted during the
	 * current node visit and display them
	 */
	for(var z=0; z< recentResponses.length; z++) {
		/*
		 * display the responses the student has just posted during the
		 * current node visit
		 */
		var recentResponse = recentResponses[z];
		BRAINSTORM.prototype.addStudentResponse(frameDoc, recentResponse, vle.getWorkgroupId(), "response" + responsesParent.childNodes.length, vle);
	};
};

/**
 * When the save button is clicked, this function is called. It will save
 * the student's response in the node state and then display everyone's
 * responses including this current one just saved.
 * @param frameDoc the dom object that contains all the brainstorm elements
 */
BRAINSTORM.prototype.save = function(frameDoc){
	if (this.node.view.config.getConfigParam('mode') != "run") {
		return;
	};
	if(this.richTextEditor){
		frameDoc.getElementById('studentResponse').value = this.richTextEditor.getContent();
	};
	
	var response = frameDoc.getElementById('studentResponse').value
	
	//obtain the dom object that holds all the responses
	var responsesParent = frameDoc.getElementById('responses');
	
	/*
	 * clear out all the responses from the last time we loaded
	 * them so we do not have any duplicates. down below, we will 
	 * re-load all of the responses again including any new responses.
	 */
	while(responsesParent.firstChild){
		responsesParent.removeChild(responsesParent.firstChild);
	};
	
	if(response && response!=""){
//		if(this.node.view){
			var currentState = new BRAINSTORMSTATE(response);
			eventManager.fire('pushStudentWork',currentState);
			this.states.push(currentState);
//			this.node.view.state.getCurrentNodeVisit().nodeStates.push(currentState);
//		} else {
//			var currentState = new BRAINSTORMSTATE(response);
//			this.states.push(currentState);
//		};
		
		frameDoc.getElementById('saveMsg').innerHTML = "<font color='8B0000'>save successful</font>";
		
		this.recentResponses.push(response);
		
		//display the canned responses
		this.showCannedResponses(frameDoc);
		
		//check if we are using a server backend
		if(this.content.useServer) {
			/*
			 * we are using a server backend so we can retrieve other students'
			 * responses
			 */
			
			/*
			 * post the current node visit to the db immediately without waiting
			 * for the student to exit the step.
			 */
			this.node.view.postCurrentNodeVisit(this.node.view.state.getCurrentNodeVisit());

			this.showClassmateResponses(frameDoc);
			
			/*
			 * check if we have already subscribed to the event otherwise the
			 * callback will be called multiple times
			 */
			//if(!this.subscribed) {
				/*
				 * subscribe to the processPostResponseComplete event so we know when
				 * we can request all the classmate responses. these classmate
				 * responses also contain the current student using the vle which
				 * is why we need to wait for the post from below to return
				 * before calling showClassmateResponsesCallback()
				 */
				//this.node.view.eventManager.subscribe('processPostResponseComplete', this.showClassmateResponsesCallback, {frameDoc: frameDoc, bs: this});
				//this.subscribed = true;
			//}
			
			/*
			 * post the current node visit to the db immediately without waiting
			 * for the student to exit the step.
			 */
			//this.node.view.postCurrentNodeVisit(this.node.view.state.getCurrentNodeVisit());
		} else {
			for(var x=0; x<this.states.length; x++) {
				var state = this.states[x];
				this.addStudentResponse(frameDoc, this.states[x].response, this.node.view.getUserAndClassInfo().getWorkgroupId(), "responsestates" + x, this.node.view);
			}
		}
		
		//make the "check for new responses" button clickable
		this.enableRefreshResponsesButton();
	} else {
		frameDoc.getElementById('saveMsg').innerHTML = "<font color='8B0000'>nothing to save</font>";
	};
};

/**
 * Add the response to the brainstorm display. This function is used to display
 * canned responses, classmate responses, and recent responses.
 * @param frameDoc the dom object that contains all the brainstorm display elements
 * @param responseText the text a student has posted in response to the question
 * @param userId the id of the student who made this post
 * @param localResponseId a local dom id for the response element we are going to make
 * @param vle the vle of the student who is logged in
 */
BRAINSTORM.prototype.addStudentResponse = function(frameDoc, responseText, userId, localResponseId, vle) {
	//obtain the dom object that holds all the responses
	var responsesParent = frameDoc.getElementById('responses');
	
	//create the response and response title elements
	var responseTextArea = createElement(frameDoc, 'div', {rows: '7', cols:  '80', disabled: true, id: localResponseId});
	var responseTitle = createElement(frameDoc, 'div', {id: 'responseTitle_' + localResponseId});
	
	//set the html for the response title
	responseTitle.innerHTML = 'Posted By: &nbsp;' + vle.getUserAndClassInfo().getUserNameByUserId(userId);
	responseTitle.appendChild(createElement(frameDoc, 'br'));
	responseTitle.appendChild(responseTextArea);
	responseTitle.setAttribute('class', 'responseTitle');
	
	//set the student text in the response textarea
	responseTextArea.innerHTML = responseText;
	responseTextArea.setAttribute('class', 'responseTextArea');

	//add the whole response element into the parent container
	responsesParent.appendChild(responseTitle);
	responsesParent.appendChild(createElement(frameDoc, 'br'));
};

//REMOVE - for testing purposes
BRAINSTORM.prototype.getText = function(){
	var text = '';
	text += 'title: ' + this.title;
	text += '  anonAllowed: ' + this.isAnonymousAllowed;
	text += '  gated: ' + this.isGated;
	text += '  displayNameOption: ' + this.displayNameOption;
	text += '  richText: ' + this.isRichTextEditorAllowed;
	text += '  isPollEnded: ' + this.isPollEnded;
	text += '  isPollActive: ' + this.isInstantPollActive;
	text += '  questionType: ' + this.questionType;
	return text;
};

/**
 * Attempts to retrieve the contentbase url from project and inject
 * it into the content.
 */
BRAINSTORM.prototype.injectBaseRef = function(content){
	if (content.search(/<base/i) > -1) {
		// no injection needed because base is already in the html
		return content;
	} else {
	    // NATE!!
	    var cbu = contentBaseUrl;
	    if (this.node.ContentBaseUrl) {
	        cbu = this.node.ContentBaseUrl;
	    }
		var domain = 'http://' + window.location.toString().split("//")[1].split("/")[0];
		
		if(window.parent.vle){
			var baseRefTag = "<base href='" + window.parent.vle.project.cbu + "'/>";
		} else if(typeof vle!='undefined'){
			var baseRefTag = "<base href='" + vle.project.cbu + "'/>";
		} else {
			return content;
		};
		
		var headPosition = content.indexOf("<head>");
		var newContent = content.substring(0, headPosition + 6);  // all the way up until ...<head>
		newContent += baseRefTag;
		newContent += content.substring(headPosition+6);

		return newContent;
	};	
};

/**
 * Places the starter sentence, if provided, at the top of the
 * response and appends any of the student's work after it.
 */
BRAINSTORM.prototype.showStarter = function(){
	if(this.content.starterSentence.display != '0'){

		//get the response box element
		var responseBox = document.getElementById('studentResponse');
		
		//update normally if rich text editor is not available
		if(!this.richTextEditor){
			responseBox.value = this.content.starterSentence.sentence + '\n\n' + responseBox.value;
		} else {//otherwise, we need to set it in the editor instance
			this.richTextEditor.setContent(this.content.starterSentence.sentence + '<br/><br/>' + this.richTextEditor.getContent());
		};
		
		//link clicked, so remove it
		document.getElementById('starterParent').innerHTML = '';
	} else {
		this.node.view.notificationManager.notify("There is no starter sentence specified for this step", 3);
	};
};

/**
 * Retrieve responses again so that the student can see
 * all the latest responses
 * @param frameDoc
 */
BRAINSTORM.prototype.refreshResponses = function(frameDoc) {
	/*
	 * clear the responses because the show functions after this
	 * just append to the div
	 */
	this.clearResponses();
	
	//show the canned responses
	this.showCannedResponses(frameDoc);
	
	//check if we are using a server
	if(this.content.useServer) {
		//show the classmate responses by requesting them from the server
		this.showClassmateResponses(frameDoc);
	}
};

/**
 * Clears the responses div
 */
BRAINSTORM.prototype.clearResponses = function() {
	document.getElementById("responses").innerHTML = "";
};

/**
 * Makes the "Check for new responses" button clickable
 */
BRAINSTORM.prototype.enableRefreshResponsesButton = function() {
	document.getElementById("refreshResponsesButton").disabled = false;
};

/**
 * Makes the "Check for new responses" button not clickable
 */
BRAINSTORM.prototype.disableRefreshResponsesButton = function() {
	document.getElementById("refreshResponsesButton").disabled = true;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/brainstorm/brainstorm.js');
};