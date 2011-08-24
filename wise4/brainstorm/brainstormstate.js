/**
 * Object for storing the student's response to the brainstorm
 */
function BRAINSTORMSTATE(response, timestamp){
	this.type = "bs";
	this.response = response;
	if(arguments.length == 1) {
		this.timestamp = Date.parse(new Date());
	} else {
		this.timestamp = timestamp;
	};
};

BRAINSTORMSTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};

BRAINSTORMSTATE.prototype.getDataXML = function() {
	return "<response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
};

BRAINSTORMSTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new BRAINSTORMSTATE(reponse.textContent, timestamp.textContent);		
	}
};

/**
 * Takes in a state JSON object and returns an BRAINSTORMSTATE object
 * @param stateJSONObj a state JSON object
 * @return a BRAINSTORMSTATE object
 */
BRAINSTORMSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new BRAINSTORMSTATE object
	var brainState = new BRAINSTORMSTATE();
	
	//set the attributes of the BRAINSTORMSTATE object
	brainState.response = stateJSONObj.response;
	brainState.timestamp = stateJSONObj.timestamp;
	
	//return the BRAINSTORMSTATE object
	return brainState;
}

BRAINSTORMSTATE.prototype.getStudentWork = function() {
	return this.response;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/brainstorm/brainstormstate.js');
};