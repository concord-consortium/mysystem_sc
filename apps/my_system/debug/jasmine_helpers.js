/*globals jasmine describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor clickOn MySystem fillIn window SC $ dataHelper*/

function defineJasmineHelpers() {

  jasmine.Matchers.prototype.toBeA = function (scType) {  
    return SC.kindOf(this.actual, scType);
  };
  
  jasmine.Matchers.prototype.toContainA = function (scType) {
    var contains = function (array, scType) {
      if (!array) return false;
      var el = array.shift();
      return SC.kindOf(el, scType) || contains(array, scType);
    };
    return contains(this.actual, scType);
  };
  
  window.runBeforeEach = function (fn) {
    beforeEach( function () { SC.run(fn); });
  };

  window.runAfterEach = function (fn) {
    afterEach( function () { SC.run(fn); });
  };
  
  dataHelper = (function () {
    return {
      
      // give simplified learner data of the form
      //    {nodes: ['obj1','obj2'], links: ['obj1.0-->obj2.0:en1','obj2.0-->obj1.0:en2']}
      // this will create the expanded version of the student data hash,
      // and set it to the MySystem store.
      setStudentStateDataHash: function(_data) {
        var studentData = this.createStudentDataHash(_data);
        studentData = MySystem.migrations.migrateLearnerData(studentData);
        MySystem.store.setStudentStateDataHash(studentData);
      },
      
      createStudentDataHash: function (_data) {
        var studentData = {};
        var data = {};
        data.nodes = _data.nodes || [];
        data.links = _data.links || [];

        var objectTypesCount = {};

        // we add a set of nodes. Each object of type 'someObjType'
        // will get guids someObjType.0, someObjType.1...
        // this way we can distinuish them when defining links
        $.each(data.nodes, function(i, nodeType){
          if (!studentData['MySystem.Node']){
            studentData['MySystem.Node'] = {};
          }
          if (objectTypesCount[nodeType] === undefined){
            objectTypesCount[nodeType] = 0;
          } else {
            objectTypesCount[nodeType] = objectTypesCount[nodeType] + 1;
          }
          var guid = nodeType+'.'+objectTypesCount[nodeType];
          studentData['MySystem.Node'][guid] = {guid: guid, nodeType: nodeType, inLinks: [], outLinks: []};
        });

        // we add a series of links. For simplicity, all links are defined as -->, with
        // no links going the other way. For now the test author simply needs to refer
        // to the nodes by name, knowing that they will be defined as 'someObjType.0', 
        // 'someObjType.1'...
        $.each(data.links, function(i, linkDesc){
          if (!studentData['MySystem.Link']){
            studentData['MySystem.Link'] = {};
          }
          var energyType = null;
          if (linkDesc.split(":").length > 1){
            energyType = linkDesc.split(":")[1];
            linkDesc = linkDesc.split(":")[0];
          }
          var startNode = linkDesc.split("-->")[0],
              endNode = linkDesc.split("-->")[1],
              guid = 'link'+i;
          // add to inlinks and outlinks of nodes
          studentData['MySystem.Node'][startNode].outLinks.push(guid);
          studentData['MySystem.Node'][endNode].inLinks.push(guid);
          studentData['MySystem.Link']['link'+i] = {
            guid: guid,
            startNode: startNode,
            endNode: endNode,
            startTerminal: 'a',
            endTerminal: 'a',
            energyType: energyType
          };
        });

        return studentData;
      }
    };
  })();
  
}
