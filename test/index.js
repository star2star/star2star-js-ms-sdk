//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const beforeEach=mocha.beforeEach;
const it = mocha.it;
//test requires
const s2sMS = require("../src/index");
const Config = require("../src/config");

beforeEach(function () {
  s2sMS.setMsHost(process.env.MS_HOST);
});

describe("MS SDK Index", function () {
  it("s2s-ms module exports", function (done) {
    const msKeys = [ 
      "Accounts",
      "Lambda",
      "Identity",
      "Messaging",
      "Objects",
      "Util",
      "setMsHost",
      "getMsHost",
      "setMsAuthHost",
      "setApplicationKey",
      "getApplicationKey",
      "setEnv",
      "getEnv",
      "Groups",
      "ShortUrls",
      "Auth",
      "Oauth",
      "Chat",
      "Contacts",
      "Media",
      "Providers",
      "Pubsub",
      "setMSVersion",
      "Workflow",
      "Email",
      "ResourceGroups",
      "Scheduler",
      "Metadata",
      "Forms",
      "Entitlements",
      "Activity",
      "Resources"
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

  it("set/get msHost production ", function (done) {
    s2sMS.setMsHost(process.env.MS_HOST);
    assert.equal(s2sMS.getMsHost(), process.env.MS_HOST);
    done();
  });
 
  it("set/get env", function (done) {
    const env = s2sMS.getEnv();
    assert.equal(env, Config.env);
    s2sMS.setEnv("prod");
    assert.equal(s2sMS.getEnv(), "prod");
    done();
  });

});