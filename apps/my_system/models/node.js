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
  
  // tell LinkIt whether the proposed link is valid
  canLink: function (link) {
    if (!link) return NO;
    
    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');
    
    // Make sure we don't connect to ourselves.
    if (sn === en) return NO;

    // Make sure we don't already have this link.
    if (this._hasLink(link)) return NO;
    
    if ( (st === 'input' && et === 'output') || (st === 'output' && et === 'input')) {
      return YES;
    }
    
    // TODO under what other circumstances would we refuse a link?
    return NO;
  },
    
  // do we already have the proposed new link 'link'?  
  _hasLink: function (link) {
    var links = this.get('links') || [];
    var len = links.get('length');
    var n;
    var linkID = LinkIt.genLinkID(link);
    for (var i = 0; i < len; i++) {
      n = links.objectAt(i);
      if (LinkIt.genLinkID(n) === linkID) {
        return YES;
      }
    }
  },
  
  didCreateLink: function (link) {
    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');
    
    console.log(
      'didCreateLink: this.id = %s, startNode.id = %s, startTerminal = %s, endNode.id = %s, endTerminal = %s', 
      this.get('id'), sn.get('id'), st, en.get('id'), et);
    
    if (sn === this && st === 'output' && et === 'input') {
      var outputs = this.get('outputs');
      outputs.pushObject(en);
    }
    else if (sn === this && st === 'input' && et === 'output') {
      var inputs = this.get('inputs');
      inputs.pushObject(en);
    }
  },
  
  willDeleteLink: function (link) {
    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');
      
    if (et === 'input') {
      var outputs = this.get('outputs');
      outputs.removeObject(en);
    }
    else if (et === 'output') {
      var inputs = this.get('inputs');
      inputs.removeObject(en);
    }  
  }

}) ;
