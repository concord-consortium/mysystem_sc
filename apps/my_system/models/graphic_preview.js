// ==========================================================================
// Project: MySystem
// MySystem.GraphicPreview
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem LZ77 ImageExporter */

/** @class MySystem.GraphicPreview

  Saves an image preview of the system diagram data.

  @extends SC.Record
  @version 0.1
*/
MySystem.GraphicPreview = SC.Record.extend(
/** @scope MySystem.PaletteItem.prototype */ {

  timeStamp:    SC.Record.attr(String),  // timestamp
  svg:          SC.Record.attr(String),  // svg markup
  png:          SC.Record.attr(String),  // base64 encoded png data (big)

  /**
  An image preview of the diagram in SVG and PNG formats
  **/
  updatePreview: function(feedback) {
    var data = [], exporter;
    this.set('timeStamp', new Date());

    data.push("submit time: " + this.get('timeStamp').toLocaleString());
    if (!!feedback) {
      data.push("No. Sumbits: " + feedback.get('numOfSubmits'));
      data.push("Feedback:    " + feedback.get('feedback'));
    }
    exporter = new ImageExporter(data);
    this.set('svg', escape(new LZ77().compress(exporter.get_svg())));
    // this.set('png', exporter.get_png());
  }

});

// we only ever want a single of these records to exist
MySystem.GraphicPreview.LAST_FEEDBACK_GUID = "LAST_GRAPHIC_PREVIEW";

MySystem.GraphicPreview.instance = function(store) {
  var lastPreview  = store.find(MySystem.GraphicPreview,MySystem.GraphicPreview.LAST_FEEDBACK_GUID);
  if (lastPreview && (lastPreview.get('status') & SC.Record.READY)){
    return lastPreview;
  }
  lastPreview = store.createRecord( MySystem.GraphicPreview,
    { timeStamp: new Date() },
    MySystem.GraphicPreview.LAST_FEEDBACK_GUID);
  store.flush();
  store.commitRecords();
  return lastPreview;
};

MySystem.GraphicPreview.makePreview = function(store){
  var lastFeedback = store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
  var preview = MySystem.GraphicPreview.instance(store);
  preview.updatePreview(lastFeedback);

  // need to flush here otherwise the lastFeedback Record won't be updated in some cases
  // until the end of of the runloop.  At least one case where this can happen and be a problem
  // is when Store#find is called to find this lastFeedback record before it has been created, and then
  // the feedback property is read.  This will cache a null value for the feedback property.
  // then when the createRecord method is called above it will not invalidate that cached null
  // value until flush is called (which normally happens at the end of the runloop)
  store.flush();

  // need to commit here so the changes are pushed into the dom (which is how the are stored)
  // this will also mark the datastore as dirty, so calls then calls to savingController.save
  // will actually save the data.  This is the path that happens in the checkButtonPressed action,
  store.commitRecords();
};
