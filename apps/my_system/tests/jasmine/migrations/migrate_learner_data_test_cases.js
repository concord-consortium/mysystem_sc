/*globals MySystem RaphaelViews describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor
 clickOn fillIn defineJasmineHelpers */
 
defineJasmineHelpers();

describe("MySystem learner data migration test cases", function () {

  // Iterate through test cases, describe() each, and assert that the output of migrateLearnerData<n> matches the
  // described output.
  
  var cases = MySystem.migrations.testCases,
      casesForVersion = [],
      i,
      testCaseData,
      version,
      name,
      cv,
      errorString;
  
  // Make sure we didn't screw something up such that this test passes "vacuously" (i.e., by iterating through 0 test 
  // cases and therefore having no failures.)
  it("should exist", function () {
    expect(cases).toBeDefined();
    expect(cases.length).toBeGreaterThan(0);
  });

  // This allows some freedom in how you enter test cases (e.g. the input & expected output can optionally be in
  // different files, so they can be viewed side by side, and so you don't have to work hard to find the splice point
  // when you're pasting test case input or expected output)
  for (i = 0; i < cases.length; i++) {
    testCaseData = cases[i];

    version = testCaseData.inputVersion;
    name    = testCaseData.name;
    
    if ( !name ) {
      errorString = "Found a migration test case without a name!";
      (function (e) {                
        it("", function () { throw new Error(e); });
      }(errorString));
    }
    
    if ( SC.none(version) ) {
      errorString = "version number missing from input file for migration test case '%@'".fmt(name);
      (function (e) {                
        it("", function () { throw new Error(e); });
      }(errorString));
    }
    
    if ( !MySystem.migrations.isValidReleaseVersion(version) ) {
      errorString = "version number '%@' in migration test case '%@' is invalid".fmt(version, name);
      (function (e) {                
        it("", function () { throw new Error(e); });
      }(errorString));
    }
    
    if ( !casesForVersion[version] ) {
      casesForVersion[version] = {};
    }
    cv = casesForVersion[version];
    
    if (!cv[name]) cv[name] = {};
    
    if (testCaseData.input) {
      if (cv[name].input) {
        errorString = "Input for version %@ learner-data migration test case '%@' was defined twice".fmt(version, name);
        (function (e) {                
          it("", function () { throw new Error(e); });
        }(errorString));
      }
      cv[name].input  = testCaseData.input;
    }
    
    if (testCaseData.expectedOutput) {
      if (cv[name].expectedOutput) {
        errorString = "Expected output for version %@ learner-data migration test case '%@' was defined twice".fmt(version, name);
        (function (e) {                
          it("", function () { throw new Error(e); });
        }(errorString));
      }
      cv[name].expectedOutput = testCaseData.expectedOutput;
    }
  }
  
  // Actually do the comparisons on the test cases we found. Note jasmine queues up the 'describe' blocks for
  // later execution, so you really need to make sure to wrap the iterator variables in closures as you see below.
  for (version = 1; version < casesForVersion.length; version++) {
    (function (version) {
  
      describe("migration test cases for learner data version %@".fmt(version), function () {
        var cv = casesForVersion[version];

        for (var name in cv) {
          if (!cv.hasOwnProperty(name)) continue;
          (function (name) {
            
            var theCase = cv[name];
        
            describe("test case '%@'".fmt(name), function () {
              it("should specify the input", function () {
                expect(theCase.input).toBeDefined();
              });
              
              it("should specify  the expected output", function () {
                expect(theCase.expectedOutput).toBeDefined();
              });
              
              it("actual output of migrateLearnerData%@ should match expected output".fmt(version), function () {
                var output = MySystem.migrations["migrateLearnerData"+version](theCase.input);
            
                // Poor man's javascript object comparison. FIXME. Make a nicer diffing output so you can see
                // what went wrong when this fails.
                expect(JSON.stringify(output)).toEqual(JSON.stringify(theCase.expectedOutput));
              });
            });
          }(name));
        }
      });
    }(version));
  }    
  
});
 