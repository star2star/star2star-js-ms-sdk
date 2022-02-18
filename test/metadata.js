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
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();
let file_id;

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



describe("Media MS Unit Test Suite", function () {

  let accessToken, identityData;

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
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  it("Get Metadata Subsystems", mochaAsync(async () => {
        trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Metadata.getMetadataSubsystems(
      accessToken,
      undefined, // not specifying subsystems
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") && response.items.length > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Metadata Subsystems"));

  // this will need to be expanded as we increase the number of  services.
  it("Get Metadata for Specific Subsystems", mochaAsync(async () => {
        trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Metadata.getMetadataSubsystems(
      accessToken,
      "voice-api",
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") && response.items.length === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Metadata for Specific Subsystems"));

  // template
  // it("change me", mochaAsync(async () => {
  //     //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
