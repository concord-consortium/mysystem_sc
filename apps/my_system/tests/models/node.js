// ==========================================================================
// Project:   MySystem.Node Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem module test ok equals same stop start */

module("MySystem.Node");



test("test title from fixture", function() {
  var node   = MySystem.store.find('MySystem.Node','1');
  var fixturesTitle = 'A Node';
  equals(node.get('title'),fixturesTitle, "Its title should be '"+ fixturesTitle +"' ");
});

test("test inLinks and outLinks from fixtures", function() {
  var node   = MySystem.store.find('MySystem.Node','1');
  var expectedOutLinks = 2;
  var expectedInLinks = 0;
  var foundOutlinks = node.get('outLinks').get('length');
  var foundInLinks = node.get('inLinks').get('length');
  equals(foundOutlinks, expectedOutLinks, "There should be "+ expectedOutLinks +" outlinks");
  equals(foundInLinks, expectedInLinks, "There should be "+ expectedInLinks +" inLinks");
});

test("test links computed param from fixtures", function() {
  var node   = MySystem.store.find('MySystem.Node','1');
  var foundOutlinks = node.get('outLinks').get('length');
  var foundInLinks = node.get('inLinks').get('length');
  var expectedLinks = foundOutlinks + foundInLinks;
  var foundLinks = node.get('links').get('length');
  equals(foundLinks, expectedLinks, "There should be "+ expectedLinks +" links");
});


test ("test that computed 'links' are updated when inlinks or outlinks changes", function() {
  var nodeA   = MySystem.store.find('MySystem.Node','1');
  var nodeB   = MySystem.store.find('MySystem.Node','2');
  
  var existingLinks = nodeA.get('links').get('length');
  var expectedLinks = existingLinks + 1;  
  
  var linkHash = {
      guid: 'link3',
      text: 'third link'
    };
    
  var newLink = MySystem.store.createRecord(MySystem.Link, linkHash, linkHash.guid);
  newLink.set("startNode", nodeA);
  newLink.set("endNode", nodeB);
  
  var foundLinks = nodeA.get('links').get('length');
  equals(foundLinks, expectedLinks, "There should be "+ expectedLinks +" links");
  
});