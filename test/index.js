var assert = require("assert");
var s2sMS = require("../src/index");
var fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

beforeEach(function () {
  s2sMS.setMsHost("https://cpaas.star2starglobal.net");
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("MS SDK Index", function () {
  it("s2s-ms module exports", function (done) {
    const msKeys = [ 
      'Accounts',
      'Lambda',
      'Identity',
      'Messaging',
      'Objects',
      'Util',
      'Task',
      'setMsHost',
      'getMsHost',
      'setMsAuthHost',
      'setApplicationKey',
      'getApplicationKey',
      'Groups',
      'ShortUrls',
      'Auth',
      'Oauth',
      'Chat',
      'Contacts',
      'Media',
      'Pubsub',
      'setMSVersion',
      'Workflow',
      'Email',
      'ResourceGroups'
    ];
    assert.deepEqual(Object.keys(s2sMS), msKeys);
    done();
  });

  it("set/get Application Key", function (done) {
    const appKey = "james";
    s2sMS.setApplicationKey(appKey);
    assert(s2sMS.getApplicationKey() === appKey);
    done();
  });

  it("set/get baseUrl development  ", function (done) {
    assert.equal(s2sMS.getMsHost(), "https://cpaas.star2starglobal.net");
    done();
  });

  it("set/get msHost production ", function (done) {
    s2sMS.setMsHost("https://cpaas.star2star.com/api");
    assert.equal(s2sMS.getMsHost(), "https://cpaas.star2star.com/api");
    done();
  });
});