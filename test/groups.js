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
const logger = require("./node-logger").getInstance();
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
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

describe("Groups Test Suite", function() {
  let accessToken, identityData, testGroupUuid;

  before(async () => {
    try {
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost(creds.MS_HOST);
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(creds.AUTH_HOST);
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
    } catch (error) {
      return Promise.reject(error);
    }
  });

  it("List Groups", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const filters = [];
    filters["expand"] = "members";
    filters["member_limit"] = 5;
    const response = await s2sMS.Groups.listGroups(
      accessToken,
      0, //offset
      10, //limit
      filters,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Groups"));
  
  // This is broken CSRVS-254. Returns 202 but polling does not work
  it("Create Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    //FIXME needs default attribute CCORE-179
    const body = {
      account_id: identityData.account_uuid,
      description: "A test group",
      members: [
        {
          uuid: creds.testIdentity
        }
      ],
      name: "Test",
      type: "user"
    };
    const response = await s2sMS.Groups.createGroup(accessToken, body, trace);
    testGroupUuid = response.uuid;
    assert.ok(
      response.name === "Test", 
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create Group"));
  
  it("Get One Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const filters = [];
    filters["expand"] = "members.type";
    const response = await s2sMS.Groups.getGroup(accessToken, testGroupUuid, filters, trace);
    assert.ok(
      response.name === "Test" &&
      response.members.items[0].type === "user",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get One Group"));
  
  it("Get Group Members", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const filters = [];
    filters["expand"] = "members.type";
    const response = await s2sMS.Groups.listGroupMembers(accessToken, testGroupUuid, filters, trace);
    assert.ok(
      response.metadata.total === 1 &&
      response.items[0].type === "user",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Group Members"));
  
  it("Add User to Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const testMembers = [
      {
        type: "user",
        uuid: identityData.uuid
      }
    ];
    const response = await s2sMS.Groups.addMembersToGroup(accessToken, testGroupUuid, testMembers, trace);
    assert.ok(
      response.name === "Test" &&
      response.total_members === 2,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Add User to Group"));
  
  it("Delete User from Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const members = [
      {
        uuid: identityData.uuid
      }
    ];
    const response = await s2sMS.Groups.deleteGroupMembers(accessToken, testGroupUuid, members, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete User from Group"));
  
  it("Modify Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const body = {
      description: "new description",
      name: "new name"
    };
    const response = await s2sMS.Groups.modifyGroup(accessToken, testGroupUuid, body, trace);
    assert.ok(
      response.name === "new name",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Modify Group"));
  
  it("Deactivate Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.deactivateGroup(accessToken, testGroupUuid, trace);
    assert.ok(
      response.status === "Inactive",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Deactivate Group"));
  
  it("Reactivate Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.reactivateGroup(accessToken, testGroupUuid, trace);
    assert.ok(
      response.status === "Active",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Reactivate Group"));
  
  it("Delete Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.deleteGroup(accessToken, testGroupUuid, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Group"));
});
