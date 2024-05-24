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

describe("entitlements MS Test Suite", function () {
  let accessToken, user_uuid, uuid;

  before(async () => {
    try {
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      // console.log('pppp', process.env)
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );

      accessToken = oauthData.access_token;
      // console.log('tttttt')
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      user_uuid = idData.user_uuid;
      // console.log("ARRRR", accessToken)
    } catch (error) {
      console.log("eeeee", error);
      throw error;
    }
  });

  it(
    "Get Products",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Entitlements.getProducts(
        accessToken,
        0,
        100,
        {}, // no filters
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
    }, "Get Products")
  );

  it(
    "Get Products by application_uuid",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Entitlements.getProducts(
        accessToken,
        0,
        10,
        { application_uuid: "aee1083e-219f-41b3-9530-782752ade1d4" },
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
    }, "Get Products by application_uuid")
  );

  it(
    "Get Products by type",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Entitlements.getProducts(
        accessToken,
        0,
        10,
        { type: "cwa_curbside" },
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
    }, "Get Products by type")
  );

  it(
    "Get Product bad",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const product_uuid = "5fde27b7-68c5-4bfa-a8d8-0d8ff413b3a1";
      try {
        const response = await s2sMS.Entitlements.getProduct(
          accessToken,
          product_uuid,
          trace
        );
        assert.ok(false, JSON.stringify(response, null, "\t"));
        return response;
      } catch (error) {
        assert.ok(
          error.hasOwnProperty("code") && error.code === 404,
          JSON.stringify(error, null, "\t")
        );
        return error;
      }
    }, "Get Product bad ")
  );

  it(
    "Get Product good",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const product_uuid = "5fde27b7-68c5-4bfa-a8d8-0d8ff413b3a0";
      try {
        const response = await s2sMS.Entitlements.getProduct(
          accessToken,
          product_uuid,
          trace
        );
        assert.ok(true, JSON.stringify(response, null, "\t"));
        return response;
      } catch (error) {
        assert.ok(false, JSON.stringify(error, null, "\t"));
        return error;
      }
    }, "Get Product good ")
  );

  it(
    "Get User Entitlements",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Entitlements.getUserEntitlements(
        accessToken,
        user_uuid,
        0,
        100,
        {},
        trace
      );
      assert.ok(
        response.hasOwnProperty("items") && JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Get User Entitlements")
  );

  it(
    "Update Product good",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const product_uuid = "08c5bb57-8a71-45a0-8f3f-1f6dd4c03373";
      try {
        const response = await s2sMS.Entitlements.getProduct(
          accessToken,
          product_uuid,
          trace
        );
        // console.log('>>>>', JSON.stringify(response, null, "\t"))
        assert.ok(
          response.hasOwnProperty("active"),
          JSON.stringify(response, null, "\t")
        );
        response.active = false;
        const responseUpdate = await s2sMS.Entitlements.updateProduct(
          accessToken,
          product_uuid,
          response,
          trace
        );
        // console.log('>>>>UPDATE: ', JSON.stringify(responseUpdate, null, "\t"))
        assert.ok(
          responseUpdate.hasOwnProperty("active") &&
            responseUpdate.active === false,
          JSON.stringify(responseUpdate, null, "\t")
        );
        response.active = true;
        const responseUpdate2 = await s2sMS.Entitlements.updateProduct(
          accessToken,
          product_uuid,
          response,
          trace
        );
        // console.log('>>>>UPDATE 22222: ', JSON.stringify(responseUpdate2, null, "\t"))
        assert.ok(
          responseUpdate2.hasOwnProperty("active") &&
            responseUpdate2.active === true,
          JSON.stringify(responseUpdate2, null, "\t")
        );
        return response;
      } catch (error) {
        assert.ok(false, JSON.stringify(error, null, "\t"));
        return error;
      }
    }, "update good product")
  );
  it(
    "Update Product bad",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const product_uuid = "08c5bb57-8a71-45a0-8f3f-1f6dd4c03373";
      try {
        const response = await s2sMS.Entitlements.getProduct(
          accessToken,
          product_uuid,
          trace
        );
        // console.log('>>>>', JSON.stringify(response, null, "\t"))
        assert.ok(
          response.hasOwnProperty("active") && respoonse.active === true,
          JSON.stringify(response, null, "\t")
        );
        response.active = false;
        const responseUpdate = await s2sMS.Entitlements.updateProduct(
          accessToken,
          "08c5bb57-8a71-45a0-8f3f-1f6dd4c033aa",
          response,
          trace
        );
        assert.ok(false,
          JSON.stringify(responseUpdate, null, "\t")
        );
        return response;
      } catch (error) {
        assert.ok(true, JSON.stringify(error, null, "\t"));
        return error;
      }
    }, "update product bad")
  );

  it(
    "list account entitlements",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      try {
        const response = await s2sMS.Entitlements.listAccountEntitlements(
          accessToken,
          process.env.ACCOUNT_UUID,
          0, //offset
          1, // limit
          { user_uuid: process.env.USER_UUID }, // filters
          trace
        );
        assert.ok(
          response.hasOwnProperty("items") &&
            Array.isArray(response.items) &&
            response.items.length === 1 &&
            response.items[0].user_uuid === process.env.USER_UUID,
          JSON.stringify(response, null, "\t")
        );

        return response;
      } catch (error) {
        throw error;
      }
    }, "list account entitlements")
  );
});
