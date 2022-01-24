//mocha requires
//TODO: Add tests for various result types and native JSONata transitions once workflow microservice is updated to include. nh 11/22/19
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
      const response = await func(name);
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      return Promise.reject(error);
    }
  };
};



describe("Form", function() {
  let accessToken,
    identityData, templateUUID;

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
      // console.log('iii', JSON.stringify(identityData, null, 2 ));
      accountUUID = identityData.account_uuid;
      process.env.isValid = true;
    } catch (error){
      console.log('>>>>', error)
      return Promise.reject(error);
    }
  });

  it("listUserForms", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Forms.listUserForms(
        accessToken,
        identityData.account_uuid,
        undefined,
        undefined,
        undefined,
        trace
      );

      assert.ok(
        true,
        response.hasOwnProperty("items")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"List user Forms"));

  it("listUserFormSubmissions", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Forms.listUserFormSubmissions(
        accessToken,
        identityData.account_uuid,
        "4662e6e6-07dd-4d90-ae84-5925c6732249",
        undefined,
        undefined,
        undefined,
        trace
      );
      console.log('>>>>', response)

      assert.ok(
        true,
        response.hasOwnProperty("items")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"List user Form Submissions"));

  it("createFormTemplate", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      const f = {
        "display": "form",
        "components": []
    };
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Forms.createFormTemplate(
        accessToken,
        "test form",
        "test desc",
        identityData.account_uuid,
        f,
        trace
      );
      // console.log('>>>>', response)
      templateUUID = response.uuid;
      assert.ok(
        true,
        response.hasOwnProperty("uuid")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"create form template"));

  it("getFormTemplate", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      const f = {
        "display": "form",
        "components": []
    };
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Forms.getFormTemplate(
        accessToken,
        templateUUID, 
        undefined,
        trace
      );
      console.log('>>>>', response)
      templateUUID = response.uuid;
      assert.ok(
        true,
        response.hasOwnProperty("uuid")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"create form template"));

  it("deleteFormTemplate", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      const f = {
        "display": "form",
        "components": []
    };
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Forms.deleteFormTemplate(
        accessToken,
        templateUUID, 
        trace
      );
      //console.log('>>>> <<<< ', response)
      assert.ok(
        true,
        response.statusCode === 202
      );
      return response;
    } catch(error) {
      //console.log('eeee', error)
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"create form template"));

});
