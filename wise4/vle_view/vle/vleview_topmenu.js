View.prototype.dropDownMenuDispatcher = function(type,args,obj){
	if(type=='showAllWork'){
		obj.showAllWork();
	} else if(type=='displayProgress'){
		obj.displayProgress(args[0], args[1]);
	} else if(type=='showFlaggedWork'){
		obj.showFlaggedWork();
	} else if (type == 'showNavigationTree') {
		obj.showNavigationTree();
	} else if (type == 'showStepHints') {
		// if hint is already open, do not open up another hint
		if ($("#hintsPanel") && 
				$("#hintsPanel").data("dialog") && 
				$("#hintsPanel").data("dialog").isOpen()) {
			return;
		}
		obj.showStepHints();
	} else if(type=='getIdeaBasket') {
		obj.getIdeaBasket();
	} else if(type=='ideaBasketChanged') {
		/*
		 * nothing needs to be done here since the idea basket and all the
		 * ExplanationBuilderNode steps listens for the 'ideaBasketChanged'
		 * themselves
		 */
	} else if(type=='displayAddAnIdeaDialog') {
		obj.displayAddAnIdeaDialog();
	} else if(type=='displayIdeaBasket') {
		obj.displayIdeaBasket();
	} else if(type=='addIdeaToBasket') {
		obj.addIdeaToBasket();
	} else if(type=='moveIdeaToTrash') {
		obj.moveIdeaToTrash(args[0]);
	} else if(type=='moveIdeaOutOfTrash') {
		obj.moveIdeaOutOfTrash(args[0]);
	} else if(type=='viewStudentAssets') {
		obj.viewStudentAssets();
	} else if(type=='studentAssetSubmitUpload') {
		obj.studentAssetSubmitUpload();
	} else if(type=='ideaBasketDocumentLoaded') {
		obj.loadIdeaBasket();
	} else if(type=='displayFlaggedWorkForNodeId') {
		obj.displayFlaggedWorkForNodeId();
	}
};

/**
 * Get the flags from the server
 * @return
 */
View.prototype.showFlaggedWork = function() {
	this.getShowFlaggedWorkData();
};

/**
 * Shows the NavigationPanel with tree view
 * @return
 */
View.prototype.showNavigationTree = function() {
	this.navigationPanel.showNavigationTree();
};

/**
 * Display hints for the current step.
 * Hints will popup in a dialog and each hint will
 * be in its own tab
 */
View.prototype.showStepHints = function() {
	$('#hintsLink').stop();
	$('#hintsLink').css('background-color','#FFFA7F');
	//$('#hintsLink').css('color','#333333');
	
	var currentNode = this.getCurrentNode();
	
	// show the notes panel
    $('#hintsPanel').dialog('open');
		
	// log when hint was opened
	var hintState = new HINTSTATE({action:"hintopened",nodeId:currentNode.id});
	currentNode.view.pushHintState(hintState);
};
/**
 * Display the flagged work for the project.
 */
View.prototype.displayFlaggedWork = function() {
	var flaggedWorkHtml = "";
	
	//get the node the student is currently on
	var currentNode = this.getCurrentNode();
	var nodeId = currentNode.id;

	//get the node
	var node = this.getProject().getNodeById(nodeId);
	
	//get all the flags for the current node
	var flagsForNodeId = this.flags.getAnnotationsByNodeId(nodeId);
	
	//get the node ids that have flags associated with them
	var flagNodeIds = this.flags.getNodeIds();
	
	/*
	 * the first node id in the project that contains a flag.
	 * we will use this to know which node to display when
	 * the show flagged work popup opens
	 */
	var firstFlaggedNodeId = null;
	
	if(flagNodeIds.length > 0) {
		//get all the node ids in the project
		var nodeIds = this.getProject().getNodeIds();
		
		flaggedWorkHtml += "<div>";
		flaggedWorkHtml += "<p><b>Choose a step</b></p>";
		
		//select box for the student to choose which step's flagged work to look at
		flaggedWorkHtml += "<select id='flagNodeIdSelect' onchange='eventManager.fire(\"displayFlaggedWorkForNodeId\")'>";
		
		//loop through all the node ids in the project
		for(var x=0; x<nodeIds.length; x++) {
			//get a node id
			var nodeId = nodeIds[x];
			
			//check if the node id is in the array of flagged node ids
			if(flagNodeIds.contains(nodeId)) {
				
				if(firstFlaggedNodeId == null) {
					//remember the first flagged node id
					firstFlaggedNodeId = nodeId;					
				}
				
				//get the info for the node
				var node = this.getProject().getNodeById(nodeId);
				var position = this.getProject().getVLEPositionById(nodeId);
				var stepTerm = this.getProject().getStepTerm();
				
				//add an option into the select box
				flaggedWorkHtml += "<option value=" + nodeId + ">";
				flaggedWorkHtml += stepTerm + " " + position + ": " + node.title + " (" + node.type + ")";
				flaggedWorkHtml += "</option>";
			}
		}
		
		flaggedWorkHtml += "</select>";
		flaggedWorkHtml += "</div>";
		flaggedWorkHtml += "<br>";
		
		//div that we will use to display the flagged work
		flaggedWorkHtml += "<div id='flaggedWorkForNodeIdDiv'></div>";
	} else {
		//there are no flagged items
		flaggedWorkHtml += "There are no flagged items.";
	}
	
	//check if the showflaggedwork div exists
    if($('#showflaggedwork').size()==0){
    	//the show flaggedworkdiv does not exist so we will create it
    	$('<div id="showflaggedwork" style="text-align:left"></div>').dialog({autoOpen:false,closeText:'',width:'96%',height:(document.height * .96),modal:true,title:'Flagged Work',zindex:9999});
    }
    
    //set the html into the div
    $('#showflaggedwork').html(flaggedWorkHtml);
    
    //make the div visible
    $('#showflaggedwork').dialog('open');

	//display the flagged work for the node id that is selected in the select box
	this.displayFlaggedWorkForNodeId();
};

