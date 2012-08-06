// ==========================================================================
// Project: MySystem
// MySystem.RubricScore
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem  */

/** @class MySystem.RubricScore

  Stores students grade for diagram.

  @extends SC.Record
  @version 0.1
*/
MySystem.RubricScore = SC.Record.extend(
/** @scope MySystem.RubricScore.prototype */ {

  timeStamp:      SC.Record.attr(String),  // time of the score
  score:          SC.Record.attr(Number),  // score
  categories:     SC.Record.attr(String),  // rubric categories that were matched

  /**
  An image preview of the diagram in SVG and PNG formats
  **/
  updateScore: function() {
    var data = [], exporter;
    this.set('timeStamp', new Date());
    this.set('score',0);
    this.set('categories',"some,categories seperated by commas?");
  }

});

// we only ever want a single one of these records to exist per student state.
MySystem.RubricScore.LAST_SCORE_ID = "LAST_SCORE_ID";

MySystem.RubricScore.instance = function() {
  var store = MySystem.store;
  var lastScore  = store.find(MySystem.RubricScore,MySystem.RubricScore.LAST_SCORE_ID);
  if (lastScore && (lastScore.get('status') & SC.Record.READY)){
    return lastScore;
  }
  lastScore = store.createRecord( MySystem.RubricScore,
    { timeStamp: new Date() },
    MySystem.RubricScore.LAST_SCORE_ID);
  store.flush();
  store.commitRecords();
  return lastScore;
};

MySystem.RubricScore.score = function(store){
  var score = MySystem.RubricScore.instance(store);
  score.updateScore();
  store.flush();
  store.commitRecords();
};


