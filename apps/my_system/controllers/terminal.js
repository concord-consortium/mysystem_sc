// ==========================================================================
// Project:   MySystem
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class terminalController

  @extends SC.ObjectController
*/
MySystem.terminalController = SC.ObjectController.create(
/** @scope MySystem.terminalController.prototype */ {
  
  srcTerminal: null,
  dstTerminal: null,

  setDest: function(terminal) {
    this.set('dstTerminal',terminal);
    MySystem.nodesController.set('dragLinkEndTerminal',terminal);
  },
  
  setSrc: function(terminal) {
    this.set('srcTerminal',terminal);
    MySystem.nodesController.set('dragLinkSrcTerminal',terminal);
    this.setDest(null); // always reset the destination.
  },

  focusOut: function(terminal) {
    if(terminal !== this.get('srcTerminal')) {
      terminal.set('isHovering', NO);
      this.set('dstTerminal',null);
    }
  },

  focusIn: function(terminal){
    terminal.set('isHovering', YES);
    if (this.isDragging()) {
      if(terminal !== this.get('srcTerminal')) {
        this.setDest(terminal);
      }
    }
  },

  dragStart: function(terminal){
    this.setSrc(terminal);
  },

  dragComplete: function() {
    var srcTerminal = this.get('srcTerminal');
    var dstTerminal = this.get('dstTerminal');
    if (!!dstTerminal) {
      // TODO: move this state actions here?
      MySystem.statechart.sendAction('rubberbandLinkComplete');
    } else {
      MySystem.statechart.sendAction('rubberbandLinkAbandoned');
    }
    if (!!srcTerminal) {
      srcTerminal.set('isLineDrag',NO);
      srcTerminal.set('isHovering',NO);
      this.setSrc(null);
    }
  },

  isDragging: function() {
    return (this.get('srcTerminal') !== null);
  }.property('srcTerminal')

}) ;
