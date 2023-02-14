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
    "Get Enumerations",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Campaigns.getEnumerations(
        accessToken,
        trace
      );
      assert.ok(
        Array.isArray(response.entity_types) && 
        response.entity_types.length > 0 && 
        Array.isArray(response.verticals) && 
        response.verticals.length > 0 &&
        Array.isArray(response.stock_exchanges) && 
        response.stock_exchanges.length > 0,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Enumerations")
  );

  it(
    "Create Brand",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Campaigns.createBrand(
        accessToken,
        identityData.account_uuid,
        `Sangoma Unit Test ${Date.now()}`, // legalName
        `Sangoma Unit Test ${Date.now()}`, // brandName
        "PUBLIC_PROFIT", // organization_type
        "US", // registrationCountry
        555555555, // taxId
        "US", // taxIdCountry 
        undefined, // altBusinessIdType,
        undefined, // altBusinessId,
        "TECHNOLOGY", // vertical
        "300 N. Cattlemen Rd. Suite 300", // address
        "Sarasota", // city
        "FL", // state
        34232, // postalCode
        "https://sangoma.com", // website
        "SANG", // stockSymbol
        "NASDAQ", // stockExchange
        "third-party-support+10DLC-test@sangoma.com", // emailAddress
        "9412340001", // phoneNumber
        "Unit", // firstName
        "Test", // lastName
        trace
      );
      assert.ok(response.account_uuid === identityData.account_uuid,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Create Brand")
  );

  it(
    "Get Brand",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Campaigns.getBrand(
        accessToken,
        identityData.account_uuid,
        trace
      );
      assert.ok(response.account_uuid === identityData.account_uuid,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Brand")
  );

  it(
    "Get Brand Usecases",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Campaigns.getBrandUseCases(
        accessToken,
        identityData.account_uuid,
        trace
      );
      assert.ok(Array.isArray(response),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get Brand Usecases")
  );

  it(
    "Delete Brand",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Campaigns.deleteBrand(
        accessToken,
        identityData.account_uuid,
        trace
      );
      assert.ok(response.status === "success",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Delete Brand")
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
