//mocha reqruies
require("babel-polyfill");
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const beforeEach=mocha.beforeEach;
const it = mocha.it;
//test requires
const s2sMS = require("../src/index");
const Config = require("../src/config.json");
const Util = require("../src/utilities");
const logLevel = Util.getLogLevel();
const logPretty = Util.getLogPretty();
import Logger from "../src/node-logger";
const logger = new Logger();
logger.setLevel(logLevel);
logger.setPretty(logPretty);

beforeEach(function () {
  s2sMS.setMsHost("https://cpaas.star2starglobal.net");
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
      "Task",
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
      "Pubsub",
      "setMSVersion",
      "Workflow",
      "Email",
      "ResourceGroups",
      "Scheduler"
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
 
  it("set/get env", function (done) {
    const env = s2sMS.getEnv();
    assert.equal(env, Config.env);
    s2sMS.setEnv("prod");
    assert.equal(s2sMS.getEnv(), "prod");
    done();
  });

});