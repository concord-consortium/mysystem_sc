


/**
 * Only Show specified columns
 * @param a list of array of column names  arguments[]
 * if columnNames is null or empty, show all.
 */
View.prototype.showColumns = function() {
	if (arguments.length > 0) {
		// first hide all of the columns and then re-show the specified columns
		$('.gradeColumn').css('display','none');
		for (var i=0; i<arguments.length; i++) {
			$('.' + arguments[i]).css('display','');
		}
	} else {
		// show all
		$('.gradeColumn').css('display','');
	}
};


/**
 * Callback for the onlyShowFilteredItems check box
 */
View.prototype.onlyShowFilteredItemsOnClick = function() {
	/*
	 * check if the "onlyShowFilteredItemsCheckBox" exists, it will for 
	 * gradebystep but won't for gradebyteam
	 */
	if(document.getElementById("onlyShowFilteredItemsCheckBox") != null) {
		// check if the checkbox is checked
		var isChecked = document.getElementById("onlyShowFilteredItemsCheckBox").checked;
		if (isChecked) {
			// only show filtered items
			$('#studentWorkTable').filter('[isFlagged=false]').css('display','none');
			this.gradingShowFlagged = true;
		} else {
			// show all items
			$('#studentWorkTable tr').css('display','');
			this.gradingShowFlagged = false;
		}
	}
};

/**
 * Callback for the onlyShowFilteredItems check box
 */
View.prototype.onlyShowWorkOnClick = function() {
	var onlyShowWorkCheckBox = document.getElementById("onlyShowWorkCheckBox");
	
	if(onlyShowWorkCheckBox) {
		// check if the checkbox is checked
		var isChecked = document.getElementById("onlyShowWorkCheckBox").checked;
		if (isChecked) {
			// only show filtered items
			this.showColumns('workColumn');
			
			this.gradingHidePersonalInfo = true;
		} else {
			// show all items
			this.showColumns();
			
			this.gradingHidePersonalInfo = false;
		}		
	}
};


/**
 * Displays the steps in the project and then gets the student work
 */
View.prototype.initiateGradingDisplay = function() {
	eventManager.fire("initiateGradingDisplayStart");
	
	//obtain the grading permission from the iframe window url
	var permissionSearch = window.location.search.match(/permission=(\w*)/);
	
	if(permissionSearch != null && permissionSearch.length > 1) {
		//we found the permission parameter, we will now obtain the value
		this.gradingPermission = window.location.search.match(/permission=(\w*)/)[1];	
	} else {
		//permission parameter was not found so we will default to read
		this.gradingPermission = "read";
	}
	
	this.gradingType = this.getConfig().getConfigParam('gradingType');
	
	if(this.gradingType == "step") {
		this.displayGradeByStepSelectPage();	
	} else if(this.gradingType == "team") {
		this.displayGradeByTeamSelectPage();
	}
	
	this.getRevisions = false;
	
	if(this.getConfig().getConfigParam('getRevisions') == "true") {
		this.getRevisions = true;
	}
	
	this.getPeerReviewWork();
	this.getStudentWork();
};

/**
 * Generate the html that displays the table that contains the
 * buttons at the top of the grading pages
 * @return an html table containing buttons
 */
View.prototype.getGradingHeaderTableHtml = function() {
	var getGradingHeaderTableHtml = "";
	//generate the buttons for other grading views and the export and refresh buttons
	getGradingHeaderTableHtml += "<table id='gradingHeaderTable' class='gradingHeaderTable' name='gradingHeaderTable'>";
	getGradingHeaderTableHtml += "<tr class='runButtons'><td colspan='2'>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_grade_by_step",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('displayGradeByStepSelectPage')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_grade_by_team",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('displayGradeByTeamSelectPage')\"></input>";
	
	var runInfoStr = this.config.getConfigParam('runInfo');
	if (runInfoStr != null && runInfoStr != "") {
		var runInfo = JSON.parse(runInfoStr);
		if (runInfo.isStudentAssetUploaderEnabled != null &&
				runInfo.isStudentAssetUploaderEnabled) {
			getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_view_student_uploaded_files",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('displayStudentUploadedFiles')\"></input>";
		}
	}
	
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_export_latest_student_work",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('getLatestStudentWorkXLSExport')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_export_all_student_work",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('getAllStudentWorkXLSExport')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_export_idea_baskets",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('getIdeaBasketsExcelExport')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_check_for_new_student_work",this.config.getConfigParam("locale"))+"' onClick=\"eventManager.fire('refreshGradingScreen')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.i18n.getString("grading_button_save_changes",this.config.getConfigParam("locale"))+"' onClick=\"notificationManager.notify('Changes have been successfully saved.')\"></input>";
	getGradingHeaderTableHtml += "</td></tr></table>";

	return getGradingHeaderTableHtml;
};

/**
 * Generate and set the html to display the page for the teacher
 * to select a team to grade 
 */
View.prototype.displayGradeByTeamSelectPage = function() {
	//perform any display page startup tasks
	this.displayStart("displayGradeByTeamSelectPage");
	
	var displayGradeByTeamSelectPageHtml = "";
	
	//show the grading header buttons such as export and the other grading pages
	displayGradeByTeamSelectPageHtml += this.getGradingHeaderTableHtml();
	
	//display Grade by Team header
	//"+this.i18n.getString("grading_grade_by_step",this.config.getConfigParam("locale"))+"
	
	displayGradeByTeamSelectPageHtml += "<div id='gradeStepHeader'>"+this.i18n.getString("grading_grade_by_team_header",this.config.getConfigParam("locale"))+"</div>";
	
	//get the html that will be used to filter workgroups by period
	displayGradeByTeamSelectPageHtml += this.getPeriodRadioButtonTableHtml("displayGradeByTeamSelectPage");

	//start the table that will contain the teams to choose
	displayGradeByTeamSelectPageHtml += "<table id='chooseTeamToGradeTable' class='chooseTeamToGradeTable tablesorter'>";
	
	//the header row
	displayGradeByTeamSelectPageHtml += "<thead><tr><th class='gradeColumn col1'>"+this.i18n.getString("period",this.config.getConfigParam("locale"))+"</th>"+
			"<th class='gradeColumn col2'>"+this.i18n.getString("team",this.config.getConfigParam("locale"))+"</th>"+
			"<th class='gradeColumn col3'>"+this.i18n.getString("grading_grade_by_team_teacher_graded_score",this.config.getConfigParam("locale"))+"<br/><span style='font-size:85%''>("+this.i18n.getString("grading_grade_by_step_scored_items_only",this.config.getConfigParam("locale"))+")</span></th>"+
			"<th>"+this.i18n.getString("grading_grade_by_step_items_to_review",this.config.getConfigParam("locale"))+"</th><th>"+this.i18n.getString("grading_grade_by_team_percentage_project_completed",this.config.getConfigParam("locale"))+"</th></tr></thead>";
	
	//retrieve an array of classmate objects in alphabetical order
	var classmatesInAlphabeticalOrder = this.getUserAndClassInfo().getClassmatesInAlphabeticalOrder();
	
	//get the node ids in the project
	var nodeIds = this.getProject().getNodeIds();
	
	//get the max score for the project
	var maxScoresSum = this.getMaxScoresSum(nodeIds);
	
	//get all the teacher workgroup ids including owner and shared
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	displayGradeByTeamSelectPageHtml += "<tbody>";
	
	//loop through all the student work objects
	for(var x=0; x<classmatesInAlphabeticalOrder.length; x++) {
		//get a vleState
		var student = classmatesInAlphabeticalOrder[x];
		
		//get the workgroup id
		var workgroupId = student.workgroupId;

		//get the user names for the workgroup
		var userNames = student.userName.replace(/:/g, "<br>");
		
		//get the period the workgroup is in
		var periodName = student.periodName;

		//add classes for styling
		var studentTRClass = "showScoreRow studentWorkRow period" + periodName;
		
		//get the cumulative score for the workgroup
		var totalScoreForWorkgroup = this.annotations.getTotalScoreByToWorkgroupAndFromWorkgroups(workgroupId, teacherIds);
		
		//add the html row for this workgroup
		displayGradeByTeamSelectPageHtml += "<tr class='" + studentTRClass + "' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\"><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'>" + userNames + "</td><td class='showScoreScoreColumn'>" + totalScoreForWorkgroup + " / " + maxScoresSum + "</td><td id='teamNumItemsNeedGrading_" + workgroupId + "'></td><td style='padding-left: 0pt;padding-right: 0pt' id='teamPercentProjectCompleted_" + workgroupId + "'></td></tr>";
		
		//showScoreSummaryHtml += "<tr class='" + studentTRClass + "'><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'>" + userNames + "</td><td class='showScoreScoreColumn'>" + totalScoreForWorkgroup + " / " + maxScoresSum + "</td></tr>";
	}
	
	displayGradeByTeamSelectPageHtml += "</tbody>";
	
	displayGradeByTeamSelectPageHtml += "</table>";
	
	//set the html into the div so it is displayed
	document.getElementById('gradeWorkDiv').innerHTML = displayGradeByTeamSelectPageHtml;
	
	//calculate and display the grading statistics
	this.calculateGradingStatistics("team");
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * Displays all students' uploaded files for this run in a popup
 * @return
 */
View.prototype.displayStudentUploadedFiles = function() {
	//check if the studentAssetsDiv exists
	if($('#studentAssetsDiv').size()==0){
		//it does not exist so we will create it
		$('#gradeWorkDiv').append('<div id="studentAssetsDiv" style="margin-bottom:.3em;"></div>');
				var assetEditorDialogHtml = "<div id='studentAssetEditorDialog' style='display: none;'><div class='hd'><div>Students' Files</div>" 
					+ "<div id='notificationDiv'></div>"
					+ "<div id='allStudentsAssets' class='bd'>"
					+ "</div></div><div class='bd'>"
					+ "</div></div>";
		$('#studentAssetsDiv').html(assetEditorDialogHtml);		
    }
	
	var done = function(){
		$('#studentAssetsDiv').dialog('close');			
	};

	$('#studentAssetsDiv').dialog({autoOpen:false,closeText:'',resizable:true,width:800,height:600,position:[0, 0],top:'20px',modal:true,title:'Students\' Uploaded Files', buttons:{'Done':done}});

	var displayStudentAssets = function(workgroupAssetListsStr, view) {
		// clear out the panel
		$("#allStudentsAssets").html("");
		$('#studentAssetsDiv').dialog('open');
		$('#studentAssetEditorDialog').show();

		var getStudentUploadsBaseUrl = view.config.getConfigParam("getStudentUploadsBaseUrl");
		var workgroupAssetLists = JSON.parse(workgroupAssetListsStr);
		for (var i=0; i<workgroupAssetLists.length; i++) {
			var workgroupAssetList = workgroupAssetLists[i];
			var workgroupAssetsArr = workgroupAssetList.assets.split("~");
			var currWorkgroupId = workgroupAssetList.workgroupId;
			var htmlForWorkgroup = "<div><h3>" + view.userAndClassInfo.getUserNameByUserId(currWorkgroupId) + "</h3>"
					+ "<ul>";
			for (var k=0; k < workgroupAssetsArr.length; k++) {
				var assetName = workgroupAssetsArr[k];
				var fileWWW = getStudentUploadsBaseUrl + "/" + currWorkgroupId + "/" + assetName;
				htmlForWorkgroup += "<li><a target=_blank href='"+fileWWW+"'>" + assetName + "</a></li>";
			}
			htmlForWorkgroup += "</ul></div>";
			$("#allStudentsAssets").append(htmlForWorkgroup);
		}
	};
	
	var workgroupsInClass = this.userAndClassInfo.getWorkgroupIdsInClass().join(":");
	this.connectionManager.request('POST', 1, this.getConfig().getConfigParam("viewStudentAssetsUrl"), {forward:'assetmanager', workgroups:workgroupsInClass, command: 'assetList'}, function(txt,xml,obj){displayStudentAssets(txt,obj);}, this);	
};

/**
 * Displays all the steps in the project as links. When a step is clicked on,
 * the user will be brought to a page that displays all the work for that
 * step from all students in the run.
 */
View.prototype.displayGradeByStepSelectPage = function() {
	//perform any display page startup tasks
	this.displayStart("displayGradeByStepSelectPage");
	
	//the html that will display all the steps in the project
	var displayGradeByStepSelectPageHtml = "";

	//show the grading header buttons such as export and the other grading pages
	displayGradeByStepSelectPageHtml += this.getGradingHeaderTableHtml();
	
	//display Grade by Step header
	displayGradeByStepSelectPageHtml += "<div id='gradeStepHeader'>"+this.i18n.getString("grading_grade_by_step_header",this.config.getConfigParam("locale"))+"</div>";
	
	//get the html that will be used to filter grading statistics by period
	displayGradeByStepSelectPageHtml += this.getPeriodRadioButtonTableHtml("displayGradeByStepSelectPage");
	
	displayGradeByStepSelectPageHtml += "<table id='statisticsTable'><tr><td class='col1'></td>" +
				"<td class='header col2'>"+this.i18n.getString("grading_grade_by_step_point_value",this.config.getConfigParam("locale"))+"<br/><span style='font-size:80%'>"+this.i18n.getString("grading_grade_by_step_editable",this.config.getConfigParam("locale"))+"</span></td>"+
				"<td class='header col3'>"+this.i18n.getString("grading_grade_by_step_items_to_review",this.config.getConfigParam("locale"))+"</td><td class='header col4'>"+this.i18n.getString("grading_grade_by_step_average_class_score",this.config.getConfigParam("locale"))+"<br><span style='font-size:80%'>("+this.i18n.getString("grading_grade_by_step_scored_items_only",this.config.getConfigParam("locale"))+")</span></td>"+
				"<td class='header col5'>"+this.i18n.getString("grading_grade_by_step_percent_completed_step",this.config.getConfigParam("locale"))+"</td></tr></table>";
	
	//start the table that will contains links for the steps
	displayGradeByStepSelectPageHtml += "<table id='chooseStepToGradeTable' class='chooseStepToGradeTable'><tbody>";

	//reset the activity counter used to label activity numbers
	this.activityNumber = 0;
	
	/*
	 * get the html that displays all the steps for the project as links
	 * to pages where the teacher can grade the step
	 */
	displayGradeByStepSelectPageHtml += this.displayGradeByStepSelectPageHelper(this.getProject().getRootNode());

	//close the table
	displayGradeByStepSelectPageHtml += "</tbody></table><div id='lowerSaveButton'><input type='button' value='"+this.i18n.getString("grading_button_save_changes",this.config.getConfigParam("locale"))+"' onClick=\"notificationManager.notify('Changes have been successfully saved.')\"></input></div>";

	//set the html into the div
	unlock();
	document.getElementById('gradeWorkDiv').innerHTML = displayGradeByStepSelectPageHtml;
	
	//calculate and display grading statistics
	this.calculateGradingStatistics("step");
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * Recursive function that accumulates the html that displays all the activities
 * and steps in a project
 */
View.prototype.displayGradeByStepSelectPageHelper = function(node) {
	var displayGradeByStepSelectPageHtml = "";
	var nodeId = node.id;
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		//get the position as seen by the student
		var position = this.getProject().getVLEPositionById(nodeId);
		
		/* add the right html to the displayGradeByStepSelectPageHtml based on the given node's type */
		if(node.type == "HtmlNode" || node.type == "OutsideUrlNode") {
			displayGradeByStepSelectPageHtml += this.getGradeByStepSelectPageLinklessHtmlForNode(node, position, node.type);
		} else if(node.type=='DuplicateNode'){
			displayGradeByStepSelectPageHtml += this.getGradeByStepSelectPageHtmlForDuplicateNode(node, position);
		} else {
			displayGradeByStepSelectPageHtml += this.getGradeByStepSelectPageLinkedHtmlForNode(node, position, node.type);
		}
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display the activity number and title
			displayGradeByStepSelectPageHtml += "<tr><td class='chooseStepToGradeActivityTd'><h4>A" + this.activityNumber + ". " + node.getTitle() + "</h4></td><td class='header col2'></td><td class=' header col3'></td><td class='header col4'></td><td class='header col5'></td></tr>";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayGradeByStepSelectPageHtml += this.displayGradeByStepSelectPageHelper(node.children[x]);
		}
	}

	return displayGradeByStepSelectPageHtml;
};

