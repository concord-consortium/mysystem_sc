// ==========================================================================
// Project:   MySystem.SankeyView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
// for some reason we have to assign the Sankey object to the sankey global,
// or the library gets messed up...
var sankey = null;

MySystem.SankeyPane = SC.PalettePane.design(
/** @scope MySystem.SankeyView.prototype */ {
  layout: { top: 5, left: 5, right: 5, bottom: 5 },
  isModal: YES,
  isAnchored: YES,

  contentView: SC.View.design({
    layout: {top: 5, left: 5, right: 5, bottom: 5 },
    displayProperties: 'isVisibleInWindow layout',

    childViews: "closeButton".w(),

    closeButton: SC.ButtonView.design({
      layout: { right: 0, top: 0, width: 60, height: 25 },
      title: "Close",
      action: function() {
        this.getPath('parentView.parentView').remove();
      }
    }),

    render: function(context, firstTime) {
      sc_super();
      context.begin().attr('id', 'sankey').styles({left: 5, right: 65, top: 0, bottom: 0, position: "absolute"}).end();
    }

  }),

  drawSankey: function() {
    sankey = new Sankey();
    var stacks = [[],[],[]];
    var links = [];
    var diagrammables = MySystem.nodesController.get('content');
    var i;
    for (i = 0; i < diagrammables.get('length'); i++) {
      var obj = diagrammables.objectAt(i);
      if (obj instanceof MySystem.Node) {
        var ins = obj.getPath('inLinks.length');
        var outs = obj.getPath('outLinks.length');
        if (ins === 0) {
          if (!!stacks[0]) { stacks[0].push(obj.get('id')); }
          else { stacks[0] = [obj.get('id')]; }
        } else if (outs === 0) {
          if (!!stacks[2]) { stacks[2].push(obj.get('id')); }
          else { stacks[2] = [obj.get('id')]; }
        } else {
          if (!!stacks[1]) { stacks[1].push(obj.get('id')); }
          else { stacks[1] = [obj.get('id')]; }
        }
      } else if (obj instanceof MySystem.Link) {
        // FIXME: Create a link and push it onto the stack
        var link = [obj.getPath('startNode.id'),10,obj.getPath('endNode.id')];
        links.push(link);
      }
    }

    for (i = 0; i < stacks.length; i++) {
      if (!!stacks[i] && stacks[i].length > 0) {
        sankey.stack(i, stacks[i]);
      }
    }
    sankey.setData(links);
    sankey.draw();
  }
});
