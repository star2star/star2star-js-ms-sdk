//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = s2sMS.Util;
const logger = require("../src/node-logger").getInstance();
let trace;

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response;
    } catch (error) {
      logger.debug(name, Util.formatError(error));
      //mocha will log out the error
      throw error;
    }
  };
};

describe("DbSips MS Unit Test Suite", function () {
  let accessToken, identityData, testUUID, testGroupUuid;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);

      // get accessToken to use in test cases
      const oauthData = await s2sMS.Oauth.getAccessToken(
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
    "List Destinations",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.DbSip.getAccountDestinations(
        accessToken,
        identityData.account_uuid,
        0, // offset
        100, // limit
        {}, // filters
        false, // aggregate
        trace
      );
      assert.ok(
        Array.isArray(response.items) && response.items.length > 0,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List Destinations")
  );

  it(
    "List Destinations With Offset and Limit",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.DbSip.getAccountDestinations(
        accessToken,
        identityData.account_uuid,
        10, // offset
        10, // limit
        {}, // filters
        false, // aggregate
        trace
      );
      assert.ok(
        Array.isArray(response.items) &&
          response.items.length === 10 &&
          response.metadata.offset === 10,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List Destinations")
  );

  it(
    "List Destinations Aggregate",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.DbSip.getAccountDestinations(
        accessToken,
        identityData.account_uuid,
        0, // offset
        100, // limit
        {}, // filters
        true, // aggregate
        trace
      );
      assert.ok(
        Array.isArray(response.items) &&
          response.items.length === 10 &&
          response.metadata.offset === 10,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List Destinations Aggregate")
  );

  // template
  // it("change me", mochaAsync(async () => {
  //
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