/**
 * Creates and returns the linkless html for nodes given the node and the type. The
 * type is generally the node type but if this is being generated for a duplicate
 * node then the type is changed to reference the node that it is duplicating.
 * 
 * @param node
 * @param position
 * @param type
 */
View.prototype.getGradeByStepSelectPageLinklessHtmlForNode = function(node, position, type){
	return "<tr><td class='chooseStepToGradeStepTd' colspan='5'><p>" + position + " " + node.getTitle() + " [" + type + "]</p></td></tr>";
};

/**
 * Creates and returns the html for duplicate nodes given the node and the position.
 * 
 * @param node
 * @param position
 */
View.prototype.getGradeByStepSelectPageHtmlForDuplicateNode = function(node, position){
	var realNode = node.getNode();
	var realPosition = this.getProject().getVLEPositionById(realNode.id);
	var type = 'Duplicate for ' + realNode.type + ' at ' + realPosition;
	
	return this.getGradeByStepSelectPageLinklessHtmlForNode(realNode, position, type);
};

/**
 * Creates and returns the linked html for nodes given the node, the position and the
 * type. The type is generally the node type but if this is being generated for a duplicate
 * node then the type is changed to reference the node that it is duplicating.
 * 
 * @param node
 * @param position
 * @param type
 */
View.prototype.getGradeByStepSelectPageLinkedHtmlForNode = function(node, position, type){
	//get the max score for this step, or "" if there is no max score
	var maxScore = this.getMaxScoreValueByNodeId(node.id);
	
	//create the tds for the period all statistics
	statisticsForNode = "<td class='statistic studentWorkRow periodAll' id='stepNumItemsNeedGrading_" + node.id + "'></td><td class='statistic studentWorkRow periodAll' id='stepAverageScore_" + node.id + "'></td><td style='padding-left: 0pt;padding-right: 0pt' class='statistic studentWorkRow periodAll' id='stepPercentStudentsCompleted_" + node.id + "'></td>";
	
	//get the periods set up for this run by the teacher, this is a : delimited string
	var periodNamesString = this.getUserAndClassInfo().getPeriodName();
	
	//split the period names into an array
	var periodNamesArray = periodNamesString.split(":");
	
	//loop through all the period names
	for(var x=0; x<periodNamesArray.length; x++) {
		//get a period name
		var periodName = periodNamesArray[x];
		
		//create the td statistics for the current period name
		statisticsForNode += "<td class='statistic studentWorkRow period" + periodName + "' id='stepNumItemsNeedGrading_" + node.id + "_period" + periodName + "' style='display:none'></td><td class='statistic studentWorkRow period" + periodName + "' id='stepAverageScore_" + node.id + "_period" + periodName + "' style='display:none'></td><td class='statistic studentWorkRow period" + periodName + "' id='stepPercentStudentsCompleted_" + node.id + "_period" + periodName + "' style='display:none'></td>";
	}
	
	//get the grading permission
	var maxScorePermission = this.isWriteAllowed();
	
	//the regular link to grade by step, this will show revisions for all steps except MySystemNode and SVGDrawNode
	var nodeLink = "<a href='#' onClick='eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + position + "\", \"" + node.id + "\"])'>" + position + "&nbsp;&nbsp;" + node.getTitle() + "&nbsp;&nbsp;&nbsp;<span id='nodeTypeClass'>(" + type + ")</span></a>";
	
	//this is a node that students perform work for so we will display a link
	return "<tr><td class='chooseStepToGradeStepTd'>" + nodeLink + "</td><td class='chooseStepToGradeMaxScoreTd statistic'><input id='maxScore_" + node.id + "' type='text' value='" + maxScore + "' onblur='eventManager.fire(\"saveMaxScore\", [" + this.getConfig().getConfigParam('runId') + ", \"" + node.id + "\"])'" + maxScorePermission + "/></td>" + statisticsForNode + "</tr>";
};

/**
 * Obtains the number of rows the a textarea should have such that it will
 * not display vertical scrollbars
 * @param cols the number of columns in the textarea
 * @param value the text that is in the textarea
 * @return the number of rows to set for the textarea
 */
View.prototype.getTextAreaNumRows = function(cols, value) {
	//the number or rows the textarea should have to prevent a vertical scrollbar
	var newRowSize = 0;

	//the number of chars on the current line we're looking at
	var tempLineLength = 0;

	//the index of the last ' ' char
	var lastSpaceIndex = null;

	//the index of the last char that was used as a line break
	var lastLineBreak = 0;

	/*
	 * flag specifies whether any of the lines has overflowed past the right
	 * which causes a horizontal scrollbar to show up at the bottom of the
	 * textarea
	 */
	var overflow = false;

	//loop through each char in the value
	for(var x=0; x<value.length; x++) {
		//get the current char
		var c = value.charAt(x);

		if(c == '\n') {
			/*
			 * the char was a new line so we will increase the number of lines
			 * that we want in the textarea by 1
			 */
			newRowSize += 1;
			
			/* 
			 * set the last line break char index to the current x, this is
			 * used later to handle the overflow case
			 */
			lastLineBreak = x;

			/*
			 * set the temp line length to 0 since we will be starting on a new
			 * line since we've encountered a newline char
			 */
			tempLineLength = 0;

			/*
			 * set the last space index to null because we are starting on a new
			 * new line so there won't be a last space index yet
			 */
			lastSpaceIndex = null;
		} else if(c == ' ') {
			//set the last space index, this is used later to handle overflow
			lastSpaceIndex = x;

			//increase the count of the chars on the current line
			tempLineLength += 1;

			/*
			 * check if the current line is equal to or larger than the
			 * number of columns in the textarea
			 */
			if(tempLineLength >= cols) {
				//the line length was equal or larger so we need to move to a new line
				
				//increment the number of rows
				newRowSize += 1;

				//set the last line break char index to the current x 
				lastLineBreak = x;
				
				//reset the line length to 0 to get ready to count the next line's chars
				tempLineLength = 0;
			}
		} else if(c != ' ') {
			//increment the count of the chars on the current line
			tempLineLength += 1;

			/*
			 * check if the current line is equal to or larger than the
			 * number of columns in the textarea
			 */
			if(tempLineLength >= cols) {
				//get the next char in the line
				var nextCIndex = x + 1;
				var nextC = value.charAt(nextCIndex);

				if(nextC == ' ') {
					//the next char was a space or new line so we will end the line
					
					//increment the number of rows
					newRowSize += 1;

					//set the last line break char index to the next char
					lastLineBreak = nextCIndex;

					//reset the line length to 0 to get ready to count the next line's chars			
					tempLineLength = 0;
				} else if(nextC == '\n') {
					/*
					 * the next char is a new line but we don't need to do anything
					 * because when the x counter from the for loop moves to the 
					 * nextCIndex it will handle the new line
					 */
				} else {
					//next char is not a space or new line
					
					/*
					 * check if the last space index has already been used to
					 * count as a line break
					 */ 
					if(lastSpaceIndex == null || lastLineBreak == lastSpaceIndex) {
						/*
						 * we can't break up the line anymore which means this line
						 * will overflow past the right of the textarea and a 
						 * horizontal scrollbar will display at the bottom of the
						 * textarea
						 */
						overflow = true;
					} else {
						/*
						 * find the last space and end the line there since it hasn't 
						 * been used for a line break
						 */
						x = lastSpaceIndex;

						//increment the number of rows
						newRowSize += 1;

						//reset the line length to 0 to get ready to count the next line's chars
						tempLineLength = 0;

						/*
						 * set the last line break char index to the x that we have
						 * just updated
						 */ 
						lastLineBreak = x;
					}
				}
			}
		}
	}

	/*
	 * check if any lines overflowed past the right side, causing a horizontal
	 * scrollbar to show up
	 */
	if(overflow) {
		//provide an extra row to make up for the horizontal scrollbar
		newRowSize += 1;
	}

	/*
	 * provide an extra row so that there is an empty row at the bottom of the
	 * teacher comment to make it easier for teachers to place the cursor
	 * in the box to continue adding to the comment
	 */
	newRowSize += 1;

	/*
	 * return the number of rows the textarea should have so that there won't
	 * be a vertcal scroll bar
	 */
	return newRowSize;
};

/**
 * Sets the number of rows in the text area such that there are enough
 * rows to prevent a vertical scroll bar from displaying 
 * @param textArea a TextArea dom object
 */
View.prototype.resizeTextArea = function(textArea) {
	//get the number of cols in the textarea
	var cols = textArea.cols;

	//get the text in the text area
	var value = textArea.value;

	//check if the value is null
	if(value == null) {
		//set it to empty string
		value = "";
	}

	//set the number of rows
	textArea.rows = this.getTextAreaNumRows(cols, value);
};

/**
 * Displays the grading view for a step which includes all the student ids,
 * student work, and grading text box
 * @param stepNumber the position in the vle e.g. 1.3
 * @param nodeId the step to display the grading view for
 * @param showRevisions boolean whether to show revisions or not
 */
