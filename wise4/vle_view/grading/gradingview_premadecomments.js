
/**
 * Opens a new popup window that will be used to display the premade
 * comment UI
 * @param commentBoxId the dom id of the textarea that the premade comment
 * will be inserted into in the grading page
 * @param studentWorkColumnId the dom id of the element that contains the
 * student work in the grading page
 */
View.prototype.openPremadeComments = function(commentBoxId, studentWorkColumnId) {
	/*
	 * close any existing instances of the premade comment window.
	 * we only want to display one popup window at a time because
	 * each popup window is linked to a specific student work since
	 * we need to know which comment box to insert the premade
	 * comment into
	 */
	if(this.premadeCommentsWindow) {
		this.premadeCommentsWindow.close();	
	}
	
	//open the premade comment window
	var premadeCommentsWindow = window.open('./premadecomments.html', 'premadeCommentsWindow', 'width=800,height=600,scrollbars=1');
	
	if(window.focus) {
		//give the premade comment window focus
		premadeCommentsWindow.focus();
	}

	//inject the event manager and script loader
	premadeCommentsWindow.eventManager = this.eventManager;
	premadeCommentsWindow.scriptloader = this.scriptloader;
	
	//remember these values so we can access them later
	this.premadeCommentsWindow = premadeCommentsWindow;
	this.commentBoxId = commentBoxId;
	this.studentWorkColumnId = studentWorkColumnId;
	
	if(!this.premadeCommentsSubscribed) {
		/*
		 * subscribe to the scriptsLoaded event for the premade comment window
		 * so that we know when we can begin retrieval of the premade comments.
		 * we only want to perform this subscribe once otherwise the
		 * callback function this.premadeCommentScriptsLoaded will be called
		 * multiple times.
		 */
		eventManager.subscribe('scriptsLoaded', this.premadeCommentScriptsLoaded, {id:'premadeCommentWindow', view:this});
		this.premadeCommentsSubscribed = true;
	}
	
	
	return false;
};

/**
 * Tells the premade comment window to load the scripts it requires to run such
 * as the editinplace and the sortable
 */
View.prototype.premadeCommentWindowLoaded = function() {
	//the loadScripts() function is in premadecomments.html
	this.premadeCommentsWindow.loadScripts();
};

/**
 * The callback function for when all the scripts have been loaded
 * @param type
 * @param args an array that contains the id of the object that
 * originated the call to load scripts, in this case the id is
 * 'premadeCommentWindow'. this is the 3rd argument when 
 * scriptloader.loadScripts() is called in
 * this.premadeCommentsWindow.loadScripts()
 * @param obj an object that contains an id attribute and a view attribute
 * @return
 */
View.prototype.premadeCommentScriptsLoaded = function(type, args, obj) {
	//compare the id
	if(obj.id == args[0]) {
		//obtain the view
		var thisView = obj.view;
		
		//get the premade comments
		thisView.getPremadeComments();		
	}
};

/**
 * Retrieves the premade comments if we haven't before and
 * then renders the premade comments interface. If the
 * user has opened the premade comments window before
 * we should already have the premade comments from before
 * so we don't need to retrieve them again.
 */
View.prototype.getPremadeComments = function() {
	//check if we have retrieved premade comments before
	if(this.premadeCommentLists) {
		//we have retrieved premade comments before so we just need to render them
		this.renderPremadeComments();
	} else {
		//we have not retrieved premade comments before so we need to retrieve them
		
		//get the url that will retrieve the premade comments
		var getPremadeCommentsUrl = this.getConfig().getConfigParam('getPremadeCommentsUrl');
		
		//callback when we have received the premade comments from the server
		var getPremadeCommentsCallback = function(text, xml, args) {
			var thisView = args[0];

			thisView.premadeCommentLists = $.parseJSON(text);
			thisView.renderPremadeComments();
		};
		
		//called when we fail to retrieve the premade comments from the server
		var getPremadeCommentsCallbackFail = function(text, args) {
			//alert("fail: " + text);
		};
		
		var getPremadeCommentsArgs = {};
		
		//make the request for the premade comments
		this.connectionManager.request('GET', 1, getPremadeCommentsUrl, getPremadeCommentsArgs, getPremadeCommentsCallback, [this], getPremadeCommentsCallbackFail);
	}
};

