/**
 * Functions related to the main layout of the project in the authoring view
 * 
 * @author patrick lawler
 */

/**
 * Creates the html elements necessary for authoring the currently
 * opened project.
 */
View.prototype.generateAuthoring = function(){
	var parent = document.getElementById('dynamicProject');
	$('#projectButtons button').removeAttr('disabled');
	
	//remove any old elements and clear variables
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	this.currentStepNum = 1;
	this.currentSeqNum = 1;
	
	//set up project table
	var tab = createElement(document, 'table', {id: 'projectTable'});
	var tHead = createElement(document, 'thead', {id: 'projectTableHead'});
	var tBod = createElement(document, 'tbody', {id: 'projectTableBody'});
	var existingRow = createElement(document, 'tr', {id: 'existingRow'});
	var unattachedSequenceRow = createElement(document, 'tr', {id: 'unattachedSequenceRow'});
	var unattachedNodeRow = createElement(document, 'tr', {id: 'unattachedNodeRow'});
	
	parent.appendChild(tab);
	tab.appendChild(tHead);
	tab.appendChild(tBod);
	tBod.appendChild(existingRow);
	tBod.appendChild(unattachedSequenceRow);
	tBod.appendChild(unattachedNodeRow);
	
	//generate existing project structure
	var existingTable = createElement(document, 'table', {id: 'existingTable'});
	var existingTH = createElement(document, 'thead', {id: 'existingTableHead'});
	var existingTB = createElement(document, 'tbody', {id: 'existingTableBody'});
	existingRow.appendChild(existingTable);
	existingTable.appendChild(existingTH);
	existingTable.appendChild(existingTB);
	
	if(this.project.getRootNode()){
		this.generateNodeElement(this.project.getRootNode(), null, existingTable, 0, 0);
	};
	
	//generate unattached nodes
	var uSeqTable = createElement(document, 'table', {id: 'unusedSequenceTable'});
	var uSeqTH = createElement(document, 'thead');
	var uSeqTB = createElement(document, 'tbody', {id: 'unusedSequenceTableBody'});
	var uSeqTR = createElement(document, 'tr', {id: 'unusedSequenceTitleRow'});
	var uSeqETD = createElement(document, 'td');
	var uSeqTD = createElement(document, 'td');
	
	unattachedSequenceRow.appendChild(uSeqTable);
	uSeqTable.appendChild(uSeqTH);
	uSeqTable.appendChild(uSeqTB);
	uSeqTB.appendChild(uSeqTR);
	uSeqTR.appendChild(uSeqETD);
	uSeqTR.appendChild(uSeqTD);
	
	var unusedSeqDiv = createElement(document, 'div', {id: 'uSeq', 'class': 'uSeq', onclick: 'eventManager.fire("selectClick","uSeq")', onMouseOver: 'eventManager.fire("checkAndSelect","uSeq")', onMouseOut: 'eventManager.fire("checkAndDeselect","uSeq")'});
	var unusedSeqText = document.createTextNode('Inactive Activities');
	var unusedSeqs = this.project.getUnattached('sequence');
	
	uSeqTD.appendChild(unusedSeqDiv);
	unusedSeqDiv.appendChild(unusedSeqText);
	unusedSeqDiv.innerHTML += ' <span>(Not Shown in Project)</span>';
	for(var d=0;d<unusedSeqs.length;d++){
		this.generateNodeElement(unusedSeqs[d], null, uSeqTB, 0, 0);
	};
	
	var uNodeTable = createElement(document, 'table', {id: 'unusedNodeTable'});
	var uNodeTH = createElement(document, 'thead');
	var uNodeTB = createElement(document, 'tbody', {id: 'unusedNodeTableBody'});
	var uNodeTR = createElement(document, 'tr', {id: 'unusedNodeTitleRow'});
	var uNodeETD = createElement(document, 'td');
	var uNodeTD = createElement(document, 'td');
	
	unattachedNodeRow.appendChild(uNodeTable);
	uNodeTable.appendChild(uNodeTH);
	uNodeTable.appendChild(uNodeTB);
	uNodeTB.appendChild(uNodeTR);
	uNodeTR.appendChild(uNodeETD);
	uNodeTR.appendChild(uNodeTD);
	
	var unusedNodeDiv = createElement(document, 'div', {id: 'uNode', onclick: 'eventManager.fire("selectClick","uNode")', onMouseOver: 'eventManager.fire("checkAndSelect","uNode")', onMouseOut: 'eventManager.fire("checkAndDeselect","uNode")'});
	var unusedNodesText = document.createTextNode('Inactive Steps');
	var unusedNodes = this.project.getUnattached('node');
	
	uNodeTD.appendChild(unusedNodeDiv);
	unusedNodeDiv.appendChild(unusedNodesText);
	unusedNodeDiv.innerHTML += ' <span>(Not Shown in Project)</span>';
	for(var e=0;e<unusedNodes.length;e++){
		this.generateNodeElement(unusedNodes[e], null, uNodeTB, 0, 0);
	};
	
	//notify user if any of their project violates their project structure mode and
	//advise to fix it in advanced structure mode if it does.
	if(this.projectStructureViolation){
		this.notificationManager.notify("The current project mode is Simple Project, but while generating the authoring, " +
				"nodes have been found that violate that structure (Project-->Activity-->Step). Those nodes have been " +
				"ignored! You should fix this by either authoring in Advanced Project mode or switching to Advanced " +
				"Project mode long enough to put the project in the structure required for Simple Project.", 3);
	};
	
	// show number of nodes per sequence
	$('.seq').each(function(){
		var split = $(this).attr('id').split('--');
		var sequenceId = split[1];
		var numNodes = 0;
		$('[id^='+sequenceId+']').each(function(){
			numNodes++;
		});
		if(numNodes==1){
			$(this).append('<div id="'+ sequenceId +'_count" class="nodeCount">'+ numNodes +' Step<span class="selectCount"></span></div>');
		} else {
			$(this).append('<div id="'+ sequenceId +'_count" class="nodeCount">'+ numNodes +' Steps<span class="selectCount"></span></div>');
		}
	});
	
	this.updateSelectCounts();
	
	$(window).resize(function() {
		eventManager.fire('browserResize');
	});
	eventManager.fire('browserResize');
};

/**
 * Generates the individual html elements that represent the given node and
 * appends them to the given element.
 * 
 * @param node - the node to represent
 * @param parentNode - the node's parent, can be null
 * @param el - the parent element that this element will append to
 * @param depth - depth (how many ancestors does it have
 * @param pos - position in reference to its siblings (if no parent or siblings, this will be 0)
 */
