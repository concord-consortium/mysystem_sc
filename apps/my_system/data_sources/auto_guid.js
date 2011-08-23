// ==========================================================================
// Project:   MySystem
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

MySystem.AutoGuidRecord = SC.Record.extend();

MySystem.AutoGuidRecord.mixin({
  // I want these to be function on a the class so a record that has this mixed in 
  // can call it
  updateNextId: function(id) {
    if(!this._nextIdIndex){
      this._nextIdIndex = 1;
    }
    
    // check if id matches the id pattern, if so pull out its index
    // and then make sure the nextId is larger than this index
    var pat = new RegExp(this.toString() + "-(\\d+)");
    var result = pat.exec(id);
    
    if (result !== null && result.length > 1){
      var currentIndex = parseInt(result[1], 10);
      if(currentIndex >= this._nextIdIndex){
        this._nextIdIndex = currentIndex + 1;
      }
    }
  },
  
  // format a number with padded zeros
  _formatNumberLength: function(num, length) {
      var r = "" + num;
      while (r.length < length) {
          r = "0" + r;
      }
      return r;
  },
  
  getNextId: function () {
    var index = this._nextIdIndex;
    if (!index) {
      index = 1;
    }
    this._nextIdIndex = index + 1;
    // we pad the number to make sure the ids are sorted by order
    return this.toString() + "-" + this._formatNumberLength(index, 4);
  },
  
  // This is a hack inorder to get the ids to to be automatically created
  // when the store#createRecord is called.  store#createRecord currently does 
  // this:
  //   method = recordType.prototype['primaryKey'].defaultValue
  //   method();
  // nothing is passed to the defaultValue, and 'this' isn't set either
  // by extending the extend method on the class we will access to the new class
  // instance and can setup the defaultValue method with access to the just
  // created sub class.
  extend: function (props) {
    // Call SC.Record's extend method on this, and 'this' is the AutoGuidRecord
    // class
    var newSubclass = SC.Record.extend.apply(this, arguments);

    // fix up the defaultValue of the id since sproutcore is borked
    newSubclass.reopen({
      guid: SC.Record.attr(String, {
        defaultValue: function () {
          return newSubclass.getNextId();
        }
      })
    });

    return newSubclass;
  }
});
