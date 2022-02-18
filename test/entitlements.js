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
      const response = await func(name);
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};



describe("Objects MS Test Suite", function() {
  let accessToken,
    uuid;

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

      accessToken = process.env.WSG_TOKEN//oauthData.access_token;
      console.log("ARRRR", accessToken)

    } catch (error){
      throw error;
    }
  });

  it("Get Products", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Entitlements.getProducts(
      accessToken,
      3,
      5,
      undefined, // no filters
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") && 
      response.items[0].hasOwnProperty("uuid") &&
      response.items[0].uuid !== undefined,
      JSON.stringify(response, null, "\t")
    );
    uuid = response.items[0].uuid;
    return response;
  },"Get Products"));

  it("Get Filtered Proudcts", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Entitlements.getProducts(
      accessToken,
      0,
      1,
      {
        "application_uuid": "92fb4c8a-1407-4768-90a0-1da4bdde1861" // click to dial
      }, // no filters
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") && 
      response.items[0].hasOwnProperty("application_uuid") &&
      response.items[0].application_uuid === "92fb4c8a-1407-4768-90a0-1da4bdde1861",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Filtered Proudcts"));

  it("Get Product", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Entitlements.getProduct(
      accessToken,
      uuid,
      trace
    );
    assert.ok(
      response.hasOwnProperty("uuid") &&
      response.uuid === uuid,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Product"));

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
