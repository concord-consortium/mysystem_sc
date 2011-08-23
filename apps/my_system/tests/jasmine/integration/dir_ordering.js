/*globals describe it TestDirectoryLoaded */
// we want to make sure the directories are being parsed in the same order on our various test environments
describe("The integration folder", function () {
  it("should be loaded first", function() {
    expect(window.TestDirectoryLoaded).not.toBeDefined();
    window.TestDirectoryLoaded = 1;
  }); 
});