/**
 * Posts premade comment data back to the server
 * @param premadeCommentAction the type of premade comment data we are sending
 * back to the server such as
 * 'addComment'
 * 'editComment'
 * 'deleteComment'
 * 'reOrderCommentList'
 * 
 * @param postPremadeCommentsCallback the callback function that is called after
 * the post has succeeded
 * @param premadeCommentListId the id of the premade comment list
 * @param premadeCommentListLabel the name of the premade comment list
 * @param premadeCommentId the id of the premade comment
 * @param premadeComment the comment string
 * @param isGlobal whether we are dealing with a global element
 */
View.prototype.postPremadeComments = function(premadeCommentAction, postPremadeCommentsCallback, premadeCommentListId, premadeCommentListLabel, premadeCommentId, premadeComment, isGlobal, premadeCommentListPositions) {
	//get the url that will post the premade comment to the server
	var postPremadeCommentsUrl = this.getConfig().getConfigParam('postPremadeCommentsUrl');
	
	//called when we fail to send the premade comment data to the server
	var postPremadeCommentsCallbackFail = function(text, args) {
		//alert("fail: " + text);
	};
	
	//the post parameters
	var postPremadeCommentsArgs = {
			premadeCommentAction:premadeCommentAction,
			premadeCommentListId:premadeCommentListId,
			premadeCommentListLabel:premadeCommentListLabel,
			premadeCommentId:premadeCommentId,
			premadeComment:premadeComment,
			isGlobal:isGlobal,
			premadeCommentListPositions:premadeCommentListPositions
	};
	
	//make the post to the server
	this.connectionManager.request('POST', 1, postPremadeCommentsUrl, postPremadeCommentsArgs, postPremadeCommentsCallback, [this], postPremadeCommentsCallbackFail);
};

/**
 * Render the premade comments interface
 */
