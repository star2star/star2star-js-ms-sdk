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

describe("Form", function() {
  let accessToken,
  identityData,
    version;

  const groupName = "UNIT-TEST-GROUP";

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
      // console.log('>>>', JSON.stringify(oauthData))
      accessToken = oauthData.access_token;
      // console.log('aaaa', accessToken)
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      // console.log('>>>>', JSON.stringify(idData))
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
      creds.isValid = true;
    } catch (error){
        console.log('eeee', JSON.stringify(error))
      return Promise.reject(error);
    }
  });

  it("listUserForms", mochaAsync(async () => {
    try{
      if (!creds.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Form.listUserForms(
        accessToken,
        identityData.account_uuid,
        undefined,
        undefined,
        undefined,
        trace
      );

      assert.ok(
        true,
        response.hasOwnProperty("items")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"List user Forms"));
});
