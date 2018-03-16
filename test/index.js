var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

beforeEach(function() {
  // process.env.NODE_ENV = 'dev';
  process.env.BASE_URL = "https://cpaas.star2star.net";
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("MS SDK Index", function() {
  it("s2s-ms module exports", function(done) {
    const msKeys = [
      "Lambda",
      "Identity",
      "Messaging",
      "Objects",
      "Util",
      "Task",
      "Event",
      "setBaseUrl",
      "getBaseUrl",
      "setApplicationKey",
      "getApplicationKey",
      "Groups",
      "ShortUrls",
      "Auth",
      "Chat"
    ];
    assert.deepEqual(Object.keys(s2sMS), msKeys);
    done();
  });

  it("set/get Application Key", function(done) {
    const appKey = "james";
    s2sMS.setApplicationKey(appKey);
    assert(s2sMS.getApplicationKey() === appKey);
    done();
  });

  it("set/get baseUrl development  ", function(done) {
    assert.equal(s2sMS.getBaseUrl(), "https://cpaas.star2star.net");
    done();
  });

  it("set/get baseurl production ", function(done) {
    s2sMS.setBaseUrl("https://cpaas.star2star.com/api");
    assert.equal(s2sMS.getBaseUrl(), "https://cpaas.star2star.com/api");
    done();
  });
});
