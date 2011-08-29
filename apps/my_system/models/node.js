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
  description: SC.Record.attr(String),
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

  terminals: ['a', 'b'],

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

  orderedInLinks: function() {
    var inLinks = this.get('inLinks').toArray();
    return inLinks.sort(this._linkOrderSort);
  }.property('inLinks'),

  orderedOutLinks: function() {
    var outLinks = this.get('outLinks').toArray();
    return outLinks.sort(this._linkOrderSort);
  }.property('outLinks'),

  _linkOrderSort: function(a, b) {
    // if we're the same energy type, sort by weight, descending
    var aEn = a.get('energyTypeObj');
    var bEn = b.get('energyTypeObj');
    if (aEn == bEn) {
      return (b.get('weight') - a.get('weight'));
    } else {
      var enTypes = MySystem.activityController.get('energyTypes');
      var aIdx = enTypes.indexOf(aEn);
      var bIdx = enTypes.indexOf(bEn);
      return aIdx - bIdx;
    }
  }
});
