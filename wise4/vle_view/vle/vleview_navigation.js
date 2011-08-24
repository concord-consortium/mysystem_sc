/**
 * Dispatches events specific to the navigation
 */
View.prototype.navigationDispatcher = function(type,args,obj){
	if(type=='renderNextNode'){
		obj.renderNextNode();
	} else if(type=='renderPrevNode'){
		obj.renderPrevNode();
	} else if(type=='loadingProjectComplete'){
		obj.createNavigationLogicOnProjectLoad();
		obj.processConstraintsOnProjectLoad();
	} else if(type=='renderNodeComplete'){
		obj.preloadNextNode(args[0]);
		obj.updateNavigationConstraints();
	} else if(type=='addConstraint'){
		obj.addNavigationConstraint(args[0]);
	} else if(type=='removeConstraint'){
		obj.removeNavigationConstraint(args[0]);
	} else if(type=='processLoadViewStateResponseComplete'){
		obj.processStateConstraints();
	}
};

/**
 * Preloads the next node's content when a node is rendered.
 */
View.prototype.preloadNextNode = function(){
	 /* look ahead and tell the next node to retrieve its content if it exists */
	if(this.navigationLogic){
		var nextNodeLoc = this.navigationLogic.getNextVisitableNode(this.getCurrentPosition());
		
		if(nextNodeLoc){
			this.getProject().getNodeByPosition(nextNodeLoc).preloadContent();
		}
	}
};

/* lets the navigation logic know that a node has rendered */
View.prototype.updateNavigationConstraints = function(){
	this.navigationLogic.nodeRendered(this.getCurrentPosition());
};

/**
 * Creates the navigation logic using the dfs algorithm
 */
View.prototype.createNavigationLogicOnProjectLoad = function(){
	this.navigationLogic = new NavigationLogic(new DFS(this.getProject().getRootNode()), this);
};

/**
 * Renders the previous node in the sequence if it exists.
 */
View.prototype.renderPrevNode = function() {
	var currentNode = this.getProject().getNodeByPosition(this.currentPosition);
	if(!currentNode){
		currentNode = this.getProject().getRootNode();
	}
	
	if (this.navigationLogic == null) {
		this.notificationManager.notify("nav logic not defined.", 1);
	}
	
	//if current node is note, we are leaving and should 'close' note panel
	if(currentNode.type=='NoteNode'){
		this.eventManager.fire('closeDialog','notePanel_' + currentNode.id);
	}
	
	//get the current location
	var location = this.getCurrentPosition();
	
	var prevNodeLoc = this.navigationLogic.getPrevVisitableNode(location);
	if (prevNodeLoc == null) {
		/*
		 * there is no prev node or the student is not allowed to visit
		 * any past nodes (perhaps because of navigation constraints)
		 */ 
		this.notificationManager.notify("prevNode does not exist", 1);
		
		/*
		 * try to obtain the prev node in the project and try to render
		 * it so that if the prev node is actually being blocked by a
		 * constraint, we will display the constraint message
		 */
		var prevNode = this.navigationLogic.getPrevStepNodeInProject(location);
		
		//check if there is a prev node in the project
		if(prevNode != null) {
			/*
			 * we will try to render the prev node in the project, this
			 * is just to trigger the constraint message, the node will
			 * not actually be rendered because it is not visitable.
			 * we may run into issues with trying to trigger the constraint
			 * message from nodes that the student isn't ever supposed
			 * to visit if in the future we utilize branching.
			 */
			eventManager.fire("renderNode", prevNode);
		}
	} else {
		this.eventManager.fire('renderNode', prevNodeLoc);
	}
};

/**
 * Renders the next node visitable node in the project if it exists.
 */
View.prototype.renderNextNode = function() {
	var currentNode = this.getProject().getNodeByPosition(this.getCurrentPosition());
	if(!currentNode){
		currentNode = this.getProject().getRootNode();
	}
	
	if (this.navigationLogic == null) {
		this.notificationManager.notify("No Navigation Logic.", 1);
	}
	
	//if current node is note, we are leaving and should 'close' note panel
	if(currentNode.type=='NoteNode'){
		this.eventManager.fire('closeDialog','notePanel_' + currentNode.id);
	}
	
	//get the current location
	var location = this.getCurrentPosition();
	
	var nextNodeLoc = this.navigationLogic.getNextVisitableNode(location);
	if (nextNodeLoc == null) {
		/*
		 * there is no next node or the student is not allowed to visit
		 * any future nodes (perhaps because of navigation constraints)
		 */ 
		this.notificationManager.notify("nextNode does not exist", 1);
		
		/*
		 * try to obtain the next node in the project and try to render
		 * it so that if the next node is actually being blocked by a
		 * constraint, we will display the constraint message
		 */
		var nextNode = this.navigationLogic.getNextStepNodeInProject(location);
		
		//check if there is a next node in the project
		if(nextNode != null) {
			/*
			 * we will try to render the next node in the project, this
			 * is just to trigger the constraint message, the node will
			 * not actually be rendered because it is not visitable.
			 * we may run into issues with trying to trigger the constraint
			 * message from nodes that the student isn't ever supposed
			 * to visit if in the future we utilize branching.
			 */
			eventManager.fire("renderNode", nextNode);
		}
	} else {
		this.eventManager.fire('renderNode', nextNodeLoc);
	}
};

