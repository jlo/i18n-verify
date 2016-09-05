var expect = require('chai').expect;
var parseVerify = require("../src/parse-verify-core");
require('mocha-sinon');

/** 
Todo:
mix of directories and files
multiple directory
multiple files
nonexistent directory (error handling not yet implemented)
nonexistent file (same as above)
single directory
single file
*/

xdescribe('Parser', function() {
  beforeEach(function() {
    this.sinon.stub(console, 'log');
  });

  it('parses files within a directory', function() {
    var spy = this.sinon.spy(parseVerify.main);
    parseVerify.main('test/fixtures/views', 'test/fixtures/reference/en.json', /translate\\(\'(.*)\'\\)/g, callback);
    // expect(console.log.calledWith('\'test-key-1\' from test/fixtures/views/ui_app.jade not present in test/fixtures/reference/en.json') ).to.be.true;
    expect(console.log).toHaveBeenCalledWith('test-key-1');
  })
})