View.prototype.generateNodeElement = function(node, parentNode, el, depth, pos){
	//create an id that represents this nodes absolute position in the project/sequence
	if(parentNode){
		var absId = parentNode.id + '--' + node.id + '--' + pos;
	} else {
		var absId = 'null--' + node.id + '--' + pos;
	}
	
	//project structure validation
	if(el.id=='existingTable' && this.simpleProject){
		if(depth>2 || (depth==1 && node.type!='sequence') || (depth==2 && node.type=='sequence')){
			this.projectStructureViolation = true;
			return;
		}
	}
	
	//create and append element representing this node
	var mainTR = createElement(document, 'tr');
	var mainDiv = null;
	if(absId.match(/null.*/) || absId.match(/master.*/)){
		mainDiv = createElement(document, 'div', {id: absId, onclick: 'eventManager.fire("selectClick","' + absId + '")', onMouseOver: 'eventManager.fire("checkAndSelect","' + absId + '")', onMouseOut: 'eventManager.fire("checkAndDeselect","' + absId + '")'});
	} else {
		mainDiv = createElement(document, 'div', {id: absId, onclick: 'eventManager.fire("selectClick","' + absId + '")', ondblclick: 'eventManager.fire("author", "' + absId + '----' + node.id + '")', onMouseOver: 'eventManager.fire("checkAndSelect","' + absId + '")', onMouseOut: 'eventManager.fire("checkAndDeselect","' + absId + '")'});
	}
	var taskTD = createElement(document, 'td');
	var mainTD = createElement(document, 'td');
	el.appendChild(mainTR);
	mainTR.appendChild(taskTD);
	mainTR.appendChild(mainTD);
	
	//create space according to the depth of this node
	/*var tabs = "";
	for(var b=0;b<depth;b++){
		tabs += this.tab;
	}*/
	
	//create space according to the depth of this node
	var indent = 0;
	for(var b=0;b<depth;b++){
		indent ++;
	}
	
	//create and set title for this node along with step term and/or numbering as specified
	var titleInput = createElement(document, 'input', {id: 'titleInput_' + node.id, type: 'text', 'class':'nodeTitleInput', onchange: 'eventManager.fire("nodeTitleChanged","' + node.id + '")', title: 'Click to Edit Step Name', value: node.getTitle()});
	//var taskDiv = createElement(document, 'div', {id: 'taskDiv_' + node.id, 'class': 'taskDiv'});
	//taskTD.appendChild(taskDiv);
	mainTD.appendChild(mainDiv);
	
	if(node.type=='sequence'){
		var seqTitleDiv = createElement(document, 'div', {id: 'seqTitleDiv_' + absId});
		if(absId.match(/null.*/)){
			var titleText = document.createTextNode('Activity: ');
		} else {
			var titleText = document.createTextNode('Activity ' + this.currentSeqNum + ': ');
			this.currentSeqNum++;
		}
		var choiceDiv = createElement(document, 'div', {id: 'choiceDiv_' + absId});
		
		mainDiv.appendChild(seqTitleDiv);
		mainDiv.appendChild(choiceDiv);
		//seqTitleDiv.innerHTML = tabs;
		if(indent>0){
			var marginlt = indent*.5 + 'em';
			$(mainDiv).css('margin-left',marginlt);
		}
		seqTitleDiv.appendChild(titleText);
		seqTitleDiv.appendChild(titleInput);
		titleInput.title = 'Click to Edit Activity Name';
		
		choiceDiv.style.display = 'none';
		choiceDiv.className = 'choice';
		
		if(this.getProject().getRootNode() && node.id==this.project.getRootNode().id){
			mainDiv.className = 'projectNode master';
			mainDiv.innerHTML = 'Project Sequence <span>(Active Activities & Steps)</span>';
		} else {
			mainDiv.className = 'projectNode seq';
		}
		if(this.project.useStepLevelNumbering()){
			this.currentStepNum = 1;
		}
	} else {
		//the html for the review html
		var reviewHtml = "";
		var reviewLink = null;
		
		//check if the step is a peer or teacher review
		if(node.peerReview || node.teacherReview) {
			//get the review group number
			var reviewGroup = node.reviewGroup;
			
			//check if there was a review group number
			if(reviewGroup) {
				var peerReviewStep = null;
				var reviewPhase = '';
				var reviewType = '';

				//get the review phase 'start', 'annotate', 'revise'
				if(node.peerReview) {
					reviewPhase = node.peerReview;
					reviewType = 'P';
				} else if(node.teacherReview) {
					reviewPhase = node.teacherReview;
					reviewType = 'T';
				}
				
				//set the phase number 1, 2, 3
				if(reviewPhase == 'start') {
					peerReviewStep = 1;
				} else if(reviewPhase == 'annotate') {
					peerReviewStep = 2;
				} else if(reviewPhase == 'revise') {
					peerReviewStep = 3;
				}
				
				if(peerReviewStep) {
					//make the review group class so we can obtain the elements in the group easily in the future
					var peerReviewGroupClass = "reviewGroup" + reviewGroup;
					
					//create a p element that will display the review label (e.g. PR1.1, PR1.2, PR1.3)
					reviewHtml = "<p class='" + peerReviewGroupClass + " reviewLabel' style='display:inline'>" + reviewType + "R" + reviewGroup + "." + peerReviewStep + "</p>";
					
					reviewLink = createElement(document, 'a', {'class': 'reviewLink ' + peerReviewGroupClass, id: 'reviewLink_' + reviewGroup, value: 'Delete Review Sequence', onclick: 'eventManager.fire("cancelReviewSequence",' + reviewGroup + ')'});
					//set the tabs to just one &nbsp since we now display the p element to the left of the step
					//tabs = "&nbsp;";
				}
			}
		}
		if(node.getNodeClass() && node.getNodeClass()!='null' && node.getNodeClass()!=''){
			//mainDiv.innerHTML = reviewHtml + tabs + '<img src=\'' + iconUrl + node.getNodeClass() + '16.png\'/> ';
			mainDiv.innerHTML = '<img src=\'' + this.iconUrl + node.getNodeClass() + '16.png\'/> ';
		} //else {
			//mainDiv.innerHTML = reviewHtml + tabs;
			//mainDiv.innerHTML = reviewHtml;
		//}
		if(indent>0){
			var marginlt = indent*.5 + 'em';
			$(mainDiv).css('margin-left',marginlt);
		}
		
		var titletext = '';
		if(absId.match(/null.*/)){
			var titleText = document.createTextNode(this.getProject().getStepTerm() + ': ');
		} else {
			var titleText = document.createTextNode(this.getProject().getStepTerm() + ' ' + this.getProject().getVLEPositionById(node.id) + ': ');
			this.currentStepNum++;
		}
		
		if(titleText && el.id!='unused'){
			mainDiv.appendChild(titleText);
		}
		mainDiv.appendChild(titleInput);
		mainDiv.className = 'projectNode node';
		
		//set up select for changing this node's icon
		var selectNodeText = document.createTextNode('Icon: ');
		var selectDrop = createElement(document, 'select', {id: 'nodeIcon_' + node.id, onchange: 'eventManager.fire("nodeIconUpdated","' + node.id + '")'});
		mainDiv.appendChild(selectNodeText);
		mainDiv.appendChild(selectDrop);
		
		var nodeClassesForNode = [];

		/* check to see if current node is in nodeTypes, if not ignore so that authoring 
		 * tool will continue processing remaining nodes. Resolve duplicate nodes to the
		 * type of the node that they represent */
		if(node.type=='DuplicateNode'){
			nodeClassesForNode = this.nodeClasses[node.getNode().type];
		} else {
			nodeClassesForNode = this.nodeClasses[node.type];
		}
		
		//populate select with icons for its step type
		if(nodeClassesForNode.length > 0){
			var opt = createElement(document, 'option');
			opt.innerHTML = '';
			opt.value = '';
			selectDrop.appendChild(opt);
			
			for(var x=0; x<nodeClassesForNode.length; x++) {
				var nodeClassObj = nodeClassesForNode[x];
				var opt = createElement(document, 'option');
				opt.value = nodeClassObj.nodeClass;
				opt.innerHTML = '<img src=\'' + this.iconUrl + nodeClassObj.nodeClass + '16.png\'/> ' + nodeClassObj.nodeClassText;
				selectDrop.appendChild(opt);
				if(node.getNodeClass() == nodeClassObj.nodeClass){
					selectDrop.selectedIndex = x + 1;
				}
			}
		}
		
		/* add max scores input field. values will be set on retrieval of metadata */
		var maxScoreText = document.createTextNode('Max Score: ');
		var maxScoreInput = createElement(document, 'input', {type: 'text', 'class':'maxScoreInput', title: 'Click to Edit Maximum Score', id: 'maxScore_' + node.id, 'size':'2', onchange: 'eventManager.fire("maxScoreUpdated","'+ node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(maxScoreText);
		mainDiv.appendChild(maxScoreInput);
		
		/* add link to revert node to its original state when version was created
		var revertNodeLink = createElement(document, 'a', {class: 'revertNodeLink', id:'revertNode_' + node.id, value:'Revert Node', onclick: 'eventManager.fire("versionRevertNode","' + node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(revertNodeLink);
		revertNodeLink.appendChild(document.createTextNode("Revert"));*/
		
		/* Add button to reference work to student's work in other steps, if this is
		 * a duplicate node, the type should be resolved to that of the node that it
		 * represents. */
		if(node.type=='DuplicateNode'){
			var ndx2 = this.excludedPrevWorkNodes.indexOf(node.getNode().type);
		} else {
			var ndx2 = this.excludedPrevWorkNodes.indexOf(node.type);
		}
		
		if(ndx2==-1){
			var prevWorkLink = createElement(document, 'a', {'class': 'prevWorkLink', id: 'prevWork_' + node.id, title: 'Show Work from Preview Step', onclick: 'eventManager.fire("launchPrevWork","' + node.id + '")'});
			mainDiv.appendChild(createSpace());
			mainDiv.appendChild(prevWorkLink);
			prevWorkLink.appendChild(document.createTextNode("Show Previous Work"));
		}
		
		if(reviewLink){ // if part of review sequence, add review title and remove link
			$(mainDiv).append(reviewHtml);
			mainDiv.appendChild(reviewLink);
			reviewLink.appendChild(document.createTextNode("Delete Review Sequence"));
			$(mainDiv).addClass('reviewNode');
		}
		
		// Add edit button to open node's editing interface
		var editInput = createElement(document, 'input', {type: 'button', value:'Edit', 'class':'editNodeInput', title: 'Click to Edit Step Content', id: 'editNode_' + node.id, onclick: 'eventManager.fire("author", "' + absId + '----' + node.id + '")'});
		mainDiv.appendChild(editInput);
	}
	
	// create select checkbox for this node
	if(!$(mainDiv).hasClass('master')){
		var selectBox = createElement(document, 'input', {id:'select_' + node.id, type:'checkbox', 'class':'selectNodeInput', title:'Click to Select', onclick:'eventManager.fire("selectBoxClick","'+absId+'")'});
		$(mainDiv).prepend(selectBox);
	}

	/* generate the node elements for any children that this node has */
	for(var a=0;a<node.children.length;a++){
		this.generateNodeElement(node.children[a], node, el, depth + 1, a);
	}
};

/**
 * Changes the title of the node with the given id (@param id) in
 * the project with the value of the html element. Enforces size
 * restrictions for title length.
 */
View.prototype.nodeTitleChanged = function(id){
	var node = this.project.getNodeById(id);
	var val = document.getElementById('titleInput_' + id).value;

	if(val.length>60 && node.type!='sequence'){
		this.notificationManager.notify('Step titles cannot exceed 60 characters.', 3);
		document.getElementById('titleInput_' + id).value = val.substring(0, 60);
	} else if(val.length>28 && node.type=='sequence'){
		this.notificationManager.notify('Activity titles cannot exceed 50 characters.', 3);
		document.getElementById('titleInput_' + id).value = val.substring(0, 50);
	} else {
		/* if this node is a duplicate node, we need to update the value of the original
		 * and any other duplicates of the original, if this node is not a duplicate, we
		 * need to check for duplicates and update their values as well */
		var nodes = this.getProject().getDuplicatesOf(node.id, true);
		for(var b=0;b<nodes.length;b++){
			nodes[b].setTitle(val);
			document.getElementById('titleInput_' + nodes[b].id).value = val;
		}
		
		/* save the changes to the project file */
		this.saveProject();
	};
};

/**
 * Updates the changed project title in the current project and updates the
 * metadata, publishing changes to the portal.
 */
View.prototype.projectTitleChanged = function(){
	/* get user input title */
	var newTitle = document.getElementById('projectTitleInput').value;
	
	/* if not defined, set it to an empty string */
	if(!newTitle){
		newTitle = '';
	};
	
	/* update metadata and save */
	this.projectMeta.title = newTitle;
	this.updateProjectMetaOnServer(true,true);
	
	/* update project and save */
	this.project.setTitle(newTitle);
	this.saveProject();
};

/**
 * Saves any changes in the project by having the project
 * regenerate the project file, incorporating any changes
 */
View.prototype.saveProject = function(){
	if(this.getProject()){
		var data = $.stringify(this.getProject().projectJSON(),null,3);
		
		var success_callback = function(text, xml, o){
			if(text!='success'){
				o.notificationManager.notify('Unable to save project to WISE server. The server or your Internet connection may be down. An alert will pop up with the project file data, copy this and paste it into a document for backup.', 3);
				alert(data);
			} else {
				o.notificationManager.notify('Project Saved.', 3);
				o.eventManager.fire('setLastEdited');
			};
		};
		
		var failure_callback = function(o, obj){
			obj.notificationManager.notify('Unable to save project to WISE server. The server or your Internet connection may be down. An alert will pop up with the project file data, copy this and paste it into a document for backup.', 3);
			alert(data);
		};
		
		this.connectionManager.request('POST', 1, this.requestUrl, {forward:'filemanager', projectId:this.portalProjectId, command: 'updateFile', param1: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()), param2: this.project.getProjectFilename(), param3: encodeURIComponent(data)}, success_callback, this, failure_callback);
	} else {
		this.notificationManager.notify('Please open or create a Project before attempting to save.', 3);
	};
};

/**
 * Updates the class of the node with the given id to that selected by the user
 */
View.prototype.nodeIconUpdated = function(id){
	var node = this.project.getNodeById(id);
	var select = document.getElementById('nodeIcon_' + id);
	
	/* even if this is a duplicate, setting the node class will update
	 * the original and refreshing the project will make that change visible
	 * in all duplicates. */
	node.setNodeClass(select.options[select.selectedIndex].value);
	
	this.saveProject();
	this.generateAuthoring();
	this.populateMaxScores();
};

/**
 * Updates the project's stepTerm value
 */
View.prototype.stepTermChanged = function(){
	if(this.project){
		this.project.setStepTerm(document.getElementById('stepTerm').value);
		this.saveProject();
		this.generateAuthoring();
		this.populateMaxScores();
	};
};

/**
 * Updates step numbering when step numbering option has changed
 */
View.prototype.stepNumberChanged = function(){
	var val = parseInt(document.getElementById('numberStepSelect').options[document.getElementById('numberStepSelect').selectedIndex].value);
	if(val==0){
		this.autoStepChanged();
	} else if(val==1){
		this.stepLevelChanged();
	};
};

/**
 * updates auto step labeling and project when autoStep is selected
 */
View.prototype.autoStepChanged = function(){
	if(this.project){
		this.project.setAutoStep(true);
		this.project.setStepLevelNumbering(false);
		this.saveProject();
		this.generateAuthoring();
		this.populateMaxScores();
	};
};

/**
 * updates step labeling boolean for step level numbering (1.1.2, 1.3.1 etc.)
 * when step level numbering is selected
 */
View.prototype.stepLevelChanged = function(){
	if(this.project){
		this.project.setStepLevelNumbering(true);
		this.project.setAutoStep(false);
		this.saveProject();
		this.generateAuthoring();
		this.populateMaxScores();
	};
};

/**
 * Sets appropriate variables and launches the previous work popup.
 * If this is a duplicate node, launched the previous work of the node
 * it represents.
 */
View.prototype.launchPrevWork = function(nodeId){
	showElement('previousWorkDialog');
	this.activeNode = this.project.getNodeById(nodeId).getNode(); //calling getNode gets the original node even if this is a duplicate
	
	//generate the node label e.g. "1.3: Analyze the data"
	var nodeId = this.activeNode.getNodeId();
	var nodeTitle = this.activeNode.getTitle();
	var vlePosition = this.project.getVLEPositionById(nodeId);
	var nodeLabel = vlePosition + ": " + nodeTitle;
	
	document.getElementById('nodeTitle').innerHTML = nodeLabel;
	
	this.clearCols();
	this.populateToCol();
	this.populateFromCol();
	$('#previousWorkDialog').dialog('open');
};

/**
 * Shows the create project dialog
 */
View.prototype.createNewProject = function(){
	showElement('createProjectDialog');
	$('#createProjectDialog').dialog('open');
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows create sequence dialog.
 */
View.prototype.createNewSequence = function(){
	if(this.project){
		showElement('createSequenceDialog');
		$('#createSequenceDialog').dialog('open');
	} else {
		this.notificationManager.notify('Please open or create a Project before creating an Activity', 3);
	}
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows create node dialog.
 */
View.prototype.createNewNode = function(){
	if(this.project){
		showElement('createNodeDialog');
		$('#createNodeDialog').dialog('open');
	} else {
		this.notificationManager.notify('Please open or create a Project before adding a Step', 3);
	}
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows edit project dialog.
 */
View.prototype.editProjectFile = function(){
	if(this.getProject()){
		$('#projectText').val($.stringify(this.getProject().projectJSON(),null,3));
		showElement('editProjectFileDialog');
		$('#editProjectFileDialog').dialog('open');
	} else {
		this.notificationManager.notify('Please open or create a Project before editing the project data file.', 3);
	}
};



/**
 * Initializes and renders asset editor dialog with clean up function.
 */
View.prototype.initializeAssetEditorDialog = function(){
	var view = this;
	
	var remove = function(){
		var parent = document.getElementById('assetSelect');
		var ndx = parent.selectedIndex;
		if(ndx!=-1){
			var opt = parent.options[parent.selectedIndex];
			var name = opt.value;

			var success = function(text, xml, o){
				if(text.status==401){
					xml.notificationManager.notify('You are not authorized to remove assets from this project. If you believe this is an error, please contact an administrator.',3);
				} else {
					parent.removeChild(opt);
					o.notificationManager.notify(text, 3);
					
					/* call upload asset with 'true' to get new total file size for assets */
					o.uploadAsset(true);
				}
			};
			
			view.connectionManager.request('POST', 1, view.assetRequestUrl, {forward:'assetmanager', projectId:view.portalProjectId, command: 'remove', path: view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase()), asset: name}, success, view, success);
		}
	};

	var done = function(){
		$('#assetEditorDialog').dialog('close');
		$('#uploadAssetFile').val('');
		
		replaceNotificationsDiv();
	};
	
	var cancel = function(){
		$('#assetSelect').children().remove();
		$('#uploadAssetFile').val('');
		$('#sizeDiv').html('');
		
		replaceNotificationsDiv();
	};
	
	var show = function(){
		$('#assetUploaderBodyDiv').after($('#notificationDiv')); // temporarily move notifications div to assets dialog
		clearNotifcations(); // clear out any existing notifications
		eventManager.fire('browserResize');
	};
	
	var clearNotifcations = function(){
		$('.authoringMessages > span').each(function(){
			var messageId = $(this).attr('id');
			notificationEventManager.fire('removeMsg',messageId);
		});
	};
	
	var replaceNotificationsDiv = function(){
		$('#authorOptions').after($('#notificationDiv')); // move notifications div back to default authoring location
		clearNotifcations(); // clear out any existing notifications
		eventManager.fire('browserResize');
	};
	
	$('#assetEditorDialog').dialog({autoOpen:false, draggable:true, modal:true, width:600, title: 'Project Files', buttons: {'Done': done, 'Remove Selected File': remove}, close: cancel, open:show});
};

/**
 * Checks to ensure that a project path exists, validates size and
 * file extension
 */
View.prototype.uploadAsset = function(view){
	if(this.project){
		//showElement('assetUploaderDialog');

		var callback = function(text, xml, o){
			if(text >= o.MAX_ASSET_SIZE){
				o.notificationManager.notify('Maximum space allocation exceeded! Maximum allowed is ' + o.utils.appropriateSizeText(o.MAX_ASSET_SIZE) + ', total on server is ' + o.utils.appropriateSizeText(text) + '.', 3);
			} else if(view){
				document.getElementById('sizeDiv').innerHTML = "You are using " + o.utils.appropriateSizeText(text) + " of your " + o.utils.appropriateSizeText(o.MAX_ASSET_SIZE) + " storage space.";
			} else {
				//$('#assetUploaderDialog').dialog('open');
			}
		};
		this.connectionManager.request('POST', 1, this.assetRequestUrl, {forward:'assetmanager', projectId:this.portalProjectId, command: 'getSize', path: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase())}, callback, this);
	} else {
		this.notificationManager.notify("Please open or create a project that you wish to upload assets to.", 3);
	}
};

View.prototype.submitUpload = function() {
	var filename = $('#uploadAssetFile').val();
	var view = this;
	if(filename && filename != ''){
		filename = filename.replace("C:\\fakepath\\", "");  // chrome/IE8 fakepath issue: http://acidmartin.wordpress.com/2009/06/09/the-mystery-of-cfakepath-unveiled/	
		if(!view.utils.fileFilter(view.allowedAssetExtensions,filename)){
			view.notificationManager.notify('Sorry, the specified file type is not allowed.', 3);
			return;
		} else {
			var frameId = 'assetUploadTarget_' + Math.floor(Math.random() * 1000001);
			var frame = createElement(document, 'iframe', {id:frameId, name:frameId, src:'about:blank', style:'display:none;'});
			var form = createElement(document, 'form', {id:'assetUploaderFrm', method:'POST', enctype:'multipart/form-data', action:view.assetRequestUrl, target:frameId, style:'display:none;'});
			var assetPath = view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase());
			
			/* create and append elements */
			document.body.appendChild(frame);
			document.body.appendChild(form);
			form.appendChild(createElement(document,'input',{type:'hidden', name:'path', value:assetPath}));
			form.appendChild(createElement(document,'input',{type:'hidden', name:'forward', value:'assetmanager'}));
			form.appendChild(createElement(document,'input',{type:'hidden', name:'projectId', value:view.portalProjectId}));

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
			
			/* close the dialog */
			//$('#assetUploaderDialog').dialog('close');
		}
	} else {
		view.notificationManager.notify('Please specify a file to upload.',3);
	}
};

/**
 * Retrieves a list of any assets associated with the current project
 * from the server, populates a list of the assets in the assetEditorDialog
 * and displays the dialog.
 */
View.prototype.viewAssets = function(){
	if(this.project){
		showElement('assetEditorDialog');
		var populateOptions = function(names, view){
			if(names && names!=''){
				var parent = document.getElementById('assetSelect');
				parent.innerHTML = '';
				var splitz = names.split('~');
				splitz.sort(function(a,b) {
				  var al=a.toLowerCase(),bl=b.toLowerCase()
				  return al==bl?(a==b?0:a<b?-1:1):al<bl?-1:1
				});
				for(var d=0;d<splitz.length;d++){
					var opt = createElement(document, 'option', {name: 'assetOpt', id: 'asset_' + splitz[d]});
					opt.text = splitz[d];
					opt.value = splitz[d];
					parent.appendChild(opt);
				}
			}

			//call upload asset with 'true' to get total file size for assets
			view.uploadAsset(true);
			
			//show dialog
			$('#assetEditorDialog').dialog('open');
			
			eventManager.fire('browserResize');
			
			$('#uploadAssetFile').val('');
		};
	
		//get assets from servlet
		this.connectionManager.request('POST', 1, this.assetRequestUrl, {forward:'assetmanager', projectId:this.portalProjectId, command: 'assetList', path: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase())}, function(txt,xml,obj){populateOptions(txt,obj);}, this);
	} else {
		this.notificationManager.notify("Please open or create a project that you wish to view assets for.", 3);
	}
};

