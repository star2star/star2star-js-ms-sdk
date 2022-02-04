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
const Logger = require("../src/node-logger");
const logger = Logger.getInstance();
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
      throw error;
    }
  };
};

describe("Form", function () {
  let accessToken, identityData, formUUID, templateUUID, formTemplate;

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
      accountUUID = identityData.account_uuid;
      process.env.isValid = true;
    } catch (error) {
      throw error
    }
  });

  it(
    "listUserForms",
    mochaAsync(async () => {
      try {
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Forms.listUserForms(
          accessToken,
          identityData.account_uuid,
          undefined,
          undefined,
          undefined,
          trace
        );
        formUUID = response.ite
        assert.ok(true, response.hasOwnProperty("items"));
        formUUID = response.items?.[0]?.uuid;
        return response;
      } catch (error) {
        throw error;
      }
    }, "List user Forms")
  );

  it("listUserFormSubmissions", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Forms.listUserFormSubmissions(
        accessToken,
        identityData.account_uuid,
        formUUID,
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
      throw error
    }
  },"List user Form Submissions"));

  it(
    "create form template",
    mochaAsync(async () => {
      try {
        const f = {
          display: "form",
          components: [],
        };
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Forms.createFormTemplate(
          accessToken,
          "test form",
          "test desc",
          identityData.account_uuid,
          f,
          trace
        );
        templateUUID = response.uuid;
        assert.ok(true, response.hasOwnProperty("uuid"));
        return response;
      } catch (error) {
        throw error;
      }
    }, "create form template")
  );

  it(
    "get form template",
    mochaAsync(async () => {
      try {
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Forms.getFormTemplate(
          accessToken,
          templateUUID,
          undefined,
          trace
        );
        templateUUID = response.uuid;
        assert.ok(true, response.hasOwnProperty("uuid"));
        return response;
      } catch (error) {
        throw error;
      }
    }, "get form template")
  );

  it(
    "get form template with definition",
    mochaAsync(async () => {
      try {
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Forms.getFormTemplate(
          accessToken,
          templateUUID,
          true,
          trace
        );
        templateUUID = response.uuid;

        assert.ok(
          response.hasOwnProperty("uuid") &&
            response.hasOwnProperty("form"),
          JSON.stringify(response, null, "\t")
        );
        formTemplate = response;
        return response;
      } catch (error) {
        throw error;
      }
    }, "get form template with definition")
  );

  it(
    "update form template",
    mochaAsync(async () => {
      try {
        formTemplate.form.components = ["a"];
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Forms.updateFormTemplate(
          accessToken,
          templateUUID,
          formTemplate,
          trace
        );
        assert.ok(
          response.form.components[0] === formTemplate.form.components[0],
          JSON.stringify(response, null, "\t")
        );
        return response;
      } catch (error) {
        throw error;
      }
    }, "update form template")
  );

  it(
    "deleteFormTemplate",
    mochaAsync(async () => {
      try {
        trace = Util.generateNewMetaData(trace);
        const response = await s2sMS.Forms.deleteFormTemplate(
          accessToken,
          templateUUID,
          trace
        );
        assert.ok(true, response.statusCode === 202);
        return response;
      } catch (error) {
       throw error
      }
    }, "create form template")
  );
});
