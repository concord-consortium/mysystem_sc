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
      var data = SC.$('#my_system_state').text();
      MySystem.store.setStudentStateDataHash( JSON.parse(data ));
    });
  },
});
