// ==========================================================================
// Project:   MySystem.DiagramRule
// Copyright: ©2011 My Concord Consortium
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
  name: SC.Record.attr(String),
  category: SC.Record.attr(String),
  type: SC.Record.attr(String),
  isJavascript: SC.Record.attr(Boolean, { defaultValue: NO }),
  hasLink: SC.Record.attr(Boolean),
  linkDirection: SC.Record.attr(String),
  otherNodeType: SC.Record.attr(String),
  energyType: SC.Record.attr(String),
  javascriptExpression: SC.Record.attr(String),
  not: SC.Record.attr(Boolean, { defaultValue: NO }),

  // FIXME use something better than node for non typed rules
  paletteItem: function (nodeType) {
    if( nodeType == 'node' ) {
      return MySystem.DiagramRule.genericPaletteItem;
    }

    var query = SC.Query.local(MySystem.PaletteItem, 'title = {title}', { title: nodeType });
    var items = MySystem.store.find(query);
    if(items.get('length') > 0){
      return items.objectAt(0);
    } else {
      return null;
    }
  },

  energyTypeObject: function() {
    // the energyType could be null for authored content that was created before energy types
    var energyType = this.get('energyType');
    if( !energyType || energyType == 'any'){
      return MySystem.DiagramRule.genericEnergyType;
    }

    var query = SC.Query.local(MySystem.EnergyType, 'label = {label}', { label: energyType });
    var items = MySystem.store.find(query);
    if(items.get('length') > 0){
      return items.objectAt(0);
    } else {
      return null;
    }
  },

  check: function(nodes,evaluator) {
    if (this.get('isJavascript')) {
      return (this.js_check(nodes,evaluator));
    }
    var count = this.matches(nodes);

    // 'more than', 'less than', 'exactly'
    var passes;

    switch(this.get('comparison')) {
      case 'more than':
        passes = count > this.get('number');
        break;
      case 'less than':
        passes = count < this.get('number');
        break;
      case 'exactly':
        passes = count == this.get('number');
        break;
      default:
        throw "Invalid comparison value for diagram rule.";
    }

    if (this.get('not')){
      return !passes;
    }
    return passes;
  },

  checkNode: function(paletteItem, node) {
    if (paletteItem === null){
      // the paletteItem couldn't be found this is a error in the diagram rule
      // it would probably be best to add some special note to the feedback
      return false;
    } else if(paletteItem === MySystem.DiagramRule.genericPaletteItem){
      return true;
    } else {
      return paletteItem.get('uuid') == node.get('nodeType');
    }
  },

  checkLink: function(link, startPaletteItem, endPaletteItem) {
    // check the energyType
    var energyType = this.energyTypeObject();
    if(!energyType){
      return false;
    }

    if((energyType != MySystem.DiagramRule.genericEnergyType ) && (energyType.get('uuid') != link.get('energyType'))){
      return false;
    }

    return this.checkNode(startPaletteItem, link.get('startNode')) && this.checkNode(endPaletteItem, link.get('endNode'));
  },


  // returns = true if we passed
  // nodes is the list of nodes to check
  // evaluator is the rule_controller, which has helper methods.
  js_check: function (nodes, evaluator) {
    var self       = this;
    var javascript = this.get("javascriptExpression");
    var ruleName   = this.get('name');
    var Rules      = evaluator;
    var diagram    = evaluator;
    var name       = ruleName;
    var result     = false;

    var errorMsg = "Rule Evaluation Error: rule# %@:\n%@";
    (function(){
      try {
        eval(javascript);
      }
      catch(e) {
        errorMsg = errorMsg.fmt(ruleName, e);
        if (console && typeof console.log == 'function') {
          console.log(errorMsg);
        }
        alert(errorMsg);
      }
    }).call(self);
    return result;
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
        return false;
      } else if(paletteItem === MySystem.DiagramRule.genericPaletteItem) {
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
MySystem.DiagramRule.genericPaletteItem = "genericPaletteItem";
MySystem.DiagramRule.genericEnergyType  = "genericEnergyType";
