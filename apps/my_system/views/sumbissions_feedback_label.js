// ==========================================================================
// Project:   MySystem.InspectorPane
// Copyright: ©2010 Concord Consortium 
// under the MIT License (see LICENSE file for more info)
// ==========================================================================
/*globals MySystem SCUI Forms */

/** 
 * @class


  @extends SC.View
*/
sc_require('core');

MySystem.SubmissionsFeedbackLabel = SC.View.extend({
  displayProperties: ['value'],
  classNames: 'sumbissions_feedback_label'.w(),
  click: function(e) {
    MySystem.activityController.showFeedbackPalette();
  },
  render: function (context) {
    context.push("<div id='sumbission_feedback_label'>", this.get('value'), '</div>');
  },
  update: function (jquery) {
    jquery.find('#sumbission_feedback_label').text(this.get('value'));
  }
});

