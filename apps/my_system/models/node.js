// ==========================================================================
// Project:   MySystem.Node
// Copyright: ©2010 Concord Consortium
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
  transformer: SC.Record.attr(Boolean, {defaultValue: true }),
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
    })
    /* Temporarily removed for Berkeley 0.1 release */
    // Forms.FormView.row(SC.CheckboxView, {
    //   fieldKey: 'transformer',
    //   fieldLabel: 'Transformer?'
    // })
  ],

  inColorMap: [],
  outColorMap: [],

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
  }.property('.outlinks.[]', '.inLinks.[]'),    // FIXME this is not valid (at least in this version of SproutCore)
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

  // returns the intersection of two arrays, with null indicating a "universal" array
  intersection: function(array1, array2) {
    if (array1 === null) return array2;
    if (array2 === null) return array1;
    var result = [];
    // Both non-null
    for (var i = 0; i < array1.length; i += 1) {
      var el1 = array1[i];
      for (var j = 0; j < array2.length; j += 1) {
        var el2 = array2[j];
        if (el1 == el2) {
          result.push(el1);
        }
      }
    }
    return result;
  },

  // tell LinkIt whether the proposed link is valid
  canLink: function (link) {
    // console.log(this+".canLink("+link+")");
    if (!link) return NO;

    var sn = link.get('startNode'), 
        st = link.get('startTerminal');
    var en = link.get('endNode'), 
        et = link.get('endTerminal');

    // Only accept links from nodes
    if (!sn.instanceOf(MySystem.Node) || !en.instanceOf(MySystem.Node)) return NO;

    // Make sure we don't connect to ourselves.
    if (sn === en) return NO;

    // Make sure we don't already have this link.
    if (this._hasLink(link)) return NO;

    /* Temporarily removed for Berkeley 0.1 release */
    // var outColors = sn.acceptableOutLinkColors();
    // var inColors = en.acceptableInLinkColors();
    // var acceptableColors = this.intersection(inColors, outColors);
    // if (acceptableColors !== null && acceptableColors == []) {
    //   return NO;
    // }

    // Input-to-output terminal matching
    // if ( (st === 'input' && et === 'output') || (st === 'output' && et === 'input')) {
    //   return YES;
    // }
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
         // link.set('color', MySystem.linkColorChooser.get('content'));
         MySystem.canvasView.selectLink(link);
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

  // Returns a list of acceptable colors for out-links, null if no restriction
  acceptableOutLinkColors: function() {
    if (MySystem.studentMode == MySystem.ADVANCED_STUDENT) {
      return null;  // Advanced students can create any kind of link they want
    } else if (MySystem.studentMode == MySystem.NOVICE_STUDENT) {
      if (this.get('transformer')) {
        return null;
      }
      if (this.get('inLinks').get('length') === 0) {
        return null;
      }
      var colors = [];
      var inLinks = this.get('inLinks');
      var l = inLinks.get('length');
      for (var i = 0; i < l; i += 1) {
        var link = inLinks.objectAt(i);
        colors.push(link.get('color'));
      }
      return colors;
      // return this.get('inLinks').map(function(link) { link.get('color'); });
    } else {
      SC.Logger.warn('Invalid student mode ' + MySystem.studentMode);
      return null;
    }
  },

  // Returns a list of acceptable colors for in-links, null if no restriction
  acceptableInLinkColors: function() {
    if (MySystem.studentMode == MySystem.ADVANCED_STUDENT) {
      return null;
    } else if (MySystem.studentMode == MySystem.NOVICE_STUDENT) {
      if (this.get('transformer')) {
        return null;
      }
      if (this.get('outLinks').get('length') === 0) {
        return null;
      }
      var colors = [];
      var outLinks = this.get('outLinks');
      var l = outLinks.get('length');
      for (var i = 0; i < l; i += 1) {
        var link = outLinks.objectAt(i);
        colors.push(link.get('color'));
      }
      return colors;
      // return this.get('outLinks').map(function(link) { link.get('color'); });
    } else {
      SC.Logger.warn('Invalid student mode ' + MySystem.studentMode);
      return null;
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
  }.property('.outlinks.[]', '.inLinks.[]'),          // FIXME this is not valid SC!

  // Returns an array of colors of all in-links to the node.
  inLinkColors: function() {
    return this.get('inLinks').getEach('color');
  }.property('.inLinks.[]'),                          // FIXME this is not valid SC!

  // Returns an array of colors of all out-links from the node.
  outLinkColors: function() {
    return this.get('outLinks').getEach('color');
  }.property('.inLinks.[]'),                         // FIXME this is not valid SC! (plus it should be 'outlinks' not 'inlinks', yes?

  colorObjects: function() {
    var colors = [], height = 15;
    var inLinkColors = this.uniqueColors(this.get('inLinkColors'));
    var newNode = this;
    // console.log("colorObjects, newNode=" + newNode);
    inLinkColors.forEach( function (item) {
      var newColorNode = MySystem.EnergyFlow.create( { color: item, side: 'in', position: { x: 10, y: height }, node: newNode, guid: MySystem.EnergyFlow.newGuid() } );
      // console.log("colorObjects pushing " + newColorNode.get('node'));
      colors.pushObject( newColorNode );
      newNode.get('inColorMap')[item] = newColorNode;
      height = height + 25;
    });
    height = 15;
    var outLinkColors = this.uniqueColors(this.get('outLinkColors'));
    newNode = this;
    outLinkColors.forEach( function (item) {
      var newOutNode = MySystem.EnergyFlow.create( { color: item, side: 'out', position: { x: 450, y: height }, node: newNode, guid: MySystem.EnergyFlow.newGuid() } ) ;
      // console.log("colorObjects pushing " + newOutNode.get('node'));
      colors.pushObject(newOutNode);
      newNode.get('outColorMap')[item] = newOutNode;
      height = height + 25;
    });
    return colors;
  }.property('.inLinkColors.[]', '.outLinkColors.[]'),      // FIXME this is not valid SC!

  uniqueColors: function(colorArray) {
    var outArray = [];
    colorArray.forEach( function(color) {
      if (outArray.indexOf(color) < 0) {
        outArray.push(color);
      }
    });
    return outArray;
  },

  // Returns an array of in-link colors which are in transformations for this node
  inLinkColorsWithTransformations: function() {
    return this.get('transformations').getEach('inLinkColor');
  }.property('.transformations.[]'),

  // Returns an array of out-link colors which are in transformations for this node
  outLinkColorsWithTransformations: function() {
    return this.get('transformations').getEach('outLinkColor');
  }.property('.transformations.[]'),

  // Checking first out links, then in links, this answers the question:
  // is there at least one link not covered by a defined transformation?
  allLinksHaveTransformations: function() {
    var haveTransformations = true;
    var transformationColors = this.get('outLinkColorsWithTransformations');
    var linkColors = this.get('outLinkColors');
    linkColors.forEach( function (item, index, enumerable) {
      if (transformationColors.indexOf(item) < 0) {
        haveTransformations = false;
      }
    });
    if (haveTransformations) { // Still with us? OK, now check in-links
      transformationColors = this.get('inLinkColorsWithTransformations');
      linkColors = this.get('inLinkColors');
      linkColors.forEach( function (item, index, enumerable) {
        if (transformationColors.indexOf(item) < 0) {
          haveTransformations = false;
        }
      });
    }
    if (haveTransformations) {
      return YES;
    } else {
      return NO;
    }
  }.property(),

  // Controls the transformation icon in the view and its toolTip.
  transformationIcon: function() {
    var transformationCount = this.get('transformations').get('length');
    if (transformationCount > 0) {
      if (this.get('transformationsAreAllAnnotated') && this.get('allLinksHaveTransformations')) {
        this.set('toolTip', 'All transformations are annotated.');
        return sc_static('resources/gotTransformationIcon.png');
      } else {
        this.set('toolTip', 'This node has at least one unexplained link or transformation which needs explanation.');
        return sc_static('resources/transformationNeededIcon.gif');
      }
    } else { // There are no defined transformations
      if (this.get('hasImpliedTransformations')) { // There's an implied transformation - un-annotated if we made it here
        this.set('toolTip', 'This node has at least one unexplained link or transformation which needs explanation.');
        return sc_static('resources/transformationNeededIcon.gif');
      } else {
        this.set('toolTip', null);
        return sc_static('resources/noTransformationNeededIcon.gif');
      }
    }
  }.property(),

  /** Starting here - extraneous code from false trail of transformations which may be re-usable
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
  This is the end of the extra Transformation code **/

  // This function doesn't calculate all possible transformations, or worry about which
  // transformations actually work. It just verifies that a transformation is
  // *possible*, that is, at least one inLink with a different color from at least
  // one outLink.
  // N.B. Not sure this method actually has a use other than defining implied transformations.
  hasImpliedTransformations: function() {
    var inLinks = this.get('inLinks');
    var outLinks = this.get('outLinks');
    if ((inLinks.get('length') < 1) || (outLinks.get('length') < 1)) {
      return NO; // No transformation without both in-flow and out-flow
    } else {
      var _hasTransformation = NO;
      var color = null;
      var inLength = inLinks.get('length');
      var outLength = outLinks.get('length');
      var i, j;
      for (i=0; i<inLength; i++) { // Check each in-link
        color = inLinks.objectAt(i).get('color');
       for (j=0; j<outLength; j++) { // Check against each out-link
          if (color != outLinks.objectAt(j).get('color')) {
            _hasTransformation = YES; // Found one
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
MySystem.Node.newGuid = function() { return "node" + MySystem.Node.GuidCounter++;};
