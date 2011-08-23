/*globals MySystem defineJasmineHelpers describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor runAfterEach runBeforeEach */

defineJasmineHelpers();

describe("AutoGuidRecord", function (){
  var recordType;
  
  describe("updateNextId method", function () {
    beforeEach( function () {
      recordType = MySystem.AutoGuidRecord.extend();
      recordType._object_className = "MyApp.RecordType"; // normally set by SC on app init
    });

    it("should start at 0001", function () {
      expect(recordType.getNextId()).toBe("MyApp.RecordType-0001");
    });

    it("should should increment nextId", function () {
      recordType.updateNextId("MyApp.RecordType-0002");
      expect(recordType.getNextId()).toBe("MyApp.RecordType-0003");
      recordType.updateNextId("MyApp.RecordType-9999");
      expect(recordType.getNextId()).toBe("MyApp.RecordType-10000");
    });
  });
});