/**
 * Display the flagged work for the node id that is selected in the select box
 * @param nodeId which node to display flagged work for (optional)
 */
View.prototype.displayFlaggedWorkForNodeId = function(nodeId) {
	if(nodeId == null) {
		//get the node that is selected in the select box
		nodeId = $('#flagNodeIdSelect').val();
	}
	
	//get the node
	var node = this.getProject().getNodeById(nodeId);
	
	//get all the flags for the current node
	var flagsForNodeId = this.flags.getAnnotationsByNodeId(nodeId);
	
	//get the position
	var position = this.getProject().getVLEPositionById(nodeId);
	
	var flaggedWorkHtml = "";
	
	//display the step position, title, and type
	flaggedWorkHtml += "<div><br><b><u>" + position + " " + node.title + " (" + node.type + ")" + "</u></b><br><br>";
	
	//display the prompt for the step
	flaggedWorkHtml += "Prompt:<br/>";
	flaggedWorkHtml += node.getPrompt() + "<br/><br/></div><hr size=4 noshade><br/>";
	
	var flaggedWorkAnswers = "";
	
	//loop through all the flags for the current node
	for(var y=0; y<flagsForNodeId.length; y++) {
		//get a flag
		var flagForNodeId = flagsForNodeId[y];
		
		//get the work that was flagged
		var flaggedWork = flagForNodeId.data.getLatestWork();
		var flaggedWorkPostTime = flagForNodeId.postTime;
		
		if(flaggedWorkAnswers != "") {
			//add line breaks to separate the multiple answers that were flagged
			flaggedWorkAnswers += "<br/><br/>";
		}
		
		flaggedWorkAnswers += "<div style='border-width:thin; border-style:solid'>";
		
		//display the flagged work/answer
		flaggedWorkAnswers += "<div>Answer (Team Anonymous " + (y + 1) + "):</div><br/>";
		if (node.type == "MySystemNode") {
			var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
			var divId = "mysystemDiagram_"+flaggedWorkPostTime;
			flaggedWorkAnswers += "<div id='"+divId+"' contentBaseUrl='"+contentBaseUrl+"' class='mysystem' style=\"height:350px;\">" + flaggedWork + "</div>";
		} else if (node.type == "SVGDrawNode") {
    		var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
			var divId = "svgDraw_"+flaggedWorkPostTime;
			flaggedWork = node.translateStudentWork(flaggedWork);
			var divStyle = "height:270px; width:360px; border:1px solid #aaa; background-color:#fff;";
			flaggedWorkAnswers += "<div id='"+divId+"' contentBaseUrl='"+contentBaseUrl+"' class='svgdraw2' style=\"" + divStyle + "\">" + flaggedWork + "</div>";
    	} else if(this.isSelfRenderingGradingViewNodeType(node.type)) {
    		flaggedWorkAnswers += "<div id='flaggedStudentWorkDiv_" + flagForNodeId.stepWorkId + "'></div>";
    	} else {
			flaggedWorkAnswers += "<div>"+flaggedWork+"</div>";
		}
		
		flaggedWorkAnswers += "</div>";
	}
	
	flaggedWorkHtml += flaggedWorkAnswers;

	//add the html to the flagged work div
	$('#flaggedWorkForNodeIdDiv').html(flaggedWorkHtml);
	
    // inject svgdrawings
    $('.svgdraw2').each(function(){
		var svgString = String($(this).html());
		var contentBaseUrl = $(this).attr("contentBaseUrl");
		svgString = Utils.decode64(svgString);
		// shrink svg image to fit
		svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
		svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
		svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
		var svgXml = Utils.text2xml(svgString); // convert to xml
		$(this).html('');
		$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
	});
    
    // print mysystem...should happen after opening showflaggedwork dialog
	$(".mysystem").each(function() {
		var json_str = $(this).html();
		$(this).html("");
		var divId = $(this).attr("id");
		var contentBaseUrl = $(this).attr("contentBaseUrl");
		try {
			new MySystemPrint(json_str,divId,contentBaseUrl);
		} catch (err) {
			// do nothing
		}
	});
	
	//loop through all the flags for the current node
	for(var y=0; y<flagsForNodeId.length; y++) {
		//get a flag
		var flagForNodeId = flagsForNodeId[y];
		
		//only perform this for sensor nodes until we implement it for all other steps
		if(this.isSelfRenderingGradingViewNodeType(node.type)) {

			//get the nodevisit from the flag
			var nodeVisit = flagForNodeId.data;
			
			if(nodeVisit != null) {
				/*
				 * get the step work id and set it into the nodevisit
				 * because for some reason it does not have its id set
				 */
				nodeVisit.id = flagForNodeId.stepWorkId;
				
				var workgroupId = parseInt(flagForNodeId.toWorkgroup);
				
				//render the work into the div to display it
				node.renderGradingView("flaggedStudentWorkDiv_" + nodeVisit.id, nodeVisit, "flag_", workgroupId);					
			}
		}
	}
};

