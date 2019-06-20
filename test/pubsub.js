//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const Logger = require("../src/node-logger");
const logger = new Logger.default();
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      return Promise.reject(error);
    }
  };
};

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Pubsub MS Unit Test Suite", function () {

  let accessToken,
    oauthData,
    sub_uuid;

  before(async () => {
    try {
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost(creds.MS_HOST);
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(creds.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
    
      oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
    } catch (error) {
      return Promise.reject(error);
    }
  });
 
  it("List user subscriptions", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.listUserSubscriptions(
      "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
      accessToken,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.hasOwnProperty("metadata"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List user subscriptions")); 

  it("add subscription", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const subscriptions = {
      identity: ["identity_property_change"]
    };
    const criteria = [{
      user_uuid: "0904f8d5-627f-4ff5-b34d-68dc96487b1e"
    }];
    const response = await s2sMS.Pubsub.addSubscription( 
      "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
      "47113ee7-ddbe-4388-aade-717c36ec17c7",
      "http://localhost:8001/foo",
      [],
      criteria,
      subscriptions, 
      accessToken,
      trace
    );
    sub_uuid = response.subscription_uuid;
    assert.ok(
      response.hasOwnProperty("subscription_uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"add subscription"));
  
  it("delete subscription", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.deleteSubscription( 
      sub_uuid, 
      accessToken,
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"delete subscription"));

  // template
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});