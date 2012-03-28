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
    context.push('<h1>', this.get('value'), '</h1>');
  },
  update: function (jquery) {
    jquery.find('h1').text(this.get('value'));
  }
});

