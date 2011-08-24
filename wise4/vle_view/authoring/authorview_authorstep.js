/**
 * Functions specific to step authoring
 * 
 * @author patrick lawler
 * @author jonathan breitbart
 */

/**
 * Shows the author step dialog
 */
View.prototype.showAuthorStepDialog = function(){
	$('#previewFrame').src = 'empty.html';
	//$('#authorStepDialog').dialog('open');
	$('#authorStepDialog').show();
	$('#overlay').show();
	//$.colorbox({href:'#authorStepDialog',inline:true,width:'98%',height:'98%',title:'Edit Step',overlayClose:false,showClose:false,onComplete:function(){eventManager.fire("previewFrameLoaded");},buttons:{'Save':function(){eventManager.fire("saveStep");},'Save and Close':function(){eventManager.fire("saveAndCloseStep");},'Close':function(){eventManager.fire("closeStep");}}});
	/*
	 * scroll to the top of the page because the author step 
	 * dialog shows up at the top and the author would have
	 * to otherwise scroll up themselves
	 */
	//window.scrollTo(0,0);
};

/**
 * Hides the author step dialog
 */
View.prototype.hideAuthorStepDialog = function(){
	//$.colorbox.close();
	$('#authorStepDialog').hide();
	$('#overlay').hide();
	//$('#authorStepDialog').dialog('close');
};

/**
 * Sets the initial state of the authoring step dialog window
 */
View.prototype.setInitialAuthorStepState = function(){
	/* set active content as copy of the active nodes content */
	this.activeContent = createContent(this.activeNode.content.getContentUrl());
	
	/* preserve the content of the active node */
	this.preservedContent = this.activeNode.content;
	
	/* set step saved boolean */
	this.stepSaved = true;
	
	/* set radiobutton for easy/advanced mode */
	if(this.easyMode){
		document.getElementById('easyTrue').checked = true;
	} else {
		document.getElementById('easyFalse').checked = true;
	}
	
	/* set refresh as typing mode */
	document.getElementById('refreshCheck').checked = this.updateNow;
	
	/* generate the authoring */
	if(this.easyMode){
		this[this.resolveType(this.activeNode.type)].generatePage(this);

		this.insertCommonComponents();
	} else {
		this.generateAdvancedAuthoring();
	}
	
	/*
	 * clear out the preview frame, we do this so that the previous step the
	 * author previewed does not still show up if they are now authoring a
	 * note step
	 */
	//$('body', window.frames['previewFrame'].document).html("");
	$('#previewFrame').html('');
	
	//clear out the previous nodeId value in the preview frame
	//window.frames['previewFrame'].nodeId = null;
	$('#previewFrame').nodeId = null;
	
	/* show in preview frame */
	this.previewStep();
};

/**
 * Returns the appropriate type for the purposes of authoring of the given node type.
 * In most cases, it is the node type itself. i.e. MatchSequenceNode = MatchSequenceNode,
 * but sometimes it's not: NoteNode = OpenResponseNode.
 */
View.prototype.resolveType = function(type){
	if(type=='NoteNode'){
		return 'OpenResponseNode';
	} else if(type=='ChallengeNode'){
		return 'MultipleChoiceNode';
	} else if(type=='BranchNode'){
		return 'MultipleChoiceNode';
	} else {
		return type;
	}
};

/**
 * Inserts the link div into the current step's authoring and processes existing links.
 */
View.prototype.insertLinkTo = function(){
	/* move the linkto into the prompt div for this node and show it */
	try{
		var linkDiv = document.getElementById('linkContainer').removeChild(document.getElementById('linkDiv'));
		document.getElementById('promptDiv').appendChild(linkDiv);
	} catch (e){/* do nothing */}
	
	/* process the links for this step */
	this.linkManager.processExistingLinks(this);
};


/**
 * Changes the boolean value of easyMode to that of the given value
 */
View.prototype.authorStepModeChanged = function(val){
	if(this.stepSaved || confirm('You are about to switch authoring mode but have not saved your changes. If you continue, your changes will be lost. Do you wish to continue?')){
		if(val=='true'){
			this.easyMode = true;
		} else {
			this.easyMode = false;
		}
		
		this.cleanupCommonComponents();
		this.setInitialAuthorStepState();
	} else {
		/* user canceled put selection back */
		if(this.easyMode){
			document.getElementById('easyTrue').checked = true;
		} else {
			document.getElementById('easyFalse').checked = true;
		}
	}
};

/**
 * Changes the boolean value of updateNow to that selected by the user in the document
 */
View.prototype.updateRefreshOption = function(){
	this.updateNow = document.getElementById('refreshCheck').checked;
};

/**
 * generates the text area to author content when in advanced authoring mode
 */
