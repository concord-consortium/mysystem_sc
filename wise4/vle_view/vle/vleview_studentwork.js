

/**
 * Given the type and optional arguments, creates a new 
 * state of the type, passing in the arguments.
 */
View.prototype.pushStudentWork = function(nodeState){
	this.state.getCurrentNodeVisit().nodeStates.push(nodeState);
	this.eventManager.fire('updateNavigationConstraints');
};

/**
 * Given the type and optional arguments, creates a new 
 * state of the type, passing in the arguments.
 */
View.prototype.pushHintState = function(hintState){
	this.state.getCurrentNodeVisit().hintStates.push(hintState);
};

/**
 * Posts the data for the current node that the user is on back to the
 * server.
 * Does not send the actual data for the step.
 * @param currentNode the current node that the student is on
 */
View.prototype.postCurrentStep = function(currentNode) {
	//check if there is a postCurrentStepUrl
	if(this.getConfig().getConfigParam('postCurrentStepUrl')) {
		//post the data back to the server
		this.connectionManager.request('POST', 3, this.getConfig().getConfigParam('postCurrentStepUrl'), {nodeId: currentNode.id, nodeType: currentNode.type, extraData: currentNode.extraData}, null, this);		
	}
};

/**
 * Posts the current node visit. This is usually used when we need to post
 * intermediate step data before the user has exited the step. An example
 * of this would be brainstorm in which we post the response immediately
 * after the student clicks save and we don't wait until they exit the step.
 * @return
 */
View.prototype.postCurrentNodeVisit = function() {
	if (this.getConfig().getConfigParam('mode') == "portalpreview") {
		// no need to post data if we're in preview mode
		return;
	}
	
	//obtain the current node visit
	var currentNodeVisit = this.state.getCurrentNodeVisit();
	
	//obtain the step work id for the visit
	var stepWorkId = currentNodeVisit.id;
	
	var url;
	if(this.getConfig().getConfigParam('postStudentDataUrl')){
		url = this.getConfig().getConfigParam('postStudentDataUrl');
	} else {
		url = "postdata.html";
	};
	
	//obtain the json string representation of the node visit
	var nodeVisitData = encodeURIComponent($.stringify(currentNodeVisit));
	
	if(this.getUserAndClassInfo() != null) {
		this.connectionManager.request('POST', 3, url, 
				{id: stepWorkId, 
				runId: this.getConfig().getConfigParam('runId'), 
				userId: this.getUserAndClassInfo().getWorkgroupId(), 
				data: nodeVisitData
				}, 
				this.processPostResponse, 
				{vle: this, nodeVisit:currentNodeVisit});
	} else {
		this.connectionManager.request('POST', 3, url, 
				{id: stepWorkId, 
				runId: this.getConfig().getConfigParam('runId'), 
				userId: '-2', 
				data: prepareDataForPost(diff)
				}, 
				this.processPostResponse);
	};
};

/**
 * Posts an unposted nodeVisit to the server, then sets
 * its visitPostTime upon receiving it in the response
 * from the server.
 * @param nodeVisit its visitPostTime must be null.
 * @param boolean - sync - true if the request should by synchronous
 * @return
 */
View.prototype.postUnsavedNodeVisit = function(nodeVisit, sync) {
	if (!this.getConfig() 
			|| !this.getConfig().getConfigParam('mode') 
			|| this.getConfig().getConfigParam('mode') == "portalpreview"
			|| this.getConfig().getConfigParam('mode') == "developerpreview"
			|| this.getConfig().getConfigParam('mode') == "standaloneauthorpreview") {
		// no need to post data if we're in preview mode
		return;
	}

	var url = this.getConfig().getConfigParam('postStudentDataUrl');
	
	/* check the post level to determine, what if anything needs to be posted */
	if(this.getProject().getPostLevel()==1){
		/* if postLevel == 1, we are only interested in steps with student work */
		if(nodeVisit.nodeStates && nodeVisit.nodeStates.length>0){
			var postData = encodeURIComponent($.stringify(nodeVisit));
		} else {
			/* return - nothing to do for this post level if there is no student data */
			return;
		};
	} else {
		/* assuming that if logging level is not 1 then it is 5 (which is everything) */
		var postData = encodeURIComponent($.stringify(nodeVisit));
	};
	
	var postStudentDataUrlParams = {id: nodeVisit.id,
									runId: this.getConfig().getConfigParam('runId'),
									periodId: this.getUserAndClassInfo().getPeriodId(),
									userId: this.getUserAndClassInfo().getWorkgroupId(),
									data: postData};
	
	this.connectionManager.request('POST', 3, url, postStudentDataUrlParams, this.processPostResponse, {vle: this, nodeVisit:nodeVisit}, null, sync);
};


