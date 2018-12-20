//mocha reqruies
require("babel-polyfill");
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

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
    permissions,
    userGroupUUID,
    role,
    roleBody;

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

  it("List Permissions", mochaAsync(async () => {
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
    assert(
      response.hasOwnProperty("items") &&
      response.items[0].hasOwnProperty("action")
    );
    return response;
  },"List Permissions"));

  it("Create User Group", mochaAsync(async () => {
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
    assert(
      response.hasOwnProperty("uuid") &&
        response.members[0].uuid === identityData.uuid &&
        response.account_uuid === identityData.account_uuid
    );
    return response;
  },"Create User Group"));

  it("List User Groups", mochaAsync(async () => {
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
    assert(
      response.items[0].name === filters.name &&
      response.items[0].description === filters.description
    );
    return response;
  },"List User Groups"));

  it("Modify Group", mochaAsync(async () => {
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
    assert(1 === 1);
    return response;
  },"Modify Group"));

  it("List User Groups After Modify", mochaAsync(async () => {
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
    assert(
      response.items[0].name === filters.name &&
      response.items[0].description === filters.description
    );
    return response;
  },"List User Groups After Modify"));
  
  it("Create Role", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    const body = {
      name: "Unit-Test",
      type: "user",
      status: "Active",
      permissions: [permissions[0].uuid]
    };

    s2sMS.Auth.createRole(accessToken, identityData.account_uuid, body)
      .then(response => {
        logger.info(`Create Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        role = response.uuid;
        assert(
          response.hasOwnProperty("name") && response.name === "Unit-Test"
        );
        done();
      })
      .catch(error => {
        logger.error(`Create Role ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Assign Permissions to Role", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    const body = {
      permissions: [permissions[1].uuid]
    };

    s2sMS.Auth.assignPermissionsToRole(accessToken, role, body)
      .then(response => {
        logger.info(`Assign Permissions to Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`Assign Permissions to Role ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("List Roles", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    const filters = [];
    filters["name"] = "Unit-Test";

    s2sMS.Auth.listRoles(accessToken, 0, 1, filters)
      .then(response => {
        roleBody = response.items[0];
        logger.info(`List Roles RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(
          response.hasOwnProperty("items") &&
            response.items[0].hasOwnProperty("type") &&
            response.items[0].type === "role_permission" &&
            response.items[0].total_members === 2
        );
        done();
      })
      .catch(error => {
        logger.error(`List Roles ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Modfy Role", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    roleBody.name = "new name";
    roleBody.description = "new description";

    s2sMS.Auth.modifyRole(accessToken, role, roleBody)
      .then(response => {
        logger.info(`Modfy Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.hasOwnProperty("name") && response.name === "new name");
        done();
      })
      .catch(error => {
        logger.error(`Modfy Role ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Assign Roles to User Group", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    const body = {
      roles: [role]
    };

    s2sMS.Auth.assignRolesToUserGroup(accessToken, userGroupUUID, body)
      .then(response => {
        logger.info(`Assign Roles to User Group RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`Assign Roles to User Group ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("List a Role's Groups", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    setTimeout(() => {
      s2sMS.Auth.listRoleUserGroups(accessToken, role)
        .then(response => {
          logger.info(`List a Role's Groups RESPONSE: ${JSON.stringify(response, null, "\t")}`);
          assert(response.items[0].uuid === userGroupUUID);
          const filters = [];
          filters["name"] = "invalid"; //should return 0
          s2sMS.Auth.listRoleUserGroups(accessToken, role, filters)
            .then(response => {
              logger.info(`List a Role's Groups RESPONSE: ${JSON.stringify(response, null, "\t")}`);
              assert(response.items.length === 0);
              done();
            })
            .catch(error => {
              logger.error(`List a Role's Groups ERROR: ${JSON.stringify(error, null, "\t")}`);
              done(new Error(error));
            });
        })
        .catch(error => {
          logger.error(`List a Role's Groups ERROR: ${JSON.stringify(error, null, "\t")}`);
          done(new Error(error));
        });
    }, Util.config.msDelay);
  });

  it("List a Role's Permissions", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    const filters = [];
    filters["name"] = "update";
    s2sMS.Auth.listRolePermissions(accessToken, role, filters)
      .then(response => {
        logger.info(`List a Role's Permissions RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.items[0].name === "account.update");
        done();
      })
      .catch(error => {
        logger.error(`List a Role's Permissions ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("List a Permission's Roles", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    const filters = [];
    filters["name"] = "new name";

    s2sMS.Auth.listPermissionRoles(accessToken, permissions[0].uuid, filters)
      .then(response => {
        logger.info(`List a Permission's Roles RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(
          response.items.reduce((prev, cur) => {
            if (!prev) {
              if (cur.uuid === role) {
                return cur;
              }
            }
            return prev;
          }, undefined)
        );
        done();
      })
      .catch(error => {
        logger.error(`List a Permission's Roles ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("List a Group's Roles", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    setTimeout(() => {
      s2sMS.Auth.listUserGroupRoles(accessToken, userGroupUUID)
        .then(response => {
          logger.info(`List a Group's Roles RESPONSE: ${JSON.stringify(response, null, "\t")}`);
          assert(response.items[0].uuid === role);
          const filters = [];
          filters["name"] = "invalid"; //should return 0
          s2sMS.Auth.listUserGroupRoles(accessToken, userGroupUUID, filters)
            .then(response => {
              logger.info(`List a Group's Roles RESPONSE: ${JSON.stringify(response, null, "\t")}`);
              assert(response.items.length === 0);
              done();
            })
            .catch(error => {
              logger.error(`List a Group's Roles ERROR: ${JSON.stringify(error, null, "\t")}`);
              done(new Error(error));
            });
        })
        .catch(error => {
          logger.error(`List a Group's Roles ERROR: ${JSON.stringify(error, null, "\t")}`);
          done(new Error(error));
        });
    }, Util.config.msDelay);
  });

  //Broken: CCORE-418
  // it("Delete Permission From Role With User Group Attached", function(done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   setTimeout(() => {
  //     s2sMS.Auth.deletePermissionFromRole(accessToken, role, permissions[0].uuid)
  //       .then(response => {
  //         logger.info(`Delete Permission From Role With User Group Attached RESPONSE: ${JSON.stringify(response, null, "\t")}`);
  //         done(new Error(response));
  //       })
  //       .catch(error => {
  //         logger.error(`Delete Permission From Role With User Group Attached ERROR: ${JSON.stringify(error, null, "\t")}`);
  //         if(error.statusCode === 400){
  //           done();
  //         } else {
  //           done (new Error(error));
  //         }
  //       });
  //   }, Util.config.msDelay);
  // });

  it("Delete Role From User Group", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.deleteRoleFromUserGroup(accessToken, userGroupUUID, role)
      .then(response => {
        logger.info(`Delete Role From User Group RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        setTimeout(() => {
          s2sMS.Auth.listUserGroupRoles(accessToken, userGroupUUID)
            .then(response => {
              logger.info(`Delete Role From User Group RESPONSE: ${JSON.stringify(response, null, "\t")}`);
              assert(response.items.length === 0);
              done();
            })
            .catch(error => {
              logger.info(`Delete Role From User Group ERROR: ${JSON.stringify(error, null, "\t")}`);
              done(new Error(error));
            });
        }, Util.config.msDelay);
      })
      .catch(error => {
        logger.info(`Delete Role From User Group ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  //Broken: CCORE-418
  // it("Delete Permission From Role", function(done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   setTimeout(() => {
  //     s2sMS.Auth.deletePermissionFromRole(
  //       accessToken,
  //       role,
  //       permissions[0].uuid
  //     )
  //       .then(response => {
  //         logger.info(`Delete Permission From Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
  //         assert(response.status === "ok");
  //         done();
  //       })
  //       .catch(error => {
  //         logger.error(`Delete Permission From Role ERROR: ${JSON.stringify(error, null, "\t")}`);
  //         done(new Error(error));
  //       });
  //   }, Util.config.msDelay);
  // });

  it("Deactivate Role", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.deactivateRole(accessToken, role)
      .then(response => {
        logger.info(`Deactivate Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`Deactivate Role ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Reactivate Role", function(done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.activateRole(accessToken, role)
      .then(response => {
        logger.info(`Reactivate Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`Reactivate Role ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  //Broken: CCORE-216
  // it("Delete Role", function(done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }

  //   s2sMS.Auth.deleteRole(accessToken, role)
  //     .then(response => {
  //       logger.info(`Delete Role RESPONSE: ${JSON.stringify(response, null, "\t")}`);
  //       assert(response.status === "ok");
  //       done();
  //     })
  //     .catch(error => {
  //       logger.error(`Delete Role RESPONSE: ${JSON.stringify(error, null, "\t")}`);
  //       done(new Error(error));
  //     });
  // });

  it("Delete User Group", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Groups.deleteGroup(accessToken, userGroupUUID, trace);
    assert(response.status === "ok");
    return response;
  },"Delete User Groups"));

  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   const response = await somethingAsync();
  //   assert(1 === 1);
  //   return response;
  // },"change me"));
});
