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

describe("maximum feedback exceeded", function(){
  var clickLimit = 3;
  var tooManyClicks = "You clicked 'submit' too many times";
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
       "diagram_rules": [],
       "maxSubmissionClicks": clickLimit,
       "maxSubmissionFeedback": tooManyClicks
     }
  });
  
  beforeEach(function(){
    helper.setupApp();
  });
  
  afterEach(function(){
    helper.teardownApp();
  });
  
  it("should limit the number of submits", function(){
    var i = 0;
    helper.addNode('obj1');
    for (i = 0; i < 10; i++) {
      helper.submitDiagram();
    }
    // we expect submit to still save:
    expect(helper.get('externalSaveCount')).toBe(10);
    // but it shoudn't resubmit
    expect(helper.lastFeedback().numOfSubmits).toBe(clickLimit);
  });
describe("submit timestamp", function(){
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
       "diagram_rules": [],
     }
  });
  beforeEach(function(){
    helper.setupApp();
  });
  
  afterEach(function(){
    helper.teardownApp();
  });

  it("should update the timestamp on submit", function() {
    var milliesNow       = new Date().getTime();
    var firstSubmitTime  = null;
    var secondSubmitTime = null;
    var self             = this;

    helper.addNode('obj1');

    helper.submitDiagram();
    console.log(helper.lastFeedback().numOfSubmits);
    firstSubmitTime = helper.lastFeedback().timeStampMs;
    expect(firstSubmitTime > milliesNow).toBeTruthy();
  
    helper.submitDiagram();
    secondSubmitTime = helper.lastFeedback().timeStampMs;
    expect(secondSubmitTime > firstSubmitTime).toBeTruthy();
  });
});
