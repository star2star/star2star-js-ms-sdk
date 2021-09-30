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
//const logger = new Logger();
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();
let identityData;

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

describe("Activity MS Unit Test Suite", function() {
  let accessToken,
    reportTemplate,
    report;

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
    
      const oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error) {
      throw error;
    }
    
  });

  it("List Reports", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Activity.listReportTemplates(
      accessToken,
      1, // offset
      1,  // limit
      trace
    );
    assert.ok(
      typeof response.items !== "undefined" &&
      Array.isArray(response.items) &&
      typeof response.items[0].template_uuid === "string",
      JSON.stringify(response, null, "\t")
    );
    reportTemplate = response.items[0];
    return response;
  },"List Reports"));

  it("Run Report", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Activity.runReport(
      accessToken,
      reportTemplate.template_uuid, 
      undefined, //owner_uuid
      identityData.account_uuid, 
      {
        "start_time": (Date.now() - 2592000),
        "end_time": Date.now()
      }, //parameters
      trace
    );
    assert.ok(
      typeof response.template_uuid === "string" &&
      typeof response.report_uuid === "string",
      JSON.stringify(response, null, "\t")
    );
    report = response;
    return response;
  },"Run Report"));

  it("Get Report", mochaAsync(async () => {
    // allow report to finish
    await new Promise(resolve => setTimeout(resolve, 3000));
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Activity.getReport(
      accessToken,
      report.report_uuid,
      report.template_uuid, 
      trace
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    report = response;
    return response;
  },"Get Report"));

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