/**
 * Retrieve all the data required to display the show all work. Perform
 * this retrieval every time the student opens Show All Work so that
 * they can get grades and comments the teacher made immediately.
 */
View.prototype.showAllWork = function(annotationsRetrieved, projectMetaDataRetrieved){
	//clear out these values so that the respective data will be retrieved again
	this.annotationsRetrieved = annotationsRetrieved;
	this.projectMetaDataRetrieved = projectMetaDataRetrieved;
	
	//get the annotation, project meta data, and run extras
	this.getShowAllWorkData();
};

/**
 * This function checks to make sure annotations, project meta data, and
 * run extras are retrieved before displaying Show All Work.
 * 
 * The dispatcher listens for the 3 events below and calls displayShowAllWork 
 * each time but only displays Show All Work after all 3 have been fired
 * by checking the *Retrieved flags
 * 
 * getAnnotationsComplete
 * getProjectMetaDataComplete
 * getRunExtrasComplete
 *
 */
View.prototype.displayShowAllWork = function() {
	//make sure annotations, project meta data, and run extras have been retrieved
	if(this.annotationsRetrieved && this.projectMetaDataRetrieved) {
	    var allWorkHtml = "";
	    
	    var workgroupId = this.getUserAndClassInfo().getWorkgroupId();
	    
	    //get all the ids for teacher and shared teachers
	    var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	    
	    //get the scores given to the student by the teachers
	    var totalScoreAndTotalPossible = this.annotations.getTotalScoreAndTotalPossibleByToWorkgroupAndFromWorkgroups(workgroupId, teacherIds, this.maxScores);
	    
	    //get the total score for the workgroup
	    var totalScoreForWorkgroup = totalScoreAndTotalPossible.totalScore;
	    
	    //get the max total score for the steps that were graded for this workgroup
	    var totalPossibleForWorkgroup = totalScoreAndTotalPossible.totalPossible;
	    
	    //get the max total score for this project
	    var totalPossibleForProject = this.getMaxScoreForProject();
	    
	    var vleState = this.state;
	    
	    //get all the nodeIds in the projecte except HtmlNodes
	    var nodeIds = this.getProject().getNodeIds("HtmlNode");
	    
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
			}
		}
		
		//for the current team, calculate the percentage of the project they have completed
		var teamPercentProjectCompleted = Math.floor((numStepsCompleted / nodeIds.length) * 100) + "%";
	    
		// var closeButton1 = "<a href='#' class='container-close'>Close</a>";
		
	    var scoresDiv1 = "<table id='showAllWorkScoresTable'><tr><td class='scoreHeader' colspan='4'>Current Score & Progress</td></tr>";
	    
	    var scoresDiv2 = "<tr><td>Teacher Graded Score</td><td>Computer Graded Score</td><td>TOTAL SCORE</td><td>% of Project Completed</td></tr>";
	    	
	    var scoresDiv3 = "<tr><td class='scoreValue'>" + totalScoreForWorkgroup + "/" + totalPossibleForWorkgroup + "</td><td class='scoreValue'>not available</td><td class='scoreValue'>" + totalScoreForWorkgroup + "/" + totalPossibleForProject + "</td><td class='scoreValue'>" + teamPercentProjectCompleted + "</td></tr></table>";

	    
		allWorkHtml = "<div id=\"showWorkContainer\">" + scoresDiv1 + scoresDiv2 + scoresDiv3 + "<br><hr class='showAllWorkHR'><br>" + this.project.getShowAllWorkHtml(this.project.getRootNode(), true) + "</div>";

	    if($('#showallwork').size()==0){
	    	$('<div id="showallwork"></div>').dialog({autoOpen:false,closeText:'',width:'96%',height:(document.height * .96),modal:true,title:'My Work (with Teacher Feedback and Scores)'});
	    }	    
	    
	    $('#showallwork').html(allWorkHtml);
	    
	    // inject svgdrawings
	    $('.svgdraw').each(function(){
			var svgString = String($(this).html());
			var contentBaseUrl = $(this).attr("contentBaseUrl");
			svgString = Utils.decode64(svgString);
			// shrink svg image to fit
			svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
			svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
			svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
			var svgXml = Utils.text2xml(svgString); // convert to xml
			$(this).html('');
			$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
		});
	    
	    $('#showallwork').dialog('open');
	    // print mysystem...should happen after opening showallworkdialog
		$(".mysystem").each(function() {
			var json_str = $(this).html();
			$(this).html("");
			var divId = $(this).attr("id");
			var contentBaseUrl = $(this).attr("contentBaseUrl");
			try {
				new MySystemPrint(json_str,divId,contentBaseUrl);
			} catch (err) {
				// do nothing
			}
		});
		
		//get all the node ids in the project
		var nodeIds = this.project.getNodeIds();
		
		//loop through all the node ids
		for(var x=0; x<nodeIds.length; x++) {
			//get a node object
			var node = this.project.getNodeById(nodeIds[x]);

			//only perform this for sensor nodes until we implement it for all other steps
			if(this.isSelfRenderingGradingViewNodeType(node.type)) {
				//get the node id
				var nodeId = node.id;
				
				//get the latest node visit that contains student work for this step
				var nodeVisit = this.state.getLatestNodeVisitByNodeId(nodeId);
				
				//check if the student has any work for this step
				if(nodeVisit != null) {
					//render the work into the div to display it
					node.renderGradingView("latestWork_" + nodeVisit.id, nodeVisit, "", workgroupId);
					
					if($("#new_latestWork_" + nodeVisit.id).size != 0) {
						/*
						 * render the work into the new feedback div if it exists. the
						 * new feedback div exists when the teacher has given a new
						 * score or comment and we need to show the work and feedback
						 * for that step at the the top of the show all work
						 */
						node.renderGradingView("new_latestWork_" + nodeVisit.id, nodeVisit, "", workgroupId);
					}
				}
			}
		}
		
		//check if there was any new feeback for the student
		if(this.project.hasNewFeedback()) {
			//display a popup to notify the student that there is new feedback
			alert('You have new feedback from your teacher.\n\nThe new feedback is labelled as [New].');
		}
	}
};

