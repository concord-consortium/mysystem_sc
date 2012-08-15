// ==========================================================================
// Project:   MySystem.story
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
MySystem.storyController = SC.ObjectController.create(
/** @scope MySystem.story.prototype */ {
  contentBinding: "MySystem.activityController.assignmentText",

  // TODO: Author the instruction panel width size seperately
  // for now this is the same size as the feedback pallet...
  // instructionPanelWidthBinding: "MySystem.activityController.feedbackPanelWidth",
  // instructionPanelHeightBinding: "MySystem.activityController.feedbackPanelHeight",

  instructionPanelWidth: 600,
  instructionPanelHeight: 400,

  // Related to a floating PalettePanel showing last feedback.
  instructionPalette: null,
  showInstructions: function() {
    var palette = this.get('instructionPalette');
    if(!!! palette) {
      palette = MySystem.InstructionPallet.create({});
      this.set('instructionPalette', palette);
    }
    palette.append();
  },

  // TODO: These probably should be moved to their own controller perhaps..
  // Related to a floating PalettePan showing last feedback.
  hideInstructions: function() {
    var palette = this.get('instructionPalette');
    if(palette) {
      palette.remove();
    }
  }
  

}) ;