/**
 * Launches the currently opened project in the vle.
 */
View.prototype.previewProject = function(){
	if(this.project){
		if(this.project.getStartNodeId() || confirm('Could not find a start node for the project. You can add sequences and/or nodes to remedy this. Do you still wish to preview the project (you will not see any steps)?')){
			if(this.portalProjectId){
				window.open(this.requestUrl + '?command=preview&projectId=' + this.portalProjectId);
			} else {
				window.open('vle.html', 'PreviewWindow', "toolbar=no,width=1024,height=768,menubar=no");
			}
		}
	} else {
		this.notificationManager.notify('Please open or create a Project to preview.', 3);
	}
};

/**
 * The opened vle window is ready, start the loading of the project in the vle
 * by firing the startpreview event in the given eventManager with a custom object
 * of name:value pairs that match that of the config object in the vle @see config.js
 */
View.prototype.startPreview = function(em){
	var obj = {'mode':'standaloneauthorpreview','getContentUrl':this.getProject().getUrl(),'getContentBaseUrl':this.getProject().getContentBase(),'updateAudio':this.updateAudioInVLE};
	em.fire('startVLEFromParams', obj);
	this.updateAudioInVLE = false;
};

/**
 * Retrieves the project name and sets global path and name, then
 * loads the project into the authoring tool.
 */