/**
 * Retrieve all the annotations for the currently-logged in user/workgroup
 * from the teacher.
 */
View.prototype.getAnnotations = function(callerId) {
	var processGetAnnotationResponse = function(responseText, responseXML, args) {
		var thisView = args[0];
		var callerId = args[1];
		
		//parse the xml annotations object that contains all the annotations
		thisView.annotations = Annotations.prototype.parseDataJSONString(responseText);

		thisView.annotationsRetrieved = true;
		eventManager.fire('getAnnotationsComplete', callerId);
	};

	var annotationsUrlParams = {
				runId: this.getConfig().getConfigParam('runId'),
				toWorkgroup: this.getUserAndClassInfo().getWorkgroupId(),
				fromWorkgroups: this.getUserAndClassInfo().getAllTeacherWorkgroupIds(),
				periodId:this.getUserAndClassInfo().getPeriodId()
			};
	
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getAnnotationsUrl'), annotationsUrlParams, processGetAnnotationResponse, [this, callerId]);
};

/**
 * Retrieve the flagged work and display it
 */
View.prototype.getFlaggedWork = function() {
	var processGetFlaggedWorkResponse = function(responseText, responseXML, args) {
		var thisView = args[0];
		var callerId = args[1];
		
		//parse the flags
		thisView.flags = Annotations.prototype.parseDataJSONString(responseText);
		
		var containsExplanationBuilderNode = false;
		
		//get all the node ids that have flags
		var nodeIds = thisView.flags.getNodeIds();
		
		//loop through all the node ids that have flags
		for(var x=0; x<nodeIds.length; x++) {
			var nodeId = nodeIds[x];
			var node = thisView.getProject().getNodeById(nodeId);
			
			if(node.type == 'ExplanationBuilderNode') {
				/*
				 * the node is an explanation builder step so we know
				 * we will need to retrieve idea baskets from some of
				 * our classmates
				 */
				containsExplanationBuilderNode = true;
			}
		}
		
		if(containsExplanationBuilderNode) {
			/*
			 * at least one of the flags is for an explanation builder step
			 * so we need to retrieve the idea baskets of our classmates that
			 * are associated with the flagged work
			 */
			thisView.getFlaggedIdeaBaskets();
		} else {
			//display the flagged work
			thisView.displayFlaggedWork();
		}
	};

	var flaggedWorkUrlParams = {
				userId:this.getUserAndClassInfo().getWorkgroupId(),
				periodId:this.getUserAndClassInfo().getPeriodId(),
				isStudent:true
	};
	
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getFlagsUrl'), flaggedWorkUrlParams, processGetFlaggedWorkResponse, [this]);

};