/**
 * Adds a constraint on navigation built from the given options object.
 * 
 * @param object- opts
 */
View.prototype.addNavigationConstraint = function(opts){
	if(this.navigationLogic && opts){
		this.navigationLogic.addConstraint(opts);
	}
};

/**
 * Removes the constraint with the given id.
 * 
 * @param string - constraintId
 */
View.prototype.removeNavigationConstraint = function(constraintId){
	this.navigationLogic.removeConstraint(constraintId);
};

/**
 * Adds the given constraints from the just loaded project into the
 * navigation and sets up any branching node constraints.
 */
View.prototype.processConstraintsOnProjectLoad = function(){
	/* get the constraints from the project */
	var constraints = this.getProject().getConstraints().slice();
	
	/* iterate through the constraints and add to the navigation logic */
	for(var c=0;c<constraints.length;c++){
		this.navigationLogic.addConstraint(constraints[c]);
	}
	
	/* loop through all of the project nodes used in the project and create
	 * the constraints needed for any of the branch nodes */
	var projectNodes = this.getProject().getDescendentNodeIds(this.getProject().getRootNode().id);
	for(var d=0;d<projectNodes.length;d++){
		var currentNode = this.getProject().getNodeById(projectNodes[d]);
		if(currentNode.getType()=='BranchNode'){
			var bNodeContent = currentNode.getContent().getContentJSON();
			
			/* get all branch node ids and set up notvisitablex constraints for all of them, add
			 * the created constraintNodeIds to the content for use when constraints need to be lifted,
			 * we need to keep track of the created constraints and ids because if an activity or step
			 * is specified for more than one branch, we do not want to create multiple constraints because
			 * then the student won't be able to navigate to it */
			var nodeIdsToConstraintIds = {};
			for(var e=0;e<bNodeContent.branches.length;e++){
				var currentBranch = bNodeContent.branches[e];
				currentBranch.constraintIds = [];
				for(var f=0;f<currentBranch.branchIds.length;f++){
					/* check to see if we already created a constraint for this node id in another
					 * branch, if so, we only need to add the existing constraint id */
					if(nodeIdsToConstraintIds[currentBranch.branchIds[f]]){
						currentBranch.constraintIds.push(nodeIdsToConstraintIds[currentBranch.branchIds[f]]);
					} else {
						var cId = currentNode.utils.generateKey(20);
						var mode = (this.getProject().getNodeById(currentBranch.branchIds[f]).isSequence() ? 'sequenceAll' : 'node');
						currentBranch.constraintIds.push(cId);
						this.navigationLogic.addConstraint({type:'NotVisitableXConstraint', x:{id:currentBranch.branchIds[f], mode:mode},status:2, menuStatus:2, id:cId});
						nodeIdsToConstraintIds[currentBranch.branchIds[f]] = cId;
					}
				}
			}
		}
	}
	
	/* have the navigation update its constraints and set variables that
	 * complete its loading checking the mode to ensure that the constraints
	 * from the state have also been loaded if required for that mode */
	this.isProjectConstraintProcessingComplete = true;
	
	/* if the config mode is run, then we want to process state
	 * constraints (which will set the navigation loading complete),
	 * otherwise, we just want to set navigation loading complete */
	if(this.config.getConfigParam('mode')=='run'){
		this.processStateConstraints();
	} else {
		this.isNavigationComponentLoaded = true;
		this.eventManager.fire('navigationLoadingComplete');
	}
};

/**
 * If/When state is loaded, checks the state to see if any dynamically created
 * constraints need to be re-created.
 */
View.prototype.processStateConstraints = function(){
	if(this.navigationLogic){
		this.navigationLogic.constraintManager.processStateConstraints();
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_navigation.js');
}