/*globals MySystem defineJasmineHelpers describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor NO YES*/

defineJasmineHelpers();


describe("Rubric category", function () {
  var category;
  var failingRule;
  var passingRule;


  beforeEach( function () {
    MySystem.setupStore(MySystem);
    MySystem.statechart.initStatechart();
    category = createCategory("category 1");
    failingRule = addRule("failingRule", false);
    passingRule = addRule("passingRule", true);
    category.addRule("failing");
    category.addRule("passing");
  });
  
  
  it("has a name", function () {
    expect(category.get('name')).not.toBeNull();
  });

  it("has a list of rules", function() {  
    expect(category.get('rules')).not.toBeNull();
    expect(category.get('rules').length).toBeGreaterThan(1);
  });

  describe("evalutating rules", function() {
    describe("with one failing rule", function() {
      var failingRule = { check: function() { return false; }};

      beforeEach(function () {
        category = createCategory("failing");  
        spyOn(failingRule, 'check').andCallThrough();
        spyOn(category,'getRules').andReturn([failingRule]);
      });

      it ("should fail its check, by checking the rule",function() {
        expect(category.check()).toBeFalsy();
        expect(failingRule.check).toHaveBeenCalled();
      });
    });
  
    describe("with one passing rule", function() {
      var passingRule = { check: function() { return true; }};

      beforeEach(function () {
        category = createCategory("passing");  
        spyOn(passingRule, 'check').andCallThrough();
        spyOn(category,'getRules').andReturn([passingRule]);
      });

      it ("should pass its check, by checking the rule",function() {
        expect(category.check()).toBeTruthy();
        expect(passingRule.check).toHaveBeenCalled();
      });
    });


    describe("with one passing rule, one failing rule", function() {
      var passingRule = { check: function() { return true; }};
      var failingRule = { check: function() { return false; }};

      beforeEach(function () {
        category = createCategory("passing");  
        spyOn(passingRule, 'check').andCallThrough();
        spyOn(failingRule, 'check').andCallThrough();
        spyOn(category,'getRules').andReturn([failingRule, passingRule]);
      });

      it ("should pass its check, by checking the rules",function() {
        expect(category.check()).toBeTruthy();
        expect(passingRule.check).toHaveBeenCalled();
        expect(failingRule.check).toHaveBeenCalled();
      });
    });

  });

  var createCategory = function(name,rules) {
    // var category = MySystem.RubricCategory.create();
    var category = MySystem.store.createRecord(
      MySystem.RubricCategory,
      {name: name},
      MySystem.Activity.newGuid("rubricCategory")
    );

    return category;
  };


  var addRule = function(name, passes) {
    var defs = {};
    defs.name = name;
    defs.isJavascript = true;
    defs.javascriptExpression = "this.results = false;";
    if(passes) {
      defs.javascriptExpression = "this.results = true;";
    }
    
    var newDiagramRule = MySystem.store.createRecord(
      MySystem.DiagramRule,
      defs, 
      MySystem.Activity.newGuid("diagramRule")
    );

    return newDiagramRule;
  };


});

