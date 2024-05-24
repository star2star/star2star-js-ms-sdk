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
      const response = await func(name);
      logger.debug(name, response);
      return response;
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};

describe("usage MS Test Suite", function () {
  let accessToken, userUUID, templateUUID, billingStart, billingEnd, reportUUID;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      // console.log('pppp', process.env)
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );

      accessToken = oauthData.access_token;
      // console.log('tttttt')
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      userUUID = idData.user_uuid;
      // console.log("ARRRR", accessToken)
    } catch (error) {
      console.log("eeeee", error);
      throw error;
    }
  });

  it(
    "Create Event",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Usage.createEvent(
        accessToken,
        process.env.ACCOUNT_UUID,
        null, // application uuid
        "sms_did_request", // type
        {
          brand_id: "UNIT TEST",
          brand_name: "UNIT TEST",
          campaign_id: "UNIT TEST",
          campaign_name: "Unit Test 2024-05-24T14:00:24.630Z",
          did: "9415481601",
          action: "REMOVE",
          user_uuid: "5aa2b6ea-f746-4b05-bb2b-7df7554261f9",
          user_email: "nharris@sangoma.com",
        },
        trace
      );
      assert.ok(
        response.account_uuid === process.env.ACCOUNT_UUID &&
          response.metadata?.action === "REMOVE",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Create Event")
  );

  it(
    "Get Account Billing Cycle",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Usage.getAccountBillingCycle(
        accessToken,
        process.env.ACCOUNT_UUID,
        trace
      );
      billingStart = response.start_date;
      billingEnd = response.end_date;
      const now = new Date(Date.now());
      const start = new Date(response.start_date);
      const end = new Date(response.end_date);
      assert.ok(
        now.getFullYear() === start.getFullYear() ||
          now.getFullYear() === end.getFullYear(),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Account Billing Cycle")
  );

  it(
    "List Usage Template",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Usage.listUsageTemplates(
        accessToken,
        0, // offset
        1, // limit
        trace
      );
      templateUUID = response.items?.[0].uuid;
      assert.ok(
        typeof response.items?.[0].uuid === "string",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List Usage Template")
  );

  it(
    "Run Usage Report",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Usage.runUsageReport(
        accessToken,
        templateUUID,
        billingStart,
        billingEnd,
        process.env.ACCOUNT_UUID,
        undefined, // applicationUUID,
        undefined, // eventType,
        undefined, // offset
        undefined, // limit
        undefined, // filterValues
        trace = {}
      );
      reportUUID = response.report_uuid;
      assert.ok(
        response.status === "CREATED" || response.status === "SUCCEEDED",
        JSON.stringify(response, null, "\t")
      );
      // allow report to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      return response;
    }, "Run Usage Report")
  );

  it(
    "Get Usage Report",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Usage.getUsageReport(
        accessToken,
        reportUUID,
        trace = {}
      );
      assert.ok(
        response.status === "CREATED" || response.status === "SUCCEEDED" &&
        response.status === "SUCCEEDED" ? typeof response.location === "string" : true,
        JSON.stringify(response, null, "\t")
      );
      // allow report to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      return response;
    }, "Get Usage Report")
  );
});