View.prototype.renderPremadeComments = function() {
	//get the div that we will put the premade comment lists into
	var premadeCommentsListsDiv = this.premadeCommentsWindow.document.getElementById('premadeCommentsListsDiv');
	
	//get the student work from the element in the original grading page
	var studentWork = $('#' + this.studentWorkColumnId).html();
	
	//get the id of the comment box in the grading page
	var commentBoxId = '#' + this.commentBoxId.replace('.', '\\.');
	
	//get the existing comment
	var existingComment = $(commentBoxId).attr('value');
	
	//populate the premade comment submit box with the existing comment
	$('#premadeCommentsTextArea', this.premadeCommentsWindow.document).attr('value', existingComment);
	
	//find the index of the timestamp in the student work
	var indexOfTimestamp = studentWork.indexOf('<br><br><br><p class="lastAnnotationPostTime">');
	
	//remove the timestamp from the student work
	studentWork = studentWork.substring(0, indexOfTimestamp);
	
	//display the student work in the premade comments window
	$('#premadeCommentsStudentWorkDiv', this.premadeCommentsWindow.document).html(studentWork);
	
	//get the user login name that they use to sign in
	var userLoginName = this.getUserAndClassInfo().getUserLoginName();
	
	//loop through all the premade comment lists
	for(var x=0; x<this.premadeCommentLists.length; x++) {
		//get a premade comment list
		var premadeCommentList = this.premadeCommentLists[x];
		
		//get the id of the list
		var premadeCommentListId = premadeCommentList.id;
		
		//get the label of the list
		var premadeCommentListLabel = premadeCommentList.label;
		
		//get the owner of the list
		var premadeCommentListOwner = premadeCommentList.owner;
		
		//check if the signed in user is the owner of this list
		var signedInUserIsOwner = false;
		if(userLoginName == premadeCommentListOwner) {
			signedInUserIsOwner = true;
		}
		
		//sort premade comment list by premade comment listposition
		premadeCommentList.premadeComments = this.sortPremadeCommentList(premadeCommentList.premadeComments);
		
		//get the name of the premade comment list
		var premadeCommentListLabelText = document.createTextNode(premadeCommentListLabel + ' ');
		
		//add the premade comment list name to the div
		premadeCommentsListsDiv.appendChild(premadeCommentListLabelText);
		
		if(signedInUserIsOwner) {
			//create the button that the user will use to add a new premade comment
			var premadeCommentListAddCommentButton = createElement(this.premadeCommentsWindow.document, 'input', {type:'button', id:'premadeCommentListAddCommentButton_' + premadeCommentListId, value:'Add Comment', onclick:'eventManager.fire("addPremadeComment", [' + premadeCommentListId + '])'});

			//add the premade comment add comment button to the div
			premadeCommentsListsDiv.appendChild(premadeCommentListAddCommentButton);
		}
		
		/*
		 * if the signed in user is the owner, we will give it the
		 * 'myPremadeCommentList' class so that it will be sortable
		 */
		var premadeCommentListULClass = "";
		if(signedInUserIsOwner) {
			premadeCommentListULClass = 'myPremadeCommentList';
		}
		
		//create the UL element that will hold all the premade comments in this list
		var premadeCommentListUL = createElement(this.premadeCommentsWindow.document, 'ul', {id:'premadeCommentUL_' + premadeCommentListId, style:'margin-left: 0px; padding-left: 0px', 'class':premadeCommentListULClass});
		
		//put this UL into the div to display it
		premadeCommentsListsDiv.appendChild(premadeCommentListUL);
		
		//loop through all the premade comments in the list
		for(var y=0; y<premadeCommentList.premadeComments.length; y++) {
			//get a premade comment
			var premadeComment = premadeCommentList.premadeComments[y];
			
			//get the id of the premade comment
			var premadeCommentId = premadeComment.id;
			
			//get the comment
			var comment = premadeComment.comment;
			
			//create the DOM id for the comment
			var premadeCommentDOMId = this.getPremadeCommentDOMId(premadeCommentId);
			
			//create the premade comment LI
			var premadeCommentLI = this.createPremadeCommentLI(premadeCommentId, comment, premadeCommentListId, signedInUserIsOwner);
			
			//add the LI to the UL
			premadeCommentListUL.appendChild(premadeCommentLI);
			
			if(signedInUserIsOwner) {
				//make the comment editable in place if the user owns this list
				this.makePremadeCommentEditable(premadeCommentId);				
			}
		}
	}
	
	//make the lists that this user owns sortable
	this.makePremadeCommentListsSortable();
	
	//this call will remove the loading message and make the UI elements visible
	this.renderPremadeCommentsComplete();
};

/**
 * Sort the premade comment list by premade comment list positions
 * in descending order (largest first, smallest last)
 * @param an array of premade comments
 */
View.prototype.sortPremadeCommentList = function(premadeCommentList) {
	premadeCommentList = premadeCommentList.sort(this.sortPremadeCommentListByListPositions);
	
	return premadeCommentList;
};

/**
 * A sorting function used as an argument to array.sort() to sort premade
 * comments in a premade comment list in descending order (largest first,
 * smallest last)
 * @param a some premade comment
 * @param b some premade comment
 * @return
 * true if b comes after a
 * false if a comes after b
 */
View.prototype.sortPremadeCommentListByListPositions = function(a, b) {
	var aListPosition = a.listPosition;
	var bListPosition = b.listPosition;
	
	return aListPosition < bListPosition;
};

/**
 * Make the premade comment lists sortable
 */
