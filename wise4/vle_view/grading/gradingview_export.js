
/**
 * Generate the student navigation XLS. This will ask the
 * teacher to save the XLS file.
 */
View.prototype.getAllStudentWorkXLSExport = function() {
	this.setParamsForXLSExport();
	document.getElementById('exportType').value = 'allStudentWork';
	document.getElementById('getStudentXLSExport').submit();
};

/**
 * Generate the student work XLS. This will ask the
 * teacher to save the XLS file.
 */
View.prototype.getLatestStudentWorkXLSExport = function() {
	this.setParamsForXLSExport();
	document.getElementById('exportType').value = 'latestStudentWork';
	document.getElementById('getStudentXLSExport').submit();
};

View.prototype.getIdeaBasketsExcelExport = function() {
	this.setParamsForXLSExport();
	document.getElementById('exportType').value = 'ideaBaskets';
	document.getElementById('getStudentXLSExport').submit();
};

/**
 * Generate the nodeIdToNodeTitleArray which is used for
 * XLS export to display the node titles in the XLS. This
 * is a recursive function that modifies the global array
 * this.nodeIdToNodeTitleArray
 * @param node this should be the root node of the project
 */
View.prototype.getNodeIdToNodeTitlesMap = function(node) {
	var displayGradeByStepSelectPageHtml = "";
	
	if(node.isLeafNode()) {
		//this node is a leaf/step
		
		/*
		 * create the mapping of node id to node title delimited by &##58;
		 * &#58; is the ascii value of : and we use two #'s in case the
		 * author used a : in the step title to prevent collisions and
		 * corruption when parsing this after this string is sent
		 * back to the server
		 * e.g. node_1.html&##58;1. Introduction
		 */
		var nodeIdToNodeTitle = node.id + "###58;" + this.getProject().getVLEPositionById(node.id) + " " + node.title;

		/*
		 * add the mapping to the array that we are using to keep track
		 * of all the mappings. replace all commas , with &##44;
		 * &#44; is the ascii value of , and we use two #'s to prevent
		 * collisions and parsing errors
		 */
		this.nodeIdToNodeTitleArray.push(nodeIdToNodeTitle.replace(/,/g, "###44;"));
	} else {
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//call this function with each child
			this.getNodeIdToNodeTitlesMap(node.children[x]);
		}
	}
};

/**
 * Sets all the parameters that are required for the XLS
 * export.
 */
View.prototype.setParamsForXLSExport = function() {

	/*
	 * set the run id to an element that will be passed back to the server
	 * when the export to xls is called 
	 */
	document.getElementById('runId').value = this.getConfig().getConfigParam('runId');

	/*
	 * set the project title to an element that will be passed back to the server
	 */
	document.getElementById('projectName').value = this.project.getTitle();
	
	/*
	 * set the project path to an element that will be passed back to the server
	 */
	document.getElementById('projectPath').value = this.getConfig().getConfigParam('getProjectPath');

	/*
	 * set the type for the bridge controller to inspect
	 */
	document.getElementById('type').value = "xlsexport";
	
	/*
	 * set the url for where to get the xls
	 */
	document.getElementById('getStudentXLSExport').action = this.getConfig().getConfigParam('getXLSExportUrl');
};

/**
 * Show the total scores of all students
 * Go thru all of the classmates and get their score
 */
View.prototype.showScores = function() {
	var classmates = this.getUserAndClassInfo().vle.myClassInfo.classmates;
	var htmlSoFar = "score\tname\n";
	for (var i=0; i < classmates.length; i++) {
		var classmate = classmates[i];
		var classmateScore = annotations.getTotalScoreByToWorkgroup(classmate.workgroupId);
		htmlSoFar += classmateScore + "\t" + classmate.userName +"\n";
	}
	alert(htmlSoFar);
}

/**
 * Obtain the latest student work by calling render again to retrieve the
 * latest data.
 */
function refresh() {
	lock();	
	render(this.contentURL, this.userURL, this.getDataUrl, this.contentBaseUrl, this.getAnnotationsUrl, this.postAnnotationsUrl, this.runId, this.getFlagsUrl, this.postFlagsUrl);
}

/**
 * Export the grades in the specified format.
 * Currently supported format(s):
 *   CSV
 */
function exportGrades(exportType) {
	 //display the popup window that contains the export data
	 displayExportData(exportType);
	 
	 //send the export data to the server so it can echo it and we can save it as a file
	 vle.saveStudentWorkToFile(exportType);
}

var myMenu;

/**
 * Displays the export data in a new popup window. This is to allow
 * the teacher to be be able to copy and paste the export data
 * into their own text editor in case the data is too big and the
 * echo post fails causing the save dialog to not show up.
 *
 * @param exportType the file type to save the data as
 */
function displayExportData(exportType) {
	//make the new window
	var exportDataWin = window.open("", "exportData", "width=600,height=400");

	//get the export data from the vle
	var exportData = vle.getContentForFile(exportType);

	//make the message to display at the top of the pop up window
	var message = "<p>If you were asked to save the file you can ignore and close this window.</p>";
	message += "<p>If you were not asked to save the file, you can copy the contents in the box below and paste it into Notepad or Textedit and save it yourself.</p>";

	//make the textarea that will contain the export data
	var textBoxHtml = "<textarea rows='15' cols='70'>" + exportData + "</textarea>";

	//write the contents to the popup window
	exportDataWin.document.open();
	exportDataWin.document.write(message + textBoxHtml);
	exportDataWin.document.close();
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_export.js');
};