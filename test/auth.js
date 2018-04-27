const assert = require("assert");
const request = require('request-promise');
const s2sMS = require("../index");
const fs = require("fs");

const setMsHost = require("../index").setMsHost;

let creds = {
  CPAAS_KEY: "yourkeyhere",
  CPAAS_IDENTITY_KEY: "id key here",
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_PERMISSIONS_KEY: "your permissions key here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};


beforeEach(function () {
  // For tests, use the dev msHost
  setMsHost("https://cpaas.star2starglobal.net");

  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});


const assignPermissions = () => {
  // this function will add permissions for a user if there are none.  The assignments will be cleaned up after 
}

// If we needed to create permissions, log them here so they can be deleted when test is done.
let newPermissions = [];

describe("Auth MS", function () {

  it("Auth Pre-test setup", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    // TODO get list of permissions.  If none, then create some for test
    const requestOptions = {
      method: "GET",
      uri: `${s2sMS.getMsHost()}/auth/permissions?resource_type=object`,
      headers: {
        "Content-type": "application/json",
        "application-key": creds.CPAAS_PERMISSIONS_KEY
      },
    };
    const permissionList = request(requestOptions);
    permissionList.then((permissionData) => {
      console.log('Permission Data', permissionData);
      const pData = JSON.parse(permissionData);



      if (pData.items.length > 0) {
        // console.log('Got some permisions', pData.items.length);
        // make array of user scope permissions
        const userPermissions = pData.items.filter((pItem) => {
          return pItem.scope === "user"
        });
        // console.log('user permissions...', userPermissions);
        // create an object and add user permissions to it...



        done();
      } else {
        // TODO need to create some permissions
        done();
      }
    });



    // s2sMS.Identity.login(
    //   creds.CPAAS_IDENTITY_KEY,
    //   creds.email,
    //   creds.password
    // ).then(identityData => {
    //   // console.log('iiiii %j', identityData);
    //   const resourceType = 'object';
    //   const scope = 'user';
    //   const actions = ['create', 'read', 'list'];
    //   s2sMS.Auth.listUserPermissions(
    //     creds.CPAAS_PERMISSIONS_KEY,
    //     identityData.user_uuid,
    //     resourceType,
    //     scope,
    //     actions
    //   ).then(responseData => {
    //     console.log('listUserPermissions response %j', responseData);
    //     assert(responseData.length > 0);
    //     done();
    //   }).catch((e) => {
    //     console.log('error in list permissions', e);
    //   });
    // });
  });




  // it("list permissions", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }

  //   let promiseArray




  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     // console.log('iiiii %j', identityData);
  //     const resourceType = 'object';
  //     const scope = 'user';
  //     const actions = ['create', 'read', 'list'];
  //     s2sMS.Auth.listUserPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       resourceType,
  //       scope,
  //       actions
  //     ).then(responseData => {
  //       console.log('listUserPermissions response %j', responseData);
  //       assert(responseData.length > 0);
  //       done();
  //     }).catch((e) => {
  //       console.log('error in list permissions', e);
  //     });
  //   });
  // });



  // it("list permissions with resource type ", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.listUserPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object"
  //     ).then(responseData => {
  //       //console.log('rrrrrr %j', responseData )
  //       assert(responseData.length > 0);
  //       done();
  //     });
  //   });
  // });
  // it("list permissions with resource type with scope ", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.listUserPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object",
  //       "global"
  //     ).then(responseData => {
  //       // console.log('rrrrrr %j', responseData )
  //       assert(responseData.length >= 0);
  //       done();
  //     });
  //   });
  // });
  // it("list permissions with resource type with scope and action ", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.listUserPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object",
  //       "global", ["read"]
  //     ).then(responseData => {
  //       //console.log('rrrrrr %j', responseData )
  //       assert(responseData.length >= 0);
  //       done();
  //     });
  //   });
  // });
  // it("get Specific Permissions  ", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.getSpecificPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object",
  //       "global", ["read"]
  //     ).then(responseData => {
  //       //console.log('rrrrrr %j', responseData )
  //       assert(responseData.length === 1);
  //       done();
  //     });
  //   });
  // });
  // it("get Specific Permissions  multiple ", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.getSpecificPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object",
  //       "global", ["read", "list"]
  //     ).then(responseData => {
  //       //console.log('rrrrrr %j', responseData )
  //       assert(responseData.length === 2);
  //       done();
  //     });
  //   });
  // });
  // it("get Specific Permissions invalid action", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.getSpecificPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object",
  //       "global", ["foo"]
  //     ).catch(errorData => {
  //       //console.log('rrrrrr %j', errorData )
  //       assert(errorData.indexOf("actions must be an array") > -1);
  //       done();
  //     });
  //   });
  // });
  // it("get Specific Permissions invalid resouce_type", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.getSpecificPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "bad",
  //       "global", ["foo"]
  //     ).catch(errorData => {
  //       //console.log('rrrrrr %j', errorData )
  //       assert(errorData.indexOf("resource_type must be") > -1);
  //       done();
  //     });
  //   });
  // });
  // it("get Specific Permissions invalid scope", function (done) {
  //   if (!creds.isValid) {
  //     const err = new Error("Valid credentials must be provided");
  //     return done(err);
  //   }
  //   s2sMS.Identity.login(
  //     creds.CPAAS_IDENTITY_KEY,
  //     creds.email,
  //     creds.password
  //   ).then(identityData => {
  //     //console.log('iiiii %j', identityData )
  //     s2sMS.Auth.getSpecificPermissions(
  //       creds.CPAAS_PERMISSIONS_KEY,
  //       identityData.user_uuid,
  //       identityData.token,
  //       "object",
  //       "x", ["foo"]
  //     ).catch(errorData => {
  //       //console.log('rrrrrr %j', errorData )
  //       assert(errorData.indexOf("scope must be") > -1);
  //       done();
  //     });
  //   });
  // });
});