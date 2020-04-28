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
const uuidv4 = require("uuid/v4");
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
 
  // it("List user subscriptions", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await s2sMS.Pubsub.listUserSubscriptions(
  //     "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
  //     accessToken,
  //     trace
  //   );
  //   assert.ok(
  //     response.hasOwnProperty("items") &&
  //     response.hasOwnProperty("metadata"),
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"List user subscriptions")); 

  // it("add subscription", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const subscriptions = {
  //     identity: ["identity_property_change"]
  //   };
  //   const criteria = [{
  //     user_uuid: "0904f8d5-627f-4ff5-b34d-68dc96487b1e"
  //   }];

  //   const expiresDate = new Date(Date.now() + 100000).toISOString();
  //   const response = await s2sMS.Pubsub.addSubscription( 
  //     creds.testIdentity,
  //     creds.testAccount,
  //     "http://localhost:8001/foo",
  //     [],
  //     criteria,
  //     subscriptions, 
  //     accessToken,
  //     expiresDate,
  //     trace
  //   );
  //   sub_uuid = response.subscription_uuid;
  //   assert.ok(
  //     response.hasOwnProperty("subscription_uuid"),
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"add subscription"));

  // it("update subscription expiration", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    
  //   const response = await s2sMS.Pubsub.updateSubscriptionExpiresDate(  
  //     accessToken,
  //     sub_uuid,
  //     new Date(Date.now() + 1000000).toISOString(),
  //     trace
  //   );
  //   assert.ok(
  //     1===1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"update subscription expiration"));
  
  // it("delete subscription", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await s2sMS.Pubsub.deleteSubscription( 
  //     sub_uuid, 
  //     accessToken,
  //     trace
  //   );
  //   assert.ok(
  //     response.status === "ok",
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"delete subscription"));

  // Custom Pubsub Tests:
  let app_uuid = uuidv4();
  let custom_uuid;
  it("createCustomApplication", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.createCustomApplication(
      accessToken,
      app_uuid, //app_uuid
      [
        "event1",
        "event2"
      ], // events
      trace
    );
    assert.ok(
      response.hasOwnProperty("events") &&
      Array.isArray(response.events) &&
      response.events.length === 2 &&
      response.hasOwnProperty("app_uuid"),
      JSON.stringify(response, null, "\t")
    );
    app_uuid = response.app_uuid;
    return response;
  },"createCustomApplication"));

  it("getCustomApplication", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.getCustomApplication(
      accessToken,
      app_uuid,
      trace
    );
    assert.ok(
      response.hasOwnProperty("events") &&
      Array.isArray(response.events) &&
      response.events.length === 2 &&
      response.hasOwnProperty("app_uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"getCustomApplication"));

  it("addCustomEventSubscription", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.addCustomEventSubscription(
      accessToken,
      app_uuid,
      "http://localhost/some/fake/route", // callback url this can't work so it doesn't matte
      [{"important_header": true}],
      [], // criteria, but we are not filtering
      ["event1"],
      undefined, //expires date
      trace
    );
    assert.ok(
      response.hasOwnProperty("events") &&
      Array.isArray(response.events) &&
      response.events[0] === "event1" &&
      response.app_uuid === app_uuid &&
      response.hasOwnProperty("callback") &&
      response.callback.hasOwnProperty("headers"),
      JSON.stringify(response, null, "\t")
    );
    custom_uuid = response.uuid;
    return response;
  },"addCustomEventSubscription"));

  it("getCustomSubscription", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.getCustomSubscription(
      accessToken,
      custom_uuid,
      trace
    );
    assert.ok(
      response.hasOwnProperty("events") &&
      Array.isArray(response.events) &&
      response.events[0] === "event1" &&
      response.app_uuid === app_uuid &&
      response.hasOwnProperty("callback") &&
      response.callback.hasOwnProperty("headers"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"getCustomSubscription"));

  it("broadcastCustomApplication", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.broadcastCustomApplication(
      accessToken,
      app_uuid,
      "event1",
      {
        "importantStuff": true,
        "lessImportantStuff": {"foo": "bar"}
      },
      trace
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"broadcastCustomApplication"));

  it("deleteCustomSubscription", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.deleteCustomSubscription(
      accessToken,
      custom_uuid,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"deleteCustomSubscription"));

  it("deleteCustomApplication", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Pubsub.deleteCustomApplication(
      accessToken,
      app_uuid,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"deleteCustomApplication"));

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