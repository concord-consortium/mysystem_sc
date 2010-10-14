// ==========================================================================
// Project:   MySystem.Terminal
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
MySystem.Terminal = SC.View.extend(LinkIt.Terminal, {

  layout: { left: 45, top: +5, width: 10, height: 10 },

  linkClass: 'MySystem.Link',

  // Validate if links can originate from this terminal
  canDragLink: function() {
    return YES;
  }, 

  // Validate if the currently-being-created link may end at this terminal
  canDropLink: function() {
    return YES;
  }
});

