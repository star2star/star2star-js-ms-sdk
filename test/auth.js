//mocha requires

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
const logger = require("../src/node-logger").getInstance();
let trace = Util.generateNewMetaData();
const { shouldSkipIntegrationError } = require("./helpers/integration");

const authIt = (title, fn) => {
  mocha.it(title, async function () {
    try {
      await fn.call(this);
    } catch (error) {
      if (shouldSkipIntegrationError(error)) {
        this.skip();
      }
      throw error;
    }
  });
};

describe("Permissions MS Test Suite", function() {
  let accessToken,
    identityData,
    permissions,
    userGroupUUID,
    newRole,
    role;

  before(async () => {
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
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
  });
  
  // Template for New Test............
  // it("change me", mochaAsync(async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(1 === 1);
  //   return response;
  // },"change me"));

  authIt("List Permissions", async () => {
        const filters = {
      "resource_type": "account"
    };
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.listPermissions(
      accessToken,
      0, // offset
      100, // limit
      filters,
      trace
    );
    // console.log('>>>>', JSON.stringify(response, null, 2))
    permissions = response.items;
    assert.ok(
      response.hasOwnProperty("items"), 
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  authIt("Create User Group", async () => {
        const body = {
      name: "Unit-Test",
      users: [identityData.uuid],
      description: "A test group"
    };
    trace = Util.generateNewMetaData(trace);
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

  authIt("List User Groups", async function () {
        const filters = {
      "name": "Unit-Test",
      "description": "A test group"
    };
    trace = Util.generateNewMetaData(trace);
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
    logger.debug(this.test.title, response);
  });

  authIt("Modify Group", async () => {
        const body = {
      "description": "A modified test group"
    };
    trace = Util.generateNewMetaData(trace);
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

  authIt("List User Groups After Modify", async () => {
        const filters = {
      "name": "Unit-Test",
      "description": "A modified test group"
    };
    trace = Util.generateNewMetaData(trace);
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
  
  authIt("Create Role", async () => {
        const body = {
      name: "Unit-Test",
      type: "user",
      status: "Active",
      permissions: [permissions[0]?.uuid]
    };
    trace = Util.generateNewMetaData(trace);
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

  authIt("List Roles After Create", async () => {
        const filters = {
      "name": "Unit-Test"
    };
    trace = Util.generateNewMetaData(trace);
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
      response.items[0].type === "role_permission",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  authIt("Get Role By UUID", async () => {
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.getRole(
      accessToken,
      role,
      trace
    );
    logger.debug("GET ONE ROLE RESPONSE",response);
    newRole = response;
    assert.ok(
      response.hasOwnProperty("name"),
      response.name === "Unit-Test" &&
      response.hasOwnProperty("members") &&
      Array.isArray(response.members) &&
      response.members[0].hasOwnProperty("uuid") &&
      response.members[0].uuid === permissions[0].uuid,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  authIt("Assign Permissions to Role", async () => {
        trace = Util.generateNewMetaData(trace);
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

  authIt("Modfy Role", async () => {
        const body = {
      "description": "new description",
      "type": "USER"
    };
 

    trace = Util.generateNewMetaData(trace);
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
  
  authIt("List Roles After Modify", async () => {
        const filters = {
      "name": "Unit-Test"
    };
    trace = Util.generateNewMetaData(trace);
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
      response.items[0].type === "role_permission",  
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  authIt("Assign Roles to User Group", async () => {
        const body = {
      roles: [role]
    };
    trace = Util.generateNewMetaData(trace);
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

  authIt("List a Role's Groups", async () => {
        trace = Util.generateNewMetaData(trace);
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

  
  authIt("List a Role's Permissions", async () => {
        const filters = {
      "resource_type": "account"
    };
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.listRolePermissions(
      accessToken,
      role,
      filters,
      trace
    );
    logger.debug(this.ctx.test.title, response);
    console.log('rrrr', JSON.stringify(response, null, 2));
    assert.ok(
      response.items.filter((a)=>a.name === "account.update")[0].name === "account.update",
      JSON.stringify(response, null, "\t")
    );
  });

  authIt("List a Permission's Roles", async () => {
        const filters = {
      "name": "Unit-Test"
    };
    trace = Util.generateNewMetaData(trace);
    await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
    const response = await s2sMS.Auth.listPermissionRoles(
      accessToken,
      permissions[0].uuid,
      filters,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length === 1 &&
      (response.items[0].uuid === role || response.item[1].uuid === role),
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });

  authIt("List a Group's Roles", async () => {
        trace = Util.generateNewMetaData(trace);
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

  authIt("Remove User Group Member", async () => {
        const members = [
      {
        uuid: identityData.uuid
      }
    ];
    trace = Util.generateNewMetaData(trace);
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

  authIt("List User Groups After Remove Member", async () => {
        const filters = {
      "name": "Unit-Test",
      "description": "A modified test group"
    };
    trace = Util.generateNewMetaData(trace);
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
  
  authIt("Add User Group Member", async () => {
        const members = [
      {
        type: "user",
        uuid: identityData.uuid
      }
    ];
    trace = Util.generateNewMetaData(trace);
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

  authIt("List User Groups After Add Member", async () => {
        const filters = {
      "name": "Unit-Test",
      "description": "A modified test group"
    };
    trace = Util.generateNewMetaData(trace);
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
  
  
  authIt("Delete Permission From Role With User Group Attached", async () => {
        try {
      trace = Util.generateNewMetaData(trace);
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
        (error.statusCode === 400 || error.code === 400),
        JSON.stringify(error, null, "\t")
      );
      logger.debug(this.ctx.test.title, error);
    } 
  });
  
  authIt("Delete Role From User Group", async () => {
        trace = Util.generateNewMetaData(trace);
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
    trace = Util.generateNewMetaData(trace);
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

  // it("Delete Permission From Role", async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await s2sMS.Auth.deletePermissionFromRole(
  //     accessToken,
  //     role,
  //     permissions[0].uuid,
  //     trace
  //   );
  //   assert.ok(
  //     response.status === "ok",
  //     JSON.stringify(response, null, "\t")
  //   );
  //   logger.debug(this.ctx.test.title, response);
  // });

  // it("List Roles After Delete Permission", async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   const filters = {
  //     "name": "Unit-Test"
  //   };
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await s2sMS.Auth.listRoles(
  //     accessToken,
  //     0, // offset
  //     100, // limit
  //     filters,
  //     trace
  //   );
  //   assert.ok(
  //     response.hasOwnProperty("items") &&
  //     response.items[0].hasOwnProperty("type") &&
  //     response.items[0].type === "role_permission" &&
  //     response.items[0].total_members === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   logger.debug(this.ctx.test.title, response);
  // });

  authIt("getResourceGroupRoles returns object role map", async () => {
    trace = Util.generateNewMetaData(trace);
    const roles = await s2sMS.Auth.getResourceGroupRoles(accessToken, trace);
    assert.ok(
      roles.object && roles.object.r && roles.object.u,
      JSON.stringify(roles, null, "\t")
    );
  });

  authIt("listAccessByGroups returns empty items for unknown resource", async () => {
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.listAccessByGroups(
      accessToken,
      "00000000-0000-4000-8000-000000000000",
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") && Array.isArray(response.items),
      JSON.stringify(response, null, "\t")
    );
  });

  authIt("assignScopedRoleToUserGroup succeeds for mock group", async () => {
    trace = Util.generateNewMetaData(trace);
    const groupBody = {
      name: "coverage scoped group",
      users: [process.env.USER_UUID],
      description: "resource group test",
    };
    const group = await s2sMS.Auth.createUserGroup(
      accessToken,
      process.env.ACCOUNT_UUID,
      groupBody,
      trace
    );
    const roles = await s2sMS.Auth.getResourceGroupRoles(accessToken, trace);
    const resourceUUID = "00000000-0000-4000-8000-000000000099";
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.assignScopedRoleToUserGroup(
      accessToken,
      group.uuid,
      roles.object.r,
      "resource",
      [resourceUUID],
      trace
    );
    assert.strictEqual(response.status, "ok");
    trace = Util.generateNewMetaData(trace);
    const access = await s2sMS.Auth.listAccessByGroups(
      accessToken,
      resourceUUID,
      trace
    );
    assert.ok(access.items.length >= 1, JSON.stringify(access, null, "\t"));
  });

  it("Deactivate Role", async function () {
    if (!role) {
      this.skip();
    }
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.deactivateRole(accessToken, role, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.test.title, response);
  });

  it("Reactivate Role", async function () {
    if (!role) {
      this.skip();
    }
        trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Auth.activateRole(accessToken, role, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.test.title, response);
  });

  // it("Delete Role", async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await s2sMS.Auth.deleteRole(accessToken, role, trace);
  //   assert.ok(
  //     response.status === "ok",
  //     JSON.stringify(response, null, "\t")
  //   );
  //   logger.debug(this.ctx.test.title, response);
  //   return true;
  // });
  
  // it("Delete User Group", async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await s2sMS.Groups.deleteGroup(accessToken, userGroupUUID, trace);
  //   assert.ok(
  //     response.status === "ok",
  //     JSON.stringify(response, null, "\t")
  //   );
  //   logger.debug(this.ctx.test.title, response);
  // });

  // clean up any objects left behind
  after(async () => {
    if (!accessToken) {
      return;
    }
    const filters = {
      "name": "Unit-Test"
    };
    trace = Util.generateNewMetaData(trace);
    let groupsResponse;
    try {
      groupsResponse = await s2sMS.Auth.listUserGroups(
      accessToken,
      0, //offset
      100, //limit
      filters,
      trace
    );
    } catch (error) {
      const msg = error?.message || "";
      if (msg.includes("TimeLimitExceededException")) {
        return;
      }
      throw error;
    }
    const deletePromises = [];
    groupsResponse.items.forEach(item => {
      trace = Util.generateNewMetaData(trace);
      deletePromises.push(
        s2sMS.Groups.deleteGroup(accessToken, item.uuid, trace)
      );
    });

    filters.name = "new name";
    trace = Util.generateNewMetaData(trace);
    const rolesResponse = await s2sMS.Auth.listRoles(
      accessToken,
      0, //offset
      100, //limit
      filters,
      trace
    );
    rolesResponse.items.forEach(item => {
      trace = Util.generateNewMetaData(trace);
      deletePromises.push(
        s2sMS.Auth.deleteRole(accessToken, item.uuid, trace)
      );
    });
    await Promise.all(deletePromises);
  });
});
