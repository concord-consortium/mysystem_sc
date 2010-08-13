(function() {
    
  MySystem.parseOldFormatJson = function(json) {
    var i, node;
    var nodes = [];
    containers = json[0].containers;
    wires = json[0].wires;
    
    for (i = 0; i < containers.length; ++i) {
      node = createNode(containers[i], 'node-' + i);
      nodes.push(node);
    }
    for (i = 0; i < wires.length; ++i) {
      createLink(wires[i], containers, nodes, 'link-' + i);
    }
  };
  
  var createNode = function(container, guid) {
    return MySystem.store.createRecord(MySystem.Node, {
      title: container.name,
      image: filterImagePath(container.image)
    }, guid);
  };
  
  var createLink = function(wire, containers, nodes, guid) {
      console.log('src id=' + wire.src.moduleId);
      console.log('tgt id=' + wire.tgt.moduleId);
      console.log('src id=' + nodes[Number(wire.src.moduleId)].get('id'));
     return MySystem.store.createRecord(MySystem.Link, {
         startNode: nodes[Number(wire.src.moduleId)].get('id'),
         endNode: nodes[Number(wire.tgt.moduleId)].get('id'),
         startTerminal: 'a',
         endTerminal: 'b',
         text: 'Link'
     }, guid);
  };
  
  var filterImagePath = function(path) {
      return 'http://ccmysystem.appspot.com/' + path;
  };
  
})();