/**
 * Retrieve the flagged work
 */
View.prototype.getShowFlaggedWorkData = function() {
	this.getFlaggedWork();
};

/**
 * Makes sure all 3 sets of data are retrieved before
 * Show All Work is displayed.
 */
View.prototype.getShowAllWorkData = function() {
	//make sure annotations are retrieved
	if(this.annotationsRetrieved == null) {
		this.getAnnotations('displayShowAllWork');
	} else {
		/*
		 * the annotations were already retrieved so we will make sure
		 * the flag has been set and we will fire the event again
		 * so listeners will be notified 
		 */
		this.annotationsRetrieved = true;
		eventManager.fire('getAnnotationsComplete', 'displayShowAllWork');
	}
	
	//make sure project meta data is retrieved
	if(this.projectMetaDataRetrieved == null) {
		this.getProjectMetaData();
	} else {
		/*
		 * the annotations were already retrieved so we will make sure
		 * the flag has been set and we will fire the event again
		 * so listeners will be notified 
		 */
		this.projectMetaDataRetrieved = true;
		eventManager.fire('getProjectMetaDataComplete');
	}
};

/**
 * Get annotations so we can check if there are any new teacher annotations
 * to notify the student about
 */
View.prototype.getAnnotationsToCheckForNewTeacherAnnotations = function() {
	this.getAnnotations('checkForNewTeacherAnnotations');
};

/**
 * Check if there are any new teacher annotations since the student last
 * visited. If there are new annotations we will display a popup message
 * to the student and automatically open up show all work.
 * @return
 */
View.prototype.checkForNewTeacherAnnotations = function() {
	if(this.state != null) {
		//get the time they last visited in milliseconds
		var lastTimeVisited = this.state.getLastTimeVisited();
		
		if(this.annotations != null) {
			//check if there are any new annotations after the last time they visited
			var areNewAnnotations = this.annotations.annotationsAfterDate(lastTimeVisited);
			
			if(areNewAnnotations) {
				//there are new annotations so we will automatically open up the show all work
				this.showAllWork(true, null, null);
			}		
		}		
	}
	
	eventManager.fire('getIdeaBasket');
};

/**
 * Displays the Add an Idea dialog popup so the student can create a new Idea
 */
