"use strict";

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const { v4 } = require("uuid");

const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const ResourceGroups = require("../src/resourceGroups");
const { mochaAsync } = require("./helpers/integration");

describe("ResourceGroups", function () {
  it("createResourceGroups rejects missing resource type", async function () {
    try {
      await ResourceGroups.createResourceGroups(
        "token",
        "account-uuid",
        "resource-uuid",
        undefined,
        { r: ["user-uuid"] },
        {}
      );
      assert.fail("expected error");
    } catch (error) {
      assert.strictEqual(error.code, 400);
    }
  });

  it("updateResourceGroups rejects missing resource type", async function () {
    try {
      await ResourceGroups.updateResourceGroups(
        "token",
        v4(),
        "account-uuid",
        undefined,
        { r: ["user-uuid"] },
        {}
      );
      assert.fail("expected error");
    } catch (error) {
      assert.strictEqual(error.code, 400);
    }
  });

  describe("ResourceGroups integration (mocked HTTP)", function () {
    let accessToken;
    let trace = Util.generateNewMetaData();

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
    });

    it(
      "creates, updates, and cleans up resource groups",
      mochaAsync(async () => {
        const resourceUUID = v4();
        const accountUUID = process.env.ACCOUNT_UUID;
        const users = { r: [process.env.USER_UUID] };

        trace = Util.generateNewMetaData(trace);
        const created = await ResourceGroups.createResourceGroups(
          accessToken,
          accountUUID,
          resourceUUID,
          "object",
          users,
          trace
        );
        assert.strictEqual(created.status, "ok");

        trace = Util.generateNewMetaData(trace);
        const extraUser = v4();
        const updated = await ResourceGroups.updateResourceGroups(
          accessToken,
          resourceUUID,
          accountUUID,
          "object",
          { r: [process.env.USER_UUID, extraUser], u: [process.env.USER_UUID] },
          trace
        );
        assert.strictEqual(updated.status, "ok");

        trace = Util.generateNewMetaData(trace);
        const cleaned = await ResourceGroups.cleanUpResourceGroups(
          accessToken,
          resourceUUID,
          trace
        );
        assert.strictEqual(cleaned.status, "ok");
        return cleaned;
      }, "creates, updates, and cleans up resource groups")
    );
  });
});
