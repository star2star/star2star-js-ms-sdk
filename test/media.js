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
let file_id;
let user_file_id;

const { mochaAsync } = require("./helpers/integration");

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
      identityData = await s2sMS.Identity.getIdentityDetails(
        accessToken,
        idData.user_uuid
      );
    } catch (error) {
      throw error;
    }
  });
  it(
    "List user Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.listUserMedia(
        identityData.uuid,
        accessToken,
        trace
      );
      assert.ok(
        response.hasOwnProperty("items") && response.hasOwnProperty("metadata"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List user Media")
  );

  it(
    "Upload user Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const fileName = "user-upload.png";
      const response = await s2sMS.Media.uploadFile(
        fileName,
        fs.createReadStream("./test/media.js"),
        identityData.uuid,
        accessToken,
        trace
      );
      user_file_id = response.file_id;
      assert.ok(response.hasOwnProperty("file_id"), JSON.stringify(response, null, "\t"));
      return response;
    }, "Upload user Media")
  );

/*

  it(
    "List global Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.getGlobalMedia(
        accessToken,
        0, // offest
        10, // limit
        undefined, // startDatetime,
        undefined, // endDatetime,
        undefined, // sort,
        undefined, // includeDeleted,
        undefined, // fileCategory,
        "ringback", // filter
        undefined, // includeThumbnails,
        trace
      );
      assert.ok(
        response.hasOwnProperty("items") &&
          response.hasOwnProperty("metadata") &&
          response.items?.[0]?.file_title === "ringback",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List global Media")
  );

  it(
    "Upload user Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const fileName = "git-cheat-sheet.png";
      const response = await s2sMS.Media.uploadFile(
        fileName,
        fs.createReadStream("./test/media.js"),
        identityData.uuid,
        accessToken,
        trace
      );
      file_id = response["file_id"];
      assert.ok(
        response.hasOwnProperty("file_id") &&
          fileName.indexOf(response["file_name"]) > -1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Upload user Media")
  );

  it(
    "delete user Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.deleteMedia(
        file_id,
        accessToken,
        trace
      );
      assert.ok(response.status === "ok", JSON.stringify(response, null, "\t"));
      return response;
    }, "delete user Media")
  );

  it(
    "share Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      try {
        const response = await s2sMS.Media.shareMedia(
          accessToken,
          "b8876774-42d1-42de-aad9-a64495f63ada",
          "f3fcefca-8584-4fee-b21d-c3a2845ebe82",
          trace
        );
        console.log('>>>>>', response);
        assert.ok(true, JSON.stringify(response, null, "\t"));
        return response;
      } catch (e) {
        console.error(e);
        assert.fail(e);
      }

    }, "share Media")
  );
*/
  it(
    "Global Upload Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const fileName = "git-cheat-sheet.png";
      const response = await s2sMS.Media.uploadGlobalMediaFile(
        fileName,
        fs.createReadStream("./test/media.js"),
        accessToken,
        trace
      );
      file_id = response["file_id"];
      assert.ok(
        response.hasOwnProperty("file_id") &&
          fileName.indexOf(response["file_name"]) > -1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Upload user Media")
  );

  it(
    "List global Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.getGlobalMedia(
        accessToken,
        0,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        trace
      );
      assert.ok(
        response.hasOwnProperty("items") && response.hasOwnProperty("metadata"),
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "List global Media")
  );

  it(
    "Get Media File URL",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.getMediaFileUrl(
        accessToken,
        file_id,
        60000,
        trace
      );
      assert.ok(response.url, JSON.stringify(response, null, "\t"));
      return response;
    }, "Get Media File URL")
  );

  it(
    "Delete global Media",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.deleteMedia(file_id, accessToken, trace);
      assert.ok(response.status === "ok", JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete global Media")
  );

  it(
    "Delete user Media",
    mochaAsync(async () => {
      if (!user_file_id) {
        return;
      }
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.deleteMedia(user_file_id, accessToken, trace);
      assert.ok(response.status === "ok", JSON.stringify(response, null, "\t"));
      return response;
    }, "Delete user Media")
  );

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