View.prototype.projectOptionSelected = function(){
	var path = document.getElementById('selectProject').options[document.getElementById('selectProject').selectedIndex].value;

	/* if this is a portal project, we need to set the portal variables based on the project name/id combo */
	if(this.portalUrl){
		var nameId = path.split(' ID: ');
		var ndx = this.portalProjectIds.indexOf(nameId[1]);
		if(ndx!=-1){
			this.portalProjectId = nameId[1];
			this.authoringBaseUrl = this.portalUrl + '?forward=filemanager&projectId=' + this.portalProjectId + '&command=retrieveFile&param1=';
			path = this.portalProjectPaths[ndx];
		} else {
			this.portalProjectId = undefined;
			this.notificationManager.notify('Could not find corresponding portal project id when opening project!', 2);
		}
	}
	
	//if all is set, load project into authoring tool
	if(path!=null && path!=""){
		/* if a project is currently open and the authoring tool is in portal mode, notify the
		 * portal that this user is not longer working on the project */
		if(this.getProject() && this.portalUrl){
			this.notifyPortalCloseProject();
		}
		
		this.loadProject(this.authoringBaseUrl + path, this.utils.getContentBaseFromFullUrl(this.authoringBaseUrl + path), true);
		$('#openProjectDialog').dialog('close');
		$('#currentProjectContainer').show();
		$('#authoringContainer').show();
		$('#projectTools').show();
		//$('#projectButtons button').removeAttr('disabled');
		eventManager.fire('browserResize');
	}
};

