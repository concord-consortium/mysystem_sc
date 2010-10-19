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
    // var proposedLinkColor = MySystem.linkColorChooser.get('content');
    // if (MySystem.studentMode === MySystem.NOVICE_STUDENT) {
    //   // This block for novice mode
    //   if (this.node.get('transformer')) {
    //     // Transformers may generate any link type
    //     return YES;
    //   }
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so the new link may establish the link type
    //     return YES;
    //   }
    //   if (this.node.get('linkColor') == proposedLinkColor) {
    //     // The proposed link has the right color
    //     return YES;
    //   }
    //   console.log('No link creation here: ' + this.node.get('linkColor') + ' is not ' + proposedLinkColor);
    //   return NO;
    // } else if (MySystem.studentMode === MySystem.ADVANCED_STUDENT) {
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so the new link may establish the link type
    //     return YES;
    //   }
    //   if (this.node.get('linkColor') == proposedLinkColor) {
    //     // The proposed link has the right color
    //     return YES;
    //   }
    //   if (this.node.hasTransformationWithOutgoingColor(proposedLinkColor)) {
    //     return YES;
    //   }
    //   if (this.node.hasIncomingLinksWithColor(proposedLinkColor)) {
    //     return YES;
    //   }
    //   console.log('No link creation here: ' + this.node.get('linkColor') + ' is not ' + proposedLinkColor);
    //   return NO;
    // } else {
    //   console.log("MySystem.studentMode invalid:" + MySystem.studentMode);
    //   return NO;
    // }
    return YES;
  }, 

  // Validate if the currently-being-created link may end at this terminal
  canDropLink: function() {
    // console.log('Checking if links may drop at this terminal');
    // var inboundLinkColor = MySystem.linkColorChooser.get('content');
    // if (MySystem.studentMode == MySystem.NOVICE_STUDENT) {
    //   // This block for novice mode
    //   if (this.node.get('transformer')) {
    //     // Transformers can accept any link
    //     return YES;
    //   }
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so this establishes the energy type
    //     return YES;
    //   }
    //   if (this.node.get('linkColor') == inboundLinkColor) {
    //     // The being-created link has the same color as all those currently in place
    //     return YES;
    //   }
    //   // else
    //   return NO;
    // } else if (MySystem.studentMode == MySystem.ADVANCED_STUDENT) {
    //   if (this.node.get('transformer')) {
    //     // Transformers can accept any link
    //     return YES;
    //   }
    //   if (this.node.get('links').get('length') === 0) {
    //     // There aren't any links yet, so this establishes the energy type
    //     return YES;
    //   }
    //   // if (this.node.get('linkColor') == inboundLinkColor) {
    //   //        // The being-created link has the same color as all those currently in place
    //   //        return YES;
    //   // }
    //   // else
    //   return YES;
    // } else {
    //   console.log("Bad student mode: " + MySystem.studentMode);
    //   return NO;
    // }
    return YES;
  },

  computeDragOperations: function(drag, evt) {
    return this.canDropLink() ? SC.DRAG_LINK : SC.DRAG_NONE;
  }

});

