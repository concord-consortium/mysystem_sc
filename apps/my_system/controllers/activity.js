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
    var rules = MySystem.activityController.get('diagramRules'),
        nodes = MySystem.store.find(MySystem.Node),
        suggestions = [];

    rules.forEach( function (rule) {
      if (!rule.check(nodes)) {
        suggestions.pushObject(rule.get('suggestion'));
      }
    });
    
    return suggestions;
  }
  
}) ;