View.prototype.displayAddAnIdeaDialog = function() {
	
	if(!this.ideaBasket) {
		/*
		 * the vle failed to retrieve the idea basket so we will display
		 * an error message and not display the idea basket popup
		 */
		this.notificationManager.notify(this.i18n.getString("idea_basket_retrieval_error",this.config.getConfigParam("locale")), 3);
		return;
	}
	
	//check if the addAnIdeaDiv exists
	if($('#addAnIdeaDiv').size()==0){
		//it does not already exist so we will create it
    	$('<div id="addAnIdeaDiv" style="text-align:left"></div>').dialog({autoOpen:false,closeText:'',width:470,height:240,resizable:false,modal:false,title:this.i18n.getString("idea_basket_add_an_idea",this.config.getConfigParam("locale")),position:[300,40],buttons:[{text:this.i18n.getString("ok",this.config.getConfigParam("locale")),click:function() {eventManager.fire("addIdeaToBasket");}},{text:this.i18n.getString("cancel",this.config.getConfigParam("locale")),click:function() {$(this).dialog("close");}}]});
    }
	
	//the html we will insert into the popup
	var addAnIdeaHtml = "";
	
	addAnIdeaHtml += "<form class='cmxform' id='ideaForm' method='get' action=''>";
	addAnIdeaHtml += "<fieldset>";
	addAnIdeaHtml += "			<p><label for='text'>Type your idea here*:</label><input id='addAnIdeaText' type='text' name='text' size='30' class='required' minlength='2' maxlength='150'></input></p>";
	addAnIdeaHtml += "			<table>";
	addAnIdeaHtml += "				<tr>";
	addAnIdeaHtml += "					<td>";
	addAnIdeaHtml += "			<p style:'height:24px; line-height:24px;'>";
	addAnIdeaHtml += "				<label for='source'>Source*: </label>";
	addAnIdeaHtml += "				<select id='addAnIdeaSource' name='source' class='required' style='height:24px;'>";
	addAnIdeaHtml += "					<option value='Evidence Step'>Evidence Step</option>";
	addAnIdeaHtml += "				  <option value='Visualization or Model'>Visualization or Model</option>";
	addAnIdeaHtml += "				  <option value='Movie/Video'>Movie/Video</option>";
	addAnIdeaHtml += "				  <option value='Everyday Observation'>Everyday Observation</option>";
	addAnIdeaHtml += "				  <option value='School or Teacher'>School or Teacher</option>";
	addAnIdeaHtml += "				  <option value='Other'>Other</option>";
	addAnIdeaHtml += "				</select>";
	addAnIdeaHtml += "			</p>";
	addAnIdeaHtml += "					</td>";
	addAnIdeaHtml += "					<td>";
	addAnIdeaHtml += "			<p id='addAnIdeaOtherSource' style='display:none'><label for='other'>Specify*: </label><input id='addAnIdeaOther' name='other' size='15' minlength='2' maxlength='25'></input></p>";
	addAnIdeaHtml += "					</td>";
	addAnIdeaHtml += "				</tr>";
	addAnIdeaHtml += "			</table>";
	addAnIdeaHtml += "			<p><label for='tags'>Tags (keywords): </label><input id='addAnIdeaTags' name='tags' size='20' maxlength='20'></input></p>";
	addAnIdeaHtml += "				<p>";
	addAnIdeaHtml += "				<label for='flag'>Flag (choose one)*: </label>";
	addAnIdeaHtml += "				<input type='radio' name='addAnIdeaFlag' value='blank' class='required' checked style='margin-left:0;'><span style='vertical-align:top; line-height:24px;'> None</span>";
	addAnIdeaHtml += "				<input type='radio' name='addAnIdeaFlag' value='important'><img src='images/ideaManager/important.png' alt='important' /><span style='vertical-align:top; line-height:24px;'>Important</span>";
	addAnIdeaHtml += "				<input type='radio' name='addAnIdeaFlag' value='question'><img src='images/ideaManager/question.png' alt='question' /><span style='vertical-align:top; line-height:24px;'>Not Sure</span>";
	//addAnIdeaHtml += "				<input type='radio' name='addAnIdeaFlag' value='check'><img src='images/ideaManager/check.png' alt='check' />";
	addAnIdeaHtml += "				</p>";
	addAnIdeaHtml += "	</fieldset>";
	addAnIdeaHtml += "</form>";
	
	//insert the html into the popup
	$('#addAnIdeaDiv').html(addAnIdeaHtml);
	
	//make the popup visible
	$('#addAnIdeaDiv').dialog('open');
	
	//display or hide the specify other source field when Other is chosen or not chosen
	$('#addAnIdeaSource').change(function(){
		if($('#addAnIdeaSource').val()=='Other'){
			$('#addAnIdeaOtherSource').show();
			$('#addAnIdeaOther').addClass('required');
		} else {
			$('#addAnIdeaOtherSource').hide();
			$('#addAnIdeaOther').removeClass('required');
		}
	});
};

/**
 * Add the idea to the basket and save the basket back to the server
 */
View.prototype.addIdeaToBasket = function() {
	//get the values the student entered
	var text = $('#addAnIdeaText').val();
	
	if(text == "") {
		alert("Please enter text in the idea field");
	} else {
		
		var source = $('#addAnIdeaSource').val();
		var tags = $('#addAnIdeaTags').val();
		var flag = $("input[@name=addAnIdeaFlag]:checked").val();
		
		//get the node id, node name and vle position for the step
		var nodeId = this.getCurrentNode().id;
		var nodeName = this.getCurrentNode().getTitle();
		var vlePosition = this.getProject().getVLEPositionById(nodeId);
		
		//prepend the vlePosition so nodeName will now look something like "2.3: How Airbags Work"
		nodeName = vlePosition + ": " + nodeName;

		//get the idea basket
		var ideaBasket = this.ideaBasket;
		
		//create and add the new idea to the basket
		ideaBasket.addIdeaToBasketArray(text,source,tags,flag,nodeId,nodeName);
		
		ideaBasket.saveIdeaBasket(this);
		
		//close the create an idea popup
		$('#addAnIdeaDiv').dialog('close');		
		
		// update idea count on toolbar
		ideaBasket.updateToolbarCount(1,true);
	}
};

