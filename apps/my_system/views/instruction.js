// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================

/*globals MySystem  */
MySystem.InstructionView = SC.View.extend({
  childViews: 'assignmentView checkButtonView'.w(),
  backgroundColor: '#eeefff',
  
  canCollapse: YES,
  
  assignmentView: SC.LabelView.design({
    valueBinding: 'MySystem.storyController.content',
  
    anchorLocation: SC.ANCHOR_TOP,  
    layout: { top: 5, right: 5, bottom: 5, left: 5 },

    tagName: "div",
    escapeHTML: NO,
    textAlign: SC.ALIGN_LEFT
  }),
  
  checkButtonView: SC.ButtonView.design({
    layout: { right: 15, bottom: 10, height: 20, width: 80 },
    title: 'Check',
    toolTip: 'Check your diagram',
    action: 'checkDiagramAgainstConstraints'
  })
  
});