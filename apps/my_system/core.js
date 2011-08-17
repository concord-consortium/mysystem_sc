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

// add a binding transform to take the first element of an array and return it
SC.Binding.firstOnly = function() {
  return this.transform(function(value, binding) {
    if (!!value) {
      return value.firstObject();
    } else {
      return null;
    }
  });
};
