/*globals MySystem describe it toPass toFail givenRules expect beforeEach afterEach spyOn runs waits waitsFor NO YES*/

// jasmine.pp = function(value) {
//   var stringPrettyPrinter = new jasmine.StringPrettyPrinter();
//   stringPrettyPrinter.format(value);
//   return stringPrettyPrinter.string;
// };

var old_pp = jasmine.pp;
jasmine.pp = function(value) {
  if(value && value.toString) {
    return value.toString();
  }
  return old_pp(value);
};


describe("Nodes", function () {
  // custom matchers:

  var node1, node2, newLinka, newLinkb;

  beforeEach( function () {
    var _outLinks       = function(node)    { return node.get('outLinks').get('length'); } ;
    var _inLinks        = function(node)    { return node.get('inLinks').get('length');  } ;
    var _links          = function(node)    { return _outLinks(node) + _inLinks(node);   } ;
    var _toHaveLinks    = function(howMany) { return _links(this.actual)    === howMany; } ;

    MySystem.setupStore(MySystem);    
    node1    = MySystem.store.createRecord(MySystem.Node, { 'title': 'Test node 2', 'image': '/lightbulb_tn.png', 'transformer': false });
    node2    = MySystem.store.createRecord(MySystem.Node, { 'title': 'Test node 1', 'image': '/lightbulb_tn.png', 'transformer': false });
    newLinkb = MySystem.store.createRecord(MySystem.Link, { 'text': 'Link to test node' });
    newLinkb.set("endNode", node1);
    newLinkb.set("startNode", node2);
    newLinkb.set("endTerminal","a");
    newLinkb.set("startTerminal","b");
    
    newLinka = MySystem.store.createRecord(MySystem.Link, { 'text': 'Link to test node' });
    newLinka.set("startNode", node1);
    newLinka.set("endNode", node2);
    newLinka.set("startTerminal","a");
    newLinka.set("endTerminal","b");
    this.addMatchers({
       toHaveLinks:    _toHaveLinks
    });

  });
  describe("destroy", function() {
    it ("destroying a node, should also destroy its links", function() {
      node1.destroy();
      expect(node2).toBeDefined();
      expect(node2).toHaveLinks(0);
    });
  });
  
});

