Mysystem2Node.prototype = new Node();
Mysystem2Node.prototype.constructor = Mysystem2Node;
Mysystem2Node.prototype.parent = Node.prototype;

/*
 * the name that displays in the authoring tool when the author creates a new step
 */
Mysystem2Node.authoringToolName = "My System 2"; 

/*
 * will be seen by the author when they add a new step to their project to help
 * them understand what kind of step this is
 */
Mysystem2Node.authoringToolDescription = "This is a generic step only used by developers";

/**
 * This is the constructor for the Node
 * 
 * @param nodeType
 * @param view
 */
function Mysystem2Node(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

/**
 * This function is called when the vle loads the step and parses
 * the previous student answers, if any, so that it can reload
 * the student's previous answers into the step.
 * 
 * @param stateJSONObj
 * @return a new state object
 */
Mysystem2Node.prototype.parseDataJSONObj = function(stateJSONObj) {
	return MYSYSTEM2STATE.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * This function is called if there needs to be any special translation
 * of the student work from the way the student work is stored to a
 * human readable form. For example if the student work is stored
 * as an array that contains 3 elements, for example
 * ["apple", "banana", "orange"]
 *  
 * and you wanted to display the student work like this
 * 
 * Answer 1: apple
 * Answer 2: banana
 * Answer 3: orange
 * 
 * you would perform that translation in this function.
 * 
 * Note: In most cases you will not have to change the code in this function
 * 
 * @param studentWork
 * @return translated student work
 */
Mysystem2Node.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * This function is called when the student exits the step. It is mostly
 * used for error checking.
 * 
 * Note: In most cases you will not have to change anything here.
 */
Mysystem2Node.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		if(this.contentPanel.save) {
			//tell the content panel to save
			this.contentPanel.save();
		}
	}
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
Mysystem2Node.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	//Get the latest student state object for this step
	var MYSYSTEM2STATE = nodeVisit.getLatestWork();
	
	/*
	 * get the step work id from the node visit in case we need to use it in
	 * a DOM id. we don't use it in this case but I have retrieved it in case
	 * someone does need it. look at SensorNode.js to view an example of
	 * how one might use it.
	 */
	var stepWorkId = nodeVisit.id;
	
	var studentWork = MYSYSTEM2STATE.getStudentWork();
	
	//put the student work into the div
	$('#' + divId).html(studentWork.response);
};

/**
 * Get the html file associated with this step that we will use to
 * display to the student.
 * 
 * @return a content object containing the content of the associated
 * html for this step type
 */
Mysystem2Node.prototype.getHTMLContentTemplate = function() {
	return createContent('node/mysystem2/mysystem2.html');
};

//Add this node to the node factory so the vle knows it exists.
NodeFactory.addNode('Mysystem2Node', Mysystem2Node);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mysystem2/Mysystem2Node.js');
};