View.prototype.generateAdvancedAuthoring = function(){
	var parent = document.getElementById('dynamicParent');
	
	/* remove any existing elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create elements for authoring content */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var ta = createElement(document, 'textarea', {id:'sourceTextArea', style:'width:100%;height:100%', onkeyup:'eventManager.fire("sourceUpdated")'});
	parent.appendChild(pageDiv);
	pageDiv.appendChild(ta);
	
	/* fill with active node's content string */
	ta.style.width = '100%';
	ta.style.height = '100%';
	ta.value = this.activeContent.getContentString();
};

/**
 * saves the currently open step's content and hides the authoring dialog
 */
View.prototype.closeOnStepSaved = function(success){
	if(success || confirm('Save failed, do you still want to exit?')){
		this.cleanupCommonComponents();
		document.getElementById('dynamicPage').innerHTML = '';
		this.hideAuthorStepDialog();
		this.activeNode.content.setContent(this.preservedContent.getContentJSON());
		this.activeNode.baseHtmlContent = undefined;
		this.activeNode = undefined;
		this.activeContent = undefined;
		this.activeTA = undefined;
		this.preservedContent = undefined;
		this.stepSaved = true;
	}
};

/**
 * Prompts user if they are trying to exit before saving and hides the authoring dialog if they wish to continue
 */
View.prototype.closeStep = function(){
	if(this.stepSaved || confirm('Changes have not been saved, do you still wish to exit?')){
		this.closeOnStepSaved(true);
	}
};

/**
 *  refreshes the preview 
 */
View.prototype.refreshNow = function(){
	this.sourceUpdated(true);
};

/**
 * saves hints to local var
 */
View.prototype.saveHint = function(){	
    var currentNode = this.activeNode;    
    var hintTextBoxes = $('#hintsTabs').find("textarea");
    
    var newHintsArr = [];
    for(var i=0; i<hintTextBoxes.length; i++) {
    	newHintsArr.push(hintTextBoxes[i].value);
    }    
    var forceShow = $("#forceShowOptions option:selected").val();
    this.activeContent.getContentJSON().hints = {"hintsArray":newHintsArr,"forceShow":forceShow};
};

/**
 * saves all hints for current node to server
 */
View.prototype.saveHints = function(){	
	this.saveHint();    
    eventManager.fire("saveStep");
    $('#editHintsPanel').dialog('close');
};

/**
 * Add new hint to the current node
 */
View.prototype.addHint = function(){
    var currentNode = this.activeNode;
    var hintsArr = currentNode.getHints().hintsArray;
    hintsArr.push("new hint");
    
    eventManager.fire("editHints", [hintsArr.length-1]);
};

/**
 * Deletes the currently opened hint for the current node
 * after deletion, show the next hint if exists. if not exists, show the previous hint
 */
View.prototype.deleteHint = function(){
	// get index of currently-opened tab
	var selectedIndex = $('#hintsTabs').tabs('option', 'selected');
	
    var currentNode = this.activeNode;
    var hintsArr = currentNode.getHints().hintsArray;
    hintsArr.splice(selectedIndex, 1);
    
    var newTabIndex = 0;  // which tab to open
    if (selectedIndex >= hintsArr.length) {
    	newTabIndex = hintsArr.length - 1;
    } else {
    	newTabIndex = selectedIndex;
    };
    eventManager.fire("editHints", [newTabIndex]);
};

/**
 * opens editHint window
 * @tabIndex which tab index to open
 */
