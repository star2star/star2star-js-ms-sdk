//mocha requires
//TODO: Add tests for various result types and native JSONata transitions once workflow microservice is updated to include. nh 11/22/19
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
const uuidv4 = require("uuid/v4");
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func(name);
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

describe("Providers", function() {
  let accessToken,
      clientID,
      providerUUID,
      redirectURL,
      userUUID;
  
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
    } catch (error){
      return Promise.reject(error);
    }
  });

  it("Authorize Provider", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Providers.authorizeProvider(
      //clientID,
      "689129445930-qqdrkf38fu6e37gd84nt758lur5kagq2.apps.googleusercontent.com",
      // providerUUID,
      "57992b0e-ecf3-4105-a291-1ed755719512",
      // redirectURL,
      "https://cpaas-appdev.star2starglobal.net/providers/providers/a6db5f71-3a6b-45cc-90fa-4ba5a64c1fbd/oauth/callback",
      // userUUID,
      "9e11c9a7-b03f-4cb3-b6aa-66f6f060aef3",
      trace
    );
    console.log("ap=============================================");
    console.log(response);
    console.log("=============================================ap");
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Authorize Provider"));

  it("Get Provider Token", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    console.log("params a =============================================");
    console.log("accessToken: ", accessToken);
    console.log("trace: ", trace);
    console.log("============================================= params a");
    const response = await s2sMS.Providers.getProviderToken(
      accessToken,
      //clientID,
      "689129445930-qqdrkf38fu6e37gd84nt758lur5kagq2.apps.googleusercontent.com",
      // providerUUID,
      "57992b0e-ecf3-4105-a291-1ed755719512",
      // redirectURL,
      "https://cpaas-appdev.star2starglobal.net/providers/providers/a6db5f71-3a6b-45cc-90fa-4ba5a64c1fbd/oauth/callback",
      // userUUID,
      "9e11c9a7-b03f-4cb3-b6aa-66f6f060aef3",
      trace
    );
    console.log("gpt=============================================");
    console.log(response);
    console.log("=============================================gpt");
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Provider Token"));


  it("List all Available Providers", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Providers.listAvailableProviders(
      accessToken,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List all Available Providers"));

  it("List all User Providers", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Providers.listUsersProviders(
      accessToken,
      // userUUID,
      "9e11c9a7-b03f-4cb3-b6aa-66f6f060aef3",
      trace
    );
    assert.ok(
      response.hasOwnProperty("items"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List all User Providers"));
});

// Providers list
//     { uuid: 'a6db5f71-3a6b-45cc-90fa-4ba5a64c1fbd',
//       name: 'Zoho',
//       type: 'identity',
//     { uuid: '4113039d-61d6-46ab-bc1c-7d66035fc3bf',
//       name: 'Google Drive',
//       type: 'identity',
//     { uuid: '57992b0e-ecf3-4105-a291-1ed755719512',
//       name: 'Google',
//       type: 'identity',