/**
 * Retrieves an updated list of projects, either from the authoring tool
 * or the portal and shows the list in the open project dialog.
 */
View.prototype.openProject = function(){
	/* wipe out old select project options and set placeholder option */
	$('#selectProject').children().remove();
	$('#selectProject').append('<option name="projectOption" value=""></option>');
	
	/* make request to populate the project select list */
	this.retrieveProjectList();
	
	/* show the loading div and hide the select drop down until the
	 * project list request comes back */
	$('#openProjectForm').hide();
	$('#loadingProjectMessageDiv').show();
	
	/* open the dialog */
	$('#openProjectDialog').dialog('open');
	eventManager.fire('browserResize');
};


/**
 * Opens the copy project dialog, populates the select-able projects,
 * sets hidden form elements, and shows the dialog.
 */
View.prototype.copyProject = function(){
	showElement('copyProjectDialog');
	
	var doSuccess = function(list, view){
		var parent = document.getElementById('copyProjectSelect');
		var sep;
		if(view.primaryPath.indexOf('/')!=-1){
			sep = '/';
		} else {
			sep = '\\';
		};
		
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		};
		
		/* split the projects up */
		var projects = list.split('|');
		
		for(var c=0;c<projects.length;c++){
			var opt = createElement(document, 'option', {name: 'copyProjectOption'});
			parent.appendChild(opt);
			
			/* If list is from portal, set option text to name + id, otherwise, use the path. 
			 * Also set option id to the associated project id so that the request to the portal has it. */
			if(projects[c].indexOf('~')!=-1){
				var splitz = projects[c].split('~');
				
				opt.text = splitz[2] + ' ID: ' + splitz[1];
				opt.value = splitz[0].substring(0, splitz[0].lastIndexOf(sep));
				opt.id = splitz[1];
				opt.filename = splitz[0].substring(splitz[0].lastIndexOf(sep) + 1, splitz[0].length);
				opt.title = splitz[2];
			} else {		
				opt.text = projects[c];
				opt.value = projects[c].substring(0, projects[c].lastIndexOf(sep));
				opt.filename = splitz[0].substring(splitz[0].lastIndexOf(sep) + 1, splitz[0].length);
				opt.title = opt.filename.substring(0, opt.filename.indexOf('.'));
			}
		};
		
		$('#copyProjectDialog').dialog('open');
		eventManager.fire('browserResize');
	};
	
	if(this.portalUrl){
		this.connectionManager.request('GET', 1, this.requestUrl, {command: 'projectList'}, function(t,x,o){doSuccess(t,o);}, this);
	} else {
		this.connectionManager.request('GET', 1, this.requestUrl, {command: 'projectList', 'projectPaths': this.projectPaths}, function(t,x,o){doSuccess(t,o);}, this);
	};
};

/**
 * Switches the project mode between Simple and Advanced and refreshes
 * the project.
 */
View.prototype.toggleProjectMode = function(){
	this.projectStructureViolation = false;
	
	//toggle modes and set associated text
	if(this.simpleProject){
		this.simpleProject = false;
		$('#projectModeDiv > span').text('Advanced Mode');
	} else {
		this.simpleProject = true;
		$('#projectModeDiv > span').text('Simple Mode');
	};
	//regenerate authoring if a project is open
	if(this.project){
		this.generateAuthoring();
	};
};

/**
 * Sets initial values and shows the edit project metadata dialog
 */