View.prototype.editHints = function(tabIndex){
     var currentNode = this.activeNode;
	 if($('#editHintsPanel').size()==0){
	    	//the show hintsDiv does not exist so we will create it
	    	$('<div id="editHintsPanel" style="text-align:left"></div>').dialog(
	    			{	autoOpen:false,
	    				closeText:'',
	    				width:650,
	    				modal:false,
	    				resizable:false,
	    				title:'Add/Edit Hints for this Step',
	    				zIndex:3000, 
	    				left:0
	    			}).bind( "dialogbeforeclose", {view:currentNode.view}, function(event, ui) {
	    			    // before the dialog closes, save hintstate
	    		    	if ($(this).data("dialog").isOpen()) {	    		    		
	    		    		//var hintState = new HINTSTATE({"action":"hintclosed","nodeId":event.data.view.getCurrentNode().id});
	    		    		//event.data.view.pushHintState(hintState);
	    		    	};
	    		    }).bind( "tabsselect", {view:currentNode.view}, function(event, ui) {
	    		    	//var hintState = new HINTSTATE({"action":"hintpartselected","nodeId":event.data.view.getCurrentNode().id,"partindex":ui.index});
	    		    	//event.data.view.pushHintState(hintState);
	    		    });
	    };
	    
	    // append hints into one html string
	    var editHintsMenu = "<input type='button' value='add new hint' onclick='eventManager.fire(\"addHint\")'></input>"+
	    	"<input type='button' value='delete current hint' onclick='eventManager.fire(\"deleteHint\")'></input>" +
	    	"<input type='button' value='save hints' onclick='eventManager.fire(\"saveHints\")'></input>" + 
	    	"Force Show: <select id='forceShowOptions'><option value='never'>Never</option><option value='firsttime'>First time only</option><option value='always'>Always</option></select>";     
	    var hintsStringPart1 = "";   // first part will be the <ul> for text on tabs
	    var hintsStringPart2 = "";   // second part will be the content within each tab
	    // if there are no hints, make them
	    if (currentNode.getHints() == null) {
	    	if (currentNode.content &&
	    			currentNode.content.getContentJSON()) {
	    		currentNode.content.getContentJSON().hints = {"hintsArray":[],"forceShow":"never"};
	    	}
	    };
	    var hintsArr = currentNode.getHints().hintsArray;
	    for (var i=0; i< hintsArr.length; i++) {
	    	var currentHint = hintsArr[i];
	    	hintsStringPart1 += "<li><a href='#tabs-"+i+"'>Hint "+(i+1)+"</a></li>";
	    	hintsStringPart2 += "<div id='tabs-"+i+"'><textarea class='hintTextBox' onblur='eventManager.fire(\"saveHint\")'>"+currentHint+"</textarea></div>";
	    }
	    hintsStringPart1 = "<ul>" + hintsStringPart1 + "</ul>";

	    hintsString = "<div id='hintsTabs'>" + editHintsMenu + hintsStringPart1 + hintsStringPart2 + "</div>";
	    //set the html into the div
	    $('#editHintsPanel').html(hintsString);
	    
	    //make the div visible
	    $('#editHintsPanel').dialog('open');

	    // instantiate tabs 
		$("#hintsTabs").tabs({selected:tabIndex});		
		
		// select forceshow option
	    var hintsForceShow = currentNode.getHints().forceShow;
		$("#forceShowOptions [value='"+hintsForceShow+"']").attr("selected", "selected");
};

/**
 * saves the currently open step's content and calls individual step type's
 * save function so that any other tasks can be done at that time.
 * @param close
 * @param bypassUpdateSource boolean whether we want to skip updating the source
 */
View.prototype.saveStep = function(close, bypassUpdateSource){
	/* calls individual step type's save() if it exists */
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].save){
		this[this.resolveType(this.activeNode.type)].save(close);
	}
	
	/* only save activeNode content if it is not an html type or if we are in advanced mode */
	if(!this.activeNode.selfRendering || !this.easyMode){
		//check if we want to skip updating the source (in the case the source is already updated)
		if(!bypassUpdateSource) {
			/* 
			 * we will update the source
			 * we need to update the active content before saving if the user has switched off the refresh as typing
			 */
			this.sourceUpdated(true);
		}
		
		/* get json content as string */
		var contentString = encodeURIComponent($.stringify(this.activeContent.getContentJSON(),null,3));
		
		if(contentString == 'undefined') {
			//the JSON is invalid so we will not save
			alert('Error: JSON is invalid, unable to save step.');
		} else {
			//the JSON is valid so we will save
			
			/* success callback for updating content file on server */
			var success = function(txt,xml,obj){
				obj.stepSaved = true;
				obj.notificationManager.notify('Content saved to server.', 3);
				obj.eventManager.fire('setLastEdited');
				obj.preservedContent.setContent(obj.activeContent.getContentJSON());
				if(close){
					obj.eventManager.fire('closeOnStepSaved', [true]);
				}
			};
			
			/* failure callback for updating content file on server */
			var failure = function(o,obj){
				obj.notificationManager.notify('Warning: Unable to save content to server!', 3);
				if(close){
					obj.eventManager.fire('closeOnStepSaved', [false]);
				}
			};
			
			/* update content to server */
			this.connectionManager.request('POST', 3, this.requestUrl, {forward:'filemanager', projectId:this.portalProjectId, command:'updateFile', param1:this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()), param2: this.activeContent.getFilename(this.project.getContentBase()), param3:contentString},success,this,failure);			
		}
	}
};

/**
 * Update content and reload preview when user changes the content
 */
View.prototype.sourceUpdated = function(now){
	if(this.updateNow || now){
		this.stepSaved = false;
		
		if(this.easyMode){
			/* have the step type authoring update the content */
			this[this.resolveType(this.activeNode.type)].updateContent();
		} else {
			/* update content from source text area */
			this.activeContent.setContent(document.getElementById('sourceTextArea').value);
		}
		
		this.previewStep();
	}
};

/**
 * Previews the activeNode's content in the preview window
 */
