// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================

/*globals MySystem  */
MySystem.InstructionView = SC.View.extend({
  childViews: 'assignmentView sankeyButtonView clearButtonView checkButtonView saveButtonView saveStatusView '.w(),
  backgroundColor: '#eeefff',
  
  canCollapse: YES,
  
  assignmentView: SC.LabelView.design({
    valueBinding: 'MySystem.storyController.content',
  
    anchorLocation: SC.ANCHOR_TOP,  
    layout: { top: 5, right: 222, bottom: 5, left: 5 },

    tagName: "div",
    escapeHTML: NO,
    textAlign: SC.ALIGN_LEFT
  }),
  
  sankeyButtonView: SC.ButtonView.design({
    layout: { right: 240, bottom: 10, height: 25, width: 80 },
    title: 'Sankey',
    toolTip: 'Show a sankey representation of your diagram',
    action: 'showSankey'
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
  }),
  
  // this starts out not enabled so people don't think they can actually save
  saveButtonView: SC.ButtonView.design({
    layout: { right: 15, top: 5, height: 25, width: 80 },
    title: 'Save',
    isEnabledBinding: 'MySystem.savingController.enableManualSave',
    toolTip: 'Save your diagram',
    action: 'saveButtonPressed'
  }),
  
  saveStatusView: SC.LabelView.design({
    layout: { right: 100, top: 9, height: 25, width: 120 },
    textAlign: SC.ALIGN_RIGHT,
    valueBinding: 'MySystem.savingController.saveStatusText'
  })
  
});