View.prototype.editProjectMetadata = function(){
	if(this.getProject()){
		showElement('editProjectMetadataDialog');
		document.getElementById('projectMetadataTitle').value = this.utils.resolveNullToEmptyString(this.projectMeta.title);
		document.getElementById('projectMetadataAuthor').value = this.utils.resolveNullToEmptyString(this.projectMeta.author);
		this.utils.setSelectedValueById('projectMetadataSubject', this.utils.resolveNullToEmptyString(this.projectMeta.subject));
		document.getElementById('projectMetadataSummary').value = this.utils.resolveNullToEmptyString(this.projectMeta.summary);
		this.utils.setSelectedValueById('projectMetadataGradeRange', this.utils.resolveNullToEmptyString(this.projectMeta.gradeRange));
		this.utils.setSelectedValueById('projectMetadataTotalTime', this.utils.resolveNullToEmptyString(this.projectMeta.totalTime));
		this.utils.setSelectedValueById('projectMetadataCompTime', this.utils.resolveNullToEmptyString(this.projectMeta.compTime));
		this.utils.setSelectedValueById('projectMetadataLanguage', this.utils.resolveNullToEmptyString(this.projectMeta.language));
		document.getElementById('projectMetadataContact').value = this.utils.resolveNullToEmptyString(this.projectMeta.contact);
		
		var techReqs = this.projectMeta.techReqs;
		
		if(this.projectMeta.techReqs != null) {

			//determine if flash needs to be checked
			if(techReqs.flash) {
				$('#flash').attr('checked', true);
			}
			
			//determine if java needs to be checked
			if(techReqs.java) {
				$('#java').attr('checked', true);
			}
			
			//determine if quicktime needs to be checked
			if(techReqs.quickTime) {
				$('#quickTime').attr('checked', true);
			}

			//set the tech details string
			$('#projectMetadataTechDetails').attr('value', techReqs.techDetails);
			
			if (this.projectMeta.tools != null) {
				var tools = this.projectMeta.tools;
				
				//determine if enable idea manager needs to be checked
				if (tools.isIdeaManagerEnabled != null && tools.isIdeaManagerEnabled) {
					$("#enableIdeaManager").attr('checked', true);
				}

				//determine if enable student asset uploader needs to be checked
				if (tools.isStudentAssetUploaderEnabled != null && tools.isStudentAssetUploaderEnabled) {
					$("#enableStudentAssetUploader").attr('checked', true);
				}
			}
		}
		
		document.getElementById('projectMetadataLessonPlan').value = this.utils.resolveNullToEmptyString(this.projectMeta.lessonPlan);
		document.getElementById('projectMetadataStandards').value = this.utils.resolveNullToEmptyString(this.projectMeta.standards);
		document.getElementById('projectMetadataKeywords').value = this.utils.resolveNullToEmptyString(this.projectMeta.keywords);
		$('#editProjectMetadataDialog').dialog('open');
		eventManager.fire('browserResize');
	} else {
		this.notificationManager.notify('Open a project before using this tool.', 3);
	};
};

/**
 * Called each time a project is loaded to set necessary variables
 * and generates the authoring for this project.
 */
View.prototype.onProjectLoaded = function(){
	if(this.cleanMode){
		this.retrieveMetaData();
		eventManager.fire('cleanProject');
	} else {
		//make the top project authoring container visible (where project title shows up)
		$('#currentProjectContainer').show();
		
		//make the bottom project authoring container visible (where the steps show up)
		$('#authoringContainer').show();
		$('#projectTools').show();
		
		this.projectStructureViolation = false;
		if(this.selectModeEngaged){
			this.disengageSelectMode(-1);
		};
	
		/*if(this.project && this.project.useAutoStep()==true){
			document.getElementById('autoStepCheck1').checked = true;
		} else {
			document.getElementById('autoStepCheck1').checked = false;
		};*/
	
		if(this.project && this.project.useStepLevelNumbering()==true){
			//document.getElementById('stepLevel').checked = true;
			document.getElementById('numberStepSelect').options[1].selected = true;
		} else {
			//document.getElementById('stepLevel').checked = false;
			document.getElementById('numberStepSelect').options[0].selected = true;
		};
	
		if(this.project && this.project.getStepTerm()){
			document.getElementById('stepTerm').value = this.project.getStepTerm();
		} else {
			document.getElementById('stepTerm').value = '';
			this.project.setStepTerm('');
			this.notificationManager.notify('stepTerm not set in project, setting default value: \"\"', 2);
		};
	
		document.getElementById('postLevelSelect').selectedIndex = 0;
	
		// if we're in portal mode, tell the portal that we've opened this project
		if (this.portalUrl) {
			this.notifyPortalOpenProject(this.project.getContentBase(), this.project.getProjectFilename());
		}
	
		if(this.project.getTitle()){
			var title = this.project.getTitle();
		} else {
			var title = this.project.getProjectFilename().substring(0, this.project.getProjectFilename().lastIndexOf('.project.json'));
			this.project.setTitle(title);
		};

		document.getElementById('projectTitleInput').value = title;

		//set the project id so it is displayed to the author
		$('#projectIdDisplay').text(this.portalProjectId);
	
		this.generateAuthoring();
	
		this.retrieveMetaData();
		
		//add these two params to the config
		this.getConfig().setConfigParam('getContentUrl', this.getProject().getUrl());
		this.getConfig().setConfigParam('getContentBaseUrl', this.getProject().getContentBase());
	
		if(this.placeNode){
			this.placeNewNode(this.placeNodeId);
		}
	}
};

/**
 * Notifies portal that this user is now authoring this project
 */
View.prototype.notifyPortalOpenProject = function(projectPath, projectName) {
	var handler = function(responseText, responseXML, o){
		if (responseText != "") {
			o.notificationManager.notify(responseText + " is also editing this project right now. Please make sure not to overwrite each other's work.", 3);
			document.getElementById("concurrentAuthorDiv").innerHTML = "Also Editing: " + responseText;
			o.currentEditors = responseText;
			eventManager.fire('browserResize');
		} else {
			o.currentEditors = '';
			document.getElementById("concurrentAuthorDiv").innerHTML = "";
			eventManager.fire('browserResize');
		}
	};
	
	this.connectionManager.request('POST', 1, this.portalUrl, {command: 'notifyProjectOpen', path: this.project.getUrl()}, handler, this);
};

/**
 * Notifies portal that this user is no longer authoring this project
 * 
 * @param boolean - sync - whether the request should be synchronous
 */
View.prototype.notifyPortalCloseProject = function(sync){
	if(this.getProject()){
		var success = function(t,x,o){
			o.notificationManager.notify('Portal notified that project session is closed.', 3);
		};
		
		var failure = function(t,o){
			o.notificationManager.notify('Unable to notify portal that project session is closed', 3);
		};
		
		this.connectionManager.request('POST', 1, this.portalUrl, {command:'notifyProjectClose', path: this.getProject().getUrl()}, success, this, failure, sync);
	}
};

/**
 * Run on an interval, notifies the user when another user is also editing the
 * same project.
 */
View.prototype.getEditors = function(){
	var success = function(t,x,o){
		/* there was a change and we need to get the difference */
		if(t!=this.currentEditors){
			/* notify user of the difference */
			var diffText = o.getEditorDifferenceText(t);
			
			if(diffText && diffText!=''){
				o.notificationManager.notify(o.getEditorDifferenceText(t), 3);
			};
			
			/* update the also editing display to the current editors if any */
			if(t==''){
				document.getElementById("concurrentAuthorDiv").innerHTML = '';
				eventManager.fire('browserResize');
			} else {
				document.getElementById("concurrentAuthorDiv").innerHTML = "Also Editing: " + t;
				eventManager.fire('browserResize');
			};
			
			/* set the current editors to the new response */
			o.currentEditors = t;
		};
	};
	
	/* only request if a project is currently opened */
	if(this.getProject()){
		this.connectionManager.request('POST', 1 ,this.portalUrl, {command:'getEditors', projectId: this.portalProjectId, path: this.getProject().getUrl()}, success, this);
	};
};