View.prototype.displayGradeByStepGradingPage = function(stepNumber, nodeId) {
	if(nodeId == null || nodeId == 'undefined') {
		return;
	}
	
	//perform any display page startup tasks
	this.displayStart("displayGradeByStepGradingPage", [stepNumber, nodeId]);
	
	var gradeByStepGradingPageHtml = "";
	
	//show the header with all the grading buttons
	gradeByStepGradingPageHtml += this.getGradingHeaderTableHtml();

	//show the step title and prompt
	gradeByStepGradingPageHtml += "<table class='objectToGradeHeaderTable'><tr><td class='objectToGradeTd'>" + stepNumber + " " + this.getProject().getNodeById(nodeId).getTitle() + "</td>";

	var previousAndNextNodeIds = this.getProject().getPreviousAndNextNodeIds(nodeId);
	
	//show the button to go to the previous step in the project
	var previousButtonEvent;
	if(previousAndNextNodeIds.previousNodeId) {
		previousButtonEvent = "eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + previousAndNextNodeIds.previousNodePosition + "\", \"" + previousAndNextNodeIds.previousNodeId + "\"])";
	} else {
		//if there is no previous step (because this is the first step), we will display a popup message
		previousButtonEvent = "alert(\""+this.i18n.getString("grading_previous_step_not_exist",this.config.getConfigParam("locale"))+"\")";
	}
	
	gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='" + previousButtonEvent + "'>"+this.i18n.getString("grading_previous_step",this.config.getConfigParam("locale"))+"</a></td>";
	
	//show the button to go back to select another step
	gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByStepSelectPage\")'>"+this.i18n.getString("grading_change_step",this.config.getConfigParam("locale"))+"</a></td>";
	
	//show the button to go to the next step in the project
	var nextButtonEvent;
	if(previousAndNextNodeIds.nextNodeId) {
		nextButtonEvent = "eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + previousAndNextNodeIds.nextNodePosition + "\", \"" + previousAndNextNodeIds.nextNodeId + "\"])";
	} else {
		//if there is no next step (because this is the last step), we will display a popup message
		nextButtonEvent = "alert(\""+this.i18n.getString("grading_next_step_not_exist",this.config.getConfigParam("locale"))+"\")";
	}
	
	gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='" + nextButtonEvent + "'>"+this.i18n.getString("grading_next_step",this.config.getConfigParam("locale"))+"</a></td>";
	
	gradeByStepGradingPageHtml += "</tr></table>";

	//show the button that toggles the question for the step
	gradeByStepGradingPageHtml += "<div class='questionContentContainer'><div class='questionContentHeader'><b>"+this.i18n.getString("grading_question",this.config.getConfigParam("locale"))+":</b>"+
		"<a href='#' onClick=\"eventManager.fire('togglePrompt', ['questionContentText_" + nodeId + "'])\">"+this.i18n.getString("grading_hide_show_question",this.config.getConfigParam("locale"))+"</a>";
	
	
	gradeByStepGradingPageHtml += "</div>";
	
	//get the prompt/question for the step
	var nodePrompt = this.getProject().getNodePromptByNodeId(nodeId);
	
	//the area where the question for the step will be displayed
	gradeByStepGradingPageHtml += "<div id='questionContentText_" + nodeId + "' class='questionContentText commentHidden'> " + nodePrompt + "</div></div>";

	//get the html that will display the radio buttons to filter periods
	gradeByStepGradingPageHtml += this.getPeriodRadioButtonTableHtml("displayGradeByStepGradingPage");
	
	//check if hide personal info check box was previously checked
	var hidePersonalInfoChecked = '';
	if(this.gradingHidePersonalInfo) {
		hidePersonalInfoChecked = 'checked';
	}
	
	//check box to hide personal info
	gradeByStepGradingPageHtml += "<div id='filterOptions'><input type='checkbox' id='onlyShowWorkCheckBox' onClick=\"eventManager.fire('onlyShowWorkOnClick')\" " + hidePersonalInfoChecked + "/>"+
		"<p>"+this.i18n.getString("grading_hide_personal_info",this.config.getConfigParam("locale"))+"</p>";
	
	//check if show flagged items check box was previously checked
	var showFlaggedChecked = '';
	if(this.gradingShowFlagged) {
		showFlaggedChecked = 'checked';
	}
	
	//check if show smart-filtered items check box was previously checked
	var showSmartFilteredChecked = '';
	if(this.gradingShowSmartFiltered) {
		showSmartFilteredChecked = 'checked';
	}
	
	//check box to filter only flagged items
	gradeByStepGradingPageHtml += "<input type='checkbox' id='onlyShowFilteredItemsCheckBox' value='show filtered items' onClick=\"eventManager.fire('filterStudentRows')\" " + showFlaggedChecked + "/>"+
		"<p>"+this.i18n.getString("grading_show_flagged_items_only",this.config.getConfigParam("locale"))+"</p>";

	//check box to filter only items that passed the smartfilter
	gradeByStepGradingPageHtml += "<input type='checkbox' id='onlyShowSmartFilteredItemsCheckBox' value='show filtered items' onClick=\"eventManager.fire('filterStudentRows')\" " + showSmartFilteredChecked + "/>"+
		"<p id='onlyShowSmartFilteredItemsText'>"+this.i18n.getString("grading_show_smart_filtered_items_only",this.config.getConfigParam("locale"))+"</p>";

	//check if enlarge student work check box was previously checked
	var enlargeStudentWorkTextChecked = '';
	if(this.gradingEnlargeStudentWorkText) {
		enlargeStudentWorkTextChecked = 'checked';
	}
	
	//check box for enlarging the student work text
	gradeByStepGradingPageHtml += "<input type='checkbox' id='enlargeStudentWorkTextCheckBox' value='show filtered items' onClick=\"eventManager.fire('enlargeStudentWorkText')\" " + enlargeStudentWorkTextChecked + "/>"
		+"<p>"+this.i18n.getString("grading_enlarge_student_work_text",this.config.getConfigParam("locale"))+"</p>";
	
	//check if show revisions check box was previously checked
	var showRevisionsChecked = '';
	if(this.gradingShowRevisions) {
		showRevisionsChecked = 'checked';
	}
	
	if(this.getRevisions) {
		//check box for showing all revisions
		gradeByStepGradingPageHtml += "<input type='checkbox' id='showAllRevisions' value='show all revisions' onClick=\"eventManager.fire('filterStudentRows')\" " + showRevisionsChecked + "/>"+
			"<p style='display:inline'>"+this.i18n.getString("grading_show_all_revisions",this.config.getConfigParam("locale"))+"</p>";
	}

	gradeByStepGradingPageHtml += "</div>";
	
	gradeByStepGradingPageHtml += "<div id='flaggedItems'></div>";

	//create the table that displays all the student data, student work, and grading text box
	gradeByStepGradingPageHtml += "<table border='1' id='studentWorkTable' class='studentWorkTable'>";

	//add the header for the table
	gradeByStepGradingPageHtml += "<tr><th class='gradeColumn workgroupIdColumn'>"+this.i18n.getString("team_caps",this.config.getConfigParam("locale"))+"</th>"+
		"<th class='gradeColumn workColumn'>"+this.i18n.getString("student_work",this.config.getConfigParam("locale"))+"</th>"+
		"<th class='gradeColumn gradingColumn'>"+this.i18n.getString("teacher_comment_and_score",this.config.getConfigParam("locale"))+"</th>"+
		"<th class='gradeColumn annotationColumn'>"+this.i18n.getString("tools",this.config.getConfigParam("locale"))+"</th></tr>";
	
	var vleStates = this.getVleStatesSortedByUserName();
	
	var runId = this.getConfig().getConfigParam('runId');
	
	var teacherId = this.getUserAndClassInfo().getWorkgroupId();
	
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	//get the node
	var node = this.getProject().getNodeById(nodeId);
	
	var nodeId = node.id;

	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		var workgroupId = vleState.dataId;

		//get the user names in the workgroup, with 2 <br>'s in between each user name
		var userNamesHtml = this.getUserNamesByWorkgroupId(workgroupId, 2);
		
		var stepWorkId = null;
		var studentWork = null;
		var latestNodeVisitPostTime = null;
		
		//get the revisions
		var nodeVisitRevisions = vleState.getNodeVisitsWithWorkByNodeId(nodeId);
		
		var latestNodeVisit = null;
		
		if(nodeVisitRevisions.length > 0) {
			//get the latest work for the current workgroup
			latestNodeVisit = nodeVisitRevisions[nodeVisitRevisions.length - 1];
		}
		
		if (latestNodeVisit != null) {
			stepWorkId = latestNodeVisit.id;
			studentWork = latestNodeVisit.getLatestWork();
			latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
		}
		
		/*
		 * retrieve any peer or teacher review data, if the current node is
		 * not a peer or teacher review type step, the function will just
		 * return the unmodified studentWork back
		 */
		studentWork = this.getPeerOrTeacherReviewData(studentWork, node, workgroupId, vleState);
		
		//get the annotations data for this student/step combination
		var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);
		var annotationCommentValue = annotationData.annotationCommentValue;
		var annotationScoreValue = annotationData.annotationScoreValue;
		var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
		
		//get the period name for this student
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);

		//get the latest flag value
		var latestFlag = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, 'flag');

		//default will be unchecked/unflagged
		var flagChecked = "";
		var isFlagged = 'false';
		
		//we found a flag annotation
		if(latestFlag) {
			//check if it is 'flagged' or 'unflagged'
			if(latestFlag.value == 'flagged') {
				//the value of the flag is 'flagged' so the checkbox will be checked
				flagChecked = " checked";
				isFlagged = 'true';
			}
		}
		
		//make the css class for the row
		var studentTRClass = "studentWorkRow period" + periodName;
		
		//see if there is any new work so we can add the css class to highlight the row
		if(latestAnnotationPostTime < latestNodeVisitPostTime) {
			studentTRClass += " newWork";
		}
		
		//make the row for this student
		gradeByStepGradingPageHtml += "<tr class='" + studentTRClass + "' id='studentWorkRow_"+workgroupId+"_"+nodeId+"_" + stepWorkId + "' isFlagged='" + isFlagged + "'>";
		
		var toggleRevisionsLink = "";
		if(nodeVisitRevisions.length > 1) {
			//there is more than one revision so we will display a link that will display the other revisions
			toggleRevisionsLink = "<br><br><a href='#' onClick=\"eventManager.fire('toggleGradingDisplayRevisions', ['" + workgroupId + "', '" + nodeId + "'])\">"+this.i18n.getString("grading_hide_show_revisions",this.config.getConfigParam("locale"))+"</a>";
		} else if(nodeVisitRevisions.length == 1) {
			if(this.getRevisions) {
				//we retrieved all revisions so that means there are no other revisions
				toggleRevisionsLink = "<br><br>"+this.i18n.getString("grading_no_revisions",this.config.getConfigParam("locale"));
			} else {
				//we only retrieved the latest revision so there may be other revisions
				toggleRevisionsLink = "<br><br>"+this.i18n.getString("grading_only_latest_revision_displayed",this.config.getConfigParam("locale"));
			}
		} else if(nodeVisitRevisions.length == 0) {
			//there are no revisions
			toggleRevisionsLink = "<br><br>"+this.i18n.getString("grading_no_revisions",this.config.getConfigParam("locale"));
		}
		
		//display the student workgroup id
		gradeByStepGradingPageHtml += "<td class='gradeColumn workgroupIdColumn'><a href='#' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\">" + userNamesHtml + "</a>"+
			"<br><br>["+this.i18n.getString("period",this.config.getConfigParam("locale"))+" " + periodName + "]" + toggleRevisionsLink + "</td>";
		
		//make the css class for the td that will contain the student's work
		var studentWorkTdClass = "gradeColumn workColumn";
		
		//check if we want to enable/disable grading for this student/row
		var isGradingDisabled = "";
		if(studentWork == null) {
			//the student has not done any work for this step so we will disable grading
			isGradingDisabled = "disabled";
		} else {
			//get the permission the currently logged in user has for this run
			isGradingDisabled = this.isWriteAllowed();
		}
		
		//get the html for the student work td
		gradeByStepGradingPageHtml += this.getStudentWorkTdHtml(studentWork, node, stepWorkId, studentWorkTdClass, latestNodeVisitPostTime);
		
		//make the css class for the td that will contain the score and comment boxes
		var scoringAndCommentingTdClass = "gradeColumn gradingColumn";
		
		//get the html for the score and comment td
		gradeByStepGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass);

		//make the css class for the td that will contain the flag checkbox
		var flaggingTdClass = "gradeColumn toolsColumn";
		
		//get the html for the flag td
		gradeByStepGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
		
		//close the row for the student
		gradeByStepGradingPageHtml += "</tr>";
		
		//check if there was more than one revision		
		if(nodeVisitRevisions.length > 1) {
			//loop through the revisions from most recent to oldest
			for(var revisionCount=nodeVisitRevisions.length - 2; revisionCount>=0; revisionCount--) {
				//get a node visit
				var nodeVisitRevision = nodeVisitRevisions[revisionCount];
				var revisionPostTime = nodeVisitRevision.visitPostTime;
				
				//get the work from the node visit
				var revisionWork = nodeVisitRevision.getLatestWork();
				
				//get the stepWorkId of the revision
				var revisionStepWorkId = nodeVisitRevision.id;
				
				//get the annotation data for the revision if any
				var annotationDataForRevision = this.getAnnotationDataForRevision(revisionStepWorkId);
				var annotationCommentValue = annotationDataForRevision.annotationCommentValue;
				var annotationScoreValue = annotationDataForRevision.annotationScoreValue;
				var latestAnnotationPostTime = annotationDataForRevision.latestAnnotationPostTime;
				
				var isGradingDisabled = "disabled";
				
				//default will be unchecked/unflagged
				var flagChecked = "";
				var isFlagged = 'false';
				
				//display the data for the revision
				gradeByStepGradingPageHtml += "<tr id='studentWorkRow_"+workgroupId+"_"+nodeId+"_" + revisionStepWorkId + "' class='studentWorkRow period" + periodName + " studentWorkRevisionRow studentWorkRevisionRow_" + workgroupId + "_" + nodeId + "' style='display:none' isFlagged='" + isFlagged + "'>";
				gradeByStepGradingPageHtml += "<td class='gradeColumn workgroupIdColumn'>" + userNamesHtml + "<br><br>Revision " + (revisionCount + 1) + "</td>";
				gradeByStepGradingPageHtml += this.getStudentWorkTdHtml(revisionWork, node, revisionStepWorkId, studentWorkTdClass, revisionPostTime);
				gradeByStepGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, revisionStepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass);
				gradeByStepGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, revisionStepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
				gradeByStepGradingPageHtml += "</tr>";
			}
		}
	}

	//close the table that contains all the student rows
	gradeByStepGradingPageHtml += "</table><div id='lowerSaveButton'><input type='button' value='"+this.i18n.getString("grading_button_save_changes",this.config.getConfigParam("locale"))+"' onClick=\"notificationManager.notify('Changes have been successfully saved.')\"></input></div>";

	//set the html in the div so the user can see it
	document.getElementById('gradeWorkDiv').innerHTML = gradeByStepGradingPageHtml;
	
	//render all the student work for the step
	this.renderAllStudentWorkForNode(node);
	
	// if this step is a mysystem step, call showDiagrams for each div that has student data
	if (node.type == "MySystemNode") {
		$(".mysystemCell").each(showDiagramNode);
	}
	
	// if this step is an svgdraw step, call showDrawNode for each div that has student data
	if (node.type == "SVGDrawNode") {
		$(".svgdrawCell").each(showDrawNode);
		$(".snapCell").each(showSnaps);
	}
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * Calculates the grading statistics for the gradingType
 * @param gradingType
 * @return
 */
View.prototype.calculateGradingStatistics = function(gradingType) {
	/*
	 * check to make sure the student work has been retrieved otherwise
	 * we can't calculate the statistics
	 */
	if(this.vleStates != null) {
		//check if gradingType was passed into this fuction
		if(gradingType == null) {
			//gradingType was not passed in so we will retrieve it from the config
			gradingType = this.getConfig().getConfigParam('gradingType');	
		}
		
		if(gradingType == "step") {
			//get statistics for gradebystep
			this.calculateGradeByStepGradingStatistics(this.getProject().getRootNode());	
		} else if(gradingType == "team") {
			//get statistics for gradebyteam
			this.calculateGradeByTeamGradingStatistics();
		}
		
	}
};

/**
 * Calculate and set the gradebyteam statistics
 * @return
 */
View.prototype.calculateGradeByTeamGradingStatistics = function() {
	/*
	 * get all the leaf nodes in the project except for HtmlNodes
	 * this is a : delimited string of nodeIds
	 */
	var nodeIds = this.getProject().getNodeIds("HtmlNode:OutsideUrlNode");
	
	//get the run id
	var runId = this.getConfig().getConfigParam('runId');
	
	//get the teacher id
	var teacherId = this.getUserAndClassInfo().getWorkgroupId();
	
	//get all the teacher ids
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<this.vleStates.length; x++) {
		//get a vleState
		var vleState = this.vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;
		
		//the number of items that need grading for the current workgroupId
		var numItemsNeedGrading = 0;
		
		//the number of steps the current workgroupId has completed
		var numStepsCompleted = 0;
		
		//loop through all the nodeIds
		for(var y=0; y<nodeIds.length; y++) {
			var nodeId = nodeIds[y];
			
			//get the latest work for the current workgroup 
			var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
			var latestNodeVisitPostTime = null;
			
			//check if there was any work
			if (latestNodeVisit != null) {
				//student has completed this step so we will increment the counter
				numStepsCompleted++;

				//get the timestamp for this latest work
				latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
			}
			
			//get the annotations data for this student/step combination
			var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);

			//get the timestamp for the latest annotation
			var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
			
			//see if the teacher has graded the latest work
			if(latestNodeVisitPostTime > latestAnnotationPostTime) {
				//the teacher has not graded the latest work
				numItemsNeedGrading++;
			}
		}
		
		//for the current team, calculate the percentage of the project they have completed
		var teamPercentProjectCompleted = Math.floor((numStepsCompleted / nodeIds.length) * 100) + "%";
		
		//display the percentage and an hr with a width of the percentage
		teamPercentProjectCompleted = teamPercentProjectCompleted + "<hr size=3 color='black' width='" + teamPercentProjectCompleted + "' align='left' noshade>";
		
		//total score is calculated within displayGradeByTeamSelectPage()
		
		//set the number of items that need scoring for this team
		document.getElementById("teamNumItemsNeedGrading_" + workgroupId).innerHTML = numItemsNeedGrading;
		
		//set the percentage of the project the team has completed
		document.getElementById("teamPercentProjectCompleted_" + workgroupId).innerHTML = teamPercentProjectCompleted;
	}

	
    // add parser through the tablesorter addParser method 
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'grades', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
        	
        	/*
        	 * the values in the column are like "9 / 10" so we need 
        	 * to sort by the number value before the '/'
        	 */
        	
        	//get the index of the '/'
        	var slashIndex = s.indexOf('/');
        	
        	/*
        	 * get only the number value before the '/', we need to
        	 * subtract 1 because the value is like "9 / 10" and we
        	 * want to get rid of the space before the '/'
        	 */
        	var score = s.substring(0, slashIndex - 1);

        	//return the value before the '/'
            return score; 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    }); 
     
    // add parser through the tablesorter addParser method 
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'completion', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
        	
        	/*
        	 * the values in the column are like "52%<hr>" so we need 
        	 * to sort by the value before '%'
        	 */
        	
        	//get the index of the '%'
        	var percentIndex = s.indexOf('%');
        	
        	// only get the number value before the '%'
        	var completion = s.substring(0, percentIndex);

        	//return the value before the '%'
            return completion; 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    }); 
    
    /*
     * make the table sortable by any of its columns
     * 
     * the 3rd column requires
     * special sorting because the values in that column are like
     * "9 / 10" so we need to sort by the number value before the '/'
     * 
     * the 5th column requires special sorting to only look at the
     * percentage value and to ignore the <hr>
     */
    $("#chooseTeamToGradeTable").tablesorter({ 
        headers: { 
            2: { 
                sorter:'grades' 
            },
    		4: { 
        		sorter:'completion' 
    		}
        } 
    }); 
	
	this.displayFinished();
};

/**
 * Calculate and set the gradebystep statistics
 * @param node
 * @return
 */
View.prototype.calculateGradeByStepGradingStatistics = function(node) {
	var nodeId = node.id;
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		if(node.type == "HtmlNode" || node.type == "OutsideUrlNode" || node.type == 'DuplicateNode') {

		} else {
			//calculate the grading statistics for this step
			var gradeByStepGradingStatistics = this.getGradeByStepGradingStatistics(nodeId);
			
			//set the average score for this step
			document.getElementById("stepAverageScore_" + nodeId).innerHTML = gradeByStepGradingStatistics.averageScore;
			
			//set the number of items that need scoring for this step
			document.getElementById("stepNumItemsNeedGrading_" + nodeId).innerHTML = gradeByStepGradingStatistics.numItemsNeedScoring;
			
			var percentStudentsCompletedStep = gradeByStepGradingStatistics.percentStudentsCompletedStep;
			
			//the default bar size, we will use this for the thickness of the hr
			var percentBarSize = 0;
			
			//check if the percent complete is 0%
			if(percentStudentsCompletedStep != '0%') {
				//set the thickness to 3
				percentBarSize = 3;
			}
			
			//display the percentage and an hr bar under it
			percentStudentsCompletedStep = percentStudentsCompletedStep + "<hr width='" + percentStudentsCompletedStep + "' size=" + percentBarSize + " color='black' align='left' noshade>";
			
			//set the percentage of the class that has completed this step
			document.getElementById("stepPercentStudentsCompleted_" + nodeId).innerHTML = percentStudentsCompletedStep;
			
			//loop through the periods
			for(var x=0; x<gradeByStepGradingStatistics.periods.length; x++) {
				//get the statistics for a period
				var periodGradingStatisticsObject = gradeByStepGradingStatistics.periods[x];
				
				//get the period name
				var periodName = periodGradingStatisticsObject.periodName;
				
				//get the statistics values
				var numItemsNeedScoring = periodGradingStatisticsObject.numItemsNeedGrading;
				var percentStudentsCompletedStep = periodGradingStatisticsObject.percentStudentsCompletedStep;
				var averageScore = periodGradingStatisticsObject.averageScore;
				
				//set the statistics values into the display elements
				document.getElementById("stepAverageScore_" + nodeId + "_period" + periodName).innerHTML = averageScore;
				document.getElementById("stepNumItemsNeedGrading_" + nodeId + "_period" + periodName).innerHTML = numItemsNeedScoring;
				document.getElementById("stepPercentStudentsCompleted_" + nodeId + "_period" + periodName).innerHTML = percentStudentsCompletedStep;
			}
		}
	} else {
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			this.calculateGradeByStepGradingStatistics(node.children[x]);
		}
	}
};

