// ==========================================================================
// Project:   MySystem.Node
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem Forms */

/** @class

  Simple model of a MySystem node.

  @extends MySystem.Diagrammable
  @version 0.1
*/
sc_require('models/diagrammable');

MySystem.Node = MySystem.Diagrammable.extend(
/** @scope MySystem.Node.prototype */ {

  image: SC.Record.attr(String),
  title: SC.Record.attr(String),
  transformer: SC.Record.attr(Boolean, {defaultValue: true }),
  toolTip: SC.Record.attr(String, { defaultValue: null }),

  // uuid taken from the palette item that created this node
  nodeType: SC.Record.attr(String),
  
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

  // For some reason this line was causing the qunit tests to fail when finding nodes
  // perhaps it was related to both sides being listed as 'master'
  // transformations: SC.Record.toMany('MySystem.Transformation', {
  //   inverse: 'node', isMaster: YES
  // }),

  terminals: ['a', 'b'],

  inColorMap: [],
  outColorMap: [],

  init: function () {
    sc_super();
  },
  
  // update our links before destroy
  // fires off notifications to interested parties.
  // NOTE: We can't just grab our link arrays and invoke('destroy') on them, as the links remove themselves 
  // from the arrays and the invoke method doesn't correctly iterate once elements start being removed
  destroy: function() {
    var links = this.get('outLinks').toArray().concat(this.get('inLinks').toArray());
    for (var i = 0, ii = links.length; i < ii; i++){
      links[i].destroy();
    }
    SC.Logger.log("destroy called on ", this);
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
        if (el1 === el2) {
          result.push(el1);
        }
      }
    }
    return result;
  },

  addInLink: function(link) {
    this.get('outLinks').pushObject(link); 
  },

  addOutLink: function(link) {
    this.get('inLinks').pushObject(link);
  },

  // Returns a list of acceptable colors for out-links, null if no restriction
  acceptableOutLinkColors: function() {
    if (MySystem.studentMode === MySystem.ADVANCED_STUDENT) {
      return null;  // Advanced students can create any kind of link they want
    } else if (MySystem.studentMode === MySystem.NOVICE_STUDENT) {
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
    if (MySystem.studentMode === MySystem.ADVANCED_STUDENT) {
      return null;
    } else if (MySystem.studentMode === MySystem.NOVICE_STUDENT) {
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
    // SC.Logger.log("colorObjects, newNode=" + newNode);
    inLinkColors.forEach( function (item) {
      var newColorNode = MySystem.EnergyFlow.create( { color: item, side: 'in', position: { x: 10, y: height }, node: newNode, guid: MySystem.EnergyFlow.newGuid() } );
      // SC.Logger.log("colorObjects pushing " + newColorNode.get('node'));
      colors.pushObject( newColorNode );
      newNode.get('inColorMap')[item] = newColorNode;
      height = height + 25;
    });
    height = 15;
    var outLinkColors = this.uniqueColors(this.get('outLinkColors'));
    newNode = this;
    outLinkColors.forEach( function (item) {
      var newOutNode = MySystem.EnergyFlow.create( { color: item, side: 'out', position: { x: 450, y: height }, node: newNode, guid: MySystem.EnergyFlow.newGuid() } ) ;
      // SC.Logger.log("colorObjects pushing " + newOutNode.get('node'));
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

  transformationsAreAllAnnotated: function() {
    var _areAnnotated = YES;
    this.get('transformations').forEach( function (item, index, enumerable) {
      if (!item.get('isAnnotated') === NO) {
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
      if (transformation.get('outLinkColor') === color) {
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
      if (link.get('color') === color) {
        return YES;
      }
    }
    return NO;
  }
});
