// ==========================================================================
// Project:   MySystem.DiagramRule
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals MySystem */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
MySystem.DiagramRule = SC.Record.extend(
/** @scope MySystem.DiagramRule.prototype */ {

  suggestion: SC.Record.attr(String),
  comparison: SC.Record.attr(String),
  number: SC.Record.attr(Number),
  type: SC.Record.attr(String),
  hasLink: SC.Record.attr(Boolean),
  linkDirection: SC.Record.attr(String),
  otherNodeType: SC.Record.attr(String),
  energyType: SC.Record.attr(String),
  
  // FIXME use something better than node for non typed rules
  paletteItem: function (nodeType) {
    if( nodeType == 'node' ) {
      return null;
    }
    
    var query = SC.Query.local(MySystem.PaletteItem, 'title = {title}', { title: nodeType });
    var items = MySystem.store.find(query);
    return items.objectAt(0);
  },
  
  energyTypeObject: function() {
    // the energyType could be null for authored content that was created before energy types
    var energyType = this.get('energyType');
    if( !energyType || energyType == 'any'){
      return null;
    }
    
    var query = SC.Query.local(MySystem.EnergyType, 'label = {label}', { label: energyType });
    var items = MySystem.store.find(query);
    return items.objectAt(0);    
  },
  
  check: function(nodes) {
    var count = this.matches(nodes);
    
    // 'more than', 'less than', 'exactly'
    switch(this.get('comparison')) {
      case 'more than':
        return count > this.get('number');
      case 'less than':
        return count < this.get('number');
      case 'exactly':
        return count == this.get('number');
      default:
        throw "Invalid comparison value for diagram rule.";
    }
  },
  
  checkNode: function(paletteItem, node) {
    if(paletteItem === null){
      return true;
    } else {
      return paletteItem.get('uuid') == node.get('nodeType');
    }
  },
  
  checkLink: function(link, startPaletteItem, endPaletteItem) {
    // check the energyType
    var energyType = this.energyTypeObject();
    if(energyType && energyType.get('uuid') != link.get('energyType')){
      return false;
    }

    return this.checkNode(startPaletteItem, link.get('startNode')) && this.checkNode(endPaletteItem, link.get('endNode'));
  },
  
  matches: function(nodes) {
    var paletteItem = this.paletteItem(this.get('type')),
        n = 0;
    if ( this.get('hasLink')) {
      var otherPaletteItem = this.paletteItem(this.get('otherNodeType')),
          links = MySystem.store.find(MySystem.Link);
      
      switch(this.get('linkDirection')) {
        case '-->':
          links.forEach( function (link) {
            if (link.isComplete() && this.checkLink(link, paletteItem, otherPaletteItem)){
              n++;
            }
          }, this);
          break;
        case '<--':
          links.forEach( function (link) {
            if (link.isComplete() && this.checkLink(link, otherPaletteItem, paletteItem)) {
              n++;
            }
          }, this);
          break;
        case '---':
          links.forEach( function (link) {
            if (link.isComplete() && 
                (this.checkLink(link, paletteItem, otherPaletteItem) || this.checkLink(link, otherPaletteItem, paletteItem))) {
              n++;
            }
          }, this);
          break;
        default:
          throw "Invalid linkDirection value for diagram rule.";
      }
      return n;
    } else {
      if (paletteItem === null) {
        // fast path
        return nodes.get('length');
      } else {
        nodes.forEach( function (node) {
          if (this.checkNode(paletteItem, node)) n++;
        }, this);
        return n;
      }
    }
  }
}) ;
