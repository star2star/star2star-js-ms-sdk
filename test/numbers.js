//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
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

describe("Numbers MS Unit Test Suite", function () {
  let accessToken, identityData, numbers;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.

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
    "Get Available States",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.getAvailableStates(
        accessToken,
        trace
      );
      assert.ok(
        response?.items,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Available States")
  );

  it(
    "Get Available Rate Centers by State",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.getAvailableRateCenters(
        accessToken,
        "FL",
        trace
      );
      assert.ok(
        response?.items,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Available Rate Centers by State")
  );

  it(
    "Get Available Area Codes by State and Rate Center",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.getAvailableAreaCodes(
        accessToken,
        "FL",
        "MIAMI",
        trace
      );
      assert.ok(
        response?.items,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Available Area Codes by State and Rate Center")
  );

  it(
    "List 5 Available Numbers",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.listAvailableNumbers(
        accessToken,
        "AL", // quantity = 5
        "VIx", // network
        undefined, // state
        undefined, // rate center
        undefined, // area code
        trace
      );
      //use these for the provision test
      assert.ok(
        response?.items?.length === 5,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List 2 Available Numbers")
  );

  it(
    "List 3 Available Numbers with State",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.listAvailableNumbers(
        accessToken,
        3, // quantity
        "VIx", // network
        "FL", // state
        undefined, // rate center
        undefined, // area code
        trace
      );
      assert.ok(
        response?.items?.length === 3,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List 3 Available Numbers with State")
  );

  it(
    "List 4 Available Numbers with State and Rate Center",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.listAvailableNumbers(
        accessToken,
        4, // quantity
        "VIx", // network
        "FL", // state
        "MIAMI", // rate center
        undefined, // area code
        trace
      );
      assert.ok(
        response?.items?.length === 4,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List 4 Available Numbers with State and Rate Center")
  );

  it(
    "List 2 Available Numbers with State, Rate Center, and Area Code",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.listAvailableNumbers(
        accessToken,
        2, // quantity
        "VIx", // network
        "FL", // state
        undefined, // rate center
        305, // area code
        trace
      );
      numbers = response.items;
      assert.ok(
        response?.items?.length === 2 && response.items[0].indexOf(305) !== -1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List 2 Available Numbers with State, Rate Center, and Area Code")
  );

  it(
    "Provision Numbers",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.provisionNumbers(
        accessToken,
        numbers,
        "VI", // provider
        identityData.account_uuid,
        identityData.uuid,
        "A very helpful help message",
        true, // is campaign
        Date.now(), // reference id
        "US", // country format
        trace
      );
      assert.ok(
        response?.enabled?.length === 2,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Provision Numbers")
  );

  it(
    "Update Numbers Help",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.provisionNumbersHelp(
        accessToken,
        numbers,
        "An updated very helpful help message",
        "US", // country format
        trace
      );
      console.log("help text", response)
      assert.ok(
        response.help_text === "An updated very helpful help message",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Update Numbers Help")
  );

  it(
    "Update Numbers Reference ID",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.provisionNumbersRefId(
        accessToken,
        numbers,
        "updated_ref_id", // reference id
        "US", // country format
        trace
      );
      assert.ok(
        response.reference_id === "updated_ref_id",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Update Numbers Reference ID")
  );

  it(
    "Get Provisioned Numbers By Account",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.getProvisionedNumbersByAccount(
        accessToken,
        identityData.account_uuid,
        trace
      );
      assert.ok(
       1 === 1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Provisioned Numbers By Account")
  );

  it(
    "Get Provisioned Numbers By User",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.getProvisionedNumbersByUser(
        accessToken,
        identityData.uuid,
        trace
      );
      assert.ok(
        1 === 1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Provisioned Numbers By User")
  );

  it(
    "Deprovision Numbers",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Numbers.deprovisionNumbers(
        accessToken,
        numbers,
        "VI", // provider
        identityData.account_uuid,
        identityData.uuid,
        "US", // country format
        trace
      );
      assert.ok(
        response?.disabled?.length === 2,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Deprovision Numbers")
  );
  

  // template
  // it("change me", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
