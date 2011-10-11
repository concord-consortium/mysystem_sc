/*globals MySystem describe beforeEach afterEach it defineJasmineHelpers*/

defineJasmineHelpers();

describe("The External API", function () {
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
    it("should save the result of running the feedback rules even if the submit button hasn't been push", function() {

      // setup App:
      MySystem.setupStore(MySystem);
      MySystem.statechart.initStatechart();

      var authoredContent = 
        {
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
        };

      var activity = MySystem.Activity.fromWiseStepDef(authoredContent);
      MySystem.activityController.set('content',activity);

      MySystem.preExternalSave();

      var lastFeedback = MySystem.store.find(MySystem.RuleFeedback, MySystem.RuleFeedback.LAST_FEEDBACK_GUID);
      expect(lastFeedback).toNotBe(null);
      expect(lastFeedback.get('success')).toBe(true);
      expect(lastFeedback.get('feedback')).toBe("Your diagram has no obvious problems.");
    });
  });
});