View.prototype.makePremadeCommentListsSortable = function() {
	//null check the window and the function in the html page
	if(this.premadeCommentsWindow && this.premadeCommentsWindow.makeSortable) {
		/*
		 * call the function in the premadecomments.html to make the lists
		 * sortable. this is required because for some reason the function
		 * call does not work if I call it here within the view so I had
		 * to call it within the premadecomments.html
		 */ 
		this.premadeCommentsWindow.makeSortable(this);
	}
};

/**
 * Called when the user chooses a premade comment to use
 * @param premadeCommentDOMId the dom id of the element that contains
 * the premade comment text
 */
View.prototype.selectPremadeComment = function(premadeCommentDOMId) {
	//obtain the text already in the text area
	var existingCommentText = $('#premadeCommentsTextArea', this.premadeCommentsWindow.document).attr('value');
	
	/*
	 * retrieve the premade comment text that was chosen and append it
	 * into the text area at the bottom of the premade comments window
	 * so the user can view it and modify it if they decide to do so
	 */
	$('#premadeCommentsTextArea', this.premadeCommentsWindow.document).attr('value', existingCommentText + $('#' + premadeCommentDOMId, this.premadeCommentsWindow.document).html());
};

/**
 * Called when the user is satisfied with the premade comment feedback
 * and wants to insert it into the comment box back in the original
 * grading page
 * @param premadeCommentDOMId the dom id of the element that contains
 * the premade comment text
 * @return
 */
View.prototype.submitPremadeComment = function(premadeCommentDOMId) {
	//get the comment text the teacher has chosen to submit
	var commentText = $('#premadeCommentsTextArea', this.premadeCommentsWindow.document).attr('value');
	
	/*
	 * obtain the value in the premade comment text area and insert it
	 * into the comment box in the grading page.
	 * the commentBoxId requires . escaping because the id is comprised
	 * of values one of which includes the nodeId which may contains .
	 * characters and jquery uses . as a special identifier character
	 * 
	 */
	var commentBoxId = '#' + this.commentBoxId.replace('.', '\\.');
	
	/*
	 * set the value and the html because the value is what is saved
	 * and the html is what is displayed
	 */
	$(commentBoxId).attr('value', commentText);
	$(commentBoxId).html(commentText);
	
	//give the comment box back in the original grading page focus
	$(commentBoxId).focus();
	
	//remove the focus so that the textarea will save since it saves on blur
	$(commentBoxId).blur();
	
	//close the premade comment window
	this.premadeCommentsWindow.close();
};

/**
 * Create the call to add a new premade comment to a list
 * @param premadeCommentListId the id of the premade comment list
 */
View.prototype.addPremadeComment = function(premadeCommentListId) {
	//arguments used in the server request to create a new comment
	var premadeCommentAction = 'addComment';
	var postPremadeCommentsCallback = this.addPremadeCommentCallback;
	var premadeCommentListLabel = null;
	var premadeCommentId = null;
	var premadeComment = null;
	var isGlobal = null;
	
	//make the request to create a new comment
	this.postPremadeComments(premadeCommentAction, postPremadeCommentsCallback, premadeCommentListId, premadeCommentListLabel, premadeCommentId, premadeComment, isGlobal);
};

/**
 * Called after the server creates a new comment
 * @param text the JSON of the new comment
 * @param xml
 * @param args
 */
View.prototype.addPremadeCommentCallback = function(text, xml, args) {
	//obtain the view
	var thisView = args[0];
	
	//parse the premade comment
	var premadeComment = $.parseJSON(text);
	
	//obtain the premade comment list id
	var premadeCommentListId = premadeComment.premadeCommentListId;
	
	//obtain the premade comment id
	var premadeCommentId = premadeComment.id;
	
	//this is a new comment so the comment will be empty
	var premadeCommentMessage = premadeComment.comment;
	
	//create the LI element for the premade comment
	var premadeCommentLI = thisView.createPremadeCommentLI(premadeCommentId, premadeCommentMessage, premadeCommentListId, true);
	
	//add the premade comment LI to the top of the premade comment list UL
	$('#premadeCommentUL_' + premadeCommentListId, thisView.premadeCommentsWindow.document).prepend(premadeCommentLI);
	
	//make the premade comment LI editable
	thisView.makePremadeCommentEditable(premadeCommentId);
	
	//add the premade comment to our local array of premade comments
	thisView.addPremadeCommentLocally(premadeCommentListId, premadeComment);
};

