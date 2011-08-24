/**
 * The core that is common to all views
 */

/**
 * Loads a project into the view by creating a content object using the
 * given url and passing in the given contentBase and lazyLoading as
 * parameters to the project.
 * 
 * @param url
 * @param contentBase
 * @param lazyLoading
 */
View.prototype.loadProject = function(url, contentBase, lazyLoading){
	/* success called when project metadata exists, create project meta content and load project according
	 * to lastEdited and lastMinified times if specified in metadata file */
	var success = function(t,x,o){
		/* parse the text response and set the projectMetadata as JSON */
		var metaContent = createContent();
		metaContent.setContent(t);
		o.projectMetadata = metaContent.getContentJSON();
		
		// if o.projectMetadata is undefined, it means project metadata doesn't exist. Load project normally.
		if (!o.projectMetadata) {
			failure(t,o);
			return;
		}
		
		//set the max scores
		var maxScores = o.projectMetadata.maxScores;
		
		if(maxScores == null || maxScores == "") {
			//there are no max scores so we will just use an empty JSON array
			maxScores = "[]";
		}
		
		//parse and set the max scores to the this.maxScores variable
		o.processMaxScoresJSON(maxScores);
		
		/* get the lastEdited and lastMinified times */
		var lastEdited = o.projectMetadata.lastEdited;
		var lastMinified = o.projectMetadata.lastMinified;
		
		/* if both lastEdited and lastMinified exist and it was minified more recently
		 * than edited, then load minified project file, otherwise load project file normally */
		if(lastEdited && lastMinified && (lastEdited < lastMinified) && !(o.name=='authoring' || o.name=='vle')){
			eventManager.fire('loadingProjectStart');
			
			try {
				//try to load the minified project
				o.project = createProject(createContent(url), contentBase, lazyLoading, o, createContent(url.replace(/\.project(.*)\.json/,'.project-min$1.json')));	
			} catch(err) {
				/*
				 * we failed to load the minified project so we will fall back to
				 * the regular project
				 */
				o.project = createProject(createContent(url), contentBase, lazyLoading, o);
			}
			
			o.isLoadedProjectMinified = true;
			eventManager.fire('loadingProjectComplete');
		} else {
			eventManager.fire('loadingProjectStart');
			o.project = createProject(createContent(url), contentBase, lazyLoading, o);
			o.isLoadedProjectMinified = false;
			$('#currentProjectContainer').show();
			$('#authoringContainer').show();
			eventManager.fire('loadingProjectComplete');
		};
	};
	
	/* failure will be called if the project meta data file does not exist, so load project normally */
	var failure = function(t,o){
		o.eventManager.fire('loadingProjectStart');
		o.project = createProject(createContent(url), contentBase, lazyLoading, o);
		o.isLoadedProjectMinified = false;
		o.eventManager.fire('loadingProjectComplete');
	};
	
	//check if we have loaded the project metadata before
	if(this.projectMetaData == null) {
		//we have not loaded the project metadata before so we ned to retrieve them
		
		//get the url that we will use to retrieve the metadata
		var projectMetaDataUrl = this.getConfig().getConfigParam('projectMetaDataUrl');
		
		if (projectMetaDataUrl) {
			//get the project id
			var projectId = this.getProjectId();

			//set the params for the request
			var projectMetaDataUrlParams = {
					command:"getProjectMetaData",
					projectId:projectId
			};
			
			//make the request for the project meta data
			this.connectionManager.request('GET',1,projectMetaDataUrl,projectMetaDataUrlParams,success, this, failure);					
		} else {
			// project metadata does not exist and metadataurl is unspecified so start project normally
			this.eventManager.fire('loadingProjectStart');
			this.project = createProject(createContent(url), contentBase, lazyLoading, this);
			this.isLoadedProjectMinified = false;
			this.eventManager.fire('loadingProjectComplete');
		}
	}
};

/**
 * @return the currently loaded project for this view if one exists
 */
View.prototype.getProject = function(){
	return this.project;
};

/**
 * Injects the vle url into the given content and returns it.
 */
View.prototype.injectVleUrl = function(content){
	var loc = window.location.toString();
	var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';

	content = content.replace(/(src='|src="|href='|href=")(?!http|\/)/gi, '$1' + vleLoc);
	return content;
};

/**
 * Given a node id, retrieves the appropriate html content object and returns it.
 */
View.prototype.getHTMLContentTemplate = function(node){
	//get the content template for this node
	var content = node.getHTMLContentTemplate();
	
	return content;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/coreview.js');
};