const assert = require("assert");
const util = require("../utilities");
const request = require('request-promise');
const s2sMS = require("../index");
const fs = require("fs");


let creds = {
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_PERMISSIONS_KEY: "your permissions key here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

// consts for permissions in this environment
let permissions = {};

describe("Auth MS Test Suite", function () {

  let accessToken;

  before(function () {
    // For tests, use the dev msHost
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");

    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
        creds.CPAAS_OAUTH_TOKEN,
        creds.CPAAS_API_VERSION,
        creds.email,
        creds.password
      )
      .then(oauthData => {
        const oData = JSON.parse(oauthData);
        // console.log('Got access token and identity data -[Get Object By Data Type] ', identityData, oData);
        accessToken = oData.access_token;




      });
  });

  it("Auth Pre-test setup", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.getPermissions(accessToken).then((pData) => {
        // console.log('PPPPPPP', pData);
        permissions = pData;
        done();
      })
      .catch((error) => {
        done(new Error(error));
      });
  });


  it("list permissions", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        // console.log('iiiii %j', identityData);
        const idData = JSON.parse(identityData);
        const resourceType = 'object';
        const scope = 'user';
        const actions = ['create', 'read', 'list'];
        s2sMS.Auth.listUserPermissions(
          accessToken,
          idData.user_uuid,
          resourceType,
          scope,
          actions
        ).then(responseData => {
          // console.log('listUserPermissions response %j', responseData);
          // TODO what asserts should be made here???          
          assert(responseData.length > 0);
          done();
        }).catch((error) => {
          console.log('error in list permissions', error);
          done(new Error(error));
        });
      });
  });

  it("list permissions with resource type ", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Identity.getMyIdentityData(accessToken)
      .then(identityData => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        const resourceTypeToMatch = 'object';

        s2sMS.Auth.listUserPermissions(
            accessToken,
            idData.user_uuid,
            resourceTypeToMatch
          ).then(responseData => {
            // console.log('rrrrrr %j', responseData);
            const notMatchingPermissions = responseData.filter((item) => {
              return item.resource_type !== resourceTypeToMatch;
            });

            assert(responseData.length > 0 && notMatchingPermissions.length === 0);
            done();
          })
          .catch((error) => {
            console.log('Error getting permissions with resource type filter', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error getting identity data [list permissions with resource type]', error);
        done(new Error(error));
      });
  });

  it("list permissions with resource type with scope ", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        const resourceTypeToMatch = "object";
        const scopeToMatch = "global";

        s2sMS.Auth.listUserPermissions(
            accessToken,
            idData.user_uuid,
            resourceTypeToMatch,
            scopeToMatch
          ).then(responseData => {
            // console.log('rrrrrr %j', responseData )
            const notMatchingPermissions = responseData.filter((item) => {
              return item.resource_type !== resourceTypeToMatch || item.scope !== scopeToMatch;
            });

            assert(responseData.length >= 0 && notMatchingPermissions.length === 0);
            done();
          })
          .catch((error) => {
            console.log('Error getting permissions with resource type and scope filtered', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error getting identity data [list permissions with resource type]', error);
        done(new Error(error));
      });
  });


  it("list permissions with resource type with scope and action ", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }

    // TODO need to create test conditions so that data will be returned from microservice...

    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        const resourceTypeToMatch = "object";
        const scopeToMatch = "global";
        const actionToMatch = ["read"];

        s2sMS.Auth.listUserPermissions(
            accessToken,
            idData.user_uuid,
            resourceTypeToMatch,
            scopeToMatch,
            actionToMatch
          ).then(responseData => {
            // console.log('response from listUserPermissions %j', responseData)
            const notMatchingPermissions = responseData.filter((item) => {
              return item.resource_type !== resourceTypeToMatch || item.scope !== scopeToMatch || item.action.indexOf(actionToMatch[0]) === -1;
            });

            assert(responseData.length >= 0 && notMatchingPermissions.length === 0);
            done();
          })
          .catch((error) => {
            console.log('Error getting permissions with resource type, scope and action filtered', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error getting identity data [list permissions with resource type]', error);
        done(new Error(error));
      });
  });


  it("get Specific Permissions  ", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    // TODO create test data and clean it up after testing
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        s2sMS.Auth.getSpecificPermissions(
            accessToken,
            idData.user_uuid,
            "object",
            "global", ["list"]
          ).then(responseData => {
            // console.log('response from getSpecificPermissions [getSpecificPermissions] %j', responseData)
            assert(responseData.length === 1);
            done();
          })
          .catch((error) => {
            console.log('Error getting specific permissions', error);
            done(new Error(error));
          })
      });
  });

  it("get Specific Permissions  multiple ", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then(identityData => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        s2sMS.Auth.getSpecificPermissions(
            accessToken,
            idData.user_uuid,
            "object",
            "global", ["read", "list"]
          ).then(responseData => {
            //console.log('rrrrrr %j', responseData )
            assert(responseData.length === 2);
            done();
          })
          .catch((error) => {
            console.log('Error getting specific permissions multiple', error);
            done(new Error(error));
          });
      });
  });

  it("get Specific Permissions invalid action", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then(identityData => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        s2sMS.Auth.getSpecificPermissions(
          accessToken,
          idData.user_uuid,
          "object",
          "global", ["foo"]
        ).catch(errorData => {
          // console.log('RrRrRrrrRRRRr %j', errorData)
          assert(errorData.indexOf("actions must be an array") > -1);
          done();
        });
      });
  });

  it("get Specific Permissions invalid resouce_type", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then(identityData => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        s2sMS.Auth.getSpecificPermissions(
          accessToken,
          idData.user_uuid,
          "bad",
          "global", ["foo"]
        ).catch(errorData => {
          //console.log('rrrrrr %j', errorData )
          assert(errorData.indexOf("resource_type must be") > -1);
          done();
        });
      });
  });

  it("get Specific Permissions invalid scope", function (done) {
    if (!creds.isValid) {
      const err = new Error("Valid credentials must be provided");
      return done(err);
    }
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then(identityData => {
        //console.log('iiiii %j', identityData )
        const idData = JSON.parse(identityData);
        s2sMS.Auth.getSpecificPermissions(
          accessToken,
          idData.user_uuid,
          "object",
          "x", ["foo"]
        ).catch(errorData => {
          //console.log('rrrrrr %j', errorData )
          assert(errorData.indexOf("scope must be") > -1);
          done();
        });
      });
  });
});