/**
 * Add the premade comment to our local copy of the premade comment list
 * @param premadeCommentListId the id of the premade comment list to add
 * the new premade comment to
 * @param premadeComment the new premade comment
 */
View.prototype.addPremadeCommentLocally = function(premadeCommentListId, premadeComment) {
	//get the premade comment list
	var premadeCommentList = this.getPremadeCommentListLocally(premadeCommentListId);
	
	/*
	 * add the premade comment to the premade comments array in the
	 * premade comment list object
	 */ 
	premadeCommentList.premadeComments.push(premadeComment);
};

/**
 * Create the premade comment LI element
 * @param premadeCommentId the id of the premade comment
 * @param comment the comment text
 * @param premadeCommentListId the id of the premade comment list
 * @param signedInUserIsOwner boolean whether the signed in user is the owner of
 * the list this premade comment is part of
 * @return an LI element that contains a select button, the premade comment text,
 * a drag handle, and a delete button
 */
View.prototype.createPremadeCommentLI = function(premadeCommentId, comment, premadeCommentListId, signedInUserIsOwner) {
	//get the premade comment dom id for the element that will hold the comment text
	var premadeCommentDOMId = this.getPremadeCommentDOMId(premadeCommentId);
	
	//create the LI element that will hold the button, the comment, and the handle
	var premadeCommentListLI = createElement(this.premadeCommentsWindow.document, 'li', {id:'premadeCommentLI_' + premadeCommentId, style:'list-style-type:none;margin-left:0px;padding-left:0px'});
	
	//the input button the user will click to choose the comment
	var premadeCommentSelectButton = createElement(this.premadeCommentsWindow.document, 'input', {id:'premadeCommentSelectButton_' + premadeCommentId, type:'button', value:'Select', onclick:'eventManager.fire("selectPremadeComment", ["' + premadeCommentDOMId + '"])'});
	
	//the p element that will display the comment
	var premadeCommentP = createElement(this.premadeCommentsWindow.document, 'p', {id:premadeCommentDOMId, style:'display:inline'});
	premadeCommentP.innerHTML = comment;

	//add the elements to the LI
	premadeCommentListLI.appendChild(premadeCommentSelectButton);
	premadeCommentListLI.appendChild(document.createTextNode(' '));
	premadeCommentListLI.appendChild(premadeCommentP);

	/*
	 * check if the signed in user is the owner of the list so we can determine
	 * if we want to display the '[Drag Me]' and Delete button UI elements
	 */
	if(signedInUserIsOwner) {
		//the p element that will display the handle to use for re-ordering comments in the list
		var premadeCommentDragHandle = createElement(this.premadeCommentsWindow.document, 'p', {id:'premadeCommentHandle_' + premadeCommentId, style:'display:inline', 'class':'premadeCommentHandle'});
		premadeCommentDragHandle.innerHTML = '[Drag Me]';
		
		//the delete button to delete the premade comment
		var premadeCommentDeleteButton = createElement(this.premadeCommentsWindow.document, 'input', {id:'premadeCommentDeleteButton_' + premadeCommentId, type:'button', value:'Delete', onclick:'eventManager.fire("deletePremadeComment", [' + premadeCommentId + ', ' + premadeCommentListId + '])'});
		
		//add the elements to the LI
		premadeCommentListLI.appendChild(document.createTextNode(' '));
		premadeCommentListLI.appendChild(premadeCommentDragHandle);
		premadeCommentListLI.appendChild(document.createTextNode(' '));
		premadeCommentListLI.appendChild(premadeCommentDeleteButton);
	}
	
	return premadeCommentListLI;
};

