// ==========================================================================
// Project:   MySystem.EnergyFlow
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This object isn't a true model, because it doesn't extend SC.Record and isn't
  in the Store. Instead, objects of this class only exist in memory, for the sake
  of putting nodes on the canvas of the Transformation Builder pane.

  @extends SC.Object
  @version 0.1
*/
MySystem.EnergyFlow = SC.Object.extend(
/** @scope MySystem.EnergyFlow.prototype */ {

  color: null,
  side: 'in',
  position: {},
  node: null,
  linksKey: 'transformations',
  transformations: function() {
    var nodeTrans = this.get('node').get('transformations');
    var validLinks = [];
    var energyFlow = this;
    nodeTrans.forEach( function (transformation) {
      if ( transformation.get('isComplete') ) {
        validLinks.pushObject(transformation);
      }
    });
    return validLinks;
  }.property('node.transformations', 'node.inColorMap', 'node.outColorMap')

}) ;

MySystem.EnergyFlow.GuidCounter = 100;
MySystem.EnergyFlow.newGuid = function() { return "ef" + MySystem.EnergyFlow.GuidCounter++;};
