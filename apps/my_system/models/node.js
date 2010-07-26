// ==========================================================================
// Project:   MySystem.Node
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  Simple model of a MySystem node.

  @extends SC.Record
  @extends LinkIt.Node
  @version 0.1
*/
MySystem.Node = SC.Record.extend(LinkIt.Node, 
/** @scope MySystem.Node.prototype */ {

  image: SC.Record.attr(String),
  title: SC.Record.attr(String),
  outputs: SC.Record.toMany('MySystem.Node'),
  inputs: SC.Record.toMany('MySystem.Node'),
  
  terminals: ['input', 'output'],
  
  links: [],
  
  init: function () {
    sc_super();
    // setup the links property initially
    this.invokeLater(this._calculateLinks);
  },
  
  _nodeArraysDidChange: function () {
    console.log('_nodeArraysDidChange!');
    this.invokeOnce(this._calculateLinks);
  }.observes('.inputs.[]', '.outputs.[]'),
  
  _calculateLinks: function () {
    var links = [], 
        link;
    var inputs = this.get('inputs'),
        outputs = this.get('outputs');
    
    // process inputs
    for (var i = 0, ii = inputs.get('length'); i < ii; i++) {
      link = SC.Object.create(LinkIt.Link, {
        startNode: inputs.objectAt(i),
        startTerminal: 'output',
        endNode: this,
        endTerminal: 'input'
      });
      links.pushObject(link);
    }
    
    // process outputs
    for (i = 0, ii = outputs.get('length'); i < ii; i++) {
      link = SC.Object.create(LinkIt.Link, {
        startNode: this,
        startTerminal: 'output',
        endNode: outputs.objectAt(i),
        endTerminal: 'input'
      });
      links.pushObject(link);
    }
    
    this.set('links', links);
  },
  
  // TODO implement canLink() method to validate link before creating it.
  
  didCreateLink: function (link) {
    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');
    
    console.log(
      'didCreateLink: this.id = %s, startNode.id = %s, startTerminal = %s, endNode.id = %s, endTerminal = %s', 
      this.get('id'), sn.get('id'), st, en.get('id'), et);
    
    if (sn === this && st === 'output') {
      var outputs = this.get('outputs');
      outputs.pushObject(en);
      //this.set('outputs', outputs);
    }
    if (en === this && et === 'input') {
      var inputs = this.get('inputs');
      inputs.pushObject(sn);
      //this.set('inputs', inputs);
    }
    
  },
  
  willDeleteLink: function (link) {
  }

}) ;
