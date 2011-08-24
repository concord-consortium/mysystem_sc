/**
 * Dispatches events that are specific to the menu.
 */
View.prototype.menuDispatcher = function(type,args,obj){
	if(type=='loadingProjectComplete'){
		obj.createMenuOnProjectLoad();
	} else if(type=='renderNodeComplete'){
		obj.renderNavigationPanel();
		obj.expandActivity(args[0]);
	} else if(type=='toggleNavigationPanelVisibility'){
		obj.navigationPanel.toggleVisibility();
	} else if(type=='menuExpandAll'){
		obj.myMenu.expandAll();
	} else if(type=='menuCollapseAll'){
		obj.myMenu.collapseAll();
	} else if(type=='menuCollapseAllNonImmediate'){
		obj.collapseAllNonImmediate();
	} else if(type=='toggleMenu'){
		obj.myMenu.toggleMenu(document.getElementById(args[0]));
	} else if(type=='updateNavigationConstraints'){
		obj.updateNavigationConstraints();
	} else if(type=='resizeMenu'){
		obj.resizeMenu();
	}
};

/**
 * Creates and initializes the menu used by this view.
 */
View.prototype.createMenuOnProjectLoad = function(){
	var menuEl = document.getElementById('my_menu');
	
	if(menuEl){
		this.myMenu = new SDMenu('my_menu');
	};
	
	if(typeof this.myMenu != 'undefined'){
		this.myMenu.init();
	};
	
	
	if (this.config != null && this.config.getConfigParam('mainNav') != null) {
		var mainNav = this.config.getConfigParam('mainNav');
		
		if (mainNav == 'none') {
			this.eventManager.fire('toggleNagivationPanelVisibility');
		};
	};
};

/**
 * Renders the navigationPanel. Creates one if one does not yet exist
 */
View.prototype.renderNavigationPanel = function(){
	if(!this.navigationPanel){
		this.navigationPanel = new NavigationPanel(this);	
	};
	this.navigationPanel.render('render');
};

/**
 * Updates the menu constraints.
 */
View.prototype.updateNavigationConstraints = function(){
	/* have the navigation logic update its active constraints */
	if(this.navigationLogic){
		this.navigationLogic.nodeRendered();
	}
	
	/* have the navigation panel update the menu constraints */
	if(this.navigationPanel){
		this.navigationPanel.processConstraints();
	}
};

/**
 * Expands the parent menu of the node with the given id
 */
View.prototype.expandActivity = function(position) {
	var node = this.getProject().getNodeByPosition(position);
	if (node.parent) {
		submenu = document.getElementById(this.getProject().getPositionById(node.parent.id));
		if(submenu){
			//remove the collapsed class from the menu so it becomes expanded
			submenu.className = submenu.className.replace("collapsed", "");
		};
	};
};


/**
 * finds and collapses all nodes except parents, grandparents, etc
 */
View.prototype.collapseAllNonImmediate = function() {
	//obtain all the parents, grandparents, etc of this node
	var enclosingNavParents = this.getEnclosingNavParents(this.getCurrentPosition());
	
	if(enclosingNavParents != null && enclosingNavParents.length != 0 && this.myMenu) {
		//collapse all nodes except parents, grandparents, etc
		this.myMenu.forceCollapseOthersNDeep(enclosingNavParents);	
	};
};

/**
 * Obtain an array of the parent, grandparent, etc. basically the parent,
 * the parent's parent, the parent's parent's parent, etc. so that when
 * the nav menu is displaying a project that is n-levels deep, we know
 * which parents to keep open. We need to keep all of these ancestors
 * open and not just the immediate parent.
 * @param position - the absolute position of the node we are currently on
 * @param enclosingNavParents an array containing all the parents
 * @return the array of ancestors
 */
View.prototype.getEnclosingNavParents = function(position, enclosingNavParents) {
	//initialize the ancestors array
	if(enclosingNavParents == null) {
		enclosingNavParents = new Array();
	};
	
	var ndx = position.lastIndexOf('.');
	if(ndx != -1) {
		var parentPos = position.substring(0, position.lastIndexOf('.'));
		//see if the parent has an element in the nav
		var parentNavElement = document.getElementById(parentPos);
		if(parentNavElement != null) {
			/*
			 * the parent does have an element in the nav so we will add it
			 * to our array of ancestors
			 */
			enclosingNavParents.push(parentNavElement);
		};
		//look for the ancestors of the parent recursively
		return this.getEnclosingNavParents(parentPos, enclosingNavParents);
	} else {
		/*
		 * we have reached to top of the parent tree so we will now
		 * return the ancestor array
		 */
		return enclosingNavParents;
	};
};

/**
 * Toggles the visibility of the navigation panel
 */
View.prototype.toggleNavigationPanelVisibility = function() {
	this.navigationPanel.toggleVisibility();	
};

/**
 * Resizes navigation panel menu box to fit window height
 */
View.prototype.resizeMenu = function() {
	if($('#projectLeftBox').length>0){
		var navHeight = $('#projectLeftBox').height() - $('#hostBrandingBoxUpper').outerHeight() -
			$('#projectLogoBox').outerHeight() - $('#navMenuControls').outerHeight() - 4;
		$('#navigationMenuBox').height(navHeight);
	}
};



/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_menu.js');
}