/**
 * Calculate the gradebystep statistics for a specific step
 * @param nodeId the node id of the step
 * @return an object containing the statistics values
 */
View.prototype.getGradeByStepGradingStatistics = function(nodeId) {
	//the object to contain the statistics values and return
	var gradingStatistics = {};
	
	//counter for the number of student work that needs grading
	var numItemsNeedGrading = 0;
	
	//get the run id
	var runId = this.getConfig().getConfigParam('runId');
	
	//get the teacher workgroup id
	var teacherId = this.getUserAndClassInfo().getWorkgroupId();
	
	//get all the teacher workgroup ids
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	//counter for the number of students who have completed work for this step
	var numStudentsCompletedStep = 0;
	
	//sum of all the scores that the teacher has given for this step, does not include non-scored
	var sumOfScoredValues = 0;
	
	//number of scores the teacher has given out, does not include non-scored
	var numOfScoredValues = 0;
	
	//the max score for this step
	var maxScore = this.getMaxScoreValueByNodeId(nodeId);
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<this.vleStates.length; x++) {
		//get a vleState
		var vleState = this.vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;
		
		//get the period name the current workgroupId is in
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);
		
		//get the statistics object for the period
		var periodGradingStatistics = this.getPeriodGradingStatisticsObject(gradingStatistics, periodName);

		//get the latest work for the current workgroup 
		var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
		var latestNodeVisitPostTime = null;
		
		//check if the student did any work for the step
		if (latestNodeVisit != null) {
			//increment the counter since this student did work for this step
			numStudentsCompletedStep++;
			periodGradingStatistics.numStudentsCompletedStep++;
			
			//get the timestamp for the work
			latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
		}
		
		//get the annotations data for this student/step combination
		var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);

		//get the graded score
		var annotationScoreValue = annotationData.annotationScoreValue;
		
		//get the timestamp of the grade if any
		var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
		
		//check if the teacher has given a score
		if(annotationScoreValue != null && annotationScoreValue != "") {
			//add the score to our sum
			sumOfScoredValues += parseFloat(annotationScoreValue);
			
			//add the score to the period statistics
			periodGradingStatistics.sumOfScoredValues += parseFloat(annotationScoreValue);
			
			//increment the number of scores the teacher has given out
			numOfScoredValues++;
			
			//increment the value in the period statistics
			periodGradingStatistics.numOfScoredValues++;
		}
		
		//check if the work is newer than the last time the teacher graded
		if(latestNodeVisitPostTime > latestAnnotationPostTime) {
			//this item needs grading so we will increment the counter
			numItemsNeedGrading++;
			
			//increment the value in the period statistics
			periodGradingStatistics.numItemsNeedGrading++;
		}
		
		periodGradingStatistics.numStudentsInPeriod++;
	}

	//calculate the percentage of students who have completed this step
	var percentStudentsCompletedStep = Math.floor((numStudentsCompletedStep / this.vleStates.length) * 100) + "%";
	
	//calculate the average score for the scores that were given for this step
	var averageScore = sumOfScoredValues / numOfScoredValues;
	
	if(isNaN(averageScore)) {
		averageScore = "na";
	} else {
		var averageScoreString = averageScore.toString();
		
		var indexOfDecimal = averageScoreString.indexOf(".");
		
		if(indexOfDecimal != -1) {
			//there is a decimal
			
			//get the digits after the decimal
			var substringOf = averageScoreString.substring(indexOfDecimal + 1);
			
			if(substringOf.length > 1) {
				/*
				 * there are more than two digits after the decimal so we will
				 * truncate down to two decimals
				 */
				averageScore = averageScore.toFixed(1);
			}
		}
	}
	
	//set the statistics into the object that we will return
	gradingStatistics.numItemsNeedScoring = numItemsNeedGrading;
	gradingStatistics.percentStudentsCompletedStep = percentStudentsCompletedStep;
	gradingStatistics.averageScore = averageScore;
	
	//calculate the statistics for all the periods
	this.calculatePeriodGradingStatistics(gradingStatistics);
	
	return gradingStatistics;
};

/**
 * Get the statistics object for a specific period. Creates an object
 * and sets it into the gradingStatistics periods array if it does not
 * exist
 * @param gradingStatistics the object that holds all the statistics
 * including the array of period statistics
 * @param periodName the name of the period
 * @return the statistics object for the period with the given name
 */
View.prototype.getPeriodGradingStatisticsObject = function(gradingStatistics, periodName) {
	//create an array to hold the period statistics if it does not exist
	if(gradingStatistics.periods == null) {
		gradingStatistics.periods = [];
	}
	
	var periodGradingStatisticsObject = null;
	
	/*
	 * loop through the array of period statistics objects to try to find
	 * the one we want
	 */
	for(var x=0; x<gradingStatistics.periods.length; x++) {
		//get a period
		var period = gradingStatistics.periods[x];
		
		//check if the period is the one we want
		if(period.periodName == periodName) {
			//we found the one we want
			periodGradingStatisticsObject = period;
			break;
		}
	}
	
	//check if we found the period we wanted
	if(periodGradingStatisticsObject == null) {
		/*
		 * we didn't find the one we wanted because it doesn't exist,
		 * we will now make it
		 */
		periodGradingStatisticsObject = {};
		periodGradingStatisticsObject.periodName = periodName;
		periodGradingStatisticsObject.numItemsNeedGrading = 0;
		periodGradingStatisticsObject.numStudentsCompletedStep = 0;
		periodGradingStatisticsObject.sumOfScoredValues = 0;
		periodGradingStatisticsObject.numOfScoredValues = 0;
		periodGradingStatisticsObject.numStudentsInPeriod = 0;
		
		//add the new period statistics object to the array
		gradingStatistics.periods.push(periodGradingStatisticsObject);
	}
	
	//return the period statistics object
	return periodGradingStatisticsObject;
};

/**
 * Calculate the statistics for all the periods in the gradingStatistics object
 * @param gradingStatistics the object that contains the array of period statistics values
 */
View.prototype.calculatePeriodGradingStatistics = function(gradingStatistics) {
	//create the array of periods if it does not exist
	if(gradingStatistics.periods == null) {
		gradingStatistics.periods = [];
	}
	
	//loop through all the periods
	for(var x=0; x<gradingStatistics.periods.length; x++) {
		//get a period
		var period = gradingStatistics.periods[x];
		
		//get the values needed to calculate the statistics
		var numStudentsCompletedStep = period.numStudentsCompletedStep;
		var numItemsNeedGrading = period.numItemsNeedGrading;
		var sumOfScoredValues = period.sumOfScoredValues;
		var numOfScoredValues = period.numOfScoredValues;
		var numStudentsInPeriod = period.numStudentsInPeriod;
		
		//calculate the percentage of students who have completed this step
		var percentStudentsCompletedStep = Math.floor((numStudentsCompletedStep / numStudentsInPeriod) * 100) + "%";
		
		//calculate the average score for the scores that were given for this step
		var averageScore = sumOfScoredValues / numOfScoredValues;
		
		if(isNaN(averageScore)) {
			averageScore = "na";
		} else {
			var averageScoreString = averageScore.toString();
			
			var indexOfDecimal = averageScoreString.indexOf(".");
			
			if(indexOfDecimal != -1) {
				//there is a decimal
				
				//get the digits after the decimal
				var substringOf = averageScoreString.substring(indexOfDecimal + 1);
				
				if(substringOf.length > 1) {
					/*
					 * there are more than two digits after the decimal so we will
					 * truncate down to two decimals
					 */
					averageScore = averageScore.toFixed(1);
				}
			}
		}
		
		//set the statistics into the object that we will return
		period.numItemsNeedScoring = numItemsNeedGrading;
		period.percentStudentsCompletedStep = percentStudentsCompletedStep;
		period.averageScore = averageScore;
	}
};

/**
 * Get the annotation data that we need for displaying to the teacher
 * @param runId the id of the run
 * @param nodeId the id of the node
 * @param workgroupId the id of the workgroup/student
 * @param teacherId the id of the teacher
 * @return an object containing annotationScoreValue, annotationCommentValue, and latestAnnotationPostTime
 */
View.prototype.getAnnotationData = function(runId, nodeId, workgroupId, teacherIds) {
	return this.getAnnotationDataHelper(runId, nodeId, workgroupId, teacherIds, null);
};

/**
 * Get the annotation data given a stepWorkId
 * @param stepWorkId the id of the step work
 * @return an object containing annotationScoreValue, annotationCommentValue, and latestAnnotationPostTime
 */
View.prototype.getAnnotationDataForRevision = function(stepWorkId) {
	return this.getAnnotationDataHelper(null, null, null, null, stepWorkId);
};

/**
 * Get the annotation data given the arguments. You may either pass in
 * runId, nodeId, workgroupId, teacherIds
 * or just
 * stepWorkId
 * 
 * @param runId
 * @param nodeId
 * @param workgroupId
 * @param teacherIds an array of teacher ids
 * @param stepWorkId
 * @return an object containing annotationScoreValue, annotationCommentValue, and latestAnnotationPostTime
 */
View.prototype.getAnnotationDataHelper = function(runId, nodeId, workgroupId, teacherIds, stepWorkId) {
	var annotationData = new Object();
	var annotationComment = null;
	var annotationScore = null;
	
	if(stepWorkId == null) {
		//obtain the annotation for this workgroup and step if any
		var annotationComment = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, "comment");
		var annotationScore = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, "score");
	} else {
		//obtain the annotation for this workgroup and step if any
		var annotationComment = this.annotations.getAnnotationByStepWorkIdType(stepWorkId, "comment");
		var annotationScore = this.annotations.getAnnotationByStepWorkIdType(stepWorkId, "score");	
	}
	
	//the value to display in the comment text box
	annotationData.annotationCommentValue = "";
	annotationData.annotationCommentPostTime = "";
	
	if(annotationComment != null) {
		//the annotation exists so we will populate the values from the annotation
		annotationData.annotationCommentValue = annotationComment.value;
		annotationData.annotationCommentPostTime = annotationComment.postTime;
	}

	//the value to display in the score text box
	annotationData.annotationScoreValue = "";
	annotationData.annotationScorePostTime = "";
	
	if (annotationScore != null) {
		//get the value of the annotationScore
		annotationData.annotationScoreValue = annotationScore.value;
		annotationData.annotationScorePostTime = annotationScore.postTime;
	}
	
	//get the latest annotation post time for comparing with student work post time
	annotationData.latestAnnotationPostTime = Math.max(annotationData.annotationCommentPostTime, annotationData.annotationScorePostTime);
	
	//return the object containing the values we need
	return annotationData;
};

/**
 * Get the html that displays the student work
 * @param studentWork a string containing the student work
 * @param node the node
 * @param stepWorkId the id of the step work
 * @param studentWorkTdClass the css class for the td
 * @param latestNodeVisitPostTime the post time in milliseconds
 * @return html for the td that will display the student work
 */
