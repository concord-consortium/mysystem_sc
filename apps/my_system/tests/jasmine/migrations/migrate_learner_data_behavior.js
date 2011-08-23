/*globals MySystem RaphaelViews describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor
 clickOn fillIn defineJasmineHelpers */
 
defineJasmineHelpers();

describe("MySystem.migrations.migrateLearnerData method", function () {
  
  var savedMigrations, savedLearnerDataVersion;
  
  // this rigmarole probably means MySystem.migrations should be made into a singleton instance of an SC class
  beforeEach( function () {
    savedMigrations = MySystem.migrations;
    savedLearnerDataVersion = MySystem.learnerDataVersion;
    
    MySystem.migrations = {
      migrateLearnerData: savedMigrations.migrateLearnerData,

      migrateLearnerData1: function () {},
      migrateLearnerData2: function () {},
      migrateLearnerData3: function () {},
      
      isPositiveInteger: MySystem.migrations.isPositiveInteger,
      detectLegacyLearnerDataVersion: MySystem.migrations.detectLegacyLearnerDataVersion
    };
    spyOn(MySystem.migrations, 'migrateLearnerData1').andReturn('migrateLearnerData1 output');
    spyOn(MySystem.migrations, 'migrateLearnerData2').andReturn('migrateLearnerData2 output');
    spyOn(MySystem.migrations, 'migrateLearnerData3').andReturn('migrateLearnerData3 output');
  });
  
  afterEach( function () {
    MySystem.migrations = savedMigrations;
    MySystem.learnerDataVersion = savedLearnerDataVersion;
  });

  describe("when MySystem.learnerDataVersion === MySystem.DEVELOPMENT_HEAD", function () {
    
    beforeEach( function () {
      MySystem.learnerDataVersion = MySystem.DEVELOPMENT_HEAD;
    });
    
    describe("and the learner data has version MySystem.DEVELOPMENT_HEAD", function () {
     
      var testData = {
        version: MySystem.DEVELOPMENT_HEAD
      };
      
      it("should not call any migrations", function () {
        MySystem.migrations.migrateLearnerData(testData);
        
        expect(MySystem.migrations.migrateLearnerData1).not.toHaveBeenCalled();
        expect(MySystem.migrations.migrateLearnerData2).not.toHaveBeenCalled();
        expect(MySystem.migrations.migrateLearnerData3).not.toHaveBeenCalled();
      });
      
      it("should return the data passed to it", function () {
        expect(MySystem.migrations.migrateLearnerData(testData)).toBe(testData);
      });
    });
    
    describe("and the learner data has no 'version' field", function () {

      var testData = {};

      it("should call all currently-defined migrations (#1-3)", function () {
        MySystem.migrations.migrateLearnerData(testData);
        
        expect(MySystem.migrations.migrateLearnerData1).toHaveBeenCalledWith(testData);
        expect(MySystem.migrations.migrateLearnerData2).toHaveBeenCalledWith('migrateLearnerData1 output');
        expect(MySystem.migrations.migrateLearnerData3).toHaveBeenCalledWith('migrateLearnerData2 output');
      });
      
      it("should return the value that is returned by the latest (#3) migration", function () {
        expect(MySystem.migrations.migrateLearnerData(testData)).toEqual('migrateLearnerData3 output');
      });
    });
    
    describe("and the learner data has version 2", function () {

      var testData = {
        version: 2
      };
        
      it("should only call the 2->3 migration and the 3->current migration", function () {
        MySystem.migrations.migrateLearnerData(testData);

        expect(MySystem.migrations.migrateLearnerData1).not.toHaveBeenCalled();
        expect(MySystem.migrations.migrateLearnerData2).toHaveBeenCalledWith(testData);
        expect(MySystem.migrations.migrateLearnerData3).toHaveBeenCalledWith('migrateLearnerData2 output');
      });

      it("should return the value that is returned by the latest (#3) migration", function () {
        expect(MySystem.migrations.migrateLearnerData(testData)).toEqual('migrateLearnerData3 output');
      });
    });
  });
  
  
  describe("when MySystem.learnerDataVersion is an example positive integer (3)", function () {
    
    beforeEach( function () {
      MySystem.learnerDataVersion = 3;
    });
    
    describe("and the learner data has version 4", function () {
      var testData = {
        version: 4
      };
      
      it("should throw a range error (because down-migrations are not supported)", function () {
        expect( function () { MySystem.migrations.migrateLearnerData(testData); }).toThrow();
      });
    });
    
    describe("and the learner data also has version 3", function () {

      var testData = {
        version: 3
      };

      it("should not call any migrations", function () {
        MySystem.migrations.migrateLearnerData(testData);

        expect(MySystem.migrations.migrateLearnerData1).not.toHaveBeenCalled();
        expect(MySystem.migrations.migrateLearnerData2).not.toHaveBeenCalled();
        expect(MySystem.migrations.migrateLearnerData3).not.toHaveBeenCalled();
      });

      it("should return the data passed to it", function () {
        expect(MySystem.migrations.migrateLearnerData(testData)).toBe(testData);
      });
    });
    
    describe("and the learner data has version 2", function () {

      var testData = {
        version: 2
      };
        
      it("should only call the 2->3 migration", function () {
        MySystem.migrations.migrateLearnerData(testData);

        expect(MySystem.migrations.migrateLearnerData1).not.toHaveBeenCalled();
        expect(MySystem.migrations.migrateLearnerData2).toHaveBeenCalledWith(testData);
        expect(MySystem.migrations.migrateLearnerData3).not.toHaveBeenCalled();
      });

      it("should return the value that is returned by the 2->3 migration", function () {
        expect(MySystem.migrations.migrateLearnerData(testData)).toEqual('migrateLearnerData2 output');
      });
    });
    
    describe("and the learner data has no 'version' field", function () {

      var testData = {};
        
      it("should only call the 1->2 and 2->3 migrations", function () {
        MySystem.migrations.migrateLearnerData(testData);

        expect(MySystem.migrations.migrateLearnerData1).toHaveBeenCalledWith(testData);
        expect(MySystem.migrations.migrateLearnerData2).toHaveBeenCalledWith('migrateLearnerData1 output');
        expect(MySystem.migrations.migrateLearnerData3).not.toHaveBeenCalled();
      });

      it("should return the value that is returned by the 2->3 migration", function () {
        expect(MySystem.migrations.migrateLearnerData(testData)).toEqual('migrateLearnerData2 output');
      });
    });
    
    describe("and the learner data has version MySystem.DEVELOPMENT_HEAD", function () {

      var testData = {
        version: MySystem.DEVELOPMENT_HEAD
      };
      
      it("should throw an error", function () {
        expect( function () { MySystem.migrations.migrateLearnerData(testData); }).toThrow();
      });
    });
  
  });
  
  
});
