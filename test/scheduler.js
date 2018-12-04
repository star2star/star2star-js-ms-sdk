const assert = require("assert");
const s2sMS = require("../src/index");
const fs = require("fs");
const util = require("../src/utilities");
const logger = util.logger;

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};
// ********* WORK IN PROGRESS **********

describe("Objects MS Test Suite", function() {
  let accessToken, identityData, event;

  before(function() {
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
    return new Promise((resolve, reject) => {
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      ).then(oauthData => {
        //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
        accessToken = oauthData.access_token;
        s2sMS.Identity.getMyIdentityData(accessToken)
          .then(idData => {
            s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid)
              .then(identityDetails => {
                identityData = identityDetails;
                resolve();
              })
              .catch(e1 => {
                reject(e1);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    });
  });

  it("Shedule Event", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Scheduler.scheduleEvent(
      accessToken,
      identityData.uuid, //user_uuid
      new Date(Date.now() + 36000000).toISOString(), //start_time
      "America/New_York", // timezone
      "Unit-Test", //name
      "A Unit Test Scheduled Event", //description
      {
        "type": "hour",
        "interval": 4
      }, //frequency
      {  
        "type": "workflow",
        "workflow_uuid": "0259c370-9173-4c65-8e92-d415a7fc15e1",
        "parameters": {"foo":"bar"}
      }, //trigger
      {
        "type": "pubsub",
        "account_uuid": identityData.account_uuid,
        "user_uuid": identityData.uuid
      } //notification
    )
      .then(responseData => {
        logger.info(`Shedule Event RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
        event = responseData;
        done();
      })
      .catch(error => {
        logger.error(`Schedule Event ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(JSON.stringify(error)));
      });
  });

  it("List Events", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Scheduler.listEvents(
      accessToken,
      0, //offset
      5 //limit
    )
      .then(responseData => {
        logger.info(`List Events RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
        done();
      })
      .catch(error => {
        logger.error(`List Events ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(JSON.stringify(error)));
      });
  });
  
  it("Get Event", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Scheduler.getEvent(
      accessToken,
      event.uuid
    )
      .then(responseData => {
        logger.info(`Get Event RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
        done();
      })
      .catch(error => {
        logger.error(`Get Event ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(JSON.stringify(error)));
      });
  });

  it("Update Event", function(done) {
    if (!creds.isValid) return done();
    //update event body
    s2sMS.Scheduler.updateEvent(
      accessToken,
      event
    )
      .then(responseData => {
        logger.info(`Update Event RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
        done();
      })
      .catch(error => {
        logger.error(`Update Event ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(JSON.stringify(error)));
      });
  });

  it("Delete Event", function(done) {
    if (!creds.isValid) return done();
    //update event body
    s2sMS.Scheduler.deleteEvent(
      accessToken,
      event
    )
      .then(responseData => {
        logger.info(`Delete Event RESPONSE: ${JSON.stringify(responseData, null, "\t")}`);
        done();
      })
      .catch(error => {
        logger.error(`Delete Event ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(JSON.stringify(error)));
      });
  });

});
