// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @namespace

  My cool new app.  Describe your application.

  @extends SC.Object
*/
MySystem = SC.Application.create(
  /** @scope MySystem.prototype */ {

  NAMESPACE: 'MySystem',
  VERSION: '0.1.0',

  // TODO: Add global constants or singleton objects needed by your app here.
  // MySystem.linkColorChooser = null;
  canvasView: null,
  NOVICE_STUDENT: 'novice',
  ADVANCED_STUDENT: 'advanced',

  /**
    Callback provided so that external applications, like WISE4, can let MySystem know to read the student state from
    the DOM element used for inter-iframe communication with MySystem.
  */
  updateFromDOM: function () {
    SC.run( function () {
      // debugger;
      var data = SC.$('#my_system_state').text();
      if(data.trim().length === 0){
        // there is no data in the dom
        return;
      }
      MySystem.store.setStudentStateDataHash( JSON.parse(data ));
    });
  }
});

// Binding transform that takes the first element of an array and returns it, iff the element is of the specified type
SC.Binding.firstIfType = function (type) {
  return this.transform(function (value, binding) {
    var first;
    
    if (value && (first = value.firstObject()) && first.kindOf(type)) {
      return first;
    } 
    else {
      return null;
    }
  });
};

SC.Record.reopen({
  unknownProperty: function (key, value) {
    var name = this.toString ? this.toString() : "(an object)";
    
    if ('undefined' === typeof value) {
      if (key.length > 0) console.error("%s accessed unknown property '%s'", name, key);
    }
    else {
      console.error("%s set unknown property '%s' to value ", name, key, value.toString ? value.toString() : value);
    }
    
    sc_super();
  }
});      
