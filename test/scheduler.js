//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

//test requires
const fs = require("fs");
const { v4 } = require("uuid");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = require("../src/node-logger").getInstance();
let trace = Util.generateNewMetaData();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func(name);
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};

describe("Scheduler MS Test Suite", function() {
  let accessToken, identityData, event, workflowUUID;

  before(async function() {
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
              "uuid": v4(),
              "description": ""
            },
            {
              "name": "End",
              "description": "End Node",
              "type": "finish",
              "uuid": v4()
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
              "uuid": v4()
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
      logger.debug(`Workflow UUID: ${workflowUUID}`);
    } catch(error) {
      throw error;
    }  
  });

  // Template for New Test............
  // it("change me", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(1 === 1);
  //   return response;
  // },"change me"));

  it("Shedule Event", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
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
      }, // metadata
      trace
    );
    event = response;
    assert.ok(
      response.user_uuid === identityData.uuid &&
      response.timezone === "America/New_York" &&
      response.description === "A Unit Test Scheduled Event" &&
      response.frequency.type === "once" &&
      response.trigger.workflow_uuid === workflowUUID &&
      response.metadata.someImportantMeta === true,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Shedule Event"));

  it("List Events", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    //update event body
    const response = await s2sMS.Scheduler.listEvents(
      accessToken,
      0, //offset
      5, //limit
      trace
    );
    assert(
      response.items[0].uuid === event.uuid,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Events"));

  it("Get Event", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Scheduler.getEvent(
      accessToken,
      event.uuid,
      trace
    );
    assert.ok(response.uuid === event.uuid,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Event"));
  
  it("Check Event Fired", mochaAsync(async () => {
    console.log("******* \"Check Event Fired\" is running, and can take several seconds to complete. *******");
        //setting the timout for this test to overide mocha config.
    //this.timeout(90000);
    //wait for the scheduler to run the workflow
    await new Promise(resolve => setTimeout(resolve, 70000));

    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Workflow.getWfTemplateHistory(
      accessToken,
      workflowUUID,
      0, // offset
      10, // limit
      undefined, // filters
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length > 0 &&
      response.items[0].template_uuid === workflowUUID &&
      response.items[0].result_type === "complete",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Check Event Fired")).timeout(90000);

  it("Update Event", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    event.start_datetime = new Date(Date.now() + 60000).toISOString();
    event.frequency.type = "once";
    delete event.frequency.interval;
    delete event.frequency.count;
    delete event.frequency.end_datetime;
    delete event.frequency.day_of_week;
    delete event.frequency.day_of_month;
    delete event.frequency.specific_weekday;
    const response = await s2sMS.Scheduler.updateEvent(
      accessToken,
      event.uuid,
      event,
      trace
    );
    assert.ok(
      response.frequency.type === "once",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Update Event"));
  
  it("Delete Event", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    //update event body
    const response = await s2sMS.Scheduler.deleteEvent(
      accessToken,
      event.uuid,
      trace
    );
    assert(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Event"));

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


  // clean up
  after(mochaAsync(async () => {
    return await s2sMS.Workflow.deleteWorkflowTemplate(accessToken,workflowUUID,"0.0.0");
  }, "Post Test Clean Up"));
});

