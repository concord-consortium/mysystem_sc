View.prototype.gradingDispatcher = function(type, args, obj) {
	if(type=='displayGradeByStepGradingPage') {
		obj.displayGradeByStepGradingPage(args[0], args[1]);
	} else if(type=='displayGradeByTeamGradingPage') {
		obj.displayGradeByTeamGradingPage(args[0]);
	} else if(type=='saveScore') {
		obj.checkAndSaveScore(args[0], args[1], args[2], args[3], args[4]);
	} else if(type=='saveComment') {
		obj.saveComment(args[0], args[1], args[2], args[3], args[4], args[5]);
	} else if(type=='saveFlag') {
		obj.saveFlag(args[0], args[1], args[2], args[3], args[4], args[5]);
	} else if(type=='processUserAndClassInfoComplete') {
		obj.getProjectMetaData();
	} else if(type=='gradingConfigUrlReceived') {
		obj.getGradingConfig(args[0]);
	} else if(type=='getGradingConfigComplete') {
		obj.loadProject(args[0], args[1], args[2]);
		obj.initializeSession();
	} else if(type=='loadingProjectComplete') {
		obj.getStudentUserInfo();
		obj.checkAndMinify();
	} else if(type=='getAllStudentWorkXLSExport') {
		obj.getAllStudentWorkXLSExport();
	} else if(type=='getLatestStudentWorkXLSExport') {
		obj.getLatestStudentWorkXLSExport();
	} else if(type=='getIdeaBasketsExcelExport') {
		obj.getIdeaBasketsExcelExport();
	} else if(type=='getProjectMetaDataComplete') {
		obj.getAnnotations();
	} else if(type=='saveMaxScore') {
		obj.saveMaxScore(args[0], args[1]);
	} else if(type=='showScoreSummary') {
		obj.showScoreSummary();
	} else if(type=='filterPeriod') {
		obj.filterPeriod(args[0], args[1]);
	} else if(type=='displayGradeByStepSelectPage') {
		obj.displayGradeByStepSelectPage();
	} else if(type=='displayGradeByTeamSelectPage') {
		obj.displayGradeByTeamSelectPage();
	} else if(type=='displayStudentUploadedFiles') {
		obj.displayStudentUploadedFiles();
	} else if(type=='togglePrompt') {
		obj.togglePrompt(args[0]);
	} else if(type=='refreshGradingScreen') {
		obj.refreshGradingScreen();
	} else if(type=='smartFilter') {
		obj.smartFilter();
	} else if(type=='getAnnotationsComplete') {
		obj.getIdeaBaskets();
	} else if(type=='getIdeaBasketsComplete') {
		obj.initiateGradingDisplay();
	} else if(type=='getStudentWorkComplete') {
		obj.calculateGradingStatistics();
		obj.reloadRefreshScreen();
	} else if(type=='toggleGradingDisplayRevisions') {
		obj.toggleGradingDisplayRevisions(args[0], args[1]);
	} else if(type=='toggleAllGradingDisplayRevisions') {
		obj.toggleAllGradingDisplayRevisions(args[0]);
	} else if(type=='onlyShowFilteredItemsOnClick') {
		obj.onlyShowFilteredItemsOnClick();
	} else if(type=='onlyShowWorkOnClick') {
		obj.onlyShowWorkOnClick();
	} else if(type=='filterStudentRows') {
		obj.filterStudentRows();
	} else if(type=='enlargeStudentWorkText') {
		obj.enlargeStudentWorkText();
	} else if(type=='openPremadeComments') {
		obj.openPremadeComments(args[0], args[1]);
	} else if(type=='selectPremadeComment') {
		obj.selectPremadeComment(args[0]);
	} else if(type=='submitPremadeComment') {
		obj.submitPremadeComment();
	} else if(type=='premadeCommentWindowLoaded') {
		obj.premadeCommentWindowLoaded();
	} else if(type=='addPremadeComment') {
		obj.addPremadeComment(args[0]);
	} else if(type=='deletePremadeComment') {
		obj.deletePremadeComment(args[0], args[1]);
	}
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_dispatcher.js');
};