View.prototype.getStudentWorkTdHtml = function(studentWork, node, stepWorkId, studentWorkTdClass, latestNodeVisitPostTime) {
	var studentWorkTdHtml = "";
	
	//if student work is null set to empty string
	if(studentWork == null) {
		//since there was no student work we will display a default message in its place
		studentWork = "<br><p style='text-align:center'>("+this.i18n.getString("grading_no_work_warning",this.config.getConfigParam("locale"))+")</p>";
	} else if (studentWork != "" && node.type == "MySystemNode") {
		//var divId = "mysystemDiagram_"+workgroupId;
		var divId = "mysystemDiagram_"+stepWorkId+"_"+latestNodeVisitPostTime;
		var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
		// if the work is for a mysystem node we need to call the print function to print the image in the cell
        var content = node.getContent().getContentString();
        // prepent contentbaseurl to urls
    	content = content.replace(/\.\/images\//gmi, 'images\/');
    	content = content.replace(/images\//gmi, contentBaseUrl+'\/images\/');
        content = content.replace(/\.\/assets\//gmi, 'assets\/');
        content = content.replace(/assets\//gmi, contentBaseUrl+'\/assets\/');

        var studentWorkFixedLink = studentWork.replace(/\.\/images\//gmi, 'images\/');
        studentWorkFixedLink = studentWork.replace(/images\//gmi, contentBaseUrl+'\/images\/');
        studentWorkFixedLink = studentWorkFixedLink.replace(/\.\/assets\//gmi, 'assets\/');
        studentWorkFixedLink = studentWorkFixedLink.replace(/assets\//gmi, contentBaseUrl+'\/assets\/');
                        	
        var contentUrl = node.getContent().getContentUrl();
        
		//commented the line below because my system grading is broken at the moment
		// onclick=\"showDiagram('"+divId+"','"+contentBaseUrl+"')\"
		studentWork = "<a class='msEnlarge' style='text-decoration:underline; color:blue;' onclick='enlargeMS(\""+divId+"\");'>enlarge</a>" +
				      "<span id='content_"+divId+"' style='display:none'>"+content+"</span>" +
				      "<span id='contenturl_"+divId+"' style='display:none'>"+contentUrl+"</span>" +
				      "<span id='studentwork_"+divId+"' style='display:none'>"+studentWorkFixedLink+"</span>" +
					  "<div id='"+divId+"' contentBaseUrl='"+contentBaseUrl+"' class='mysystemCell'  style=\"height:350px;\">"+studentWork+"</div>";
		//studentWork = "(Grading for MySystem not available)";
		
		//add the post time stamp to the bottom of the student work
		studentWork += "<br><br><br><p class='lastAnnotationPostTime'>"+this.i18n.getString("timestamp",this.config.getConfigParam("locale"))+": " + new Date(latestNodeVisitPostTime) + "</p>";
	} else if (studentWork != "" && node.type == "SVGDrawNode") {
		// if the work is for a SVGDrawNode, embed the svg
		var divId = "svgDraw_"+stepWorkId+"_"+latestNodeVisitPostTime;
		var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
		// if studentData has been compressed, decompress it and parse (for legacy compatibility)
		if (typeof studentWork == "string") {
			if (studentWork.match(/^--lz77--/)) {
				var lz77 = new LZ77();
				studentWork = studentWork.replace(/^--lz77--/, "");
				studentWork = lz77.decompress(studentWork);
				studentWork = $.parseJSON(studentWork);
			}
		} 
		var svgString = studentWork.svgString;
		var description = studentWork.description;
		var snaps = studentWork.snapshots;
		var contentUrl = node.getContent().getContentUrl();
		studentWork = "<div id='"+divId+"_contentUrl' style='display:none;'>"+contentUrl+"</div>"+
			"<a class='drawEnlarge' onclick='enlargeDraw(\""+divId+"\");'>enlarge</a>";
		// if the svg has been compressed, decompress it
		if (svgString != null){
			if (svgString.match(/^--lz77--/)) {
				var lz77 = new LZ77();
				svgString = svgString.replace(/^--lz77--/, "");
				svgString = lz77.decompress(svgString);
			}
			
			//svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
			// only replace local hrefs. leave absolute hrefs alone!
			svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, function(m,key,value) {
				  if (value.indexOf("http://") == -1) {
				    return m.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
				  }
				  return m;
				});
			svgString = svgString.replace(/(marker.*=)"(url\()(.*)(#se_arrow_bk)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
			svgString = svgString.replace(/(marker.*=)"(url\()(.*)(#se_arrow_fw)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
			svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
			svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
			svgString = Utils.encode64(svgString);
		}
		if(snaps.length>0){
			var snapTxt = "<div id='"+divId+"_snaps' class='snaps'>";
			for(var i=0;i<snaps.length;i++){
				var snapId = divId+"_snap_"+i;
				var currSnap = snaps[i].svg;
				if (currSnap.match(/^--lz77--/)) {
					var lz77 = new LZ77();
					currSnap = currSnap.replace(/^--lz77--/, "");
					currSnap = lz77.decompress(currSnap);
				}
				//currSnap = currSnap.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
				// only replace local hrefs. leave absolute hrefs alone!
				currSnap = currSnap.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, function(m,key,value) {
					  if (value.indexOf("http://") == -1) {
					    return m.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
					  }
					  return m;
					});
				
				currSnap = currSnap.replace(/(marker.*=)"(url\()(.*)(#se_arrow_bk)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
				currSnap = currSnap.replace(/(marker.*=)"(url\()(.*)(#se_arrow_fw)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
				currSnap = currSnap.replace('<svg width="600" height="450"', '<svg width="120" height="90"');
				currSnap = currSnap.replace(/<g>/gmi,'<g transform="scale(0.2)">');
				currSnap = Utils.encode64(currSnap);
				snapTxt += "<div id="+snapId+" class='snapCell' onclick='enlargeDraw(\""+divId+"\");'>"+currSnap+"</div>";
				var currDescription = snaps[i].description;
				snapTxt += "<div id='"+snapId+"_description' class='snapDescription' style='display:none;'>"+currDescription+"</div>";
			}
			snapTxt += "</div>";
			studentWork += snapTxt;
		} else {
			studentWork += "<div id='"+divId+"' class='svgdrawCell'>"+svgString+"</div>";
			if(description != null){
				studentWork += "<div id='"+divId+"_description' class='drawDescription'><span>Description: </span>"+description+"</div>";
			}
		}
		
		//add the post time stamp to the bottom of the student work
		studentWork += "<br><br><br><p class='lastAnnotationPostTime'>"+this.i18n.getString("timestamp",this.config.getConfigParam("locale"))+": " + new Date(latestNodeVisitPostTime) + "</p>";
	} else if(studentWork != "" && this.isSelfRenderingGradingViewNodeType(node.type)) {
		//create the student work div that we will insert the student work into later
		studentWork = '<div id="studentWorkDiv_' + stepWorkId + '" style="overflow:auto;width:500px"></div>';
	} else {
		//add the post time stamp to the bottom of the student work
		studentWork += "<br><br><br><p class='lastAnnotationPostTime'>Timestamp: " + new Date(latestNodeVisitPostTime) + "</p>";
		
		//replace \n with <br> so that the line breaks are displayed for the teacher
		studentWork = this.replaceSlashNWithBR(studentWork);
		
		//insert the student work into a div so we can display scrollbars if the student work overflows
		studentWork = '<div id="studentWorkDiv_' + stepWorkId + '" style="overflow:auto;width:500px">' + studentWork + '</div>';
	}
	
	//display the student work for this step/node
	studentWorkTdHtml += "<td id='studentWorkColumn_" + stepWorkId + "' class='" + studentWorkTdClass + "'>" + studentWork + "</td>";
	
	return studentWorkTdHtml;
};

/**
 * Retrieve the other data associated with the step if the step is a
 * peer review or teacher review type of step. The other data consists
 * of the original work, review written, or revised work depending
 * on which step it is. If the step is not a peer review or teacher
 * review type, it will just return the studentWork unmodified.
 * @param studentWork the work the student wrote for this step
 * @param node the node for which the studentWork is for
 * @param workgroupId id of the student workgroup
 * @param vleState all the work of the student
 * @return the studentWork with additional data or if the node
 * is not a peer review or teache review type it just returns
 * the studentWork unmodified
 */
View.prototype.getPeerOrTeacherReviewData = function(studentWork, node, workgroupId, vleState) {
	if(studentWork == null) {
		//if the student work is null we don't have to do anything
		return studentWork;
	}
	
	//get the content for the node
	var nodeContent = node.content.getContentJSON();
	
	if(node != null && node.peerReview != null) {
		//this is a peer review node
		
		if(node.peerReview == 'annotate') {
			//this is a peer review annotate node
			
			//get the nodeId of the associated/original node id
			var associatedNodeId = node.associatedStartNode;
			
			//get the peer review work data
			var peerReviewWork = this.getPeerReviewWorkByReviewerNodeId(workgroupId, associatedNodeId);
			
			if(peerReviewWork != null) {
				//get the work that the other student wrote
				var stepWork = peerReviewWork.stepWork;
				
				var otherStudentNames = "N/A";

				//get the workgroup id of the classmate who submitted the work
				var workerWorkgroupId = peerReviewWork.workgroupId;
				
				if(workerWorkgroupId != null) {
					if(workerWorkgroupId == -2) {
						/*
						 * the workgroup id is the one that the specifies the canned 
						 * work/response was shown to the student
						 */
						otherStudentNames = "Canned Response";
					} else {
						//get the names of the users who submitted the work
						var workerUserNames = this.getUserNamesByWorkgroupId(workerWorkgroupId, 1);
						
						//create a link with the names of the classmates that will open to the gradebyteam page
						otherStudentNames = "<a href='#' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workerWorkgroupId + "'])\">" + workerUserNames + "</a>";						
					}
				}
				
				var otherStudentWork = "";
				
				if(stepWork == null && workerWorkgroupId == -2) {
					//this student received the canned work so we will obtain it from the node content
					otherStudentWork = nodeContent.authoredWork;
				} else if(stepWork != null) {
					//create a node visit from the step work that the other student wrote
					var nodeVisit = NODE_VISIT.prototype.parseDataJSONObj(stepWork, this);
					
					if(nodeVisit != null) {
						//get the latest work from the other student's node visit
						otherStudentWork = nodeVisit.getLatestWork();
					}
				}
				
				//display the work from the other student and what this student wrote as a review
				studentWork = "<u>Other student:</u><br>" + otherStudentNames + "<br><br><u>Work written by other student:</u><br>" + otherStudentWork + "<br><br><u>Review written by this student:</u><br>" + studentWork;
			}
		} else if(node.peerReview == 'revise') {
			//this is a peer review revise node
			
			//get the nodeId of the associated/original node id
			var associatedNodeId = node.associatedStartNode;
			
			//get the peer review work data
			var peerReviewWork = this.getPeerReviewWorkByWorkerNodeId(workgroupId, associatedNodeId);
			
			if(peerReviewWork != null) {
				//get the work that the student originally wrote
				var stepWork = peerReviewWork.stepWork;
				
				if(stepWork != null) {
					//create a node visit from the step work the student originally wrote
					var nodeVisit = NODE_VISIT.prototype.parseDataJSONObj(stepWork, this);
					
					if(nodeVisit != null) {
						//get the latest work from the node visit
						var originalWork = nodeVisit.getLatestWork();
						
						//get the annotation the other student wrote to this student
						var annotation = peerReviewWork.annotation;
						
						//get the workgroup id of the student that wrote the review
						var reviewerWorkgroupId = peerReviewWork.reviewerWorkgroupId;
						
						var otherStudentNames = "N/A";

						if(reviewerWorkgroupId != null) {
							if(reviewerWorkgroupId == -2) {
								/*
								 * the workgroup id is the one that the specifies the canned 
								 * work/response was shown to the student
								 */
								otherStudentNames = "Canned Response";
							} else {
								//get the names of the users who submitted the work
								var workerUserNames = this.getUserNamesByWorkgroupId(reviewerWorkgroupId, 1);
								
								//create a link with the names of the classmates that will open to the gradebyteam page
								otherStudentNames = "<a href='#' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + reviewerWorkgroupId + "'])\">" + workerUserNames + "</a>";						
							}
						}
						
						var review = "";
						
						if(annotation != null) {
							//get the annotation value written by the other student
							review = annotation.value;
						} else if(annotation == null && reviewerWorkgroupId == -2) {
							//this student received the canned review so we will obtain it from the node content
							review = nodeContent.authoredReview;
						}
						
						//display the original work, the review from the other student, and the revised work
						studentWork = "<u>Original work written by this student:</u><br>" + originalWork +
						"<br><br><u>Other student:</u><br>" + otherStudentNames +
						"<br><br><u>Review written by other student:</u><br>" + review + 
						"<br><br><u>Revised work written by this student:</u><br>" + studentWork;
					}
				}
			}
		}
	} else if(node != null && node.teacherReview != null) {
		//this is a teacher review node
		
		if(node.teacherReview == 'annotate') {
			//this is a teacher review annotate node
			
			//get the authored teacher work
			var authoredWork = nodeContent.authoredWork;
			
			//display the authored teacher work and what the student wrote as a review
			studentWork = "<u>Work written by teacher:</u><br>" + authoredWork + "<br><br><u>Review written by this student:</u><br>" + studentWork;
		} else if(node.teacherReview == 'revise') {
			//this is a teacher review revise node
			
			//get the original/associated node id
			var associatedOriginalNodeId = node.associatedStartNode;
			
			//get the latest node visit from the original node
			var originalNodelatestNodeVisit = vleState.getLatestNodeVisitByNodeId(associatedOriginalNodeId);
			
			//get the latest work from the original node
			var originalWork = originalNodelatestNodeVisit.getLatestWork();
			
			var teacherAnnotation = "";
			
			if(this.annotations != null) {
				//get the latest comment annotation for the original step written by the teacher
				var latestCommentAnnotationForStep = this.annotations.getLatestAnnotation(
						this.getConfig().getConfigParam('runId'),
						associatedOriginalNodeId,
						workgroupId,
						this.getUserAndClassInfo().getAllTeacherWorkgroupIds(),
						'comment'
						);
				
				if(latestCommentAnnotationForStep != null) {
					//get the value of the annotation
					teacherAnnotation = latestCommentAnnotationForStep.value;					
				}
			}
			
			//display the original work, the teacher review, and the revised work
			studentWork = "<u>Original work written by this student:</u><br>" + originalWork + 
			"<br><br><u>Review written by teacher:</u><br>" + teacherAnnotation + 
			"<br><br><u>Revised work written by this student:</u><br>" + studentWork;
		}
	}
	
	//return the modified student work
	return studentWork;
};


/**
 * Get the html that displays the score and comment box
 * @param workgroupId
 * @param nodeId
 * @param teacherId
 * @param runId
 * @param stepWorkId
 * @param annotationScoreValue
 * @param annotationCommentValue
 * @param latestAnnotationPostTime
 * @param isGradingDisabled
 * @param scoringAndCommentingTdClass
 * @return html for the td that will display the score and comment box
 */
View.prototype.getScoringAndCommentingTdHtml = function(workgroupId, nodeId, teacherId, runId, stepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass) {
	var scoringAndCommentingTdHtml = "";
	
	//get the max score for this step, or "" if there is no max score
	var maxScore = this.getMaxScoreValueByNodeId(nodeId);
	
	var textAreaCols = 40;
	
	/*
	 * dynamically determine how many rows will be in the comment box
	 * by parsing the comment annotation
	 */
	var commentTextAreaRows = this.getTextAreaNumRows(textAreaCols, annotationCommentValue);
	
	//create a date object with the latest annotation post time
	var lastAnnotationPostTime = new Date(latestAnnotationPostTime);
	
	var lastAnnotationMessage = "";
	
	//display the last annotation post time
	if(lastAnnotationPostTime != null && lastAnnotationPostTime.getTime() != new Date(0).getTime()) {
		lastAnnotationMessage = ""+this.i18n.getString("last_annotation",this.config.getConfigParam("locale"))+": " + lastAnnotationPostTime;
	} else {
		lastAnnotationMessage = ""+this.i18n.getString("last_annotation",this.config.getConfigParam("locale"))+": "+this.i18n.getString("not_available",this.config.getConfigParam("locale"))+"";
	}
	
	//display the td for the score and comment box
	scoringAndCommentingTdHtml += "<td class='" + scoringAndCommentingTdClass + "'>";
	
	//the td will contain a table
	scoringAndCommentingTdHtml += "<table id='teacherAnnotationTable'>";
	
	//display the score box
	scoringAndCommentingTdHtml += "<tr><td>"+this.i18n.getString("score",this.config.getConfigParam("locale"))+": <input type='text' id='annotationScoreTextArea_" + workgroupId + "_" + nodeId + "' value='" + annotationScoreValue + "' onblur=\"eventManager.fire('saveScore', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"'])\" " + isGradingDisabled + "/> / " + maxScore + "</td></tr>";
	
	var openPremadeCommentsLink = "";
	
	if(isGradingDisabled != "disabled") {
		//if grading is enabled, display the link to open the premade comments
		openPremadeCommentsLink = "<a href='#' onclick='eventManager.fire(\"openPremadeComments\", [\"annotationCommentTextArea_" + workgroupId + "_" + nodeId + "\", \"studentWorkColumn_" + stepWorkId + "\"])'>"+this.i18n.getString("grading_open_premade_comments",this.config.getConfigParam("locale"))+"</a>";
	}
	
	//display the comment box
	scoringAndCommentingTdHtml += "<tr><td>"+this.i18n.getString("comment",this.config.getConfigParam("locale"))+": " + openPremadeCommentsLink + "<br><textarea wrap='soft' cols='" + textAreaCols + "' rows='" + commentTextAreaRows + "' id='annotationCommentTextArea_" + workgroupId + "_" + nodeId + "' onblur=\"eventManager.fire('saveComment', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"', this])\"" + isGradingDisabled + ">" + annotationCommentValue + "</textarea></td></tr>";
	
	//display the last annotation post time
	scoringAndCommentingTdHtml += "<tr><td><p id='lastAnnotationPostTime_" + workgroupId + "_" + nodeId + "' class='lastAnnotationPostTime'>" + lastAnnotationMessage + "</p></td></tr>";
	
	//close the inner table containing the score and comment and post time
	scoringAndCommentingTdHtml += "</table>";
	
	//close the td
	scoringAndCommentingTdHtml += "</td>";
	
	return scoringAndCommentingTdHtml;
};

View.prototype.getFlaggingTdHtml = function(workgroupId, nodeId, teacherId, runId, stepWorkId, isGradingDisabled, flagChecked, flaggingTdClass) {
	
	return "<td class='" + flaggingTdClass + "'><div></div><div class='gradeColumn flagColumn'><input type='checkbox' value='Flag' name='flagButton" + workgroupId + "' id='flagButton_" + stepWorkId + "' onClick='eventManager.fire(\"saveFlag\", [\"" + nodeId + "\", " + workgroupId + ", " + teacherId + ", " + runId + ", null, \""+ stepWorkId +"\"])' " + isGradingDisabled + " " + flagChecked + ">"+this.i18n.getString("flag",this.config.getConfigParam("locale"))+"</div></td>";
};

/**
 * Displays the grading page for a specific workgroup. Generates
 * the html and then sets it into the div.
 * @param workgroupId the id of the workgroup
 */
View.prototype.displayGradeByTeamGradingPage = function(workgroupId) {
	//perform any display page startup tasks
	this.displayStart("displayGradeByTeamGradingPage", [workgroupId]);
	
	var gradeByTeamGradingPageHtml = "";
	
	//show the header with all the grading buttons
	gradeByTeamGradingPageHtml += this.getGradingHeaderTableHtml();
	
	var userNames = this.getUserNamesByWorkgroupId(workgroupId, 1);
	
	//show the step title and prompt
	gradeByTeamGradingPageHtml += "<table class='objectToGradeHeaderTable'><tr><td class='objectToGradeTd'>" + userNames + "</td>";

	//show the button to go back to select another workgroup
	gradeByTeamGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByTeamSelectPage\")'>"+this.i18n.getString("grading_change_team",this.config.getConfigParam("locale"))+"</a></td></tr></table>";

	//check if show revisions check box was previously checked
	var showRevisionsChecked = '';
	if(this.gradingShowRevisions) {
		showRevisionsChecked = 'checked';
	}
	
	if (this.getRevisions) {
		//check box for showing all revisions
		gradeByTeamGradingPageHtml += "<div><input type='checkbox' id='showAllRevisions' value='show all revisions' onClick=\"eventManager.fire('filterStudentRows')\" " + showRevisionsChecked + "/><p style='display:inline'>"+this.i18n.getString("grading_show_all_revisions",this.config.getConfigParam("locale"))+"</p></div>";
	}
	
	//get the work for the workgroup id
	var vleState = this.getVleStateByWorkgroupId(workgroupId);

	//reset the activity counter used to label activity numbers
	this.activityNumber = 0;
	
	//loop through all the nodes and generate the html that allows the teacher to grade
	gradeByTeamGradingPageHtml += this.displayGradeByTeamGradingPageHelper(this.getProject().getRootNode(), vleState);
	
	//add a SAVE CHANGES button at bottom of all the Grade by Team Tables   ADDED BY MATTFISH
	gradeByTeamGradingPageHtml += "<div id='lowerSaveButton'><input type='button' value='"+this.i18n.getString("grading_button_save_changes",this.config.getConfigParam("locale"))+"' onClick=\"notificationManager.notify('Changes have been successfully saved.')\"></input></div>";
		
	//set the html in the div so the user can see it
	document.getElementById('gradeWorkDiv').innerHTML = gradeByTeamGradingPageHtml;

	//render all the student work for this workgroup
	this.renderAllStudentWorkForWorkgroupId(workgroupId);
	
	// call showDiagrams for each div that has mysystem student data
	$(".mysystemCell").each(showDiagramNode);
	$(".svgdrawCell").each(showDrawNode);
	$(".snapCell").each(showSnaps);
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * The helper function to generate the grading page for a
 * specific workgroup
 * @param node the node to generate the grading elements for
 * @param vleState the object that holds all the work for a workgroup
 * @return html that displays the grading elements
 */
View.prototype.displayGradeByTeamGradingPageHelper = function(node, vleState) {
	var nodeId = node.id;

	var displayGradeByTeamGradingPageHtml = "";
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		//get the position as seen by the student
		var position = this.getProject().getVLEPositionById(nodeId);
		
		if(node.type == "HtmlNode" || node.type == "OutsideUrlNode") {
			//the node is an html node so we do not need to display a link for it, we will just display the text
			displayGradeByTeamGradingPageHtml += "<table class='gradeByTeamGradingPageNonWorkStepTable'><tr><td class='chooseStepToGradeStepTd'><p>" + position + " " + node.getTitle() + " [" + node.type + "]</p></td></tr></table>";
			displayGradeByTeamGradingPageHtml += "<br>";
		} else if(node.type == 'DuplicateNode'){
			/* the node is a duplicate node, only the original should be graded so only display text */
			var realNode = node.getNode();
			var realPosition = this.getProject().getVLEPositionById(realNode.id);
			var type = 'Duplicate for ' + realNode.type + ' at ' + realPosition;
			
			displayGradeByTeamGradingPageHtml += "<table class='gradeByTeamGradingPageNonWorkStepTable'><tr><td class='chooseStepToGradeStepTd'><p>" + position + " " + node.getTitle() + " [" + type + "]</p></td></tr></table>";
		} else {
			var runId = this.getConfig().getConfigParam('runId');
			
			var teacherId = this.getUserAndClassInfo().getWorkgroupId();
			
			var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
			
			var workgroupId = vleState.dataId;

			//get the annotations data for this student/step combination
			var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);
			var annotationCommentValue = annotationData.annotationCommentValue;
			var annotationScoreValue = annotationData.annotationScoreValue;
			var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
			
			//get the period name for this student
			var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);
			
			//get the revisions
			var nodeVisitRevisions = vleState.getNodeVisitsWithWorkByNodeId(nodeId);
			
			var latestNodeVisit = null;
			
			if(nodeVisitRevisions.length > 0) {
				//get the latest work for the current workgroup
				latestNodeVisit = nodeVisitRevisions[nodeVisitRevisions.length - 1];
			}
			
			var stepWorkId = null;
			var studentWork = null;
			var latestNodeVisitPostTime = null;
			
			if (latestNodeVisit != null) {
				stepWorkId = latestNodeVisit.id;
				studentWork = latestNodeVisit.getLatestWork();
				latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
			}

			//get the latest flag value
			var latestFlag = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, 'flag');
			
			//default will be unchecked/unflagged
			var flagChecked = "";
			var isFlagged = 'false';
			
			//we found a flag annotation
			if(latestFlag) {
				//check if it is 'flagged' or 'unflagged'
				if(latestFlag.value == 'flagged') {
					//the value of the flag is 'flagged' so the checkbox will be checked
					flagChecked = " checked";
					isFlagged = 'true';
				}
			}
			
			/*
			 * retrieve any peer or teacher review data, if the current node is
			 * not a peer or teacher review type step, the function will just
			 * return the unmodified studentWork back
			 */
			studentWork = this.getPeerOrTeacherReviewData(studentWork, node, workgroupId, vleState);

			//make the class for the table for a student
			var gradeByTeamGradingPageWorkStepTableClass = "gradeByTeamGradingPageWorkStepTable";
			
			//check if there was any new work
			if(latestAnnotationPostTime < latestNodeVisitPostTime) {
				//set the css class so the table will be highlighted
				gradeByTeamGradingPageWorkStepTableClass += " newWork";
			}

			var toggleRevisionsLink = "";

			if(nodeVisitRevisions.length > 1) {
				//there is more than one revision so we will display a link that will display the other revisions
				toggleRevisionsLink = "  <a href='#' onClick=\"eventManager.fire('toggleGradingDisplayRevisions', ['" + workgroupId + "', '" + nodeId + "'])\">"+this.i18n.getString("grading_hide_show_revisions",this.config.getConfigParam("locale"))+"</a>";
			} else if(nodeVisitRevisions.length == 1) {
				//there is only one revisions
				
				if(this.getRevisions) {
					//we retrieved all revisions so that means there are no other revisions
					toggleRevisionsLink = this.i18n.getString("grading_no_revisions",this.config.getConfigParam("locale"));
				} else {
					//we only retrieved the latest revision so there may be other revisions
					toggleRevisionsLink = this.i18n.getString("grading_only_latest_revision_displayed",this.config.getConfigParam("locale"));
				}
			} else if(nodeVisitRevisions.length == 0) {
				//there are no revisions
				toggleRevisionsLink = this.i18n.getString("grading_no_revisions",this.config.getConfigParam("locale"));
			}
			
			//display the step title and link and also the button to display the question/prompt
			displayGradeByTeamGradingPageHtml += "<table id='studentWorkRow_"+workgroupId+"_"+nodeId+"_"+stepWorkId+"' class='" + gradeByTeamGradingPageWorkStepTableClass + "'>";
			displayGradeByTeamGradingPageHtml += "<thead class='gradeTeamTableHeader'><tr><td>"+this.i18n.getString("student_work",this.config.getConfigParam("locale"))+"</td>"+
				"<td>"+this.i18n.getString("teacher_comment_and_score",this.config.getConfigParam("locale"))+"</td>"+
				"<td>"+this.i18n.getString("tools",this.config.getConfigParam("locale"))+"</td></tr></thead>";
			displayGradeByTeamGradingPageHtml += "<tr><td class='chooseStepToGradeStepTd'><a href='#' onClick='eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + position + "\", \"" + nodeId + "\"])'>" + position + " " + node.getTitle() + "</a>&nbsp;&nbsp;<span class='byTeamStepType'>(" + node.type + ")</span></td>";
			displayGradeByTeamGradingPageHtml += "<td class='chooseStepToGradeStepTd2 colspan='2'><a href='#' onClick=\"eventManager.fire('togglePrompt', ['questionContentText_" + nodeId + "'])\">"+this.i18n.getString("grading_hide_show_question",this.config.getConfigParam("locale"))+"</a>" + toggleRevisionsLink + "</td>";
			displayGradeByTeamGradingPageHtml += "</tr>";

			//get the prompt/question for the step
			var nodePrompt = this.getProject().getNodePromptByNodeId(nodeId);
			
			//add the prompt/question which will initially be hidden
			displayGradeByTeamGradingPageHtml += "<tr>";
			displayGradeByTeamGradingPageHtml += "<td></td><td colspan='2'><div id='questionContentText_" + nodeId + "' class='questionContentText commentHidden'> " + nodePrompt + "</div></td>";
			displayGradeByTeamGradingPageHtml += "</tr>";

			//make the class for the row that will contain the student work, score and comment box, and flag checkbox
			var studentTRClass = "studentWorkRow period" + periodName;
			displayGradeByTeamGradingPageHtml += "<tr class='" + studentTRClass + "' isFlagged='" + isFlagged + "'>";
			
			//make the class for the student work td
			var studentWorkTdClass = "gradeByTeamWorkColumn";
			
			//get the html for the student work td
			displayGradeByTeamGradingPageHtml += this.getStudentWorkTdHtml(studentWork, node, stepWorkId, studentWorkTdClass, latestNodeVisitPostTime);
			
			//check if we want to enable/disable grading for this student/row
			var isGradingDisabled = "";
			if(studentWork == null) {
				//the student has not done any work for this step so we will disable grading
				isGradingDisabled = "disabled";
			} else {
				//get the permission the currently logged in user has for this run
				isGradingDisabled = this.isWriteAllowed();
			}
			
			//make the css class for the td that will contain the score and comment boxes
			var scoringAndCommentingTdClass = "gradeByTeamGradeColumn gradeColumn gradingColumn";
			
			//get the html for the score and comment td
			displayGradeByTeamGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass);
			
			//make the css class for the td that will contain the flag checkbox
			var flaggingTdClass = "gradeByTeamToolsColumn gradeColumn toolsColumn";
			
			//get the html for the flag td
			displayGradeByTeamGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
			
			displayGradeByTeamGradingPageHtml += "</tr>";
			
			//check if there was more than one revision
			if(nodeVisitRevisions.length > 1) {
				//loop through the revisions from most recent to oldest
				for(var revisionCount=nodeVisitRevisions.length - 2; revisionCount>=0; revisionCount--) {
					//get a node visit
					var nodeVisitRevision = nodeVisitRevisions[revisionCount];
					var revisionPostTime = nodeVisitRevision.visitPostTime;
					
					//get the work from the node visit
					var revisionWork = nodeVisitRevision.getLatestWork();
					
					//get the stepWorkId of the revision
					var revisionStepWorkId = nodeVisitRevision.id;
					
					//get the annotation data for the revision if any
					var annotationDataForRevision = this.getAnnotationDataForRevision(revisionStepWorkId);
					var annotationCommentValue = annotationDataForRevision.annotationCommentValue;
					var annotationScoreValue = annotationDataForRevision.annotationScoreValue;
					var latestAnnotationPostTime = annotationDataForRevision.latestAnnotationPostTime;
					
					var isGradingDisabled = "disabled";
					
					//default will be unchecked/unflagged
					var flagChecked = "";
					var isFlagged = 'false';
					
					//display the data for the revision
					displayGradeByTeamGradingPageHtml += "<tr id='studentWorkRow_"+workgroupId+"_"+nodeId+"_" + revisionStepWorkId + "' class='studentWorkRow period" + periodName + " studentWorkRevisionRow studentWorkRevisionRow_" + workgroupId + "_" + nodeId + "' style='display:none'>";
					displayGradeByTeamGradingPageHtml += this.getStudentWorkTdHtml(revisionWork, node, revisionStepWorkId, studentWorkTdClass, revisionPostTime);
					displayGradeByTeamGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, nodeVisitRevision.id, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass);
					displayGradeByTeamGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, revisionStepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
					displayGradeByTeamGradingPageHtml += "</tr>";
				}
			}
			
			//close the table for the student
			displayGradeByTeamGradingPageHtml += "</table>";
			
			//use a new line between each student
			displayGradeByTeamGradingPageHtml += "<br>";
		}
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display the activity number and title
			displayGradeByTeamGradingPageHtml += "<table class='gradeByTeamGradingPageActivityTable'><tr><td colspan='2' class='chooseStepToGradeActivityTd'><h4>A" + this.activityNumber + ". " + node.getTitle() + "</h4></td><td></td></tr></table>";
			displayGradeByTeamGradingPageHtml += "";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayGradeByTeamGradingPageHtml += this.displayGradeByTeamGradingPageHelper(node.children[x], vleState);
		}
	
	}
		
	return displayGradeByTeamGradingPageHtml;
	
	
};

/**
 * Sorts the vleStates alphabetically by user name
 * @return
 */
View.prototype.getVleStatesSortedByUserName = function() {
	var vleStates = this.vleStates;
	
	/*
	 * set this view to a local variable so it can be referenced
	 * inside the sortByUserName() function below
	 */
	var thisView = this;
	
	/**
	 * A function that compares two vleStates. This is only used
	 * with the array sort function.
	 * @param a some vleState
	 * @param b some vleState
	 * @return
	 * true if the userName for a comes after b
	 * false if the userName for b comes after a
	 */
	var sortByUserName = function(a, b) {
		//get the user names from the vleStates
		var userNameA = thisView.getUserAndClassInfo().getClassmateByWorkgroupId(a.dataId).userName.toLowerCase();
		var userNameB = thisView.getUserAndClassInfo().getClassmateByWorkgroupId(b.dataId).userName.toLowerCase();
		
		//compare them
		return userNameA > userNameB;
	};
	
	vleStates = vleStates.sort(sortByUserName);
	
	return vleStates;
};

/**
 * Get the user names in a workgroup id
 * @param workgroupId the id of the workgroup
 * @param numberOfLineBreaks the number of new line <br>'s to put between user names
 * @return a string containing user names that are in the workgroup separated by
 * new line <br>'s
 */
View.prototype.getUserNamesByWorkgroupId = function(workgroupId, numberOfLineBreaks) {
	//if number of line breaks is unspecified, just use 1
	if(numberOfLineBreaks == null) {
		numberOfLineBreaks = 1;
	}
	
	//the html that we will use to display in the left user column of the gradebystep page
	var userNamesHtml = "";
	
	if(workgroupId != null) {
		//get the user in the class
		var classmate = this.getUserAndClassInfo().getClassmateByWorkgroupId(workgroupId);
		
		if(classmate != null) {
			//retrieve the : delimited names of the users in the workgroup
			var userNames = classmate.userName;

			//split the string by :
			var userNamesArray = userNames.split(":");

			//loop through each name in the workgroup
			for(var y=0; y<userNamesArray.length; y++) {
				//add an empty line between each name
				if(userNamesHtml != "") {
					for(var x=0; x<numberOfLineBreaks; x++) {
						userNamesHtml += "<br>";
					}
				}

				//add the user name which consists of "[first name] [last name] ([login])"
				userNamesHtml += userNamesArray[y];
			}
		}
	}
	
	return userNamesHtml;
};

/**
 * Gets the html that will display radio buttons that will filter
 * workgroups by period
 * @return html that will display the radio buttons for filtering periods
 */
View.prototype.getPeriodRadioButtonTableHtml = function(displayType) {
	var periodRadioButtonTableHtml = "";
	
	//the div to display the period radio buttons that filter the periods
	periodRadioButtonTableHtml += "<div id='choosePeriodTable' class='choosePeriodTable'>";

	//split the period numbers into an array
	var periods = this.getUserAndClassInfo().getPeriodName().split(":");

	//the args for the onclick radio button for all classes
	var allArgs = "['all', '" + displayType + "']";
	
	
	var allPeriodsChecked = '';
	
	//check if the all periods check box should be checked, 'all' is default if no period is specified
	if(!this.gradingPeriod || this.gradingPeriod == 'all') {
		allPeriodsChecked = 'checked';
		this.gradingPeriod = 'all';
	}
	
	//create a radio button to display all periods
	periodRadioButtonTableHtml += "<div class='periodRadioChoice'><input type='radio' name='choosePeriod' value='all' onClick=\"eventManager.fire('filterStudentRows')\" " + allPeriodsChecked + "> "+this.i18n.getString("grading_grade_by_step_all_periods",this.config.getConfigParam("locale"))+"</div>";

	//loop through the periods
	for(var p=0; p<periods.length; p++) {
		//the args for the onclick radio button for a specific period
		var periodArgs = "['" + periods[p] + "', '" + displayType + "']";
		
		var periodChecked = '';
		
		//check if this period is checked
		if(this.gradingPeriod && this.gradingPeriod.replace('period', '') == periods[p]) {
			periodChecked = 'checked';
		}
		
		//create a radio button for each period
		periodRadioButtonTableHtml += "<div class='periodRadioChoice'><input type='radio' name='choosePeriod' value='period" + periods[p] + "' onClick=\"eventManager.fire('filterStudentRows')\" " + periodChecked + "> P" + periods[p] + "</div>";
	}

	periodRadioButtonTableHtml += "</div>";
	
	return periodRadioButtonTableHtml;
};

/**
 * Set the element to be visible if it is not a previous revision row
 * @param element an html element
 */
View.prototype.setDisplayVisibleIfNotRevision = function(element) {
	var className = element.className;
	
	//check if this element is a previous revision
	if(className.indexOf("studentWorkRevisionRow") == -1) {
		//the element is not a previous revision so we will show it
		element.style.display = "";	
	} else {
		//the element is a previous revision so we will not show it
		element.style.display = "none";
	}
};

/**
 * Toggle the class attribute to show/hide prompts.
 * @param elementId the id of the element to toggle
 */
View.prototype.togglePrompt = function(elementId) {
	//get the element
	var elementToToggle = document.getElementById(elementId);
	
	if(elementToToggle != null) {
		//get the class of the element
		var elementToToggleClass = elementToToggle.className;

		if(elementToToggleClass == null) {
			//do nothing
		} else if(elementToToggleClass.indexOf("commentShown") != -1) {
			//element contains commentShown class
			elementToToggle.className = elementToToggle.className.replace("commentShown", "commentHidden");
		} else if(elementToToggleClass.indexOf("commentHidden") != -1) {
			//element contains commentHidden class
			elementToToggle.className = elementToToggle.className.replace("commentHidden", "commentShown");
		}		
	}
};

/**
 * Retrieve the annotations, student data, and flags again and reload
 * the page the teacher was previously on.
 */
View.prototype.refreshGradingScreen = function() {
	//remember the grading page the teacher is currently on
	this.reloadGradingDisplay = this.currentGradingDisplay;
	
	//remember any params needed to reload the grading page
	this.reloadGradingDisplayParam = this.currentGradingDisplayParam;
	
	/*
	 * get the annotations, this will trigger a chain of events that will
	 * also get the student work and flags and also reloads the page
	 * that the teacher was last on
	 */
	this.getAnnotations();
};

/**
 * This is called after the refresh has completed retrieval of
 * annotations, student work, and flags. This function just
 * reloads the page the teacher was last on. This function
 * actually gets called every time "getStudentWorkComplete"
 * is fired but only actually does something if it was
 * triggered by the refresh button being clicked.
 * @return
 */
View.prototype.reloadRefreshScreen = function() {
	//this will be set if the refresh button was clicked
	if(this.reloadGradingDisplay != null) {
		//reload the page the teacher was last on
		eventManager.fire(this.reloadGradingDisplay, this.reloadGradingDisplayParam);
	}
	
	//clear out these values
	this.reloadGradingDisplay = null;
	this.reloadGradingDisplayParam = null;
};

/**
 * Remember the current page the teacher is viewing for grading
 * @param displayName the name of the display
 * @param displayParam any parameters used for loading the display
 */
View.prototype.displayStart = function(displayName, displayParam) {
	this.currentGradingDisplay = displayName;
	this.currentGradingDisplayParam = displayParam;
};

/**
 * Perform any page scrolling and resizing after all the grading display
 * has been generated.
 */
View.prototype.displayFinished = function() {
	//scroll to the top of the page
	parent.scrollTo(0,0);
	
	/*
	 * fix the height of the gradeWorkDiv so no scrollbars are displayed
	 * for the iframe
	 */
	this.fixGradingDisplayHeight();
	
	//apply the filters so that filters for period, hide personal info, show flagged, enlarge student, show all revisions are applied
	this.filterStudentRows();
};

/**
 * Fix the height of the gradeWorkDiv so no scrollbars are displayed
 * for the iframe
 */
View.prototype.fixGradingDisplayHeight = function() {
	//get the height of the gradeWorkDiv
	var height = document.getElementById('gradeWorkDiv').scrollHeight;

	/*
	 * resize the height of the topifrm that contains the gradeWorkDiv
	 * so that there will be no scroll bars
	 */
	parent.document.getElementById('topifrm').height = height + 300;
};

/**
 * Toggle the revisions rows for the teacher to see a student's
 * previous revisions for a specific step
 * @param workgroupId the workgroup id of the student
 * @param nodeId the id of the node/step
 */
View.prototype.toggleGradingDisplayRevisions = function(workgroupId, nodeId) {
	//get all the elements with the given class
	var revisionRows = this.getElementsByClassName(null, "studentWorkRevisionRow_" + workgroupId + "_" + nodeId, null);
	
	//loop through all the elements
	for(var x=0; x<revisionRows.length; x++) {
		//get one of the elements
		var revisionRow = revisionRows[x];
		
		//toggle the visibility
		if(revisionRow.style.display == "none") {
			//show revisions
			revisionRow.style.display = "";
			
			//check if the row we are showing is a student work row
			if(revisionRow.id.indexOf("studentWorkRow") != -1) {
				//it is a student work row
				
				//get the step work id and workgroup id
				var stepWorkId = this.getStudentWorkIdFromStudentWorkRowId(revisionRow.id);
				var workgroupId = this.getWorkgroupIdFromStudentWorkRowId(revisionRow.id);
				
				//render the student work if it has not already been rendered
				this.renderStudentWork(stepWorkId, workgroupId);
			}
		} else {
			//hide revisions
			revisionRow.style.display = "none";
		}
	}
	
	//fix the height so scrollbars don't show up
	this.fixGradingDisplayHeight();
};


/**
 * Get the period that is currently chosen in the radio buttons
 * @return the period that is selected
 */
View.prototype.getPeriodFilterSelected = function() {
	var selectedPeriod = null;
	
	//get the divs that contain the radio buttons
	var periodRadioButtonDivs = this.getElementsByClassName(null, 'periodRadioChoice', null);
	
	//get all the input elements in divs with class periodRadioChoice
	var periodRadioButtonInputs = $('.periodRadioChoice input');
	
	/*
	 * loop through all the inputs to see if it's checked in order
	 * to find the period that is selected
	 */
	periodRadioButtonInputs.each(function() {
		if($(this).attr('checked')) {
			selectedPeriod = $(this).attr('value');
		}
	});
	
	if(selectedPeriod) {
		//remove the 'period' portion of the string
		selectedPeriod = selectedPeriod.replace('period', '');
	}
	
	//return the period
	return selectedPeriod;
};

/**
 * Checks if the show flagged items checkbox is checked
 * @return whether to only show the flagged items
 */
View.prototype.isFlaggedItemsChecked = function() {
	//the default value
	var showFlagged = null;
	
	//try to obtain the check box
	var showFlaggedItemsCheckBox = document.getElementById("onlyShowFilteredItemsCheckBox");
	
	//check if the check box exists, some pages do not have it
	if(showFlaggedItemsCheckBox) {
		//see if the checkbox was checked
		showFlagged = showFlaggedItemsCheckBox.checked;
	}
	
	return showFlagged;
};

/**
 * Checks if the show smart-filtered items checkbox is checked
 * @return whether to only show the smart-filtered items
 */
View.prototype.isSmartFilterChecked = function() {
	//the default value
	var showSmartFiltered = null;
	
	//try to obtain the check box
	var showSmartFilteredItemsCheckBox = document.getElementById("onlyShowSmartFilteredItemsCheckBox");
	
	//check if the check box exists, some pages do not have it
	if(showSmartFilteredItemsCheckBox) {
		//see if the checkbox was checked
		showSmartFiltered = showSmartFilteredItemsCheckBox.checked;
	}
	
	return showSmartFiltered;
};

/**
 * Determine if we are showing revisions or not by looking
 * at the radio button
 * @return whether we are showing revisions or not
 */
View.prototype.isShowRevisions = function() {
	//the default value
	var showRevisions = null;
	
	//get the check box for show all revisions
	var showRevisionsInput = document.getElementById("showAllRevisions");
	
	//check that the check box exists
	if(showRevisionsInput) {
		//check if the check box was checked
		showRevisions = showRevisionsInput.checked;
	}
	
	return showRevisions;
};

/**
 * Determine whether we are hiding personal info
 * @return whether we are hiding personal info or not
 */
View.prototype.isHidePersonalInfo = function() {
	//the default value
	var onlyShowWork = null;
	
	var onlyShowWorkCheckBox = document.getElementById('onlyShowWorkCheckBox');
	
	if(onlyShowWorkCheckBox) {
		onlyShowWork = onlyShowWorkCheckBox.checked;
	}
	
	//check box was not checked
	return onlyShowWork;
};

/**
 * Determine whether we are enlarging text
 * @return whether we are enlarging text or not
 */
View.prototype.isEnlargeStudentWorkText = function() {
	var enlargeStudentWorkText = null;
	
	var enlargeStudentWorkTextCheckBox = document.getElementById('enlargeStudentWorkTextCheckBox');
	
	if(enlargeStudentWorkTextCheckBox) {
		enlargeStudentWorkText = enlargeStudentWorkTextCheckBox.checked;
	}
	
	//check box was not checked
	return enlargeStudentWorkText;
};


/**
 * Filter the student rows that are displayed in the grading view
 * by looking at what period is selected, whether filter flagging
 * is selected, and whether show revisions is selected
 */
View.prototype.filterStudentRows = function() {
	//get the period that is selected
	var period = this.getPeriodFilterSelected();
	
	if(period != null) {
		this.gradingPeriod = period;	
	}
	
	//get whether we are to only show flagged items
	var showFlagged = this.isFlaggedItemsChecked();
	
	if(showFlagged != null) {
		this.gradingShowFlagged = showFlagged;		
	}
	
	//get whether we are to only show items that passed smart filter
	var showSmartFiltered = this.isSmartFilterChecked();
	
	if(showSmartFiltered != null) {
		this.gradingShowSmartFiltered = showSmartFiltered;		
	}
	
	//get whether we are to show revisions
	var showRevisions = this.isShowRevisions();
	
	if(showRevisions != null) {
		this.gradingShowRevisions = showRevisions;	
	}
	
	//get whether we are hiding personal info
	var hidePersonalInfo = this.isHidePersonalInfo();
	
	if(hidePersonalInfo != null) {
		this.gradingHidePersonalInfo = hidePersonalInfo;
	}
	
	//get whether we are enlarging student work text	
	var enlargeStudentWorkText = this.isEnlargeStudentWorkText();

	if(enlargeStudentWorkText != null) {
		this.gradingEnlargeStudentWorkText = enlargeStudentWorkText;
	}
	
	//get all the student work rows
	var studentWorkRows = this.getElementsByClassName(null, 'studentWorkRow', null);
	
	//loop through all the student work rows
	for(var x=0; x<studentWorkRows.length; x++) {
		//get a student work row
		var studentWorkRow = studentWorkRows[x];
		
		//get the class for the student work row
		var studentRowClass = studentWorkRow.className;
		
		//the default value
		var displayStudentRow = true;
		
		/*
		 * filter by period (check if the current row is in the period
		 * that is currently selected
		 */
		if(period == 'all') {
			//all periods should be shown
			
			/*
			 * this is a special case only checked if the grading view is
			 * 'displayGradeByStepSelectPage'. for 'displayGradeByStepSelectPage'
			 * when 'All Periods' is selected we need to show the special
			 * aggregate row and not all the rows.
			 */
			if(this.currentGradingDisplay == 'displayGradeByStepSelectPage') {
				if(studentRowClass.indexOf("periodAll") == -1) {
					//it does not have the "periodAll" class so we will hide it
					displayStudentRow = false;
				}
			}
		} else if(studentRowClass.indexOf("period" + period) != -1) {
			//the row is in the period we want to show
		} else if(this.currentGradingDisplay == 'displayGradeByTeamGradingPage') {
			/*
			 * we are in the grade by team grading page so period filtering is not applicable
			 * because we are grading a specific team
			 */
		} else {
			//the row is not in the period we want to show so we will not show it
			displayStudentRow = false;
		}
		
		/*
		 * filter by flagged (check if only show flagged items is checked
		 * and if so, check if the row is flagged)
		 */
		if(showFlagged) {
			//only show flagged items is selected
			if(studentWorkRow.getAttribute('isFlagged') != 'true') {
				//the row is not flagged so we will not show it
				displayStudentRow = false;
			}
		}
		
		//filter by revisions (check if show revisions is checked
		if(!showRevisions) {
			/*
			 * show revisions is not checked so we need to hide revisions unless
			 * flagging is on and the revision is flagged
			 */
			
			if(showFlagged && studentWorkRow.getAttribute('isFlagged') == 'true') {
				/*
				 * allow the row to be displayed because show flagged is on and
				 * this revision is flagged
				 */
			} else if(studentRowClass.indexOf('studentWorkRevisionRow') != -1) {
				//the row is a revision so we will not show it
				displayStudentRow = false;
			}
		}
		
		//set the style to show or display the row
		if(displayStudentRow) {
			studentWorkRow.style.display = "";

			//check if the row we are showing is a student work row
			if(studentWorkRow.id.indexOf("studentWorkRow") != -1) {
				//it is a student work row
				
				//get the step work id and workgroup id
				var stepWorkId = this.getStudentWorkIdFromStudentWorkRowId(studentWorkRow.id);
				var workgroupId = this.getWorkgroupIdFromStudentWorkRowId(studentWorkRow.id);
				
				//render the student work if it has not already been rendered
				this.renderStudentWork(stepWorkId, workgroupId);
			}
		} else {
			studentWorkRow.style.display = "none";
		}
	}
	

	// tell node to show/hide smart filter
	if (this.currentGradingDisplayParam && this.currentGradingDisplay == 'displayGradeByStepGradingPage') {
		//get the node object
		var nodeId = this.currentGradingDisplayParam[1];
		var node = this.getProject().getNodeById(nodeId);
		node.showSmartFilter(showSmartFiltered);
	}	
	
	/*
	 * apply the hide personal info filter if necessary, do not perform the filter
	 * if we are on the grade by step select page because it will hide the statistics
	 */
	if(this.gradingHidePersonalInfo && this.currentGradingDisplay != 'displayGradeByStepSelectPage') {
		this.onlyShowWorkOnClick();
	}
	
	//apply the enlarge student work text if necessary
	if(this.gradingEnlargeStudentWorkText) {
		this.enlargeStudentWorkText();
	}
	
	//fix the height so scrollbars don't show up
	this.fixGradingDisplayHeight();
};

/**
 * Get the studentWorkId from the DOM studentWorkRowId.
 * @param studentWorkRowId the DOM id of the student work row.
 * the student work id will be after the last '_'
 * e.g. studentWorkRow_16784_node_13.se_627685
 * @return the student work id
 * e.g. 627685
 */
View.prototype.getStudentWorkIdFromStudentWorkRowId = function(studentWorkRowId) {
	//get the index of the last '_'
	var lastIndex = studentWorkRowId.lastIndexOf('_');
	
	//get all the string after the last '_'
	var studentWorkId = studentWorkRowId.substring(lastIndex + 1);
	
	return studentWorkId;
};

/**
 * Get the workgroupId from the DOM studentWorkRowId.
 * @param studentWorkRowId the DOM id of the student work row.
 * the workgroup id will be betweeen the first and second '_'
 * e.g. studentWorkRow_16784_node_13.se_627685
 * @return the workgroup id
 * e.g. 16784
 */
View.prototype.getWorkgroupIdFromStudentWorkRowId = function(studentWorkRowId) {
	//get the index of the first '_'
	var firstUnderscoreIndex = studentWorkRowId.indexOf('_');
	
	//get the index of the second '_'
	var secondUnderscoreIndex = studentWorkRowId.indexOf('_', firstUnderscoreIndex + 1);
	
	//get the string between the two '_'
	var workgroupId = studentWorkRowId.substring(firstUnderscoreIndex + 1, secondUnderscoreIndex);
	
	return workgroupId;
};

/**
 * Enlarges the student work text or set the student work text
 * back to normal size.
 */
View.prototype.enlargeStudentWorkText = function() {
	//get the check box for enlarge student work text
	var enlargeStudentWorkTextCheckBox = document.getElementById('enlargeStudentWorkTextCheckBox');
	
	if(enlargeStudentWorkTextCheckBox) {
		if(enlargeStudentWorkTextCheckBox.checked) {
			//check box was checked
			this.gradingEnlargeStudentWorkText = true;
			
			//get all the work columns
			var workColumns = this.getElementsByClassName(null, 'workColumn', null);
			
			//loop through all the work columns
			for(var x=0; x<workColumns.length; x++) {
				//set the style font-size to be large
				workColumns[x].style.cssText = "font-size:3.0em";	
			}
		} else {
			//check box was not checked
			this.gradingEnlargeStudentWorkText = false;
			
			//get all the work columns
			var workColumns = this.getElementsByClassName(null, 'workColumn', null);
			
			//loop through all the work columns
			for(var x=0; x<workColumns.length; x++) {
				/*
				 * set the style font-size to nothing so that the html
				 * will revert back to using the styling from the css file
				 */
				workColumns[x].style.cssText = "";	
			}
		}
	}
	
	//fix the height so scrollbars don't show up
	this.fixGradingDisplayHeight();
};

/**
 * Get whether input elements should be disabled or not
 * @return whether input elements should be disabled or not
 * depending on whether the user has write permission
 * 'disabled' if disabled
 * '' if enabled
 */
View.prototype.isWriteAllowed = function() {
	//the default value
	var writePermission = 'disabled';
	
	if(this.gradingPermission == 'write') {
		//user has write permission so element should be enabled
		writePermission = '';
	} else if(this.gradingPermission == 'read') {
		//user has read permission so element should be disabled
		writePermission = 'disabled';
	}
	
	return writePermission;
};

/**
 * Render all the student work for a given node. This is used
 * by gradeByStep.
 * @param node the node for the step we are displaying in the
 * grade by step
 */
View.prototype.renderAllStudentWorkForNode = function(node) {
	//get all the vleStates
	var vleStates = this.getVleStatesSortedByUserName();
	
	//get the node id
	var nodeId = node.id;
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;

		//get the revisions
		var nodeVisitRevisions = vleState.getNodeVisitsWithWorkByNodeId(nodeId);
		
		var latestNodeVisit = null;
		
		if(nodeVisitRevisions.length > 0) {
			//get the latest work for the current workgroup
			latestNodeVisit = nodeVisitRevisions[nodeVisitRevisions.length - 1];
		}
		
		/*
		 * this new way of displaying student work in grading is only implemented
		 * for new node types at the moment. we will convert all the other steps to
		 * this way later.
		 */
		if(this.isSelfRenderingGradingViewNodeType(node.type)) {
			//check if the student submitted any work
			if(latestNodeVisit != null) {
				//render the student work for the node visit
				this.renderStudentWorkFromNodeVisit(latestNodeVisit, workgroupId);
			}
		}
	}
};

/**
 * Render all the work for a student workgroup. This is used by
 * gradeByTeam.
 * @param workgroupId the id of the workgroup we want to display work for
 */
View.prototype.renderAllStudentWorkForWorkgroupId = function(workgroupId) {
	//get all the node ids in the project
	var nodeIds = this.getProject().getNodeIds();
	
	//get the work for the workgroup id
	var vleState = this.getVleStateByWorkgroupId(workgroupId);
	
	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//get a node id
		var nodeId = nodeIds[x];
		
		//get the node object
		var node = this.getProject().getNodeById(nodeId);

		/*
		 * this new way of displaying student work in grading is only implemented
		 * for new node types at the moment. we will convert all the other steps to
		 * this way later.
		 */
		if(this.isSelfRenderingGradingViewNodeType(node.type)) {
			//get the latest node visit for this workgroup for this node
			var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
			
			//check if the student submitted any work
			if(latestNodeVisit != null) {
				//render the student work for the node visit
				this.renderStudentWorkFromNodeVisit(latestNodeVisit, workgroupId);
			}
		}
	}
};

/**
 * Render the student work for the node visit
 * @param nodeVisit the node visit we want to display
 */
View.prototype.renderStudentWorkFromNodeVisit = function(nodeVisit, workgroupId) {
	if(nodeVisit != null) {
		//get the step work id
		var stepWorkId = nodeVisit.id;
		
		//get the student work
		var studentWork = nodeVisit.getLatestWork();
		
		//get the timestamp for when the work was posted
		var nodeVisitPostTime = nodeVisit.visitPostTime;
		
		//get the node object that the work is for
		var node = this.getProject().getNodeById(nodeVisit.nodeId);
		
		/*
		 * check if the work for this student for this step has already 
		 * been rendered. we can tell by checking that the studentWorkDiv
		 * is empty.
		 */
		if($("#studentWorkDiv_" + stepWorkId).html() == "") {
			//the div is empty so we need to render the student work
			
			//tell the node to insert/render the student work into the div
			node.renderGradingView("studentWorkDiv_" + stepWorkId, nodeVisit, "", workgroupId);
			
			//add the post time stamp to the bottom of the student work
			$("#studentWorkDiv_" + stepWorkId).append("<br><p class='lastAnnotationPostTime'>"+this.i18n.getString("timestamp",this.config.getConfigParam("locale"))+": " + new Date(nodeVisitPostTime) + "</p>");	
		}
	}
};

/**
 * Render the the student work for the given step work id. This is used
 * by filterStudentRows() and toggleGradingDisplayRevisions().
 * @param stepWorkId the id of the node visit/step work
 * @param workgroupId the id of the workgroup (this argument is
 * optional, it is used to make the call to getStudentWorkByStudentWorkId()
 * more efficient when searching for the node visit)
 */
View.prototype.renderStudentWork = function(stepWorkId, workgroupId) {
	/*
	 * get the node visit for the given id and workgroup id. the workgroup id
	 * is optional and helps make the search more efficient.
	 */
	var nodeVisit = this.getStudentWorkByStudentWorkId(stepWorkId, workgroupId);

	if(nodeVisit != null) {
		//render the student work for the node visit
		this.renderStudentWorkFromNodeVisit(nodeVisit, workgroupId);
	}
};

/**
 * Get the student work given the student work id/nodevisit id
 * @param studentWorkId the student work id/nodevisit id
 * @param workgroupId the id of the workgroup that we know
 * is associated with the student work id (this argument is
 * optional and is used to make the search more efficient) 
 * @return the node visit that has the given student work id
 * or null if not found
 */
View.prototype.getStudentWorkByStudentWorkId = function(studentWorkId, workgroupId) {
	//get all the vle states, each vle state represents the work for a workgroup
	var vleStates = this.getVleStatesSortedByUserName();
	
	//loop through all the vle states
	for(var x=0; x<vleStates.length; x++) {
		//get a vle state
		var vleState = vleStates[x];
		
		/*
		 * search this vle state if workgroup id was not provided
		 * or if the workgroup id was provided and it matches the
		 * vle state data id. basically if the workgroup id was provided
		 * and it doesn't match the vle state data id, we will skip
		 * this vle state and move on to the next one because
		 * it is assumed the student work id is associated with
		 * the workgroup id.
		 */
		if(workgroupId == null || vleState.dataId == workgroupId) {
			//get the node visit given the student work id/nodevisit id
			var nodeVisit = vleState.getNodeVisitById(studentWorkId);
			
			//return the node visit
			return nodeVisit;
		}
	}
	
	//we did not find any matching student work id/nodevisit id
	return null;
};

/**
 * displays the mysystem diagram in the specified div
 */
function showDiagram(divId, contentBaseUrl) {
    //var json_data = [{"containers": [{"terminals": [{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal1", "direction": [0, -1], "offsetPosition": {"left": 20, "top": -25}, "ddConfig": {"type": "input", "allowedTypes": ["input", "output"]}}, {"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal2", "direction": [0, 1], "offsetPosition": {"left": 20, "bottom": -25}, "ddConfig": {"type": "output", "allowedTypes": ["input", "output"]}}], "draggable": true, "position": ["191px", "67px"], "className": "WireIt-Container WireIt-ImageContainer", "ddHandle": false, "ddHandleClassName": "WireIt-Container-ddhandle", "resizable": false, "resizeHandleClassName": "WireIt-Container-resizehandle", "close": true, "closeButtonClassName": "WireIt-Container-closebutton", "title": "table", "icon": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "preventSelfWiring": true, "image": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "xtype": "MySystemContainer", "fields": {"energy": 100, "form": "light", "efficiency": 1}, "name": "table", "has_sub": false}, {"terminals": [{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal1", "direction": [0, -1], "offsetPosition": {"left": 20, "top": -25}, "ddConfig": {"type": "input", "allowedTypes": ["input", "output"]}}, {"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal2", "direction": [0, 1], "offsetPosition": {"left": 20, "bottom": -25}, "ddConfig": {"type": "output", "allowedTypes": ["input", "output"]}}], "draggable": true, "position": ["72px", "83px"], "className": "WireIt-Container WireIt-ImageContainer", "ddHandle": false, "ddHandleClassName": "WireIt-Container-ddhandle", "resizable": false, "resizeHandleClassName": "WireIt-Container-resizehandle", "close": true, "closeButtonClassName": "WireIt-Container-closebutton", "icon": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "preventSelfWiring": true, "image": "./images/thermodynamics/hotbowl.png", "xtype": "MySystemContainer", "fields": {"name": "hot bowl", "energy": 100, "form": "light", "efficiency": 1}, "name": "hot bowl", "has_sub": false}], "wires": [{"src": {"moduleId": 1, "terminal": "Terminal2"}, "tgt": {"moduleId": 0, "terminal": "Terminal2"}, "options": {"className": "WireIt-Wire", "coeffMulDirection": 100, "drawingMethod": "bezierArrows", "cap": "round", "bordercap": "round", "width": 5, "borderwidth": 1, "color": "#BD1550", "bordercolor": "#000000", "fields": {"name": "flow", "width": 5, "color": "color2"}, "selected": false}}]}];
    //var json_data = eval(document.getElementById(divId).innerHTML);
    var json_data = document.getElementById(divId).innerHTML;
    document.getElementById(divId).innerHTML = "";
    var width="800";
    var height="600";
    var scale=0.55;
    try {
      new MySystemPrint(json_data,divId,contentBaseUrl);
    } catch (err) {
    	// do nothing
    }
} 

function showDiagramNode(currNode, nodeIndex, nodeList) {
	showDiagram($(this).attr("id"),$(this).attr("contentBaseUrl"));
}

function showDrawNode(currNode) {
	var svgString = String($(this).html());
	svgString = Utils.decode64(svgString);
	var svgXml = Utils.text2xml(svgString);
	$(this).html('');
	$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
}

function showSnaps(currNode){
	var svgString = String($(this).html());
	svgString = Utils.decode64(svgString);
	var svgXml = Utils.text2xml(svgString);
	$(this).html('');
	$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
}

// TODO: figure out a fix for arrows (markers) not displaying in enlarged view
function enlargeDraw(divId){
	/*var svg = "<?xml version='1.0'?>\n" + $('#'+divId).html();
	svg = svg.replace(/xlink/,"xmlns:xlink");
	svg = svg.replace(/(<svg.*)width="360"/, '$1width="600"');
	svg = svg.replace(/(<svg.*)height="270"/, '$1height="450"');
	
	svg = svg.replace(/(<svg.*)width="120"/, '$1width="600"');
	svg = svg.replace(/(<svg.*)height="90"/, '$1height="450"');
	
	svg = svg.replace(/<g transform=".*">/gmi,'<g>');
	svg = svg.replace(/(<image.*)href(.*)(>)/gmi,'$1xlink:href$2\/$3');
	window.open("data:image/svg+xml;base64," + Utils.encode64(svg));*/

	var newwindow = window.open("/vlewrapper/vle/node/draw/svg-edit/svg-editor-grading.html");
	newwindow.divId = divId;
}

function enlargeMS(divId){
	
	/*
	var data = $('#'+divId).html();
	var contentString = $('#content_'+divId).html();
		
    mysystem.config.dataService = new GradingToolDS(data);
    mysystem.config.jsonURL = contentString;
    mySystem = mysystem.loadMySystem();
	*/
	var newwindow = window.open("/vlewrapper/vle/node/mysystem/grading/mysystem.html");
	newwindow.divId = divId;
    /*
	var svg = "<?xml version='1.0'?>\n" + $('#'+divId).html();
	svg = svg.replace(/xlink/,"xmlns:xlink");
	svg = svg.replace(/(<svg.*)width="360"/, '$1width="600"');
	svg = svg.replace(/(<svg.*)height="270"/, '$1height="450"');
	svg = svg.replace(/<g transform=".*">/gmi,'<g>');
	svg = svg.replace(/(<image.*)href(.*)(>)/gmi,'$1xlink:href$2\/$3');
	window.open("data:image/svg+xml;base64," + Utils.encode64(svg));
	*/
}

/**
 * Obtain the latest student work by calling render again to retrieve the
 * latest data.
 */
function refresh() {
	lock();	
	render(this.contentURL, this.userURL, this.getDataUrl, this.contentBaseUrl, this.getAnnotationsUrl, this.postAnnotationsUrl, this.runId, this.getFlagsUrl, this.postFlagsUrl);
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_display.js');
};