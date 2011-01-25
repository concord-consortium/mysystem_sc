function MySystemSCState(state, timestamp) {
	this.type = "mysystem";
	this.data = state;
	
	if(timestamp == null) {
		this.timestamp = new Date().getTime();
	} else {
		this.timestamp = timestamp;
	}
};

/**
 * Gets the xml format for the student data
 * @return an xml string with the student data
 */
MySystemSCState.prototype.getDataXML = function() {
	var dataXML = "<data>" + this.data + "</data>";
	dataXML += "<timestamp>" + this.timestamp + "</timestamp>";
	return dataXML;
}

/**
 * Creates a state object from an xml object
 * @param stateXML an xml object
 * @return an MySystemSCState object
 */
MySystemSCState.prototype.parseDataXML = function(stateXML) {
	//obtain the data element
	var dataElement = stateXML.getElementsByTagName("data")[0];
	
	//obtain the timestamp element
	var timestampElement = stateXML.getElementsByTagName("timestamp")[0];
	
	//check if both elements exist
	if(dataElement != null && timestampElement != null) {
		//obtain the values for the data and timestamp
		var data = dataElement.textContent;
		var timestamp = timestampElement.textContent;
		
		//create an MySystemSCState
		var state = new MySystemSCState(data, timestamp);
		return state;
	} else {
		return null;
	}
}

/**
 * Takes in a state JSON object and returns an MySystemSCState object
 * @param stateJSONObj a state JSON object
 * @return a MySystemSCState object
 */
MySystemSCState.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new MySystemSCState object
	var MySystemSCState = new MySystemSCState();
	
	//set the attributes of the MySystemSCState object
	MySystemSCState.data = stateJSONObj.data;
	MySystemSCState.timestamp = stateJSONObj.timestamp;
	
	//return the MySystemSCState object
	return MySystemSCState;
}

/**
 * Get the student work.
 * @return the student's work
 */
MySystemSCState.prototype.getStudentWork = function() {
	return this.data;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mysystem/MySystemSCState.js');
};
