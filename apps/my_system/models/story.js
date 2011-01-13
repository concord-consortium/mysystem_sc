// ==========================================================================
// Project:   MySystem.Story
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.Story = SC.Record.extend(
/** @scope MySystem.Story.prototype */ {

  storyHtml: SC.Record.attr(String),

  // return a hash of editable attributes for the property editor
  formFields: [
    // fields: "storyHtml".w(),
    // storyHtml: 
      Forms.FormView.row(SC.TextFieldView, {
      fieldKey: 'storyHtml',
      fieldLabel: 'Story',
      isTextArea: YES
    })
  ]

}) ;
