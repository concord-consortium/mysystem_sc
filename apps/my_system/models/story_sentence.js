// ==========================================================================
// Project:   MySystem.StorySentences
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.StorySentence = SC.Record.extend(
/** @scope MySystem.StorySentences.prototype */ {

  order: SC.Record.attr(Number),
  bodyText: SC.Record.attr(String),
  nodes: SC.Record.toMany("MySystem.Node", {
    inverse: "sentences", isMaster: NO
  }),
  links: SC.Record.toMany("MySystem.Link", {
    inverse: "sentences", isMaster: NO
  }),
  // The combined list of nodes and links from the diagram
  diagramObjects: function() {
    var _diagram = [],
    nodes = this.get('nodes'),
    links = this.get('links');

    // process nodes
    nodes.forEach( function (item, index, enumerable) {
      this.pushObject(item);
    }, _diagram);

    // process links
    links.forEach( function (item, index, enumerable) {
      this.pushObject(item);
    }, _diagram);

    return _diagram;
  }.property().cacheable(),

  // Update our computed property
  _diagramObjectsDidChange: function() {
    this.notifyPropertyChange('diagramObjects');
  }.observes('.nodes.[]', '.links.[]')

}) ;

MySystem.StorySentence.GuidCounter = 100;
MySystem.StorySentence.newGuid = function() { return "ss" + MySystem.Node.GuidCounter++;};
