// ==========================================================================
// Project:   MySystem.Node
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt Forms */

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
  transformer: SC.Record.attr(Boolean),
  toolTip: SC.Record.attr(String, { defaultValue: null }),

  outLinks: SC.Record.toMany('MySystem.Link',{
    inverse: 'startNode',
    isMaster: YES
  }),
  
  inLinks: SC.Record.toMany('MySystem.Link', {
    inverse: 'endNode',
    isMaster: YES
  }),
  
  sentences: SC.Record.toMany('MySystem.StorySentence', {
    inverse: 'nodes', isMaster: NO
  }),

  transformations: SC.Record.toMany('MySystem.Transformation', {
    inverse: 'node', isMaster: YES
  }),

  terminals: ['a', 'b'],

  // return a hash of editable attributes for the property editor
  formFields: [
    // fields: "image title".w(),
    // image: 
    Forms.FormView.row(SC.TextFieldView, {
      fieldKey: 'image',
      fieldLabel: 'Image:'
    }),
    // title: 
    Forms.FormView.row(SC.TextFieldView, {
      fieldKey: 'title',
      fieldLabel: 'Title:'
    }),
    Forms.FormView.row(SC.CheckboxView, {
      fieldKey: 'transformer',
      fieldLabel: 'Transformer?'
    })
  ],

  // We have to maintain this list of links. 
  // Its observed from our mixin: LinkIt.Node 
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
      if (link && link.isComplete()) {
        _links.pushObject(link.makeLinkItLink());
      }
    }

    // process outputs
    for (i = 0, ii = outputs.get('length'); i < ii; i++) {
      link = outputs.objectAt(i);
      if(link && link.isComplete()) {
        _links.pushObject(link.makeLinkItLink());
      }
    }

    // this.set('links', _links);
    return _links;
  }.property('.outlinks.[]', '.inLinks.[]'),
  // The cacheable property was removed because that broke link drawing when we added
  // in transformations.


  init: function () {
    sc_super();
  },
  
  // update our links before destroy
  // fires off notifications to interested parties.
  destroy: function() {
    var outLinks = this.get('outLinks');
    var inLinks = this.get('inLinks');
    outLinks.invoke('destroy');
    outLinks.invoke('destroy');
    this.set('outLinks',[]);
    this.set('inLinks', []);
    SC.Logger.log("destroy called on %@", this);
    sc_super();
  },

  // // manually invalidate our links[] cache.
  // _linkArraysDidChange: function () {
  //    //SC.Logger.log('_linkArraysDidChange!');
  //    this.notifyPropertyChange('links');
  // }.observes('.outLinks.[]', '.inLinks.[]'),


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

  // Part of LinkIt Node Contract. Called when a new link created by drag event.
  didCreateLink: function (inlink) {
    var tmpHash = MySystem.Link.hashFromLinkItLink(inlink);
    var link = null,
        links;

    var sn = tmpHash.startNode,
        st = tmpHash.startTerminal,
        en = tmpHash.endNode, 
        et = tmpHash.endTerminal;

    // funny, we sometimes get new nodes?
    if (SC.none(this.get("guid"))) {
      SC.Logger.warn("No guid found for %@".fmt(this));
      return;
    }
    // add only completed links (both sides are mapped)
    if(sn && st && en && et) {

      var guid = MySystem.Link.newGuid();
      tmpHash.guid = guid;

      if (sn === this) {
         tmpHash.startNode = null;
         tmpHash.endNode = null;
         link = MySystem.store.createRecord(MySystem.Link, tmpHash, guid);
         link.set("startNode",sn);
         link.set("endNode",en);
         link.set('color', MySystem.linkColorChooser.get('content'));
       }
       else if (en === this) {
         // if we are the end-node let our peer start-node do the object creation ... 
       }
    }
  },
  
  // @param link is a LinkIt.Link.
  // we are notified from the LinkIt framework
  willDeleteLink: function (link) {
    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');
    var model_link = link.model;
    if (model_link) {
      var startNode = model_link.get("startNode");
      var endNode = model_link.get("endNode");
      // if we are the startNode then we are responsible for removing the link.
      if (startNode && startNode == this) {
        // SC.Logger.log("removing link %@", model_link);
        startNode.get("outLinks").removeObject(model_link);
        startNode.get("inLinks").removeObject(model_link);
        endNode.get("outLinks").removeObject(model_link);
        endNode.get("inLinks").removeObject(model_link);
        model_link.destroy();
        link = null;
      }
    }
  },

  // Returns the color of links this node can produce and/or accept.
  // If "any", returns null (no links yet, or is a transformer)
  linkColor: function() {
    if (this.get('transformer')) {
      return null;
    }
    if (this.get('links').get('length') === 0) {
      return null;
    }
    return this.get('links').firstObject().get('model').get('color');
  }.property('.outlinks.[]', '.inLinks.[]'),

  // Controls the transformation icon in the view and its toolTip.
  transformationIcon: function() {
    var transformationCount = this.get('transformations').get('length');
    if (transformationCount > 0) {
      if (this.get('transformationsAreAllAnnotated')) {
        this.set('toolTip', 'All transformations are annotated.');
        return sc_static('resources/gotTransformationIcon.png');
      } else {
        this.set('toolTip', 'This node has at least one transformation which needs annotation.');
        return sc_static('resources/transformationNeededIcon.png');
      }
    } else { // There are no transformations
      this.set('toolTip', null);
      return sc_static('resources/noTransformationNeededIcon.gif');
    }
  }.property('.transformationsAreAllAnnotated', '.hasPotentialTransformations'),

  firstUnannotatedTransformation: function() {
    var transformations = this.get('transformations');
    var transformationCount = transformations.get('length');
    if (transformationCount > 0) {
      var _firstUAT;
      for (var i=0; i<transformationCount; i++) { // Need to be able to break;
        if (transformations.objectAt(i).get('isAnnotated') == NO) {
          _firstUAT = transformations.objectAt(i);
          break;
        }
      }
      return _firstUAT; // Transformation or null
    } else {
      return null;
    }
  },

  // The user has created an implied transformation by having different energy flows
  // (link colors) coming in and out of this node. Create any implicit transformations
  // which don't already exist.
  // This should only work if we're allowing users to create flows without pre-specifying
  // the transformations.
  createImplicitTransformation: function() {
    if (this.get('hasImpliedTransformations')) {
      var inLinks = this.get('inLinks');
      var outLinks = this.get('outLinks');
      var transformations = this.get('transformations');
      inLinks.forEach( function (inLink, iterator) {
        var inColor = inLink.get('color');
        SC.Logger.log('Checking ' + inColor + ' in-links...'); // Color appears to be null?
        outLinks.forEach( function (outLink, count) {
          var outColor = outLink.get('color');
          SC.Logger.log('Checking ' + outColor + ' out-links...');
          if (outColor != inColor) {
            SC.Logger.log('Found potential transformation!');
            // Check to see if we already have that transformation
            var isNew = true;
            transformations.forEach( function (trans) {
              if ((trans.get('inLinkColor') == inColor) && (trans.get('outLinkColor') == outColor)) {
                // Yes, we already have that one
                isNew = false;
                SC.Logger.log('We already have that one.');
              }
            });
            if (isNew) {
              // Create the new transformation
              var newGuid = MySystem.Transformation.newGuid();
              SC.Logger.log('Trying to create new transformation with guid ' + newGuid + '...');
              MySystem.store.createRecord(MySystem.Transformation, { 'guid': newGuid, 'node': this, 'inLinkColor': inColor, 'outLinkColor': outColor });
            }
          }
        });
      });
    }
  }.observes('hasImpliedTransformations'),

  // This function doesn't calculate all possible transformations, or worry about which
  // transformations actually work. It just verifies that a transformation is
  // *possible*, that is, at least one inLink with a different color from at least
  // one outLink.
  // N.B. Not sure this method actually has a use other than defining implied transformations.
  hasImpliedTransformations: function() {
    var inLinks = this.get('inLinks');
    var outLinks = this.get('outLinks');
    if ((inLinks.get('length') < 1) || (outLinks.get('length') < 1)) {
      return false; // No transformation without both in-flow and out-flow
    } else {
      var _hasTransformation = false;
      var color = null;
      var inLength = inLinks.get('length');
      var outLength = outLinks.get('length');
      var i, j;
      for (i=0; i<inLength; i++) { // Check each in-link
        color = inLinks.objectAt(i).get('color');
       for (j=0; j<outLength; j++) { // Check against each out-link
          if (color != outLinks.objectAt(j).get('color')) {
            _hasTransformation = true; // Found one
            break; // stop looking at out-links
          }
        }
        if (_hasTransformation) { break; } // If we found one, stop looking at in-links
      }
      return _hasTransformation;
    }
  }.property('.outlinks.[]', '.inLinks.[]'),

  transformationsAreAllAnnotated: function() {
    var _areAnnotated = YES;
    this.get('transformations').forEach( function (item, index, enumerable) {
      if (!item.get('isAnnotated') == NO) {
        _areAnnotated = NO;
      }
    });
    return _areAnnotated;
  }.property("transformations").cacheable(),

  hasTransformationWithOutgoingColor: function(color) {
    var transformations = this.get('transformations');
    var l = transformations.get('length');
    for (var i = 0; i < l; i += 1) {
      var transformation = transformations.objectAt(i);
      if (transformation.get('outLinkColor') == color) {
        return YES;
      }
    }
    return NO;
  },

  hasIncomingLinksWithColor: function(color) {
    var links = this.get('inLinks');
    var l = links.get('length');
    for (var i = 0; i < l; i += 1) {
      var link = links.objectAt(i);
      if (link.get('color') == color) {
        return YES;
      }
    }
    return NO;
  }
});

MySystem.Node.GuidCounter = 100;
MySystem.Node.newGuid = function() { return "Node" + MySystem.Node.GuidCounter++;};
