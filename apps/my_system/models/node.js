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
  
  outLinks: SC.Record.toMany('MySystem.Link',{
    inverse: 'startNode',
    isMaster: YES
  }),
  
  inLinks: SC.Record.toMany('MySystem.Link', {
    inverse: 'endNode',
    isMaster: YES
  }),
  
  terminals: ['a', 'b'],
  
  // We have to maintain this list. Its observed from our mixin: LinkIt.Node 
  links: [],
  
  init: function () {
    sc_super();
    // setup the links property initially
    this.invokeLater(this._calculateLinks);
  },
  

  _linkArraysDidChange: function () {
     console.log('_linkArraysDidChange!');
     this.invokeOnce(this._calculateLinks);
  }.observes('.outLinks.[]', '.inLinks.[]'),

  // method to maintain our links property
  _calculateLinks: function () {
     var _links = [], 
         link;
     var inputs = this.get('inLinks'),
         outputs = this.get('outLinks');
     

     // process inputs
     for (var i = 0, ii = inputs.get('length'); i < ii; i++) {
       link = inputs.objectAt(i);
       if (link) {
         _links.pushObject(link);
       }
     }
     
     // process outputs
     for (i = 0, ii = outputs.get('length'); i < ii; i++) {
       link = outputs.objectAt(i);
       if(link) {
         _links.pushObject(link);
       }
     }
     
    this.set('links', _links);
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
    return YES;
    // TODO under what other circumstances would we refuse a link?
    // return NO;
  },
    
  
  // do we already have the proposed new link 'link'?  
  _hasLink: function (link) {
    var links = this.get("links") || [];
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

    // add only completed links (both sides are mapped)
    if(sn && st && en && et) {
      link.set("text", 'label me');
      link.set("color", 'default color');

      // Add this Link to the datastore if its not there.
      // I think this is required for the inverse part of 
      // the ManyArray.
      if(SC.none(link.get("guid"))) {
        link.set("guid", MySystem.Link.newGuid());
        link = MySystem.store.createRecord(MySystem.Link, link); 
      }
      if (sn === this) {
        this.get('outLinks').pushObject(link);
        SC.Logger.log("this: output %@",this);
      }
      else if (en === this) {
        this.get('inLinks').pushObject(link); 
      }

    }
  },
  
  willDeleteLink: function (link) {
    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');
      
    this.get("outlinks").removeObject(link);
    this.get("inlinks").removeObject(link);
  }

}) ;
