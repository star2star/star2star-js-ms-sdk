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
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      userUUID = idData.user_uuid;
    } catch (error){
      return Promise.reject(error);
    }
  });

  // it("Authorize Provider", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await s2sMS.Providers.authorizeProvider(
  //     //clientID,
  //     "689129445930-qqdrkf38fu6e37gd84nt758lur5kagq2.apps.googleusercontent.com",
  //     // providerUUID,
  //     "57992b0e-ecf3-4105-a291-1ed755719512",
  //     // redirectURL,
  //     "https://cpaas-appdev.star2starglobal.net/providers/providers/a6db5f71-3a6b-45cc-90fa-4ba5a64c1fbd/oauth/callback",
  //     // userUUID,
  //     "9e11c9a7-b03f-4cb3-b6aa-66f6f060aef3",
  //     trace
  //   );
  //   assert.ok(
  //     response.hasOwnProperty("items") &&
  //     response.items.length > 0,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"Authorize Provider"));

  // it("Get Provider Token", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await s2sMS.Providers.getProviderToken(
  //     accessToken,
  //     //clientID,
  //     "689129445930-qqdrkf38fu6e37gd84nt758lur5kagq2.apps.googleusercontent.com",
  //     // providerUUID,
  //     "57992b0e-ecf3-4105-a291-1ed755719512",
  //     // redirectURL,
  //     "https://cpaas-appdev.star2starglobal.net/providers/providers/a6db5f71-3a6b-45cc-90fa-4ba5a64c1fbd/oauth/callback",
  //     // userUUID,
  //     "9e11c9a7-b03f-4cb3-b6aa-66f6f060aef3",
  //     trace
  //   );
  //   assert.ok(
  //     response.hasOwnProperty("items") &&
  //     response.items.length > 0,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"Get Provider Token"));


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

  it("List A User's Connections", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Providers.listUserProviderConnections(
      accessToken,
      userUUID,
      undefined, //policy_uuid filter
      undefined, // provider uuid filter,
      undefined, // username filter,
      trace  
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List A User's Connections"));

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

