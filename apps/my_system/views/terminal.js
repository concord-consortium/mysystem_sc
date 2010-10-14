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
    // This block for novice mode
    if (this.node.get('transformer')) {
      // Transformers may generate any link type
      return YES;
    }
    if (this.node.get('links').get('length') === 0) {
      // There aren't any links yet, so the new link may establish the link type
      return YES;
    }
    var proposedLinkColor = 'red'; // FIXME: placeholder until I can check selected color
    if (this.node.get('linkColor') == proposedLinkColor) {
      // The proposed link has the right color
      return YES;
    }
    // TODO: Advanced mode
    // else
    return NO;
  }, 

  // Validate if the currently-being-created link may end at this terminal
  canDropLink: function() {
    // When does this get checked?
    console.log('Checking if links may drop at this terminal');
    // This block for novice mode
    if (this.node.get('transformer')) {
      // Transformers can accept any link
      return YES;
    }
    if (this.node.get('links').get('length') === 0) {
      // There aren't any links yet, so this establishes the energy type
      return YES;
    }
    var inboundLinkColor = 'red'; // FIXME: placeholder to make things work
    if (this.node.get('linkColor') == inboundLinkColor) { // TODO: inboundLinkColor really undefined
      // The being-created link has the same color as all those currently in place
      return YES;
    }
    // else
    return NO;
    // TODO: Advanced mode
  }
});