/**
 * Posts all non-posted node_visits to the server
 * @param boolean - sync - whether the visits should be posted synchrounously
 */
View.prototype.postAllUnsavedNodeVisits = function(sync) {
	// get all node_visits that does not have a visitPostTime set.
	// then post them one at a time, and set its visitPostTime based on what the
	// server returns.
	for (var i=0; i<this.state.visitedNodes.length; i++) {
		var nodeVisit = this.state.visitedNodes[i];
		if (nodeVisit != null && nodeVisit.visitPostTime == null && nodeVisit.visitEndTime != null) {
			this.postUnsavedNodeVisit(nodeVisit,sync);
		}
	}
};


/**
 * Handles the response from any time we post student data to the server.
 * @param responseText a json string containing the response data
 * @param responseXML
 * @param args any args required by this callback function which
 * 		were passed in when the request was created
 */
View.prototype.processPostResponse = function(responseText, responseXML, args){
	notificationManager.notify("processPostResponse, responseText:" + responseText, 4);
	notificationManager.notify("processPostResponse, nodeVisit: " + args.nodeVisit, 4);
	
	//obtain the id and post time from the json response
	var responseJSONObj = $.parseJSON(responseText);
	var id = responseJSONObj.id;
	var visitPostTime = responseJSONObj.visitPostTime;
	
	/*
	 * this is for resolving node visits that used to end up with null
	 * endTime values in the db. this problem occurs when the student
	 * clicks on the same step in the nav rapidly, which causes a race condition.
	 * check if the id has been set already, if it has, it means a row in the
	 * db has already been created and we need to end the visit.
	 */
	if(args.nodeVisit.id != null) {
		//args.vle.postUnsavedNodeVisit(args.nodeVisit);
	}
	
	/*
	 * set the id for the node visit, this is the same as the id value
	 * for the visit in the stepWork table in the db
	 */
	args.nodeVisit.id = id;
	
	//set the post time
	args.nodeVisit.visitPostTime = visitPostTime;
	
	//fire the event that says we are done processing the post response
	eventManager.fire('processPostResponseComplete');
};

/**
 * Retrieve all the node states for a specific node in an array
 * @param nodeId the node to obtain node states for
 * @return an array of node states
 */
