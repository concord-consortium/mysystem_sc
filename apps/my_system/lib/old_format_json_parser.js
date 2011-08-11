(function() {
    
  MySystem.parseOldFormatJson = function(json) {
    var i, node;
    var nodes = [];
    containers = json[0].containers;
    wires = json[0].wires;
    
    for (i = 0; i < containers.length; ++i) {
      node = createNode(containers[i]);
      nodes.push(node);
    }
    for (i = 0; i < wires.length; ++i) {
      createLink(wires[i], nodes);
    }
  };
  
  var createNode = function(container) {
    return MySystem.store.createRecord(MySystem.Node, {
      title: container.name,
      image: filterImagePath(container.image),
      position: { x: container.position[0], y: container.position[1] }
    });
  };
  
  var createLink = function(wire, nodes) {
     var startNode = nodes[Number(wire.src.moduleId)];
     var endNode = nodes[Number(wire.tgt.moduleId)];
     var link = MySystem.store.createRecord(MySystem.Link, {
         startNode: startNode.get('id'),
         endNode: endNode.get('id'),
         startTerminal: wire.src.terminal === 'Terminal1' ? 'a' : 'b',
         endTerminal: wire.tgt.terminal === 'Terminal1' ? 'a' : 'b',
         text: wire.options.fields.name
     });
     startNode.get('outLinks').pushObject(link);
     endNode.get('inLinks').pushObject(link);
     return link;
  };
  
  var filterImagePath = function(path) {
      return 'http://ccmysystem.appspot.com/' + path;
  };
  
})();
