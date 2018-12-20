//mocha reqruies
require("babel-polyfill");
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logLevel = Util.getLogLevel();
const logPretty = Util.getLogPretty();
import Logger from "../src/node-logger";
const logger = new Logger();
logger.setLevel(logLevel);
logger.setPretty(logPretty);
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

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Objects MS Test Suite", function() {
  let accessToken,
    identityData,
    userObjectUUID,
    objectUUID;

  before(async () => {
    try {
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
        // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost("https://cpaas.star2starglobal.net");
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      const oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error){
      return Promise.reject(error);
    }
  });

  it("Create Shared User Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const response = await s2sMS.Objects.createUserDataObject(
      identityData.uuid,
      accessToken,
      "Unit-Test", // name
      "unit-test", // type
      "the description", // description  
      {
        a: 1 //content
      },
      identityData.account_uuid, // combined with users creates resource group scoping
      {
        rud: [identityData.uuid],
        d: ["57852400-6650-466b-bdc2-bc128e6ccaca"] //users read, update, delete permissions
      },
      trace
    );
    userObjectUUID = response.uuid;
    assert(response.content.a === 1 && response.description === "the description");
    return response;
  },"Create Shared User Object"));

  it("List Shared User Objects", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "type": "unit-test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjects(
      accessToken,
      identityData.uuid,
      0, // offset
      100, // limit
      true, // load content
      filters,
      trace
    );
    assert(
      response.items.find((item) => {
        return item.uuid === userObjectUUID;
      })
    );
    return response;
  },"List Shared User Objects"));

  it("Update Shared User Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.updateDataObject(
      accessToken,
      userObjectUUID,
      {
        "name": "Unit-Test",
        "type": "unit-test",
        "description" : "the modified description",
        "content_type": "application/json",
        "content": {a: 2}
      },
      identityData.account_uuid,
      {
        rd: [identityData.uuid],
        d: [identityData.uuid] //users read, update, delete permissions
      },
      trace
    );
    assert(response.content.a === 2 && response.description === "the modified description");
    return response;
  },"Update User Object"));

  it("List Shared User Objects After Update", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "type": "unit-test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjects(
      accessToken,
      identityData.uuid,
      0, // offset
      100, // limit
      true, // load content
      filters,
      trace
    );
    assert(
      response.items.find((item) => {
        return item.uuid === userObjectUUID && item.content.a === 2;
      })
    );
    return response;
  },"List Shared User Objects After Update"));
  
  // TODO make separate resource groups test? nh 12/19/18
  // it("Get Resource Group users", function(done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Auth.getResourceUsers(
  //     accessToken,
  //     userObjectUUID
  //   )
  //     .then(responseData => {
  //       logger.info(
  //         `Get Resource Group users RESPONSE: ${JSON.stringify(
  //           responseData,
  //           null,
  //           "\t"
  //         )}`
  //       );
  //       done();
  //     })
  //     .catch(error => {
  //       logger.error(
  //         `Get Resource Group users ERROR: ${JSON.stringify(error, null, "\t")}`
  //       );
  //       done(new Error(error));
  //     });
  // });

  it("Delete Shared User Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.deleteDataObject(accessToken, userObjectUUID, trace);
    assert(response.status === "ok");
    return response;
  },"Delete Shared User Object"));

  it("Create User Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const response = await s2sMS.Objects.createUserDataObject(
      identityData.uuid,
      accessToken,
      "Unit-Test", // name
      "unit-test", // type
      "the description", // description  
      {
        a: 1 //content
      },
      undefined, // account uuid not required for private objects
      undefined, // users object not required for private objects
      trace
    );
    userObjectUUID = response.uuid;
    assert(response.content.a === 1 && response.description === "the description");
    return response;
  },"Create User Object"));

  it("List User Objects", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "type": "unit-test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjects(
      accessToken,
      identityData.uuid,
      0, // offset
      100, // limit
      true, // load content
      filters,
      trace
    );
    assert(
      response.items.find((item) => {
        return item.uuid === userObjectUUID;
      })
    );
    return response;
  },"List User Objects"));

  it("Update User Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.updateDataObject(
      accessToken,
      userObjectUUID,
      {
        "name": "Unit-Test",
        "type": "unit-test",
        "description" : "the modified description",
        "content_type": "application/json",
        "content": {a: 2}
      },
      undefined, // account uuid not required for private objects
      undefined, // users object not required for private objects
      trace
    );
    assert(
      response.content.a === 2 && 
      response.description === "the modified description"
    );
    return response;
  },"Update User Object"));

  it("List User Objects After Update", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "type": "unit-test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjects(
      accessToken,
      identityData.uuid,
      0, // offset
      100, // limit
      true, // load content
      filters,
      trace
    );
    assert(
      response.items.find((item) => {
        return item.uuid === userObjectUUID && item.content.a === 2;
      })
    );
    return response;
  },"List User Objects After Update"));

  it("Get User Object By Type", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjectByType(
      identityData.uuid,
      accessToken,
      "unit-test",
      0, // offest
      10, // limit
      false, // load_content
      trace
    );
    assert(response.items[0].name === "Unit-Test");
    return response;
  },"Get User Object By Type"));
  
  it("Get User Object By Type And Name", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Objects.createUserDataObject(
      identityData.uuid,
      accessToken,
      "Other-Unit-Test", // name
      "unit-test", // type
      "the description", // description  
      {
        "status": "inactive",
        a: 1 //content
      },
      undefined, // account uuid not required for private objects
      undefined, // users object not required for private objects
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjectByTypeAndName(
      identityData.uuid,
      accessToken,
      "unit-test",
      "Other-Unit-Test",
      0, // offest
      10, // limit
      false, // load_content
      trace
    );
    assert(response.items[0].name === "Other-Unit-Test");
    return response;
  },"Get User Object By Type And Name"));

  //This test is incomplete until CSRVS-230 is resolved
  it("List Objects with SDK Aggregator, Paginator, and Filter", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "type": "unit-test",
      "status": "inactive"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjects(
      accessToken,
      identityData.uuid,
      0, //offset
      100, //limit
      true, //load_content
      filters,
      trace
    );
    assert(
      response.items[0].content.status === "inactive"
    );
    return response;
  },"List Objects with SDK Aggregator, Paginator, and Filter"));

  it("Delete User Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.deleteDataObject(accessToken, userObjectUUID, trace);
    assert(response.status === "ok");
    return response;
  },"Delete  User Object"));
  
  it("Create Global Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.createDataObject(
      accessToken,
      "Unit-Test",
      "global-unit-test",
      "the description",
      {
        a: 1
      }
    );
    assert(
      response.type === "global-unit-test" &&
      response.content.a === 1
    );
    objectUUID = response.uuid;
    return response;
  },"Create Global Object"));

  it("Get Global Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObject(accessToken, objectUUID, trace);
    assert(
      response.type === "global-unit-test" &&
      response.content.a === 1
    );
    objectUUID = response.uuid;
    return response;
  },"Get Global Object"));

  it("Update Global Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.updateDataObject(
      accessToken,
      objectUUID,
      {
        "name": "Unit-Test",
        "type": "unit-test",
        "description" : "the modified description",
        "content_type": "application/json",
        "content": {a: 2}
      },
      undefined, // account uuid not needed for globals
      undefined, // user object is not needed for globals
      trace
    );
    assert(response.content.a === 2 && response.description === "the modified description");
    return response;
  },"Update Global Object"));

  it("Get Global Object After Update", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObject(accessToken, objectUUID, trace);
    assert(
      response.description === "the modified description" &&
      response.content.a === 2
    );
    objectUUID = response.uuid;
    return response;
  },"Get Global Object After Update"));

  it("Delete Global Object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.deleteDataObject(accessToken, objectUUID, trace);
    assert(response.status === "ok");
    return response;
  },"Delete Global Object"));

  // template
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   const response = await somethingAsync();
  //   assert(1 === 1);
  //   return response;
  // },"change me"));

  // clean up any objects left behind
  after(async () => {
    const filters = {
      "type": "unit-test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Objects.getDataObjects(
      accessToken,
      identityData.uuid,
      0, // offset
      100, // limit
      true, // load content
      filters,
      trace
    );
    const deletePromises = [];
    response.items.forEach(item => {
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      deletePromises.push(
        s2sMS.Objects.deleteDataObject(accessToken, item.uuid, trace)
      );
    });
    await Promise.all(deletePromises);
  });

  // template
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   const response = await somethingAsync();
  //   assert(1 === 1);
  //   return response;
  // },"change me"));

});
