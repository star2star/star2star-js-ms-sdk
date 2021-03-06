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
const objectMerge = require("object-merge");
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

let accessToken, identityData;

describe("Email MS Unit Test Suite", function() {
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
      return Promise.reject(error);
    }
    
  });
  
  it("Send Valid Email", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const sender = identityData.username;
    const to = [identityData.username];
    const subject = "a test";
    const message = "a test";
    const type = "text";
    const response = await s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Valid Email"));

  it("Send Invalid Sender Email", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    try{
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const sender = "invalid";
      const to = [identityData.username];
      const subject = "a test";
      const message = "a test";
      const type = "text";
      const response = await s2sMS.Email.sendEmail(
        accessToken,
        sender,
        to,
        subject,
        message,
        type
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error){
      assert.ok(
        error.hasOwnProperty("message") &&
        error.message === "invalid request",
        JSON.stringify(error, null, "\t"));
      return error;
    }
  },"Send Invalid Sender Email"));

  it("Send Invalid Recipient Email", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    try{
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const sender = identityData.username;
      const to = ["invalid"];
      const subject = "a test";
      const message = "a test";
      const type = "text";
      const response = await s2sMS.Email.sendEmail(
        accessToken,
        sender,
        to,
        subject,
        message,
        type,
        trace
      );
      assert.ok(
        1 === 1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error){
      assert.ok(
        error.hasOwnProperty("message") &&
        error.message === "invalid request",
        JSON.stringify(error, null, "\t"));
      return error;
    }
    
  },"Send Invalid Recipient Email"));

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