/**
 * Called when the user finishes editing the comment in place
 * @param idOfEditor the dom id of the element that contains the comment text
 * @param enteredText the text that the user entered
 * @param originalText the text that was there before the user edited
 * @param args an array that holds extra args, in our case the view
 * @return the entered text
 */
View.prototype.editPremadeComment = function(idOfEditor, enteredText, originalText, args) {
	//get the view
	var thisView = args[0];
	
	//arguments used in the server post
	var premadeCommentAction = 'editComment';
	var postPremadeCommentsCallback = thisView.editPremadeCommentCallback;
	var premadeCommentListId = null;
	var premadeCommentListLabel = null;
	
	//get the premade comment id (an integer)
	var premadeCommentId = idOfEditor.replace('premadeComment_', '');
	var premadeComment = enteredText;
	var isGlobal = null;
	
	//make the request to edit the premade comment on the server
	thisView.postPremadeComments(premadeCommentAction, postPremadeCommentsCallback, premadeCommentListId, premadeCommentListLabel, premadeCommentId, premadeComment, isGlobal);
	
	return enteredText;
};

/**
 * The callback that is called after the server we receive the
 * response from the editComment request
 * @param text the JSON of the edited comment
 * @param xml
 * @param args
 */
View.prototype.editPremadeCommentCallback = function(text, xml, args) {
	//obtain the view
	var thisView = args[0];
	
	//parse the premade comment
	var premadeComment = $.parseJSON(text);

	//update the premade comment locally
	thisView.editPremadeCommentLocally(premadeComment);
};

/**
 * Updates the the comment text in our local copy of the premade comments
 * @param premadeComment the premade comment that was updated
 */
View.prototype.editPremadeCommentLocally = function(premadeComment) {
	//loop through all the premade comment lists
	for(var x=0; x<this.premadeCommentLists.length; x++) {
		//get a premade comment list
		var premadeCommentList = this.premadeCommentLists[x];
		
		//get the array of premade comments in the list
		var premadeComments = premadeCommentList.premadeComments;
		
		//loop through all the premade comments
		for(var y=0; y<premadeComments.length; y++) {
			//get a premade comment
			var currentPremadeComment = premadeComments[y];
			
			/*
			 * check if the current premade comment has the same id
			 * as the one we need to update
			 */
			if(currentPremadeComment.id == premadeComment.id) {
				//update the comment text
				currentPremadeComment.comment = premadeComment.comment;
			}
		}
	}
};

/**
 * Called when the user clicks on the delete button for a premade comment
 * @param premadeCommentId the id of the premade comment
 * @param premadeCommentListId the id of the premade comment list
 */
View.prototype.deletePremadeComment = function(premadeCommentId, premadeCommentListId) {
	//arguments used in the server post
	var premadeCommentAction = 'deleteComment';
	var postPremadeCommentsCallback = this.deletePremadeCommentCallback;
	var premadeCommentListLabel = null;
	var premadeComment = null;
	var isGlobal = null;
	
	//make the request to delete the premade comment on the server
	this.postPremadeComments(premadeCommentAction, postPremadeCommentsCallback, premadeCommentListId, premadeCommentListLabel, premadeCommentId, premadeComment, isGlobal);
};

/**
 * Callback called after the server deletes a premade comment
 * @param text the JSON for the premade comment that was deleted
 * @param xml
 * @param args
 */
View.prototype.deletePremadeCommentCallback = function(text, xml, args) {
	//obtain the view
	var thisView = args[0];
	
	//parse the premade comment
	var premadeComment = $.parseJSON(text);
	
	//obtain the premade comment id
	var premadeCommentId = premadeComment.id;
	
	//remove the LI for the deleted premade comment
	var premadeCommentLIId = 'premadeCommentLI_' + premadeCommentId;
	
	$("#" + premadeCommentLIId, thisView.premadeCommentsWindow.document).remove();
	
	//delete the premade comment locally
	thisView.deletePremadeCommentLocally(premadeComment);
};

