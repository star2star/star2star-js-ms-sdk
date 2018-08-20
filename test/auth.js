const assert = require("assert");
const s2sMS = require("../src/index");
const util = s2sMS.Util;
const request = require('request-promise');

const fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Auth MS Test Suite", function () {

  let accessToken, identityData, userGroupUUID, role, roleBody;
  let permissions = [];

  before(function () {
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
        return new Promise((resolve, reject)=>{
          s2sMS.Oauth.getAccessToken(
            creds.CPAAS_OAUTH_TOKEN,
            creds.email,
            creds.password
          )
          .then(oauthData => {
            //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
            accessToken = oauthData.access_token;
            s2sMS.Identity.getMyIdentityData(accessToken).then((idData)=>{
              s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid).then((identityDetails)=>{
                identityData = identityDetails;
                resolve();
              }).catch((e1)=>{
                reject(e1);
              });
            }).catch((e)=>{
              reject(e);
            });
          });
        });
  });
  
  //Not needed yet NH 8/17/18
  // it("Create Permission", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
    
  //   body = {
  //     "name": "object.update",
  //     "description": "Update an object",
  //     "resource_type": "object",
  //     "action": "update",
  //     "allowed": true
  //   };

  //   s2sMS.Auth.createPermission(accessToken, body) //FIXME Revisit this when types of permissions expand
  //   .then(response => {
  //       //This should not work
  //       console.log('RESPONSE', response);
  //       done(new Error(error));
  //     })
  //     .catch((error) => {
  //       //console.log("ERROR", error.statusCode);
  //       assert(error.statusCode == "409");
  //       done();
  //     });
  // });

  it("List Permissions", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    
    const filters = [];
    filters["name"] = "account";

    s2sMS.Auth.listPermissions(accessToken, 0, 2, filters)
    .then(response => {
        //console.log('LIST PERMISSIONS RESPONSE', response);
        permissions = response.items;
        assert(response.hasOwnProperty("items") && response.items[0].hasOwnProperty("action"));
        done();
      })
      .catch((error) => {
        done(new Error(error));
      });
  });

  it("Create User Group", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    body = {
        "name": "Unit-Test",
        "users": [
          identityData.uuid
        ],
        "description": "A test group"
      };
  
    s2sMS.Auth.createUserGroup(accessToken, identityData.account_uuid, body)
    .then(response => {
        //console.log('RESPONSE', response);
        userGroupUUID = response.uuid;
        assert(response.hasOwnProperty("uuid") &&
               response.members[0].uuid === identityData.uuid &&
               response.account_uuid === identityData.account_uuid);
        done();
      })
      .catch((error) => {
        done(new Error(error));
      });
  });
  
  
  it("Create Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
  
    const body = {
      "name": "Unit-Test",
      "type": "user",
      "status": "Active",
      "permissions": [
        permissions[0].uuid
      ]
    };

    s2sMS.Auth.createRole(accessToken, body)
      .then(response => {
          //console.log("RESPONSE", response);
          role = response.uuid;
          assert(
            response.hasOwnProperty("name") &&
            response.name === "Unit-Test"
           );
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("Assign Permissions to Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    
    const body = {
      "permissions":[
        permissions[1].uuid
      ]
    };

    s2sMS.Auth.assignPermissionsToRole(accessToken, role, body)
      .then(response => {
          //console.log("RESPONSE", response);
          assert(response.status === "ok");
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("List Roles", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    const filters = [];
    filters["name"] = "Unit-Test";

    s2sMS.Auth.listRoles(accessToken, 0, 1, filters)
      .then(response => {
          roleBody = response.items[0];
          //console.log("RESPONSE", response);
          assert(
            response.hasOwnProperty("items") &&
            response.items[0].hasOwnProperty("permissions") &&
            response.items[0].permissions.length === 2
          );
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("Modfy Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    roleBody.name = "new name";
    roleBody.description = "new description";

    s2sMS.Auth.modifyRole(accessToken, role, roleBody)
      .then(response => {
          //console.log("RESPONSE", response);
          assert(
            response.hasOwnProperty("name") &&
            response.name === "new name"
           );
          done();
        })
      .catch((error) => {
        console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("Assign Roles to User Group", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    
    const body = {
      "roles": [
        role
      ]
    };

    s2sMS.Auth.assignRolesToUserGroup(accessToken, userGroupUUID, body)
      .then(response => {
          //console.log("RESPONSE", response);
          assert(response.status === "ok");
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("List a Role's Groups", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    setTimeout(()=>{
      s2sMS.Auth.listRoleGroups(accessToken, role)
        .then(response => {        
            //console.log("RESPONSE", response);
            assert(
              response.items[0].uuid === userGroupUUID
            );
            done();
          })
        .catch((error) => {
          //console.log('Error in List Roles', error);
          done(new Error(error));
          });
    },2000);
  });
  
  it("List a Role's Permissions", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Auth.listRolePermissions(accessToken, role)
      .then(response => {        
          //console.log("RESPONSE", response);
          assert(response.items[0].uuid === permissions[0].uuid);
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("List a Permission's Roles", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Auth.listPermissionRoles(accessToken, permissions[0].uuid)
      .then(response => {        
          //console.log("RESPONSE", response);
          assert(response.items.length >= 1);
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("List a Group's Roles", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    setTimeout(()=>{
      s2sMS.Auth.listGroupRoles(accessToken, userGroupUUID)
        .then(response => {        
            //console.log("RESPONSE", response);
            assert(
              response.items[0].uuid === role
            );
            done();
          })
        .catch((error) => {
          //console.log('Error in List Roles', error);
          done(new Error(error));
          });
    },2000);
  });

  it("Delete Permission From Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.deletePermissionFromRole(accessToken, role, permissions[0].uuid)
      .then(response => {
          //console.log("RESPONSE", response);
          assert(response.status === "ok");
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });
  
  

  it("Deactivate Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.deactivateRole(accessToken, role)
      .then(response => {
          //console.log("Deactivate ROLE", response); 
          assert(response.status === "ok");
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("Reactivate Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.activateRole(accessToken, role)
      .then(response => {
          //console.log("Reactivate ROLE", response); 
          assert(response.status === "ok");
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("Delete Role From User Group", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.deleteRoleFromUserGroup(accessToken, userGroupUUID, role)
      .then(response => {
          //console.log("Reactivate ROLE", response); 
          assert(response.status === "ok");
          setTimeout(()=>{
            s2sMS.Auth.listGroupRoles(accessToken, userGroupUUID)
              .then(response => {        
                  //console.log("RESPONSE", response);
                  assert(response.items.length === 0);
                  done();
                })
              .catch((error) => {
                //console.log('Error in List Roles', error);
                done(new Error(error));
                });
          },2000);
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("Delete Role", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Auth.deleteRole(accessToken, role)
      .then(response => {
          //console.log("DELETE ROLE", response); 
          assert(response.status === "ok");
          done();
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });

  it("List User Groups", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    const filters = [];
    filters["name"] = "Unit-Test";

    s2sMS.Auth.listUserGroups(accessToken, 0, 10, filters)
      .then(response => {
        //console.log("RESPONSE", response);
        assert(
          response.hasOwnProperty("items") &&
          response.items[0].name === filters["name"]
        );
         //Cleanup
        s2sMS.Groups.deleteGroup(accessToken,userGroupUUID)
        .then(response => {
            //console.log("Deleted Group", response);
            done();
        })
        .catch(error => {
          done(new Error(error));
        });
        })
      .catch((error) => {
        //console.log('Error in List Roles', error);
        done(new Error(error));
        });
  });
});