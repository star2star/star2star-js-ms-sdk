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



let accessToken;

describe("Lamda MS Unit Test Suite", function() {
  before(async () => {
    try {
      

      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.MS_HOST);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
    
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.CPAAS_OAUTH_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
    } catch (error) {
      return Promise.reject(error);
    }  
  });

  it("list lambdas", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Lambda.listLambdas(accessToken, trace);
    assert.ok(
      response.items.length > 0 &&
      response.items[0].hasOwnProperty("name"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"list lambdas"));
  
  it("invokeGoodLambda", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const params = {
      x: 1,
      y: 2
    };
    const response = await s2sMS.Lambda.invokeLambda(
      accessToken,
      "james-add-numbers",
      params,
      trace
    );
    assert.ok(
      response.add === 3,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"invokeGoodLambda"));

  it("invokeBadLambda", mochaAsync(async () => {
    try {
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Lambda.invokeLambda(
        accessToken, 
        "this one does not exist",
        {env: "dev"},
        trace
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 404,
        JSON.stringify(error, null, "\t")
      );
    }
  },"invokeBadLambda")); 
  
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
