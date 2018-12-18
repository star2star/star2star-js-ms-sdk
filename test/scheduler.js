//mocha reqruies
require("babel-polyfill");
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

//test requires
const fs = require("fs");
const uuidv4 = require("uuid/v4");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logLevel = Util.getLogLevel();
const logPretty = Util.getLogPretty();
import Logger from "../src/node-logger";
const logger = new Logger();
logger.setLevel(logLevel);
logger.setPretty(logPretty);

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

describe("Objects MS Test Suite", function() {
  let accessToken, identityData, event, workflowUUID;

  before(async function() {
    try {
      
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
        // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost("https://cpaas.star2starglobal.net");
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
      
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      const oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
      const idData =  await s2sMS.Identity.getMyIdentityData(accessToken); 
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
      //create a simple workflow to use to test the scheduler
      const workflow = await s2sMS.Workflow.createWorkflowTemplate(
        accessToken,
        {
          "name": "test",
          "description": "",
          "version": "0.0.0",
          "status": "active",
          "states": [
            {
              "name": "Manual",
              "type": "start",
              "uuid": uuidv4(),
              "description": ""
            },
            {
              "name": "End",
              "description": "End Node",
              "type": "finish",
              "uuid": uuidv4()
            }
          ],
          "transitions": [
            {
              "condition": {
                "type": "passthrough",
                "data": {
                  "passthrough_condition": {}
                }
              },
              "description": "Transition for Manual",
              "name": "T-Manual-0",
              "next_error_state": "End",
              "next_state": "End",
              "next_timeout_state": "End",
              "start_state": "Manual",
              "timeout": "0",
              "uuid": uuidv4()
            }
          ],
          "users": {
            "account_uuid": identityData.account_uuid,
            "user_uuids": [
              identityData.uuid
            ]
          },
          "globals": {
            "token": accessToken
          }
        }
      );
      workflowUUID = workflow.uuid;
      logger.info(`Workflow UUID: ${workflowUUID}`);
    } catch(error) {
      return Promise.reject(error);
    }  
  });

  it("Shedule Event", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const response = await s2sMS.Scheduler.scheduleEvent(
      accessToken,
      identityData.uuid, //user_uuid
      new Date(Date.now() + 60000).toISOString(), //start_time one minute in future (minimum offset)
      "America/New_York", // timezone
      "Unit-Test", //name
      "A Unit Test Scheduled Event", //description
      {
        "type": "once"
      }, //frequency
      {  
        "type": "workflow",
        "workflow_uuid": workflowUUID,
        "parameters": {"foo":"bar"}
      }, //trigger
      {
        "type": "pubsub",
        "account_uuid": identityData.account_uuid,
        "user_uuid": identityData.uuid
      }, //notification
      {
        "someImportantMeta": true
      } // metadata
    );
    assert(1 === 1);
    event = response;
    return response;
  },"Shedule Event"));

  it("List Events", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    //update event body
    const response = await s2sMS.Scheduler.listEvents(
      accessToken,
      0, //offset
      5 //limit
    );
    assert(1 === 1);
    return response;
  },"List Events"));

  // it("Get Event", function(done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Scheduler.getEvent(
  //     accessToken,
  //     event.uuid
  //   )
  //     .then(responseData => {
  //       logger.trace(`Get Event RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
  //       done();
  //     })
  //     .catch(error => {
  //       logger.error(`Get Event ERROR: ${JSON.stringify(error, null, "\t")}`);
  //       done(new Error(JSON.stringify(error)));
  //     });
  // });

  // it("Update Event", function(done) {
  //   if (!creds.isValid) return done();
  //   //update event body
  //   s2sMS.Scheduler.updateEvent(
  //     accessToken,
  //     event
  //   )
  //     .then(responseData => {
  //       logger.info(`Update Event RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
  //       done();
  //     })
  //     .catch(error => {
  //       logger.error(`Update Event ERROR: ${JSON.stringify(error, null, "\t")}`);
  //       done(new Error(JSON.stringify(error)));
  //     });
  // });

  
  it("Delete Event", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    //update event body
    const response = await s2sMS.Scheduler.deleteEvent(
      accessToken,
      event.uuid
    );
    assert(response.status === "ok");
    return response;
  },"Delete Event"));

  // clean up
  after(mochaAsync(async () => {
    return await s2sMS.Workflow.deleteWorkflowTemplate(accessToken,workflowUUID,"0.0.0");
  }, "Post Test Clean Up"));
});

// template
// it("change me", mochaAsync(async () => {
//   if (!creds.isValid) throw new Error("Invalid Credentials");
//   //update event body
//   const response = await somethingAsync();
//   assert(1 === 1);
//   return response;
// },"change me"));