/**
 * Retrieve the idea basket from the server
 */
View.prototype.getIdeaBasket = function() {
	//set the params we will use in the request to the server
	var ideaBasketParams = {
		action:"getIdeaBasket"	
	};
	
	//request the idea basket from the server
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getIdeaBasketUrl'), ideaBasketParams, this.getIdeaBasketCallback, {thisView:this});
};

/**
 * Callback for when we receive the idea basket from the server
 * @param responseText
 * @param responseXML
 * @param args
 */
View.prototype.getIdeaBasketCallback = function(responseText, responseXML, args) {
	var thisView = args.thisView;
	
	//parse the JSON string
	var ideaBasketJSONObj = $.parseJSON(responseText);
	
	if(ideaBasketJSONObj == null) {
		thisView.notificationManager.notify(this.i18n.getString("idea_basket_retrieval_error",this.config.getConfigParam("locale")), 3);
	} else {
		//create the IdeaBasket from the JSON and set it into the view
		thisView.ideaBasket = new IdeaBasket(ideaBasketJSONObj);
		thisView.ideaBasket.updateToolbarCount();
	}
};

View.prototype.displayStudentAssets = function() {
	this.initializeAssetEditorDialog();
};

/**
 * Display the idea basket dialog popup
 * @param responseText the JSON string representing the idea basket data
 * @param responseXML
 * @param args
 */
View.prototype.displayIdeaBasket = function() {

	if(!this.ideaBasket) {
		/*
		 * the vle failed to retrieve the idea basket so we will display
		 * an error message and not display the idea basket popup
		 */
		this.notificationManager.notify(this.i18n.getString("idea_basket_retrieval_error",this.config.getConfigParam("locale")), 3);
		return;
	}
	
	//check if the ideaBasketDiv exists
	if($('#ideaBasketDiv').size()==0){
		//it does not exist so we will create it
		$('#w4_vle').append('<div id="ideaBasketDiv"></div>');
		$('#ideaBasketDiv').html('<iframe id="ideaBasketIfrm" name="ideaBasketIfrm" frameborder="0" width="100%" height="99%"></iframe><div id="ideaBasketOverlay" style="display:none;"></div>');
		$('#ideaBasketDiv').dialog({autoOpen:false,closeText:'',resizable:true,width:800,height:(document.height - 100),modal:false,title:this.i18n.getString("idea_basket",this.config.getConfigParam("locale")),close:this.ideaBasketDivClose,
			// because idea basket content is delivered in an iframe
			// need to show transparent div overlay when dragging/resizing dialog
			// so that iframe does not catch mouse movements and interupt dragging/resizing
			dragStart: function(event, ui) {
				$('#ideaBasketOverlay').show();
			},
			dragStop: function(event, ui) {
				$('#ideaBasketOverlay').hide();
			},
			resizeStart: function(event, ui) {
				$('#ideaBasketOverlay').show();
			},
			resizeStop: function(event, ui) {
				$('#ideaBasketOverlay').hide();
			}
		});
    }
	
	/*
	 * check if the idea basket div is hidden before trying to open it.
	 * if it's already open, we don't have to do anything
	 */
	if($('#ideaBasketDiv').is(':hidden')) {
		//open the dialog
		$('#ideaBasketDiv').dialog('open');
		
		if($('#ideaBasketIfrm').attr('src') == null) {
			//set the src so it will load the ideaManager.html page
			$('#ideaBasketIfrm').attr('src', "ideaManager.html");
		} else {
			//generate the JSON string for the idea basket
			var ideaBasketJSON = $.stringify(this.ideaBasket);
			
			//generate the JSON object for the idea basket
			var ideaBasketJSONObj = $.parseJSON(ideaBasketJSON);
			
			/*
			 * the ideaManager.html has already previously been loaded
			 * so we just need to reload the idea basket contents
			 */
			window.frames['ideaBasketIfrm'].loadIdeaBasket(ideaBasketJSONObj, true);
		}		
	}
};

/**
 * Called when the idea basket dialog popup is closed
 */
View.prototype.ideaBasketDivClose = function() {
	//check if the idea basket has changed
	if(window.frames['ideaBasketIfrm'].basket.isBasketChanged()) {
		/*
		 * idea basket has changed so we will save it back to the server
		 * thisView is accessed from window.frames['ideaBasketIfrm'] because
		 * this function is called from the context of the dialog popup
		 */
		window.frames['ideaBasketIfrm'].basket.saveIdeaBasket(window.frames['ideaBasketIfrm'].thisView);
		
		//set this value back to false because we are going to save it back to the server
		window.frames['ideaBasketIfrm'].basket.setBasketChanged(false);
	}
};