/**
 * Returns the appropriate string based on the new given text of editors and the
 * current editors.
 * 
 * @param text
 * @return
 */
View.prototype.getEditorDifferenceText = function(text){
	var current = this.currentEditors.split(',');
	var incoming = text.split(',');
	var diffText = '';
	
	/* remove usernames in common to get the differences */
	for(var a=current.length - 1;a>=0;a--){
		if(incoming.indexOf(current[a])!=-1){
			incoming.splice(incoming.indexOf(current[a]), 1);
			current.splice(a,1);
		};
	};
	
	/* add text for users that may have left */
	for(var b=0;b<current.length;b++){
		if(current[b]!=''){
			diffText += 'User ' + current[b] + ' is no longer working on this project.<br/>';
		};
	};
		
	/* add text for users that may have joined */
	for(var c=0;c<incoming.length;c++){
		if(incoming[c]!=''){
			diffText += 'User ' + incoming[c] + ' has started editing this project.<br/>';
		};
	};
	
	return diffText;
};

/**
 * Stops the polling interval to see who else is editing the project if it was set.
 */
View.prototype.stopEditingInterval = function(){
	if(this.editingPollInterval){
		clearInterval(this.editingPollInterval);
	}
};

/* This function is called when the user wants to author the specified node.
 * Duplicate nodes are replaced with the node that they represent */
View.prototype.author = function(nodeInfo) {
	var absId = nodeInfo.split('----')[0];
	var nodeId = nodeInfo.split('----')[1];
	
	// add editing (highlight) class to node display
	setTimeout(function(){$('#' + $.escapeId(absId)).addClass('editing');},1000);
		
	// retrieve the node from the project
	var node = this.project.getNodeById(nodeId);
	
	if(node.type=='DuplicateNode'){
		node = node.getNode();
		// replace duplicate node with the node it represents
	}
	
	// launch the authoring for the node
	if(NodeFactory.acceptedTagNames.indexOf(node.type)==-1){
		this.notificationManager.notify('No tool exists for authoring this step yet', 3);
		return;
	} else if(this.versionMasterUrl){
		//this.versioning.versionConflictCheck(nodeId);
	} else {
		this.activeNode = node;
		this.showAuthorStepDialog();
		this.setInitialAuthorStepState();
	}
};

/**
 * When a node type is selected, dynamically creates a select element
 * and option elements with icons and names for that specific nodeType.
 * The node's className is set as the value for param2 of the createNodeDialog.
 */
View.prototype.nodeTypeSelected = function(){
	var parent = document.getElementById('createNodeDiv');
	var old = document.getElementById('selectNodeIconDiv');
	var val = document.getElementById('createNodeType').options[document.getElementById('createNodeType').selectedIndex].value;
	
	if(old){
		parent.removeChild(old);
	};
	
	if(val && val!=""){
		var nodeClassesForNode = this.nodeClasses[val];
		
		var selectDiv = createElement(document, 'div', {id: 'selectNodeIconDiv'});
		var selectText = document.createTextNode('Select an Icon:');
		var select = createElement(document, 'select', {id: 'selectNodeIcon', name: 'param2'});
		
		for(var x=0;x<nodeClassesForNode.length;x++){
			var nodeClassObj = nodeClassesForNode[x];
			var opt = createElement(document, 'option', {name: 'nodeClassOption'});
			opt.value = nodeClassObj.nodeClass;
			opt.innerHTML = '<img src=\'' + this.iconUrl + nodeClassObj.nodeClass + '16.png\'/> ' + nodeClassObj.nodeClassText;
			
			select.appendChild(opt);
		};
		
		//the div that will contain the description of the step type
		var descriptionDiv = createElement(document, 'div', {id: 'selectNodeDescription'});
		
		//the actual text that contains the description, this will initially be set to the default description
		var descriptionText = "Description not provided";
		
		//get the constructor for the chosen step type
		var nodeConstructor = NodeFactory.nodeConstructors[val];
		
		if(nodeConstructor != null) {
			//the constructor exists
			if(NodeFactory.nodeConstructors[val].authoringToolDescription != null &&
					NodeFactory.nodeConstructors[val].authoringToolDescription != "") {
				//get the description text
				descriptionText = NodeFactory.nodeConstructors[val].authoringToolDescription;			
			}
		}
		
		//create a text node with the description
		var descriptionTextNode = document.createTextNode('Description: ' + descriptionText);
		
		//add the text node to the description div
		descriptionDiv.appendChild(descriptionTextNode);
		
		//add all the elements to the select div
		selectDiv.appendChild(selectText);
		selectDiv.appendChild(select);
		selectDiv.appendChild(createElement(document, 'br'));
		selectDiv.appendChild(createElement(document, 'br'));
		selectDiv.appendChild(descriptionDiv);
		
		//add the select div to the select dialog
		parent.appendChild(selectDiv);
	};
};

/**
 * Populates and shows the node selector dialog and attachs
 * the given events to the select and cancel buttons.
 */
View.prototype.populateNodeSelector = function(event, cancelEvent){
	var parent = document.getElementById('nodeSelectDiv');
	var COLORS = ['blue','red','purple','green','yellow','black','white','silver'];
	
	/* clear any old select elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	}
	
	/* create new node select element */
	var select = createElement(document, 'select', {id:'nodeSelectorSelect'});
	parent.appendChild(select);
	
	/* create color select element */
	var colorSelect = createElement(document, 'select', {id:'colorSelectorSelect'});
	parent.appendChild(colorSelect);
	
	/* parse project from root node and add option for each node in project */
	var addOption = function(node, select){
		/* if this node is a sequence node, add all of its children */
		if(node.type=='sequence'){
			for(var a=0;a<node.children.length;a++){
				addOption(node.children[a], select);
			}
		} else {
			var opt = createElement(document, 'option', {id:'opt_' + node.id});
			opt.value = node.view.getProject().getPositionById(node.id);
			opt.text = node.title;
			
			select.appendChild(opt);
		}
	};
	
	addOption(this.getProject().getRootNode(), select);
	
	/* add colors to the color selector */
	for(var b=0;b<COLORS.length;b++){
		var opt = createElement(document, 'option');
		opt.value = COLORS[b];
		opt.text = COLORS[b];
		
		colorSelect.appendChild(opt);
	}
	
	
	/* add the buttons */
	var selectButt = createElement(document, 'input', {type:'button', value:'Create Link', onclick:'eventManager.fire(\'' + event + '\')'});
	var cancelButt = createElement(document, 'input', {type:'button', value:'Cancel', onclick:'eventManager.fire(\'' + cancelEvent + '\')'});
	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	parent.appendChild(selectButt);
	parent.appendChild(cancelButt);
	
	/* show the dialog */
	showElement('nodeSelectorDialog');
	$('#nodeSelectorDialog').dialog('open');
};

/**
 * Called whenever the author window is scrolled
 */
View.prototype.authorWindowScrolled = function() {
	//see if there is a msgDiv
	if(document.msgDiv) {
		//modify the vertical position so the msgDiv is always displayed at the top of the screen
		document.msgDiv.style.top = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	}
};

/**
 * Fires the pageRenderComplete event whenever the preview frame is loaded.
 */
View.prototype.onPreviewFrameLoad = function(){
	if(this.activeNode){
		this.eventManager.fire('pageRenderComplete', this.activeNode.id);
	}
};

/**
 * Returns the activeNode (the node step currently being authored) if one
 * is active, returns null otherwise.
 * 
 * @return Node || null - activeNode
 */
