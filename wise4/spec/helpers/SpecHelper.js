beforeEach(function() {
  // This can contain code that should run for all specs
  // for example adding custom matchers
});

window.mockEventManager = function(){
  // mock the Wise4 eventManager
  return {
    fire: function (){},
    subscribe: function() {}
  };
}

window.mockNode = function(eventManager){
  // mock the Wise4 Node
  var nodeContent = {
    getContentJSON: function() {
      return {};
    }
  };
  return {
    getContent: function() {
      return nodeContent;
    },
    studentWork: [],
    view: {
      eventManager: eventManager,
      postCurrentNodeVisit: function(){},
      state : {
        getCurrentNodeVisit: function(){}
      }
    }
  };  
}
