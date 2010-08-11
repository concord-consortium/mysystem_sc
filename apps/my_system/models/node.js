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
  // links: [],
  
  links: function() {
		 var _links = [], 
     // SC.Logger.log('Computing links...');
         link;
         
     var inputs = this.get('inLinks'),
         outputs = this.get('outLinks');
     
     // process inputs
     for (var i = 0, ii = inputs.get('length'); i < ii; i++) {
       link = inputs.objectAt(i);
       if (link) {
         _links.pushObject(link.makeLinkItLink());
       }
     }
     
     // process outputs
     for (i = 0, ii = outputs.get('length'); i < ii; i++) {
       link = outputs.objectAt(i);
       if(link) {
         _links.pushObject(link.makeLinkItLink());
       }
     }
     
    // this.set('links', _links);
     return _links;
   }.property().cacheable(),
   
  init: function () {
    sc_super();
    // setup the links property initially
    // this.invokeLater(this._calculateLinks);
  },
  

  _linkArraysDidChange: function () {
     //SC.Logger.log('_linkArraysDidChange!');
     this.notifyPropertyChange('links');
  }.observes('.outLinks.[]', '.inLinks.[]'),


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
  
  didCreateLink: function (inlink) {
    var tmpHash = MySystem.Link.hashFromLinkItLink(inlink);
    var link = null,
        links;
        
    var sn = tmpHash.startNode,
        st = tmpHash.startTerminal,
        en = tmpHash.endNode, 
        et = tmpHash.endTerminal;
        
    console.log(
      'didCreateLink: this.id = %s, startNode.id = %s, startTerminal = %s, endNode.id = %s, endTerminal = %s', 
      this.get('id'), sn.get('id'), st, en.get('id'), et);
    
    // funny, we sometimes get new nodes?
    if (SC.none(this.get("guid"))) {
      SC.Logger.warn("No guid found for %@".fmt(this));
      return;
    }
    // add only completed links (both sides are mapped)
    if(sn && st && en && et) {
      tmpHash.text =  'label me';
      tmpHash.color = 'default color';

      var guid = MySystem.Link.newGuid();
      tmpHash.guid = guid;

      if (sn === this) {
         tmpHash.startNode = null;
         tmpHash.endNode = null;
         link = MySystem.store.createRecord(MySystem.Link, tmpHash, guid);
         link.set("startNode",sn);
         link.set("endNode",en);
       }
       else if (en === this) {
         // if we are the end-node let our peer start-node do the object creation ... 
       }
    }
  },
  
  // TODO: this link is probably a proxy object...
  willDeleteLink: function (link) {
    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');
    this.get("outlinks").removeObject(link);
    this.get("inlinks").removeObject(link);
  }

}) ;