/**
 * Delete the premade comment locally
 * @param premadeComment the premade comment to delete
 */
View.prototype.deletePremadeCommentLocally = function(premadeComment) {
	//loop through all the premade comment lists
	for(var x=0; x<this.premadeCommentLists.length; x++) {
		//get a premade comment list
		var premadeCommentList = this.premadeCommentLists[x];
		
		//get the array of premade comments
		var premadeComments = premadeCommentList.premadeComments;
		
		//loop through all the premade comments
		for(var y=0; y<premadeComments.length; y++) {
			//get a premade comment
			var currentPremadeComment = premadeComments[y];
			
			//compare the current premade comment id with the one we need to delete
			if(currentPremadeComment.id == premadeComment.id) {
				//the ids match so we will remove this premade comment from the array
				premadeComments.splice(y, 1);
				
				return;
			}
		}
	}
};

/**
 * Make a premade comment editable in place
 * @param premadeCommentId the id of the premade comment
 */
View.prototype.makePremadeCommentEditable = function(premadeCommentId) {
	//obtain the dom id of the element that holds the comment text
	var premadeCommentDOMId = this.getPremadeCommentDOMId(premadeCommentId);
	
	//make the comment editable in place
	$("#" + premadeCommentDOMId, this.premadeCommentsWindow.document).editInPlace({callback:this.editPremadeComment, params:[this], text_size:60});
};

/**
 * Get the premade comment dom id of the element that holds the comment
 * text
 * @param premadeCommentId the id of the premade comment (an integer)
 * @return a string containing the dom id
 */
View.prototype.getPremadeCommentDOMId = function(premadeCommentId) {
	return 'premadeComment_' + premadeCommentId;
};

/**
 * Called after all the premade comments data is retrieved and rendered.
 * This hides the Loading... message and makes everything else visible
 * such as the student work, premade comment lists, textarea, and submit
 * button
 */
View.prototype.renderPremadeCommentsComplete = function() {
	$('#premadeCommentsLoadingP', this.premadeCommentsWindow.document).hide();
	$('#premadeCommentsTopDiv', this.premadeCommentsWindow.document).show();
};

/**
 * This is used as the function call for when the sortable
 * list fires the update event. This function creates an array
 * that will contain the order of the premade comment ids.
 * 
 * e.g.
 * premade comment 10 = "great job"
 * premade comment 11 = "needs more facts"
 * premade comment 12 = "incorrect"
 * 
 * are in a list and in the list they are sorted in the order
 * 
 * "needs more facts"
 * "great job"
 * "incorrect"
 * 
 * so the array will contain the premade comment ids in this order
 * 
 * 11, 10, 12
 * 
 * the index specifies the list position and the value is the premade comment id
 * 
 * index - premadeCommentId - listPosition
 * [0] - 11 - 1
 * [1] - 10 - 2
 * [2] - 12 - 3
 * 
 * @param event
 * @param ui
 * @param thisView
 */
View.prototype.sortUpdate = function(event, ui, thisView) {
	//the array we will store the premade comment ids in
	var listPositions = [];
	
	//get the id of the UL that was updated
	var ulElementId = $(event.target).attr('id');
	
	//get the list id
	var listId = ulElementId.replace('premadeCommentUL_', '');
	
	//get all the LI elements in the UL
	var liElementsInUL = $(event.target).find('li');
	
	//loop through all the LI elements
	for(var x=0; x<liElementsInUL.length; x++) {
		//get an LI element
		var liElement = liElementsInUL[x];
		
		//get the premade comment id
		var liElementId = liElement.id.replace('premadeCommentLI_', '');
		
		//put the premade comment id into the array
		listPositions.push(parseInt(liElementId));
	}
	
	/*
	 * reverse the array so that the top of the list becomes the end of
	 * the array. we want to do this because we want the top of the
	 * list to have the highest index value since the newer premade
	 * comments should have larger list positions. this is so that
	 * when we add a new premade comment we just set the list position
	 * as the next highest available position as opposed to setting it
	 * to 1 and then having to shift all the other elements by 1.
	 */
	listPositions.reverse();

	//arguments used in the server post
	var premadeCommentAction = 'reOrderCommentList';
	var postPremadeCommentsCallback = thisView.reOrderPremadeCommentCallback;
	var premadeCommentListId = listId;
	var premadeCommentListLabel = null;
	
	//get the premade comment id (an integer)
	var premadeCommentId = null;
	var premadeComment = null;
	var isGlobal = null;
	var premadeCommentListPositions = $.stringify(listPositions);
	
	thisView.postPremadeComments(premadeCommentAction, postPremadeCommentsCallback, premadeCommentListId, premadeCommentListLabel, premadeCommentId, premadeComment, isGlobal, premadeCommentListPositions)
};

