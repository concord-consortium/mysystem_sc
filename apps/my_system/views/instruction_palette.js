// ==========================================================================
// Project:   MySystem.InstructionPallet
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem SCUI Forms */

/** 
  @class MySystem.InstructionPallet
  @extends SC.View
**/
sc_require('core');

MySystem.InstructionPallet = SC.PalettePane.extend({
  layout: { width: 500, height: 250, right: 200, top: 200 },
  error: false,
  contentView: SC.View.extend({
    classNames: "instruction_palette".w(),
    render: function (context) {
      context.push('<div class="instruction_content">', this.get('instructions'), '</div>');
    },
    update: function (jquery) {
      jquery.find('.instruction_content').text(this.get('instructions'));
    }
  }).design({
    layout: { width: 500, height: 250, right: 0, top: 0 }, 

    displayProperties            : 'instructions instructionPanelWidth instructionPanelHeight'.w(),
    instructionsBinding          : 'MySystem.storyController.content',
    instructionPanelWidthBinding : 'MySystem.storyController.instructionPanelWidth',
    feedbackPanelHeightBinding   : 'MySystem.storyController.instructionPanelHeight',

    adjustSize: function() {
      var parent          = this.get('parentView'),
      instructionPanelWidth  = this.get('instructionPanelWidth'),
      instructionPanelHeight = this.get('instructionPanelHeight');

      parent.adjust('width',  instructionPanelWidth);
      parent.adjust('height', instructionPanelHeight);
      
      this.adjust('width' , instructionPanelWidth);
      this.adjust('height', instructionPanelHeight);

    }.observes('instructionPanelWidth','instructionPanelHeight'),

    childViews: 'closeButton'.w(),

    closeButton: SC.ButtonView.design({
      layout: { width: 100, height: 30, centerX: 0, bottom: 10 }, 
      title : 'close',
      action: 'MySystem.storyController.hideInstructions'
    })
  })
});