/**
 * Called when the ideaBasket has changed. This will be when the student
 * has changed the ideaBasket in the global idea basket or in an explanation
 * builder step and they close or exit them respectively. 
 * 
 * @param ideaBasketStep this is called from IdeaBasket.saveIdeaBasket(). 
 * If the idea basket is being saved from an idea basket step, 
 * the ideaBasketStep parameter will be set to the idea basket step object.
 * This is required because when the idea basket is being saved from
 * an idea basket step, the ideaBasketChanged() function in ideaBasketScript.js
 * does not have access to the global loadIdeaBasket() function and therefore
 * needs the ideaBasketStep object to call ideaBasketStep.loadIdeaBasket(). 
 */
View.prototype.ideaBasketChanged = function(ideaBasketStep) {
	var args = {};
	
	if(ideaBasketStep != null) {
		//set the idea basket step into the args
		args.ideaBasketStep = ideaBasketStep;
	}
	
	this.ideaBasket.updateToolbarCount();
	eventManager.fire('ideaBasketChanged', args);
};

/**
 * Get the idea baskets that are associated with the work that was flagged
 */
View.prototype.getFlaggedIdeaBaskets = function() {
	
	var workgroupIds = [];
	
	//loop through all the flags
	for(var x=0; x<this.flags.annotationsArray.length; x++) {
		//get a flag
		var flag = this.flags.annotationsArray[x];
		
		var nodeId = flag.nodeId;
		var node = this.getProject().getNodeById(nodeId);
		
		if(node.type == 'ExplanationBuilderNode') {
			/*
			 * the flag was for an explanation builder step so we
			 * will need to retrieve the idea basket from the
			 * classmate that this flag is for
			 */
			var toWorkgroup = flag.toWorkgroup;
			
			if(toWorkgroup != null) {
				//add the classmate workgroup id to our array
				workgroupIds.push(parseInt(toWorkgroup));
			}
		}
	}
	
	var workgroupIdsJSONArrayStr = $.stringify(workgroupIds);
	
	//set the params we will use in the request to the server
	var ideaBasketParams = {
		action:"getIdeaBasketsByWorkgroupIds",
		workgroupIds:workgroupIdsJSONArrayStr
	};
	
	//request the idea basket from the server
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getIdeaBasketUrl'), ideaBasketParams, this.getIdeaBasketsByWorkgroupIdCallback, {thisView:this});
};

/**
 * The callback for the getIdeaBasketsByWorkgroupIds request
 * @param text the idea baskets in a JSONArray string
 * @param responseXML
 * @param args
 */
View.prototype.getIdeaBasketsByWorkgroupIdCallback = function(text, responseXML, args) {
	//get the view
	var thisView = args.thisView;
	
	//parse the idea baskets array
	var ideaBasketsJSON = $.parseJSON(text);
	var ideaBaskets = [];
	
	//loop through all the idea basket JSON objects
	for(var x=0; x<ideaBasketsJSON.length; x++) {
		//create an IdeaBasket for each idea basket JSON object
		var ideaBasketJSON = ideaBasketsJSON[x];
		var ideaBasket = new IdeaBasket(ideaBasketJSON);
		
		//add it to our array if IdeaBasket objects
		ideaBaskets.push(ideaBasket);
	}
	
	//set the array of IdeaBasket objects into the view
	thisView.ideaBaskets = ideaBaskets;
	
	//display the flagged work now that we have the idea baskets
	thisView.displayFlaggedWork();
};

/**
 * Load the idea basket into the iframe
 */
View.prototype.loadIdeaBasket = function() {
	//generate the JSON string for the idea basket
	var ideaBasketJSON = $.stringify(this.ideaBasket);
	
	//generate the JSON object for the idea basket
	var ideaBasketJSONObj = $.parseJSON(ideaBasketJSON);
	
	//load the idea basket into the iframe
	window.frames['ideaBasketIfrm'].loadIdeaBasket(ideaBasketJSONObj, true, this);
};

/**
 * Create a new IdeaBasket in the context of the view. This is required because
 * there was an issue with creating the IdeaBasket in the context of basket.js
 * and it causing problems when the student tried to Add New Idea and receiving
 * an Idea not defined error.
 *  
 * @param ideaBasketJSONObj contains all the fields of an idea basket
 * @return a new IdeaBasket with fields populated
 */
View.prototype.createIdeaBasket = function(ideaBasketJSONObj) {
	return new IdeaBasket(ideaBasketJSONObj);
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_topmenu.js');
}