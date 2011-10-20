/*globals beforeEach */
beforeEach(function() {
  // This can contain code that should run for all specs
  // for example adding custom matchers
});

window.mockEventManager = function(){
  // mock the Wise4 eventManager
  var _eventManager = {
    subscriptions: {},
    fire: function (){},
    subscribe: function(key, fn) {
      _eventManager.subscriptions[key] = fn;
    }
  };
  
  return _eventManager;
};

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
};
