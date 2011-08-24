/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;
BrainstormNode.authoringToolName = "Brainstorm Discussion";
BrainstormNode.authoringToolDescription = "Students post their answer for everyone in the class to read and discuss";
function BrainstormNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.audioSupported = true;
	this.serverless = true;
	this.prevWorkNodeIds = [];
};

/**
 * Determines if the this step is using a server back end.
 * @return
 */
BrainstormNode.prototype.isUsingServer = function() {
	if(this.content.getContentJSON().useServer) {
		//we are using a server back end
		this.serverless = false;
		return true;
	} else {
		//we are not using a server back end
		this.serverless = true;
		return false;
	}
};

/**
 * Takes in a state JSON object and returns a BRAINSTORMSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a BRAINSTORMSTATE object
 */
BrainstormNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return BRAINSTORMSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

NodeFactory.addNode('BrainstormNode', BrainstormNode);

BrainstormNode.prototype.getHTMLContentTemplate = function() {
	var content = null;
	if(this.isUsingServer()) {
		//using server
		content = createContent('node/brainstorm/brainfull.html');
	} else {
		//not using server
		content = createContent('node/brainstorm/brainlite.html');
	}
	return content;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/brainstorm/BrainstormNode.js');
};