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
const logger = require("./node-logger").getInstance();
const objectMerge = require("object-merge");
const { v4 } = require("uuid");
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
    identityData;

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
      const idData =  await s2sMS.Identity.getMyIdentityData(accessToken); 
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);

    } catch (error) {
      return Promise.reject(error);
    }
  });
 
  it("Register Push Token", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Mobile.registerPushToken(
      accessToken,
      identityData.uuid,
      creds.pushToken,
      "android", //platform
      "starmessenger", //applcation
      trace
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Register Push Token")); 

  it("List Push Tokens", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Mobile.getUserRegistrations(
      accessToken,
      identityData.uuid,
      trace
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Push Tokens")); 

  it("Unregister Push Token", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Mobile.unregisterPushToken(
      accessToken,
      creds.pushToken,
      trace
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Unregister Push Token")); 

  

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