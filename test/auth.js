//mocha requires
import "@babel/polyfill";
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

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Permissions MS Test Suite", function() {
  let accessToken,
    identityData,
    permissions,
    userGroupUUID,
    role;

  before(async () => {
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
  });
  
  // Template for New Test............
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(1 === 1);
  //   return response;
  // },"change me"));

  it("List Permissions", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "account"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listPermissions(
      accessToken,
      0, // offset
      2, // limit
      filters,
      trace
    );
    permissions = response.items;
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items[0].hasOwnProperty("action"),
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Create User Group", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const body = {
      name: "Unit-Test",
      users: [identityData.uuid],
      description: "A test group"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.createUserGroup(
      accessToken,
      identityData.account_uuid,
      body,
      trace
    );
    userGroupUUID = response.uuid;
    assert.ok(
      response.hasOwnProperty("uuid") &&
      response.members[0].uuid === identityData.uuid &&
      response.account_uuid === identityData.account_uuid,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List User Groups", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test",
      "description": "A test group"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listUserGroups(
      accessToken,
      0, //offset
      10, //limit
      filters,
      trace
    );
    assert.ok(
      response.items[0].name === filters.name &&
      response.items[0].description === filters.description,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Modify Group", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const body = {
      "description": "A modified test group"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.modifyUserGroup(
      accessToken,
      userGroupUUID,
      body,
      trace
    );
    assert.ok(
      response.description === "A modified test group",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List User Groups After Modify", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test",
      "description": "A modified test group"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listUserGroups(
      accessToken,
      0, //offset
      10, //limit
      filters,
      trace
    );
    assert.ok(
      response.items[0].name === filters.name &&
      response.items[0].description === filters.description,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });
  
  it("Create Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const body = {
      name: "Unit-Test",
      type: "user",
      status: "Active",
      permissions: [permissions[0].uuid]
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.createRole(
      accessToken,
      identityData.account_uuid,
      body,
      trace
    );
    assert.ok(
      response.hasOwnProperty("name") &&
      response.name === "Unit-Test",
      JSON.stringify(response, null, "\t")
    );
    role = response.uuid;
    logger.debug(this.ctx.test.title, response);
  });

  it("List Roles After Create", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listRoles(
      accessToken,
      0,
      100,
      filters,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items[0].hasOwnProperty("type") &&
      response.items[0].type === "role_permission" &&
      response.items[0].total_members === 1,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Assign Permissions to Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const body = {
      permissions: [permissions[1].uuid]
    };
    const response = await s2sMS.Auth.assignPermissionsToRole(
      accessToken,
      role,
      body,
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Modfy Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const body = {
      "description": "new description"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.modifyRole(
      accessToken,
      role,
      body,
      trace
    );
    assert.ok(
      response.hasOwnProperty("description") &&
      response.description === "new description",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });
  
  it("List Roles After Modify", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listRoles(
      accessToken,
      0, // offset
      100, // limit
      filters,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items[0].hasOwnProperty("type") &&
      response.items[0].type === "role_permission" &&
      response.items[0].total_members === 2,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Assign Roles to User Group", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const body = {
      roles: [role]
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.assignRolesToUserGroup(
      accessToken,
      userGroupUUID,
      body,
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List a Role's Groups", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listRoleUserGroups(
      accessToken,
      role,
      undefined, // no filters
      trace
    );
    assert.ok(
      response.items[0].uuid === userGroupUUID,
      JSON.stringify(response, null, "\t")
    );
    const filters = {"name":"invalid"};
    const invalidResponse = await s2sMS.Auth.listRoleUserGroups(
      accessToken,
      role,
      filters, 
      trace
    );
    assert.ok(
      invalidResponse.items.length === 0,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, { "validResponse": response,"invalidResponse": invalidResponse});
  });

  
  it("List a Role's Permissions", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "update"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listRolePermissions(
      accessToken,
      role,
      filters,
      trace
    );
    assert.ok(
      response.items[0].name === "account.update",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List a Permission's Roles", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "new name"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listPermissionRoles(
      accessToken,
      permissions[0].uuid,
      filters,
      trace
    );
    assert.ok(
      response.hasOwnProperty("itmes") &&
      response.items.length === 1 &&
      response.item[0].uuid === role,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List a Group's Roles", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listUserGroupRoles(
      accessToken,
      userGroupUUID,
      trace
    );
    assert.ok(
      response.items[0].uuid === role,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Remove User Group Member", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const members = [
      {
        uuid: identityData.uuid
      }
    ];
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.deleteGroupMembers(
      accessToken,
      userGroupUUID,
      members, trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List User Groups After Remove Member", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test",
      "description": "A modified test group"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listUserGroups(
      accessToken,
      0, //offset
      10, //limit
      filters,
      trace
    );
    assert.ok(
      response.items[0].total_members === 0 &&
      response.items[0].uuid === userGroupUUID,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });
  
  it("Add User Group Member", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const members = [
      {
        type: "user",
        uuid: identityData.uuid
      }
    ];
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.addMembersToGroup(
      accessToken,
      userGroupUUID,
      members,
      trace
    );
    assert.ok(
      response.total_members === 1,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List User Groups After Add Member", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test",
      "description": "A modified test group"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listUserGroups(
      accessToken,
      0, //offset
      100, //limit
      filters,
      trace
    );
    assert.ok(
      response.items[0].total_members === 1 &&
      response.items[0].uuid === userGroupUUID,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });
  
  
  it("Delete Permission From Role With User Group Attached", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    try {
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Auth.deletePermissionFromRole(
        accessToken,
        role,
        permissions[0].uuid,
        trace
      );
      //should not get here until CCORE-418 is resolved
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
    } catch (error) {
      assert.ok(
        error.hasOwnProperty("statusCode") &&
        error.statusCode === 400,
        JSON.stringify(error, null, "\t")
      );
      logger.debug(this.ctx.test.title, error);
    } 
  });
  
  it("Delete Role From User Group", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const deleteResponse = await s2sMS.Auth.deleteRoleFromUserGroup(
      accessToken,
      userGroupUUID,
      role,
      trace
    );
    assert.ok(
      deleteResponse.status === "ok",
      JSON.stringify(deleteResponse, null, "\t")
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const listResponse = await s2sMS.Auth.listUserGroupRoles(
      accessToken,
      userGroupUUID,
      trace
    );
    assert.ok(
      listResponse.items.length === 0,
      JSON.stringify(listResponse, null, "\t")
    );
    logger.debug(this.ctx.test.title, {"deleteResponse": deleteResponse, "listResponse": listResponse});
  });

  it("Delete Permission From Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.deletePermissionFromRole(
      accessToken,
      role,
      permissions[0].uuid,
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("List Roles After Delete Permission", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const filters = {
      "name": "Unit-Test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.listRoles(
      accessToken,
      0, // offset
      100, // limit
      filters,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items[0].hasOwnProperty("type") &&
      response.items[0].type === "role_permission" &&
      response.items[0].total_members === 1,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Deactivate Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.deactivateRole(accessToken, role, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Reactivate Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.activateRole(accessToken, role, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  it("Delete Role", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Auth.deleteRole(accessToken, role, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });
  
  it("Delete User Group", async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.deleteGroup(accessToken, userGroupUUID, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  // clean up any objects left behind
  after(async () => {
    const filters = {
      "name": "Unit-Test"
    };
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const groupsResponse = await s2sMS.Auth.listUserGroups(
      accessToken,
      0, //offset
      100, //limit
      filters,
      trace
    );
    const deletePromises = [];
    groupsResponse.items.forEach(item => {
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      deletePromises.push(
        s2sMS.Groups.deleteGroup(accessToken, item.uuid, trace)
      );
    });

    filters.name = "new name";
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const rolesResponse = await s2sMS.Auth.listRoles(
      accessToken,
      0, //offset
      100, //limit
      filters,
      trace
    );
    rolesResponse.items.forEach(item => {
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      deletePromises.push(
        s2sMS.Auth.deleteRole(accessToken, item.uuid, trace)
      );
    });
    await Promise.all(deletePromises);
  });
});
