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

MySystem.SubmissionsFeedbackPallet = SC.PalettePane.extend({
  layout: { width: 500, height: 250, right: 200, top: 200 },
  error: false,
  click: function(e) {
    //MySystem.activityController.hideFeedbackPalette();
  },
  contentView: SC.View.extend({
    classNames: "feedbackpaelletcontent".w(),
    render: function (context) {
      context.push('<div class="sumbission_info">', this.get('submissionInfo'), '</div>');
      context.push('<div class="last_feedback">', this.get('lastFeedback'), '</div>');
    },
    update: function (jquery) {
      console.log("update")
      console.log(this.get('submissionInfo'))
      jquery.find('.sumbission_info').text(this.get('submissionInfo'));
      jquery.find('.last_feedback').html(this.get('lastFeedback').split("\n").join("<br/>"));
    }
  }).design({
    layout: { width: 500, height: 250, right: 0, top: 0 }, 
    displayProperties: 'lastFeedback submissionInfo'.w(),
    lastFeedback: 'no Feedback yet',
    lastFeedbackBinding: 'MySystem.activityController.lastFeedback',
    submissionInfoBinding: 'MySystem.activityController.submissionInfo',
    childViews: 'closeButton'.w(),
    closeButton: SC.ButtonView.design({
      layout: { width: 100, height: 30, centerX: 0, bottom: 10 }, 
      title: 'close',
      action: 'MySystem.activityController.hideFeedbackPalette'
    })
  })
});



