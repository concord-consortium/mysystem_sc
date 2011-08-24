
View.prototype.promptManager = function() {
	this.view;
};

View.prototype.promptManager.dispatcher = function(type, args, obj) {
	if(type=='stepPromptChanged') {
		obj.updatePrompt();
	}
};

View.prototype.promptManager.insertPrompt = function(view) {
	this.view = view;
	var nodeToPromptRowSize = {
			OpenResponseNode:'35',
			BrainstormNode:'28',
			HtmlNode:'70',
			AssessmentListNode:'10',
			MultipleChoiceNode:'8',
			MatchSequenceNode:'10',
			DataGraphNode:'7',
			MySystemNode:'5',
			SVGDrawNode:'10'
	};
	$('#promptInput').attr('rows', nodeToPromptRowSize[view.resolveType(view.activeNode.type)]);
	$('#promptContainer').append($('#promptDiv').show().detach());
	
	this.view.populatePrompt();
};

View.prototype.promptManager.cleanupPrompt = function() {
	$('body').append($('#promptDiv').hide().detach());
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/components/authorview_prompt.js');
};