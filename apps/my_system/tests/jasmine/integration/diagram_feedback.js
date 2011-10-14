/*globals MySystem IntegrationTestHelper describe beforeEach afterEach it */

describe("The diagram feedback", function(){
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
  
  it("should be saved when the submit button is pressed", function(){
    helper.submitDiagram();
    
    expect(helper.get('domIO').textContent.length).toBeGreaterThan(0);
    expect(helper.lastFeedback().success).toBe(true);
    expect(helper.lastFeedback().feedback).toBe("Your diagram has no obvious problems.");
  });
  
  it("is not saved when save button is pressed and submit has not been pressed yet (note: this is not a requirement just a current behavior)", function(){
    helper.addNode('obj1').saveDiagram();

    expect(helper.get('externalSaveCount')).toBe(1);
    expect(helper.lastFeedback()).toBeUndefined();
  });

  it("should be saved when save is triggered externally", function(){
    expect(helper.get('domIO').textContent.length).toBe(0);
    MySystem.preExternalSave();
    
    // There should now be feedback in the saved data
    expect(helper.get('domIO').textContent.length).toBeGreaterThan(0);
    expect(helper.lastFeedback().success).toBe(true);
    expect(helper.lastFeedback().feedback).toBe("Your diagram has no obvious problems.");
  });

  it("should be not increment the numOfSubmits when save is triggered externally", function(){
    MySystem.preExternalSave();
    
    expect(helper.lastFeedback().numOfSubmits).toBe(0);
  });

  it("should be saved by the submit button even if save button has been pushed first", function(){
    helper.
      addNode('obj1').
      saveDiagram().
      submitDiagram();
    
    expect(helper.get('externalSaveCount')).toBe(2);
  });

  it("should be saved by the submit button if the submit button was just pressed and there have been no changes", function(){
    helper.
      addNode('obj1').
      saveDiagram().
      submitDiagram().
      submitDiagram();
    
    expect(helper.get('externalSaveCount')).toBe(3);
  });

  it("should include the number of submits", function(){
    helper.
      addNode('obj1').
      saveDiagram().
      submitDiagram().
      submitDiagram();
    
    expect(helper.get('externalSaveCount')).toBe(3);
    expect(helper.lastFeedback().numOfSubmits).toBe(2);
  });

});