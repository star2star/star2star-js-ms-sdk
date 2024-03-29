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

let instanceUUID, resourceRowID;

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func(name);
      logger.debug(name, response);
      return response;
    } catch (error) {
      console.log("EEEEEE", error);
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
      instanceUUID = response.uuid;
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "Get Resource Instance")
  );

  it(
    "Get Resource Instance by UUID",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Resources.getResourceInstanceByUUID(
        accessToken,
        instanceUUID,
        0, //rows offset
        100, // rows limit
        "rows,references", // include
        "references", // expand
        "appdev_james_2e05::9ex4hXwBwSlR5_nllNG-::a71fef3a-6184-4673-beb5-d1e0694fc3d9", //reference_filter
        trace
      );
      console.log("response", response);
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "Get Resource Instance by UUID")
  );

  it(
    "Add Row to Resource Instance",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Resources.addRowToInstance(
        accessToken,
        instanceUUID,
        {
          resource_instance_uuid: instanceUUID,
          content: {
            emails: [
              {
                email_address: `apiganelli_${Date.now()}@getnada.com`,
                label: "work",
              },
            ],
            firstname: "avril",
            form_data: {
              cancel: false,
              emails: [
                {
                  email_address: `apiganelli_${Date.now()}@getnada.com`,
                  label: "work",
                },
              ],
              submit1: true,
              firstname: "avril",
              phones: [],
              lastname: "piganelli",
            },
            phones: [],
            lastname: "piganelli",
          },
        }, //todo fix this
        trace
      );
      resourceRowID = response.uuid;
      //console.log("response", response);
      assert.ok(1 === 1, JSON.stringify(response, null, "\t"));
      return response;
    }, "Add Row to Resource Instance")
  );

  it(
    "Search Resource Instance",
    mochaAsync(async () => {
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Resources.searchResourceInstance(
        accessToken,
        "IHB23X0B4LoNFLghRM7S",
        [
          {
            column: "firstname",
            term: "James",
            operation: "=",
          },
        ],
        trace
      );
      assert.ok(
        response.uuid === "IHB23X0B4LoNFLghRM7S",
        JSON.stringify(response, null, "\t")
      );
      return response;
    }, "Search Resource Instance")
  );

  it("Get Resource Instance Row", mochaAsync(async () => {
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Resources.getResourceInstanceRow(
      accessToken,
      "IHB23X0B4LoNFLghRM7S",
      resourceRowID
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Resource Instance"));

  it("Delete Resource Instance Row", mochaAsync(async () => {
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Resources.deleteResourceInstanceRow(
      accessToken,
      "IHB23X0B4LoNFLghRM7S",
      resourceRowID
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Resource Instance Row"));

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
