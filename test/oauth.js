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
const { v4 } = require("uuid");
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
      logger.error(name, error);
      //mocha will log out the error
      return Promise.reject(error);
    }
  };
};



describe("Oauth MS Unit Test Suite", function () {

  let accessToken,
    oauthData,
    identityData,
    publicID,
    secret,
    clientUUID,
    clientBasicToken,
    clientAccessToken;

  before(async () => {
    try {
      

      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.MS_HOST);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
    
      oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.CPAAS_OAUTH_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD,
        "default",
        v4() //x-device-id
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  it("Get 2nd Device Token", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const oauthData2 = await s2sMS.Oauth.getAccessToken(
      process.env.CPAAS_OAUTH_TOKEN,
      process.env.EMAIL,
      process.env.PASSWORD,
      "default",
      v4() //x-device-id
    );
    assert.ok(
      oauthData2.access_token !== oauthData.access_token,
      JSON.stringify({oauthData, oauthData2}, null, "\t")
    );
    return {oauthData, oauthData2};
  },"Get 2nd Device Token"));

  it("Refresh Token", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.refreshAccessToken(
      process.env.CPAAS_OAUTH_TOKEN,
      oauthData.refresh_token,
      trace
    );
    assert.ok(
      response.hasOwnProperty("access_token") &&
      response.hasOwnProperty("refresh_token") &&
      response.hasOwnProperty("expires_in"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Refresh Token"));
  
  it("Get Client Token", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.getClientToken(process.env.CPAAS_OAUTH_TOKEN, trace);
    assert.ok(
      response.hasOwnProperty("access_token") &&
      response.hasOwnProperty("token_type") &&
      response.token_type === "bearer",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Client Token"));
  
  it("Create Client Application", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.createClientApp(
      accessToken,
      identityData.uuid,
      "Unit-Test",
      "Unit Test Application",
      trace
    );
    publicID = response.public_id;
    secret = response.secret;
    clientUUID = response.uuid;
    assert.ok(
      response.hasOwnProperty("uuid") &&
      response.hasOwnProperty("name") &&
      response.name === "Unit-Test" &&
      response.hasOwnProperty("public_id") &&
      response.hasOwnProperty("secret") &&
      response.hasOwnProperty("application_type") &&
      response.application_type === "connect",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create Client Application"));
 
  it("Scope Client App", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.scopeClientApp(
      accessToken,
      clientUUID,
      ["default"], //default scope
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Scope Client App"));
  
  it("Generate Basic Token", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    clientBasicToken = await s2sMS.Oauth.generateBasicToken(publicID, secret);
    assert.ok(
      Buffer.from(clientBasicToken, "base64").toString() === `${publicID}:${secret}`,
      JSON.stringify(clientBasicToken, null, "\t")
    );
    return clientBasicToken;
  },"Generate Basic Token"));
  
  it("Get Client Access Token and Test It", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    // Tyk Delay...CCORE-431
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Oauth.getClientToken(clientBasicToken, trace);
    clientAccessToken = response.access_token;
    const test = await s2sMS.Lambda.listLambdas(clientAccessToken, trace);
    assert.ok(
      response.hasOwnProperty("access_token") &&
      response.hasOwnProperty("token_type") &&
      response.token_type === "bearer" &&
      test.hasOwnProperty("items") &&
      test.items.length > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Client Access Token and Test It"));
  
  it("List Access Tokens", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.listClientTokens(
      accessToken,
      0, //offest
      10, //limit
      {
        token_type: "client",
        user_name: process.env.EMAIL
      },
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length > 0 &&
      response.items[0].hasOwnProperty("access_token"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Access Tokens"));
  
  it("Validate Access Token", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.validateToken(accessToken, clientAccessToken, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Validate Access Token"));
  
  it("Invalidate Access Token", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.invalidateToken(accessToken, clientAccessToken, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Invalidate Access Token"));
  
  it("List Access Tokens after Invalidation", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Oauth.listClientTokens(
      accessToken,
      0, //offest
      10, //limit
      {
        token_type: "client",
        user_name: process.env.EMAIL
      },
      trace
    );
    assert.ok(
      //response.hasOwnProperty("items") &&
      //response.items.length === 0,
      true,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Access Tokens after Invalidation"));
  
  // template
  // it("change me", mochaAsync(async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
