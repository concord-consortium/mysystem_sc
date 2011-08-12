// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================

/*globals MySystem  */
MySystem.InstructionView = SC.View.extend({
  childViews: 'assignmentView clearButtonView checkButtonView'.w(),
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
  
  clearButtonView: SC.ButtonView.design({
    layout: { right: 150, bottom: 10, height: 25, width: 80 },
    title: 'Clear',
    toolTip: 'Clear everything from your diagram',
    action: 'clearCanvas'
  }),
  
  checkButtonView: SC.ButtonView.design({
    layout: { right: 15, bottom: 10, height: 25, width: 120 },
    title: 'Check Diagram',
    toolTip: 'Check your diagram',
    action: 'checkButtonPressed'
  })
  
});