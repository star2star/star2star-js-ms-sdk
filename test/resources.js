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
      console.log("EEEEEE", error)
      //mocha will log out the error
      throw error;
    }
  };
};

describe("Resource CMS Test Suite", function () {
  let accessToken;

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
    "List Resource Instances",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Resources.listResources(
        accessToken,
        undefined,
        undefined, //include
        trace
      );
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "List Resource Instances")
  );

  it(
    "Get Resource Instance",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Resources.getResourceInstance(
        accessToken,
        "cwa_mass_contact",
        0, //rows offset
        100, // rows limit
        "rows,references", // include
        "references", // expand
        "appdev_james_2e05::9ex4hXwBwSlR5_nllNG-::a71fef3a-6184-4673-beb5-d1e0694fc3d9", //reference_filter
        trace
      );
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "Get Resource Instance")
  );

  it(
    "Search Resource Instance",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Resources.searchResourceInstance(
        accessToken,
        "IHB23X0B4LoNFLghRM7S",
        [{
          column: "firstname",
          term: "James",
          operation: "=",
        }],
        trace
      );
      assert.ok(response.uuid === "IHB23X0B4LoNFLghRM7S", JSON.stringify(response, null, "\t"));
      return response;
    }, "Search Resource Instance")
  );

  // it("Get Resource Instance Row", mochaAsync(async () => {
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await s2sMS.Resources.getResourceInstanceRow(
  //     accessToken,
  //     "nfDtt3wBwSlR5_nlmHoL",
  //     "nfDtt3wBwSlR5_nlmHoL/row/appdev_ack_template_849a::eFsCmXwB4LoNFLghuAIk::1a036a2d-b1d3-4886-8c5c-0fcf99695a03"
  //   );
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"Get Resource Instance"));

  // template
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
