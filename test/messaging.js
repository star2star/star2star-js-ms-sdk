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

describe("Messaging MS Unit Test Suite", function () {
  let accessToken, identityData, conversationUUID, context, messages;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.

      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(
        accessToken,
        idData.user_uuid
      );
    } catch (error) {
      throw error;
    }
  });

  it(
    "Send Simple SMS",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.sendSimpleSMS(
        accessToken,
        process.env.SMS_FROM,
        process.env.SMS_TO,
        "a test",
        "text",
        {},
        trace
      );
      assert.ok(
        response.hasOwnProperty("uuid"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Send Simple SMS")
  );

  it(
    "Get Conversation",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.getConversation(
        accessToken,
        identityData.uuid,
        process.env.SMS_TO,
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      conversationUUID = response.uuid;
      context = response.context.uuid;
      return response;
    }, "Get Conversation")
  );

  it(
    "Send Message",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      //only saving last response
      let response;
      for (const i of ["one","two","three"]){

      
      response = await s2sMS.Messaging.sendMessage(
        accessToken,
        identityData.uuid,
        context,
        process.env.SMS_FROM,
        "sms",
        [
          {
            "type": "text",
            "body": i
          }
        ],
        trace
      );
      }
      assert.ok(true, JSON.stringify(response, null, "\t"));

      return response;
    }, "Send Message")
  );

  it(
    "Retrieve Messages",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.retrieveMessages(
        accessToken,
        conversationUUID,
        0, // offest
        100, // limit
        trace
      );
      messages = response.items;
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Retrieve Messages")
  );

  it(
    "Delete Message",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.deleteMessage(
        accessToken,
        messages[0].uuid,
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete Message")
  );

  it(
    "Delete Multiple Messages",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.deleteMultipleMessages(
        accessToken,
        [
          messages[1].uuid,
          messages[2].uuid,
        ],
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete Multiple Messages")
  );

  it(
    "Get Conversation UUID",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.getConversationUuid(
        accessToken,
        identityData.uuid,
        process.env.SMS_TO,
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Get Conversation UUID")
  );

  it(
    "Retrieve Conversations",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.retrieveConversations(
        accessToken,
        identityData.uuid,
        0, // offset
        100, // limit
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Retrieve Conversations")
  );

  it(
    "Mark All Conversations Read",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.markAllConversationMessagesRead(
        accessToken,
        conversationUUID,
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Mark All Conversations Read")
  );

  it(
    "Delete Conversation",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.deleteConversation(
        accessToken,
        conversationUUID,
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete Conversation")
  );

  it(
    "Delete Multiple Conversations",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.deleteMultipleConversations(
        accessToken,
        //[conversationUUID],
        // ['6eb4196d-aa9d-4725-8e8d-1d7aa63aedc4', '7fd4aaa5-712e-4e15-9b3b-a693d4a25f93', 'f89e0cc6-3f19-4449-878c-25491625ae79'],
        [
          "98da72f1-1cdf-4f91-b19f-b247651903fa",
          "2e878ef2-7975-4b21-b01e-000e3448bafb",
          "13c9eba5-3cc7-49e0-b957-392716adeb35",
        ],
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete Multiple Conversations")
  );

  it(
    "Snooze Unsnooze Conversation",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.snoozeUnsnoozeConversation(
        accessToken,
        //[conversationUUID],
        "86725a3d-0f17-4e0a-8767-f6497d859ff9",
        true,
        trace
      );
      assert.ok(true, JSON.stringify(response, null, "\t"));
      return response;
    }, "Snooze Unsnooze Conversation")
  );

  it(
    "Valid SMS Number",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Messaging.getSMSNumber(
        accessToken,
        identityData.uuid,
        trace
      );
      assert.ok(
        response === `+1${process.env.SMS_FROM}`,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Valid SMS Number")
  );

  it(
    "GetSMS for Invalid USER UUID",
    mochaAsync(async () => {
      try {
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Messaging.getSMSNumber(
          accessToken,
          "3811af4e-d797-4eb7-a150-a369072278ae", // random uuid
          trace
        );
        assert.ok(false, JSON.stringify(response, null, "\t"));
        return response;
      } catch (error) {
        assert.ok(error.code === 404, JSON.stringify(error, null, "\t"));
      }
    }, "GetSMS for Invalid USER UUID")
  );

  // FIXME once CSRVS-155 is figured out
  // it("Send SMS", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace);
  //   const response = await s2sMS.Messaging.sendSMS(
  //     accessToken,
  //     identityData.uuid,
  //     "msg",
  //     Date.now(),
  //     "9412340001"
  //   );
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"Send SMS"));

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
