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

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response;
    } catch (error) {
      //mocha will log out the error
      throw error;
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
    "get media file content",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Media.getMediaFileContent(
        accessToken,
        file_id,
        trace
      );
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "get media file content")
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