View.prototype.previewStep = function(){
	/*
	 * replace any relative references to the assets folder with the full 
	 * path to the assets folder and set the active node's content with the 
	 * active content
	 */

	var contentBaseUrl = "";
	
	//get the content base url which should be the url to the project folder
	var contentBaseUrl = this.activeNode.getAuthoringModeContentBaseUrl();

	//make sure the url ends with '/'
	if(contentBaseUrl.charAt(contentBaseUrl.length - 1) != '/') {
		contentBaseUrl += '/';
	}
	
	//get the active content
	var contentString = this.activeContent.getContentString();
	
	//replace any relative references to assets with the absolute path to the assets
	contentString = contentString.replace(/\.\/assets|\/assets|assets/gi, contentBaseUrl + 'assets');
	
	//create a new content object
	var contentObj = createContent(this.activeNode.getContent().getContentUrl());
	
	//set the content string of the new content object
	contentObj.setContent(contentString);
	
	//set the new content with the absolute asset paths into the active node 
	this.activeNode.content.setContent(contentObj.getContentJSON());
	
	/* we don't want broken preview steps to prevent the user from saving
	 * content so let's try to catch errors here */
	
	try{
		/* render the node */
		this.activeNode.render(window.frames['previewFrame']);
	} catch(e){
		this.notificationManager.notify('Error generating preview for step authoring. The following error was generated: ' + e,1);
	}
};

View.prototype.insertCommonComponents = function() {
	var commonComponents = this[this.resolveType(this.activeNode.type)].getCommonComponents();
	if(commonComponents) {
		for(var x=0; x<commonComponents.length; x++) {
			this['insert' + commonComponents[x]]();
		}		
	}
};

View.prototype.cleanupCommonComponents = function() {
	var commonComponents = this[this.resolveType(this.activeNode.type)].getCommonComponents();
	if(commonComponents) {
		for(var x=0; x<commonComponents.length; x++) {
			this['cleanup' + commonComponents[x]]();
		}		
	}
};


/*
 * Prompt functions
 */

View.prototype.insertPrompt = function() {
	this.promptManager.insertPrompt(this);
};

View.prototype.populatePrompt = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populatePrompt){
		this[this.resolveType(this.activeNode.type)].populatePrompt();
	}
};

/**
 * Calls the currently authored node's update date prompt event if we are in easy
 * mode and one exists, does nothing otherwise.
 */
View.prototype.updatePrompt = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updatePrompt){
		this[this.resolveType(this.activeNode.type)].updatePrompt();
	}
};

View.prototype.cleanupPrompt = function() {
	this.promptManager.cleanupPrompt();
};


/*
 * StudentResponseBoxSize functions
 */

View.prototype.insertStudentResponseBoxSize = function() {
	this.studentResponseBoxSizeManager.insertStudentResponseBoxSize(this);
};

View.prototype.populateStudentResponseBoxSize = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateStudentResponseBoxSize){
		this[this.resolveType(this.activeNode.type)].populateStudentResponseBoxSize();
	}
};

View.prototype.updateStudentResponseBoxSize = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateStudentResponseBoxSize){
		this[this.resolveType(this.activeNode.type)].updateStudentResponseBoxSize();
	}
};

View.prototype.cleanupStudentResponseBoxSize = function() {
	this.studentResponseBoxSizeManager.cleanupStudentResponseBoxSize();
};

/*
 * RichTextEditor functions
 */

View.prototype.insertRichTextEditorToggle = function() {
	this.richTextEditorToggleManager.insertRichTextEditorToggle(this);
};

View.prototype.populateRichTextEditorToggle = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateRichTextEditorToggle){
		this[this.resolveType(this.activeNode.type)].populateRichTextEditorToggle();
	}
};

View.prototype.updateRichTextEditorToggle = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateRichTextEditorToggle){
		this[this.resolveType(this.activeNode.type)].updateRichTextEditorToggle();
	}
};

View.prototype.cleanupRichTextEditorToggle = function() {
	this.richTextEditorToggleManager.cleanupRichTextEditorToggle();
};

/*
 * StartSentence functions
 */

View.prototype.insertStarterSentenceAuthoring = function() {
	this.starterSentenceAuthoringManager.insertStarterSentenceAuthoring(this);
};

View.prototype.populateStarterSentenceAuthoring = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateStarterSentenceAuthoring){
		this[this.resolveType(this.activeNode.type)].populateStarterSentenceAuthoring();
	}
};

View.prototype.updateStarterSentenceAuthoring = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateStarterSentenceAuthoring){
		this[this.resolveType(this.activeNode.type)].updateStarterSentenceAuthoring();
	}
};

View.prototype.cleanupStarterSentenceAuthoring = function() {
	this.starterSentenceAuthoringManager.cleanupStarterSentenceAuthoring();
};


/*
 * LinkTo functions
 */

View.prototype.cleanupLinkTo = function() {
	this.linkManager.cleanupLinkTo();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_authorstep.js');
}