View.prototype.getCurrentNode = function(){
	return (this.activeNode ? this.activeNode : null);
};

/**
 * Cleans up before exiting the authoring tool.
 */
View.prototype.onWindowUnload = function(){
	this.stopEditingInterval();
	this.notifyPortalCloseProject(true);
};

/**
 * Retrieves and populates the project list for the open project dialog.
 */
View.prototype.retrieveProjectList = function(){
	this.connectionManager.request('GET', 1, (this.portalUrl ? this.portalUrl : this.requestUrl), {command: 'projectList', 'projectPaths': this.projectPaths}, this.retrieveProjectListSuccess, this, this.retrieveProjectListFailure);
};

/**
 * Processes the response and populates the project list with the response
 * from the server for a project list.
 */
View.prototype.retrieveProjectListSuccess = function(t,x,o){
	if(o.portalUrl){
		o.populatePortalProjects(t);
	} else {
		o.populateStandAloneProjects(t);
	}
};

/**
 * Notifies user of error when attempting to retrieve the project list.
 */
View.prototype.retrieveProjectListFailure = function(t,o){
	o.notificationManager.notify('Error when attempting to retrieve project list.', 3);
};

/**
 * Populates the project list with projects retrieved from the portal.
 * 
 * @param t
 * @return
 */
View.prototype.populatePortalProjects = function(t){
	this.portalProjectPaths = [];
	this.portalProjectIds = [];
	this.portalProjectTitles = [];
	
	var projects = t.split('|');
	for(var b=0;b<projects.length;b++){
		var pathIdTitle = projects[b].split('~');
		this.portalProjectPaths.push(pathIdTitle[0]);
		this.portalProjectIds.push(pathIdTitle[1]);
		this.portalProjectTitles.push(pathIdTitle[2]);
		
		$('#selectProject').append('<option name="projectOption" value="' + pathIdTitle[2] + ' ID: ' + pathIdTitle[1] + '">' +  pathIdTitle[2] + ' ID: ' + pathIdTitle[1] +'</option>');
	}
	
	this.onOpenProjectReady();
};

/**
 * Populates the project list with projects retrieved from the filemanager.
 * 
 * @param t
 * @return
 */
View.prototype.populateStandAloneProjects = function(t){
	var projects = t.split('|');
	for(var a=0;a<projects.length;a++){
		$('#selectProject').append('<option name="projectOption" value="' + projects[a] + '">' + projects[a] + '</option>');
	}
	
	this.onOpenProjectReady();
};

/**
 * When the project list (either stand-alone or portal) is loaded, hides the 
 * loading div and shows the select project div.
 */
View.prototype.onOpenProjectReady = function(){
	$('#loadingProjectMessageDiv').hide();
	$('#openProjectForm').show();
};

View.prototype.reviewUpdateProject = function() {
	
	if(this.projectMetadata != null && this.projectMetadata.parentProjectId == null) {
		/*
		 * there is no parent project id in the metadata which means there is no parent project.
		 * this means we can't update project.
		 */
		alert("This project does not have a parent so Update Project is not available.");
	} else {
		//update the project by retrieving the files from the parent project
		
		var success = function(text,xml,obj){
			//o.notificationManager.notify('Success', 3);
			//alert(t);
			var reviewResults = $.parseJSON(text);
			
			$('#reviewUpdateProjectDiv').html("");
			
			var reviewDescriptionHtml = "<div>";
			reviewDescriptionHtml += "Here is how this project will be modified when you perform the update.";
			reviewDescriptionHtml += "<br>";
			reviewDescriptionHtml += "<input type='button' value='View changed nodes' onclick='$(\".reviewUpdateNode\").hide();$(\".reviewUpdateNodeChanged\").show();' />";
			reviewDescriptionHtml += "<input type='button' value='View all nodes' onclick='$(\".reviewUpdateNode\").show();' />";
			reviewDescriptionHtml += "<hr>";
			reviewDescriptionHtml += "</div>";
			
			$('#reviewUpdateProjectDiv').append(reviewDescriptionHtml);
			
			for(var x=0; x<reviewResults.length; x++) {
				var nodeResult = reviewResults[x];
				
				var stepNumber = nodeResult.stepNumber;
				var title = nodeResult.title;
				var nodeType = nodeResult.nodeType;
				var status = nodeResult.status;
				var modified = nodeResult.modified;
				var stepOrActivity = "";
				var divClass = "";
				
				if(status != "not moved" || modified != "false") {
					//step was changed
					divClass = "class='reviewUpdateNode reviewUpdateNodeChanged'";
				} else {
					//step was not changed
					divClass = "class='reviewUpdateNode reviewUpdateNodeNotChanged'";
				}
				
				var nodeResultHtml = "<div " + divClass + ">";
				
				if(nodeType == "sequence") {
					stepOrActivity = "Activity";
				} else {
					stepOrActivity = "Step";
				}
				
				nodeResultHtml += stepOrActivity + " " + stepNumber + ": " + title;
				
				if(nodeType != "sequence") {
					nodeResultHtml += " (" + nodeType + ")";
				}
				
				nodeResultHtml += "<br>";
				
				var nodeStatus = "";
				
				//check whether the node was added, deleted, or moved
				if(status == 'added') {
					nodeStatus += "[Added]";
				} else if(status == 'deleted') {
					nodeStatus += "[Deleted]";
				} else if(status == 'moved') {
					nodeStatus += "[Moved]";
				} else if(status == 'not moved') {
					//do nothing
				}
				
				//check whether the node was modified
				if(modified == 'true') {
					nodeStatus += "[Modified]";
				} else if(modified == 'false') {
					//do nothing
				}
				
				//if nothing has changed we will display no change
				if(nodeStatus == "") {
					nodeStatus += "[No Change]";
				}
				
				nodeResultHtml += nodeStatus;
				
				//the hr between each node
				nodeResultHtml += "<hr>";
				
				nodeResultHtml += "</div>";
				
				$('#reviewUpdateProjectDiv').append(nodeResultHtml);
			}
			
			//only show the nodes that have changed
			$(".reviewUpdateNode").hide();
			$(".reviewUpdateNodeChanged").show();
			
			//display the popup dialog
			$('#reviewUpdateProjectDiv').dialog('open');
		};
		
		var failure = function(text,obj){
			//o.notificationManager.notify('Fail', 3);
		};
		
		
		var contentPath = this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase());
		
		var requestParams = {
			command: 'reviewUpdateProject',
			forward: 'filemanager',
			projectId: this.portalProjectId,
			contentPath: contentPath
		};
		
		this.connectionManager.request('POST', 1, this.portalUrl, requestParams, success, this, failure);
	}	
};

View.prototype.updateProject = function() {
	
	var answer = confirm("Are you sure you want to update the project with the latest changes from the parent project?\n\nUpdating the project may have negative consequences to student data from existing runs depending on how the project was changed.");
	
	if(answer) {
		var success = function(t,x,o){
			//o.notificationManager.notify('Success', 3);
		};
		
		var failure = function(t,o){
			//o.notificationManager.notify('Fail', 3);
		};
		
		
		var contentPath = this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase());
		
		var requestParams = {
			command: 'updateProject',
			forward: 'filemanager',
			projectId: this.portalProjectId,
			contentPath: contentPath
		};
		
		this.connectionManager.request('POST', 1, this.portalUrl, requestParams, success, this, failure);
	}
};

/**
 * Show the step type descriptions popup to the author 
 */
View.prototype.openStepTypeDescriptions = function(){
	showElement('stepTypeDescriptions');
	$('#stepTypeDescriptions').dialog('open');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_main.js');
}