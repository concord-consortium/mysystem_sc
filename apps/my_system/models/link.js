// ==========================================================================
// Project:   MySystem.Link
// Copyright: ©2010 My Concord Consrtium, Inc.
// ==========================================================================
/*globals MySystem LinkIt SC*/

/** @class 
  
  @extends SC.Record
  @version 0.1
*/
MySystem.Link = SC.Record.extend(

  // Mixing in the weird view / model mixin
  // TODO: break up LinkIt.Link
  LinkIt.Link,

/** @scope MySystem.Link.prototype */ {
  color: SC.Record.attr(String),
  text: SC.Record.attr(String),
  
  startNode: SC.Record.toOne('MySystem.Node', {
    inverse: 'outLinks'
  }),
  
  endNode:  SC.Record.toOne('MySystem.Node', {
    inverse: 'inLinks'
  }),

  label: {
    text: "label",
    fontSize: 12,
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    backgroundColor: "#FFFFFF"
  },
  
  startTerminal: SC.Record.attr(String),
  endTerminal: SC.Record.attr(String),
  
  init: function () {
    sc_super();
    // setup the links property initially
    //this.invokeLater(this._calculateLinks);
  },
  
  _textChanged: function() {
    console.log('_textChanged!');
    this.invokeOnce(this._setLabel);
  }.observes('.text'),
  
  _setLabel: function() {
    var newLabel = {
      text: this.get('text'),
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      backgroundColor: "#FF0000"
    };
    this.set("label", newLabel);
  }
  
}) ;
MySystem.Link.GuidCounter = 100;
MySystem.Link.newGuid = function() { return "link" + MySystem.Link.GuidCounter++;};