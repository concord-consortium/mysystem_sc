/*globals MySystem describe beforeEach afterEach it IntegrationTestHelper */

describe("The External API", function () {
  var helper = IntegrationTestHelper.create({
    authoredContent: {
       "type": "mysystem2",
       "prompt": "",
       "modules": [
         {
           "name": "obj1",
           "uuid": "obj1"
         }
       ],
       "energy_types": [
         {
           "label": "en1",
           "uuid": "en1"
         }
       ],
       "diagram_rules": []
     }
  });
  
  beforeEach(function(){
    helper.setupApp();
  });
  
  afterEach(function(){
    helper.teardownApp();
  });
  
  ["preExternalSave", 
   "setAutoSaveFrequency", 
   "registerExternalSaveFunction", 
   "loadWiseConfig",
   "updateFromDOM" 
  ].forEach(function (method){
     it("should have the method: " + method, function() {
       expect(typeof MySystem[method]).toBe('function');
     });
   });
   
  describe("preExternalSave method", function () {
    it("should not call the external save function since it was an externally triggered save", function(){
      MySystem.preExternalSave();

      helper.expectProperty('externalSaveCount').toBe(0);
    });

    it("should not call the external save function even if the diagram is modified", function(){
      helper.addNode('obj1');
      expect(MySystem.savingController.get('dataIsDirty')).toBe(YES);
      MySystem.preExternalSave();

      helper.expectProperty('externalSaveCount').toBe(0);
    });

    it("should save the result of running the feedback rules even if the submit button hasn't been push", function() {
      // this is duplicated in the diagram_feedback file
      MySystem.preExternalSave();

      expect(helper.lastFeedback()).toBeDefined();
      expect(helper.lastFeedback().success).toBe(true);
      expect(helper.lastFeedback().feedback).toBe("Your diagram has no obvious problems.");
    });
    
  });
});
