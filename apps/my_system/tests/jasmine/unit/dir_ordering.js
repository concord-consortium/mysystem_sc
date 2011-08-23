/*globals describe it TestDirectoryLoaded */
// we want to make sure the directories are being parsed in the same order on our various test environments
describe("The unit folder", function () {
  it("should be loaded third", function() {
    expect(window.TestDirectoryLoaded).toBe(2);
    window.TestDirectoryLoaded = 3;
  }); 
});

