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
const logger = require("../src/node-logger").getInstance();
const { v4 } = require("uuid");
let trace = Util.generateNewMetaData();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response;
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};

describe("Pubsub MS Unit Test Suite", function () {
  let accessToken, oauthData, sub_uuid, sub;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.

      oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  it(
    "List account subscriptions",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.listAccountSubscriptions(
        accessToken,
        process.env.ACCOUNT_UUID,
        0,
        1000,
        {"suspended": 0},
        trace
      );
      assert.ok(
        response.hasOwnProperty("items") && response.hasOwnProperty("metadata"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List account subscriptions")
  );

  it(
    "List user subscriptions",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.listUserSubscriptions(
        process.env.USER_UUID,
        accessToken,
        trace
      );
      assert.ok(
        response.hasOwnProperty("items") && response.hasOwnProperty("metadata"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List user subscriptions")
  );

  it(
    "add subscription",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const subscriptions = {
        identity: ["identity_property_change"],
      };
      const criteria = [
        {
          user_uuid: "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
        },
      ];

      const expiresDate = new Date(Date.now() + 100000).toISOString();
      const response = await s2sMS.Pubsub.addSubscription(
        process.env.USER_UUID,
        process.env.ACCOUNT_UUID,
        "http://localhost:8001/foo",
        [{"x-foo": "bar"}],
        criteria,
        subscriptions,
        accessToken,
        expiresDate,
        trace
      );
      sub_uuid = response.subscription_uuid;
      sub = response;
      console.log(JSON.stringify(response));
      assert.ok(
        response.hasOwnProperty("subscription_uuid"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "add subscription")
  );
  
  it(
    "update subscription",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      sub.callback.headers = [{"x-foo": "baz"}]
      const response = await s2sMS.Pubsub.updateSubscription(
        accessToken,
        sub_uuid,
        sub,
        trace
      );
      assert.ok(
        response.hasOwnProperty(response?.callback?.headers?.[0]?.["x-foo"] === "baz"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "update subscription")
  );

  // it("add subscription - sms workaround", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace);
  //   const subscriptions = {
  //     identity: ["identity_property_change"]
  //   };
  //   const criteria = [
  //     {user_uuid: "0904f8d5-627f-4ff5-b34d-68dc96487b1e"},
  //     {qs: {someobj:true}}
  //   ];

  //   const expiresDate = new Date(Date.now() + 100000).toISOString();
  //   const response = await s2sMS.Pubsub.addSubscription(
  //     process.env.TEST_IDENTITY,
  //     process.env.testAccount,
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
  // },"add subscription - sms workaround"));

  it(
    "update subscription expiration",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);

      const response = await s2sMS.Pubsub.updateSubscriptionExpiresDate(
        accessToken,
        sub_uuid,
        new Date(Date.now() + 1000000).toISOString(),
        trace
      );
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "update subscription expiration")
  );

  // it(
  //   "delete subscription",
  //   mochaAsync(async () => {
  //     trace = Util.generateNewMetaData(trace);
  //     const response = await s2sMS.Pubsub.deleteSubscription(
  //       sub_uuid,
  //       accessToken,
  //       trace
  //     );
  //     assert.ok(response.status === "ok", JSON.stringify(response, null, "\t"));
  //     return response;
  //   }, "delete subscription")
  // );

  // Custom Pubsub Tests:
  let app_uuid = v4();
  let custom_uuid;
  it(
    "createCustomApplication",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.createCustomApplication(
        accessToken,
        app_uuid, //app_uuid
        ["event1", "event2"], // events
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
    }, "createCustomApplication")
  );

  it(
    "getCustomApplication",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
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
    }, "getCustomApplication")
  );

  it(
    "addCustomEventSubscription",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.addCustomEventSubscription(
        accessToken,
        app_uuid,
        "http://localhost/some/fake/route", // callback url this can't work so it doesn't matte
        [{ important_header: true }],
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
    }, "addCustomEventSubscription")
  );

  it(
    "getCustomSubscription",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
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
    }, "getCustomSubscription")
  );

  it(
    "broadcastCustomApplication",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.broadcastCustomApplication(
        accessToken,
        app_uuid,
        "event1",
        {
          importantStuff: true,
          lessImportantStuff: { foo: "bar" },
        },
        trace
      );
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "broadcastCustomApplication")
  );

  it(
    "deleteCustomSubscription",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.deleteCustomSubscription(
        accessToken,
        custom_uuid,
        trace
      );
      assert.ok(
        response.hasOwnProperty("status") && response.status === "ok",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "deleteCustomSubscription")
  );

  it(
    "deleteCustomApplication",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Pubsub.deleteCustomApplication(
        accessToken,
        app_uuid,
        trace
      );
      assert.ok(
        response.hasOwnProperty("status") && response.status === "ok",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "deleteCustomApplication")
  );

  // template
  // it("change me", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
