"use strict";

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const { mochaAsync } = require("./helpers/integration");

describe("Profiles MS Test Suite", function () {
  let accessToken, userUUID, propertyUUID;

  before(async () => {
    s2sMS.setMsHost(process.env.CPAAS_URL);
    s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
    s2sMS.setMsAuthHost(process.env.AUTH_URL);
    const oauthData = await s2sMS.Oauth.getAccessToken(
      process.env.BASIC_TOKEN,
      process.env.EMAIL,
      process.env.PASSWORD
    );
    accessToken = oauthData.access_token;
    const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
    userUUID = idData.user_uuid;
  });

  it(
    "Create User Property",
    mochaAsync(async () => {
      const trace = Util.generateNewMetaData();
      const response = await s2sMS.Profiles.createUserProperty(
        accessToken,
        userUUID,
        "unit_test_prop",
        "value-one",
        "Unit Test",
        "A test property",
        trace
      );
      propertyUUID = response.uuid;
      assert.ok(response.name === "unit_test_prop", JSON.stringify(response, null, "\t"));
      return response;
    }, "Create User Property")
  );

  it(
    "List User Properties",
    mochaAsync(async () => {
      const trace = Util.generateNewMetaData();
      const response = await s2sMS.Profiles.listUserProperties(
        accessToken,
        userUUID,
        trace
      );
      assert.ok(
        response.items && response.items.length > 0,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List User Properties")
  );

  it(
    "Update User Property",
    mochaAsync(async () => {
      const trace = Util.generateNewMetaData();
      const response = await s2sMS.Profiles.updateProperty(
        accessToken,
        propertyUUID,
        { value: "updated-value", name: "unit_test_prop" },
        trace
      );
      assert.ok(response.value === "updated-value", JSON.stringify(response, null, "\t"));
      return response;
    }, "Update User Property")
  );
});
