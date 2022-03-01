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
      const response = await func();
      logger.debug(name, response);
      return response;
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};

describe("Pubsub MS Unit Test Suite", function () {
  let accessToken, oauthData, identityData, shortCode;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.

      oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(
        accessToken,
        idData.user_uuid
      );
    } catch (error) {
      throw error;
    }
  });

  it(
    "Create Short URL",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.ShortUrls.createShortUrl(
        accessToken,
        { url: "http://www.google.com" },
        trace
      );
      shortCode = response.short_code;
      assert.ok(
        response.hasOwnProperty("short_url_link"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Create Short URL")
  );

  it(
    "List Short URLs",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
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
    }, "List Short URLs")
  );

  it(
    "Delete Short URL",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.ShortUrls.deleteShortCode(
        identityData.uuid,
        accessToken,
        shortCode,
        trace
      );
      assert.ok(response.status === "ok", JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete Short URL")
  );
});