View.prototype.getStudentWorkForNodeId = function(nodeId) {
	/* if this is a duplicate node, we really just want the student work 
	 * for the node it represents, so we'll catch that here */
	var node = this.getProject().getNodeById(nodeId);
	if(node.type=='DuplicateNode'){
		nodeId = node.getNode().id;
	}
	
	var nodeStates = [];
	for (var i=0; i < this.state.visitedNodes.length; i++) {
		var nodeVisit = this.state.visitedNodes[i];
		if (nodeVisit.getNodeId() == nodeId) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				nodeStates.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	return nodeStates;
};


/**
 * Saves work for the current html step.
 * By Default, the state will be saved for the current-step.
 * if the current step is not an HTML step, do nothing.
 * if node is passed in, save the state for that node
 */
View.prototype.saveState = function(state, node) {
	var currentNode = this.getCurrentNode();
	if (node != null) {
		currentNode = node;
	}
	var newState = null;
	if (currentNode.type == "HtmlNode" || currentNode.type == "DrawNode") {
		newState = new HTMLSTATE(state);
	} else if (currentNode.type == "MySystemNode") {
		newState = new MYSYSTEMSTATE(state);
	} else if (currentNode.type == "SVGDrawNode") {
		newState = new SVGDRAWSTATE(state);
	} else if (currentNode.type == "AssessmentListNode") {
		newState = new ASSESSMENTLISTSTATE(state);
	} else if (currentNode.type == "MWNode") {
		newState = new MWSTATE(state);
	} else {
		// we currently do not support this step type
		return;
	}
	// now add the state to the VLE_STATE
	var nodeVisitsForCurrentNode = this.state.getNodeVisitsByNodeId(currentNode.getNodeId());
	var nodeVisitForCurrentNode = nodeVisitsForCurrentNode[nodeVisitsForCurrentNode.length - 1];
	nodeVisitForCurrentNode.nodeStates.push(newState);
};

/**
 * Handles the saving of any unsaved work when user exits/refreshes/etc
 * @param whether to logout the user
 */
View.prototype.onWindowUnload = function(logout){
	/* display splash screen letting user know that saving is occuring */
	$('#onUnloadSaveDiv').dialog('open');
	
	/* tell current step to clean up */ 
	if(this.getCurrentNode()) {
		this.getCurrentNode().onExit();		
	}
	
	/* set the endVisitTime to the current time for the current state */
	this.state.endCurrentNodeVisit();
	
	/* synchronously save any unsaved node visits */
	this.postAllUnsavedNodeVisits(true);
	
	/* try to blip final message before going */
	$('#onUnloadSaveDiv').html('SAVED!!');

	/*
	 * check if we need to log out the user, we need to use the === comparison
	 * because if the user refreshes the screen or navigates to another page
	 * the argument to onWindowUnload will be an event object.
	 */
	if(logout === true) {
		//logout the user
		this.connectionManager.request('GET',1,"/webapp/j_spring_security_logout", null, function(){},null,null,true);
		window.parent.location = "/webapp/index.html";		
	}
	
	$('#onUnloadSaveDiv').dialog('close');
};

/**
 * Display student assets
 * @param launchNode which node the file uploader was launched from. Null if launched from top menu.
 */
View.prototype.viewStudentAssets = function(launchNode) {
	var view = this;
	//check if the studentAssetsDiv exists
	if($('#studentAssetsDiv').size()==0){
		//it does not exist so we will create it
		$('#w4_vle').append('<div id="studentAssetsDiv" style="margin-bottom:.3em;"></div>');
		var assetEditorDialogHtml = "<div id='studentAssetEditorDialog' style='display: none; text-align:left;'><div style='margin-bottom:.5em;'>" 
			+ "<div id='assetUploaderBodyDiv'><span style='float:left;'>"+this.i18n.getString("student_assets_upload_new_file",this.config.getConfigParam("locale"))+":</span>"
			+ "<input style='margin:0 .5em;' type='file' size='30' id='uploadAssetFile' name='uploadAssetFile' onchange=\"eventManager.fire('studentAssetSubmitUpload')\"></input>"
			+ "<img id='assetProcessing' style='display:none;' class='loadingImg' src='/vlewrapper/vle/images/ajax-loader.gif' alt='loading...' /></div>"
			+ "<div id='notificationDiv'>"
			+ "</div></div><div><div style='margin-bottom: 0.5em;'>"+this.i18n.getString("student_assets_my_files",this.config.getConfigParam("locale"))+": </div>"
			+ "<select id='assetSelect' style='width:100%; height:200px; padding:.5em;' size='15'></select>"
			+ "<div id='sizeDiv' style='margin-top: 0.5em; font-size: 0.9em;'></div><div id='uploaderInstructions'></div>"
			+ "</div></div>";
		$('#studentAssetsDiv').html(assetEditorDialogHtml);		
	}
	
	var remove = function(){
		var parent = document.getElementById('assetSelect');
		var ndx = parent.selectedIndex;
		if(ndx!=-1){
			var opt = parent.options[parent.selectedIndex];
			var name = opt.value;

			var success = function(text, xml, o){
				if(text.status==401){
					xml.notificationManager.notify(this.i18n.getString("student_assets_remove_file_warning",this.config.getConfigParam("locale")),3);
				} else {
					parent.removeChild(opt);
					o.notificationManager.notify(text, 3);
					
					/* call upload asset with 'true' to get new total file size for assets */
					o.checkStudentAssetSizeLimit();
				}
			};
			view.connectionManager.request('POST', 1, view.getConfig().getConfigParam("studentAssetManagerUrl"), {forward:'assetmanager', command: 'remove', asset: name}, success, view, success);
		}
	};
	
	var saImport = function() {
		if(view.getCurrentNode() != null &&
				view.getCurrentNode().importFile) {			
			var parent = document.getElementById('assetSelect');
			var ndx = parent.selectedIndex;
			if(ndx!=-1){
				var opt = parent.options[parent.selectedIndex];
				var name = opt.value;
				// make absolute path to file: http://studentuploadsBaseWWW/workgroupId/filename
				var workgroupId = view.userAndClassInfo.getWorkgroupId();
				var getStudentUploadsBaseUrl = view.config.getConfigParam("getStudentUploadsBaseUrl");
				var fileWWW = getStudentUploadsBaseUrl + "/" + workgroupId + "/" + name;
				if(view.getCurrentNode().importFile(fileWWW)) {
					view.notificationManager.notify(this.i18n.getString("student_assets_import_success_message",this.config.getConfigParam("locale"))+": " + name, 3);
					$('#studentAssetsDiv').dialog('close');	
				} else {
					view.notificationManager.notify(this.i18n.getString("student_assets_import_failure_message",this.config.getConfigParam("locale")),3)
				}
			}
		}
	};
	
	var done = function(){
		$('#studentAssetsDiv').dialog('close');			
	};

	var show = function(){
		eventManager.fire('browserResize');
	};
	var addSelectedFileText = this.i18n.getString("student_assets_add_selected_file",this.config.getConfigParam("locale"));
	var deleteSelectedFileText = this.i18n.getString("student_assets_delete_selected_file",this.config.getConfigParam("locale"));
	var doneText = this.i18n.getString("done",this.config.getConfigParam("locale"));
	$('#studentAssetsDiv').dialog({autoOpen:false,closeText:'',resizable:false,width:600,position:['center',50],modal:false,title:this.i18n.getString("student_assets_my_files",this.config.getConfigParam("locale")), 
			buttons:[{text:deleteSelectedFileText,click:remove},{text:doneText,click:done}]});

	/*
	 * check if the div is hidden before trying to open it.
	 * if it's already open, we don't have to do anything
	 */
	if($('#studentAssetsDiv').is(':hidden')) {
		//open the dialog
		$('#studentAssetsDiv').dialog('open');
		this.checkStudentAssetSizeLimit();
	};	
	
	var studentAssetsPopulateOptions = function(names, view){
		if(names && names!=''){
			var parent = $('#assetSelect');
			parent.html('');
			var splitz = names.split('~');
			splitz.sort(function(a,b) {
			  var al=a.toLowerCase(),bl=b.toLowerCase();
			  return al==bl?(a==b?0:a<b?-1:1):al<bl?-1:1;
			});
			for(var d=0;d<splitz.length;d++){
				var opt = createElement(document, 'option', {name: 'assetOpt', id: 'asset_' + splitz[d]});
				opt.text = splitz[d];
				opt.value = splitz[d];
				parent.append(opt);
			}
		}

		$('#uploadAssetFile').val('');
		$('#studentAssetEditorDialog').show();
		view.checkStudentAssetSizeLimit();
	};
	
	// if the currently-opened node supports file import, show file import button
	if(this.getCurrentNode() != null &&
			this.getCurrentNode().importFile) {
		$( "#studentAssetsDiv" ).dialog( "option", "buttons",
				[{text:addSelectedFileText,click:saImport},{text:deleteSelectedFileText,click:remove},{text:doneText,click:done}]
             );		
	} else {
		$( "#studentAssetsDiv" ).dialog( "option", "buttons", 
				[{text:deleteSelectedFileText,click:remove},{text:doneText,click:done}]				
             );		
	}

	this.connectionManager.request('POST', 1, this.getConfig().getConfigParam("studentAssetManagerUrl"), {forward:'assetmanager', command: 'assetList'}, function(txt,xml,obj){studentAssetsPopulateOptions(txt,obj);}, this);	
};

/**
 * Check to make sure that student has not exceeded upload size limit. 
 */
View.prototype.checkStudentAssetSizeLimit = function(){
	var callback = function(text, xml, o){
			o.currentAssetSize = text;
			if(text >= o.MAX_ASSET_SIZE){
				var maxUploadSize = o.utils.appropriateSizeText(o.MAX_ASSET_SIZE);
				var studentUsageSize = o.utils.appropriateSizeText(text);
				var maxExceededMessage = o.i18n.getStringWithParams("student_assets_student_usage_exceeded_message",o.config.getConfigParam("locale"),[maxUploadSize,studentUsageSize]);
				o.notificationManager.notify(maxExceededMessage, 3);
			} else {				
				var studentUsage = o.utils.appropriateSizeText(text);
				var maxUsageLimit = o.utils.appropriateSizeText(o.MAX_ASSET_SIZE);
				$('#sizeDiv').html(o.i18n.getStringWithParams("student_assets_student_usage_message",o.config.getConfigParam("locale"),[studentUsage,maxUsageLimit]));
			} 
		};
	this.connectionManager.request('POST', 1,  this.getConfig().getConfigParam("studentAssetManagerUrl"), {forward:'assetmanager', command: 'getSize'}, callback, this);
};

/**
 * Performs student asset upload
 */
View.prototype.studentAssetSubmitUpload = function() {
	if (this.currentAssetSize != null) {
		if (this.currentAssetSize >= this.MAX_ASSET_SIZE) {
			notificationManager.notify('You cannot upload this file because you have exceeded your upload limit. Please delete some files first and try again.', 3);
			return;
		}
	};
	var filename = $('#uploadAssetFile').val();
	var view = this;
	if(filename && filename != ''){
		filename = filename.replace("C:\\fakepath\\", "");  // chrome/IE8 fakepath issue: http://acidmartin.wordpress.com/2009/06/09/the-mystery-of-cfakepath-unveiled/	
		if(!view.utils.fileFilter(view.allowedStudentAssetExtensions,filename)){
			view.notificationManager.notify('Sorry, the specified file type is not allowed.', 3);
			return;
		} else {
			var frameId = 'assetUploadTarget_' + Math.floor(Math.random() * 1000001);
			var frame = createElement(document, 'iframe', {id:frameId, type:'student', name:frameId, src:'about:blank', style:'display:none;'});
			var postStudentAssetUrl = this.getConfig().getConfigParam("studentAssetManagerUrl");
			// need to get rid of the ?type=StudentAssets&runId=X from the url because we're doing a POST and it will be syntactically incorrect.
			if (postStudentAssetUrl.indexOf("?") != -1) {
				postStudentAssetUrl = postStudentAssetUrl.substr(0,postStudentAssetUrl.indexOf("?"));
			}
			var form = createElement(document, 'form', {id:'assetUploaderFrm', method:'POST', enctype:'multipart/form-data', action:postStudentAssetUrl, target:frameId, style:'display:none;'});
			//var assetPath = view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase());

			/* create and append elements */
			document.body.appendChild(frame);
			document.body.appendChild(form);
			
			//form.appendChild(createElement(document,'input',{type:'hidden', name:'path', value:assetPath}));
			form.appendChild(createElement(document,'input',{type:'hidden', name:'type', value:'studentAssetManager'}));			
			form.appendChild(createElement(document,'input',{type:'hidden', name:'runId', value:this.config.getConfigParam("runId")}));
			form.appendChild(createElement(document,'input',{type:'hidden', name:'forward', value:'assetmanager'}));
			form.appendChild(createElement(document,'input',{type:'hidden', name:'cmd', value:'studentAssetUpload'}));
			//form.appendChild(createElement(document,'input',{type:'hidden', name:'projectId', value:view.portalProjectId}));

			/* set up the event and callback when the response comes back to the frame */
			frame.addEventListener('load',view.assetUploaded,false);
			
			/* change the name attribute to reflect that of the file selected by user */
			document.getElementById('uploadAssetFile').setAttribute("name", filename);
			
			/* remove file input from the dialog and append it to the frame before submitting, we'll put it back later */
			var fileInput = document.getElementById('uploadAssetFile');
			form.appendChild(fileInput);
			
			/* submit hidden form */
			form.submit();
			
			/* put the file input back and remove form now that the form has been submitted */
			document.getElementById('assetUploaderBodyDiv').insertBefore(fileInput, document.getElementById('assetUploaderBodyDiv').firstChild);
			document.body.removeChild(form);
			
			$('#assetProcessing').show();
		}
	} else {
		view.notificationManager.notify('Please specify a file to upload.',3);
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_studentwork.js');
};