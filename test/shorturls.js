//mocha requires
import "@babel/polyfill";
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = Util.getLogger();
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

describe("Pubsub MS Unit Test Suite", function () {

  let accessToken,
    oauthData,
    identityData,
    shortCode;

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
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error) {
      return Promise.reject(error);
    }
  });
 

  it("Create Short URL", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.ShortUrls.createShortUrl(
      accessToken,
      { "url": "http://www.google.com"},
      trace
    );
    shortCode = response.short_code;
    assert.ok(
      response.hasOwnProperty("short_url_link"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create Short URL"));

  it("List Short URLs", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.ShortUrls.listShortUrls(
      identityData.uuid,
      accessToken,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") && response.items.length > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Short URLs"));

  it("Delete Short URL", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.ShortUrls.deleteShortCode(
      identityData.uuid,
      accessToken,
      shortCode,
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Short URL"));
});