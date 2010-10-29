// ==========================================================================
// Project:   MySystem.EnergyFlow
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt */

/** @class

  This object isn't a true model, because it doesn't extend SC.Record and isn't
  in the Store. Instead, objects of this class only exist in memory, for the sake
  of putting nodes on the LinkIt canvas of the Transformation Builder pane.

  @extends SC.Object
  @version 0.1
*/
MySystem.EnergyFlow = SC.Object.extend( LinkIt.Node,
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
        validLinks.pushObject(transformation.makeLinkItLink());
      }
    });
    return validLinks;
  }.property('node.transformations', 'node.inColorMap', 'node.outColorMap'),

  // createLink: function() {
  //
  // }
  // Part of LinkIt Node Contract. Called when a new link created by drag event.
  didCreateLink: function (inlink) {
    var tmpHash = MySystem.Transformation.hashFromLinkItLink(inlink);
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
      var guid = MySystem.Transformation.newGuid();
      tmpHash.guid = guid;

      if (sn === this) {
         tmpHash.startNode = null;
         tmpHash.endNode = null;
         link = MySystem.store.createRecord(MySystem.Transformation, tmpHash, guid);
         link.set("inLinkColor",sn.get('color'));
         link.set("outLinkColor",en.get('color'));
        link.set('node', this.get('node'));
//         MySystem.canvasView.selectLink(link);
        this.propertyDidChange('transformations');
				MySystem.transformationsCanvasView.selectObjects([inlink]);
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
  }
}) ;

MySystem.EnergyFlow.GuidCounter = 100;
MySystem.EnergyFlow.newGuid = function() { return "ef" + MySystem.EnergyFlow.GuidCounter++;};
