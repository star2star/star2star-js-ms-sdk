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
  s2sMS.setMsHost(
    process.env.MS_HOST ||
      process.env.CPAAS_URL ||
      "https://cpaas-api.star2star.com"
  );
});

describe("MS SDK Index", function () {
  it("s2s-ms module exports", function (done) {
    const msKeys = [
      "Accounts",
      "Activity",
      "Auth",
      "Campaigns",
      "Chat",
      "Contacts",
      "DbSip",
      "Email",
      "Entitlements",
      "Forms",
      "getMsHost",
      "Groups",
      "Identity",
      "Lambda",
      "Media",
      "Messaging",
      "Metadata",
      "Mobile",
      "Numbers",
      "Objects",
      "Oauth",
      "Profiles",
      "Providers",
      "Pubsub",
      "ResourceGroups",
      "Resources",
      "Scheduler",
      "setMsAuthHost",
      "setMsHost",
      "setMSVersion",
      "ShortUrls",
      "Usage",
      "Util",
      "Voice",
      "Workflow",
    ];
    assert.deepEqual(Object.keys(s2sMS), msKeys);
    done();
  });

  it("set/get msHost production ", function (done) {
    const host =
      process.env.MS_HOST ||
      process.env.CPAAS_URL ||
      "https://cpaas-api.star2star.com";
    s2sMS.setMsHost(host);
    assert.equal(s2sMS.getMsHost(), host);
    done();
  });
 
});