/*globals MySystem describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor */

describe("MySystem.savingController", function () {
  var controller  = MySystem.savingController;
  var successSave = function() { controller.saveSuccessful(YES);    };
  var failingSave = function() { console.log("saving aborted --"); };


  beforeEach( function() {
  });

  describe("autosave", function() {

  });

  describe("dataIsDirty property", function() {
    beforeEach(function() {
      controller.set('dataIsDirty',YES);
      SC.run();
    });
    describe("when save isn't called", function() {
      it("should be YES", function() {
        expect(controller.get('dataIsDirty')).toBe(YES);
      });
    });
    describe("with no saveFunction defined", function() {
      beforeEach(function() {
        controller.set('saveFunction',null);
        SC.run();
      });
      it("should be YES", function() {
        controller.save();
        expect(controller.get('dataIsDirty')).toBe(YES);
      });
    });
    describe("when a save fails", function() {
      beforeEach(function() {
        controller.set('saveFunction',failingSave);
        SC.run();
      });
      it("should be YES after save is called", function() {
        controller.save();
        expect(controller.get('dataIsDirty')).toBe(YES);
      });
    });
    describe("when a save succeeds", function() {
      beforeEach(function() {
        controller.set('saveFunction',successSave);
        SC.run();
      });
      it("should be NO after save", function() {
        controller.save();
        expect(controller.get('dataIsDirty')).toBe(NO);
      });
    });
  });

  describe("saveStatusText",function() {

    describe("When there is no save function", function() {
      beforeEach(function () {
        controller.set('saveFunction', null);
      });
      it("is blank", function() {
        expect(controller.get('saveStatusText')).toEqual('Saving disabled.');
      });
    });

    describe("When there is a responsive save function", function() {
      beforeEach(function () {
        controller.set('saveFunction', successSave);
      });

      describe("When data hasn't been saved.", function() {
        beforeEach(function () {
          controller.set('saveTime', null);
        });
        it("displays 'Not saved yet.'", function() {
          expect(controller.get('saveStatusText')).toEqual('Not saved yet.');
        });
      });

      describe("When data is dirty", function() {
        beforeEach(function() {
          controller.set('dataIsDirty',YES);
        });
        describe("If the lastSaveTime as less than 10 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 9 * 1000);
          });
          it("displays 'saved seconds ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved seconds ago.');
          });
        });
        describe("If the lastSaveTime is 40 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 40 * 1000);
          });
          it("displays 'Saved seconds ago.'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved seconds ago.');
          });
        });
        describe("if the lastSaveTime is 60 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 60 * 1000);
          });
          it("displays '1 minute ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved 1 minute ago.');
          });
        });
        describe("if the lastSaveTime is 90 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 90 * 1000);
          });
          it("displays '1 minute ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved 1 minute ago.');
          });
        });
        describe("if the lastSave time is 120 second", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 120 * 1000);
          });
          it("displays '2 minutes  ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved 2 minutes ago.');
          });
        });
        describe("if the lastSave time is 140 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 140 * 1000);
          });
          it("displays '2 minutes ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved 2 minutes ago.');
          });
        });
        describe("if the lastSave time is 3600 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 3600 * 1000);
          });
          it("displays '1 hour ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved 1 hour ago.');
          });
        });
        describe("if the lastSave time is 7200 seconds", function() {
          beforeEach(function() {
            controller.set('saveTime', new Date().getTime() - 7200 * 1000);
          });
          it("displays '2 hours ago'", function() {
            expect(controller.get('saveStatusText')).toEqual('Saved 2 hours ago.');
          });
        });
      });
    });
  });
});
