/*globals describe it TestDirectoryLoaded */
// we want to make sure the directories are being parsed in the same order on our various test environments
describe("The migrations folder", function () {
  it("should be loaded second", function() {
    expect(window.TestDirectoryLoaded).toBe(1);
    window.TestDirectoryLoaded = 2;
  }); 
});

