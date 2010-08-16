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
      createLink(wires[i], nodes, 'link-' + i);
    }
  };
  
  var createNode = function(container, guid) {
    return MySystem.store.createRecord(MySystem.Node, {
      title: container.name,
      image: filterImagePath(container.image),
      position: { x: container.position[0], y: container.position[1] }
    }, guid);
  };
  
  var createLink = function(wire, nodes, guid) {
     var startNode = nodes[Number(wire.src.moduleId)];
     var endNode = nodes[Number(wire.tgt.moduleId)];
     var link = MySystem.store.createRecord(MySystem.Link, {
         startNode: startNode.get('id'),
         endNode: endNode.get('id'),
         startTerminal: wire.src.terminal === 'Terminal1' ? 'a' : 'b',
         endTerminal: wire.tgt.terminal === 'Terminal1' ? 'a' : 'b',
         text: wire.options.fields.name
     }, guid);
     startNode.get('outLinks').pushObject(link);
     endNode.get('inLinks').pushObject(link);
     return link;
  };
  
  var filterImagePath = function(path) {
      return 'http://ccmysystem.appspot.com/' + path;
  };
  
})();