/**
 * Callback called after we receive the response from a
 * reOrderCommentList request
 * @param text a JSON object containing the list id and an array
 * containing list positions
 * @param xml
 * @param args
 */
View.prototype.reOrderPremadeCommentCallback = function(text, xml, args) {
	//obtain the view
	var thisView = args[0];
	
	//parse the premade comment
	var reOrderReturn = $.parseJSON(text);
	
	//get the premade comment list id
	var premadeCommentListId = reOrderReturn.premadeCommentListId;
	
	//get the list positions
	var listPositions = reOrderReturn.listPositions;
	
	//re-order the premade comments in the list in our local copy
	thisView.reOrderPremadeCommentLocally(premadeCommentListId, listPositions);
};

/**
 * Re-order a premade comment list locally
 * @param premadeCommentListId the id of the premade comment list
 * @param listPositions an array containing premade comment ids in the order
 * that they should be positioned in the list
 * 
 * 
 * e.g.
 * premade comment 10 = "great job"
 * premade comment 11 = "needs more facts"
 * premade comment 12 = "incorrect"
 * 
 * are in a list and in the list they are sorted in the order
 * 
 * "needs more facts"
 * "great job"
 * "incorrect"
 * 
 * so the array will contain the premade comment ids in this order
 * 
 * 11, 10, 12
 * 
 * the index specifies the list position and the value is the premade comment id
 * 
 * index - premadeCommentId - listPosition
 * [0] - 11 - 1
 * [1] - 10 - 2
 * [2] - 12 - 3
 */
View.prototype.reOrderPremadeCommentLocally = function(premadeCommentListId, listPositions) {
	//get the premade comment list with the given id
	var premadeCommentList = this.getPremadeCommentListLocally(premadeCommentListId);
	
	//get the array of premade comments from the list
	var premadeComments = premadeCommentList.premadeComments;
	
	//loop through all the premade comments
	for(var x=0; x<premadeComments.length; x++) {
		//get a premade comment
		var currentPremadeComment = premadeComments[x];
		
		//get the id of the premade comment
		var currentPremadeCommentId = currentPremadeComment.id;
		
		//find the index of the premade comment id within the listPositions array
		var listPositionIndex = listPositions.indexOf(currentPremadeCommentId);
		
		//update the listPosition of the premade comment
		currentPremadeComment.listPosition = listPositionIndex + 1;
	}
};

/**
 * Get a premade comment list given the premade comment list id
 * @param premadeCommentListId the id of the premade comment list
 * @return a premade comment list object
 */
View.prototype.getPremadeCommentListLocally = function(premadeCommentListId) {
	//loop through all the premade comment lists
	for(var x=0; x<this.premadeCommentLists.length; x++) {
		//get a premade comment list
		var currentPremadeCommentList = this.premadeCommentLists[x];
		
		//get the id of the premade comment list
		var currentPremadeCommentListId = currentPremadeCommentList.id;
		
		//check if the id matches
		if(currentPremadeCommentListId == premadeCommentListId) {
			//the id matches so we will return the list
			return currentPremadeCommentList;
		}
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_premadecomments.js');
};