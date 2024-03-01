//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

//test requires
const fs = require("fs");
const { v4 } = require("uuid");
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

describe("Voice MS Test Suite", function() {
  let accessToken, identityData;

  before(async function() {
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
      const idData =  await s2sMS.Identity.getMyIdentityData(accessToken); 
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch(error) {
      throw error;
    }  
  });

  it("Get Extensions By Account", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Voice.getExtensionsByAccount(
      accessToken,
      process.env.ACCOUNT_UUID, 
      "customer", // account type
      "channels,metadata", // include
      0, // offset
      10, // limit
      trace
    );
    response;
    console.log("response", response)
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Extensions By Account"));

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

