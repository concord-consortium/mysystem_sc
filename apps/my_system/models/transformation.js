// ==========================================================================
// Project:   MySystem.Transformation
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  The Transformation model is used to indicate a way in which a Node may 
  change energy (as shown by out-links being different types than in-links).
  A Transformation is associated with a Node by necessity, and (depending on
  diagram settings) may have any number of in-links and out-links, with the
  restraint that all the in-links and all the out-links must be the same
  color; it may also be required that the in-links and out-links be different
  colors.

  The Transformation also has an Annotation, which is a StorySentence.

  A Transformation with no StorySentence is "un-annotated"; a transformation
  with a StorySentence is "annotated."

  An incomplete Transformation--that is, one missing either in-links or 
  out-links--is a "potential" Transformation, indicating that a node *may*
  transform energy this way, even if it isn't actually doing so in this
  diagram.

  @extends SC.Record
  @version 0.1
*/
MySystem.Transformation = SC.Record.extend(
/** @scope MySystem.Transformation.prototype */ {

  node: SC.Record.toOne("MySystem.Node", {
    inverse: "transformations",
    isMaster: NO
  }),
  
  annotation: SC.Record.toOne("MySystem.StorySentence", {
    inverse: "transformation",
    isMaster: YES
  }),

  // The color of allowed in-links for this transformation
  inLinkColor: SC.Record.attr(String), 
  // The color of allowed out-links for this transformation
  outLinkColor: SC.Record.attr(String),
  // N.B. the links themselves aren't directly associated with the transformation;
  // rather, they're associated "through" the node

  // The in- and out-links are going to be the respective in- and out-links of the 
  // node which have the correct color for this transformation.
  inLinks: function() {
    var _links = [];
    var node = this.get('node');
    node.get('inLinks').forEach( function (item, index, enumerable) {
      if (item.get('color') == this.inLinkColor) {
        _links.pushObject(item);
      }
    });
    return _links;
  }.property(),
  
  outLinks: function() {
    var _links = [];
    var node = this.get('node');
    node.get('outLinks').forEach( function (item, index, enumerable) {
      if (item.get('color') == this.outLinkColor) {
        _links.pushObject(item);
      }
    });
    return _links;
  }.property(),

  isAnnotated: function() {
    if (this.annotation) {
      return YES;
    } else {
      return NO;
    }
  }.property("annotation").cacheable(),

  isComplete: function() {
    var _complete = YES;
    if (!this.get('node')) {
      _complete = NO;
    } else if (this.get('inLinks').get('length') < 1) {
      _complete = NO;
    } else if (this.get('outLinks').get('length') < 1) {
      _complete = NO;
    }
    return _complete;
  }.property("node", ".inLinks.[]", ".outLinks.[]").cacheable()
}) ;

MySystem.Transformation.GuidCounter = 0;
MySystem.Transformation.newGuid = function() { return "trans" + MySystem.Transformation.GuidCounter++;};