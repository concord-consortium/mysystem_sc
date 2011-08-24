// ==========================================================================
// Project:   MySystem.activityController
// Copyright: ©2011 Concord Consortium
// ==========================================================================

/*globals MySystem */

/** 
  @class

  Description:
  ------------
  Tracks the current activity.

  @extends SC.ObjectController
  @author Noah Paessel <knowuh@gmail.com>
*/


MySystem.activityController = SC.ObjectController.create({
  
  runDiagramRules: function() {
    var rules               = MySystem.activityController.get('diagramRules'),
        minimumRequirements = MySystem.activityController.get('minimumRequirements'),
        nodes               = MySystem.store.find(MySystem.Node),
        suggestions         = [];

    var reqFails = 0;
    minimumRequirements.forEach( function(rule) {
      if (!rule.check(nodes)) {
        reqFails++;
      }
    });

    // abort if any of the minimum requirement rules fails
    if (reqFails > 0) {
      suggestions.pushObject(this.get('minimumRequirementsFeedback'));
      return suggestions;
    }

    rules.forEach( function (rule) {
      if (!rule.check(nodes)) {
        suggestions.pushObject(rule.get('suggestion'));
      }
    });

    var maxFeedback = this.get('maxFeedbackItems');

    if (maxFeedback && maxFeedback > 0 && suggestions.length > maxFeedback) {
      return suggestions.slice(0,maxFeedback);
    }
    return suggestions;
  }
  
}) ;

