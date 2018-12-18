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

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Groups Test Suite", function() {
  let accessToken, identityData, testGroupUuid;

  before(function() {
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
    return new Promise((resolve, reject) => {
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      ).then(oauthData => {
        //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
        accessToken = oauthData.access_token;
        s2sMS.Identity.getMyIdentityData(accessToken)
          .then(idData => {
            s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid)
              .then(identityDetails => {
                identityData = identityDetails;
                resolve();
              })
              .catch(e1 => {
                reject(e1);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    });
  });

  it("List Groups", function(done) {
    if (!creds.isValid) return done();
    const filters = [];
    filters["expand"] = "members";
    filters["member_limit"] = 5;

    s2sMS.Groups.listGroups(
      accessToken,
      0, //offset
      10, //limit
      filters
    )
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.hasOwnProperty("items"));
        done();
      })
      .catch(error => {
        console.log("Error List User Groups", error);
        done(new Error(error));
      });
  });

  it("Create Group", function(done) {
    if (!creds.isValid) return done();

    //FIXME needs default attribute CCORE-179
    const body = {
      account_id: identityData.account_uuid,
      description: "A test group", //FIXME Revisit when CCORE-181 is fixed
      members: [
        {
          uuid: "fake-uuid"
        }
      ],
      name: "Test",
      type: "user"
    };
    s2sMS.Groups.createGroup(accessToken, body)
      .then(responseData => {
        testGroupUuid = responseData.uuid; //Use this uuid for other tests.
        //console.log(responseData);
        assert(responseData.name === "Test");
        done();
      })
      .catch(error => {
        console.log("Error Create Group", error);
        done(new Error(error));
      });
  });

  it("Get One Group", function(done) {
    if (!creds.isValid) return done();
    const filters = [];
    filters["expand"] = "members.type";

    s2sMS.Groups.getGroup(accessToken, testGroupUuid, filters)
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.name === "Test");
        assert(responseData.members.items[0].type === "user");
        done();
      })
      .catch(error => {
        console.log("Error List User Groups", error);
        done(new Error(error));
      });
  });

  it("Get Group Members", function(done) {
    if (!creds.isValid) return done();
    const filters = [];
    filters["expand"] = "members.type";

    s2sMS.Groups.listGroupMembers(accessToken, testGroupUuid, filters)
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.metadata.total === 1);
        assert(responseData.items[0].type === "user");
        done();
      })
      .catch(error => {
        console.log("Error List User Groups", error);
        done(new Error(error));
      });
  });

  it("Add User to Group", function(done) {
    if (!creds.isValid) return done();
    const testMembers = [
      {
        type: "user",
        uuid: identityData.uuid
      }
    ];
    s2sMS.Groups.addMembersToGroup(accessToken, testGroupUuid, testMembers)
      .then(responseData => {
        // console.log("Add Members response %j", responseData);
        assert(
          responseData.name === "Test" && responseData.total_members === 2
        );
        done();
      })
      .catch(error => {
        console.log(
          "Error adding member to group [create/add members/delete]",
          error
        );
        done(new Error(error));
      });
  });

  it("Delete User from Group", function(done) {
    if (!creds.isValid) return done();
    const members = [
      {
        uuid: identityData.uuid
      }
    ];
    s2sMS.Groups.deleteGroupMembers(accessToken, testGroupUuid, members)
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.status === "ok");

        done();
      })
      .catch(error => {
        console.log("Error Delete User Group", error);
        done(new Error(error));
      });
  });

  it("Modify Group", function(done) {
    if (!creds.isValid) return done();
    const body = {
      description: "new description",
      name: "new name"
    };
    s2sMS.Groups.modifyGroup(accessToken, testGroupUuid, body)
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.name === "new name");
        done();
      })
      .catch(error => {
        console.log("Modify Group", error);
        done(new Error(error));
      });
  });

  it("Deactivate Group", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.deactivateGroup(accessToken, testGroupUuid)
      .then(responseData => {
        //console.log(responseData);
        assert(responseData.status === "Inactive");
        done();
      })
      .catch(error => {
        console.log("Error Deactivting Group", error);
        done(new Error(error));
      });
  });

  it("Reactivate Group", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.reactivateGroup(accessToken, testGroupUuid)
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.status === "Active");
        done();
      })
      .catch(error => {
        console.log("Error Reactivate Group", error);
        done(new Error(error));
      });
  });

  it("Delete Group", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.deleteGroup(accessToken, testGroupUuid)
      .then(responseData => {
        // console.log(responseData);
        assert(responseData.status === "ok");
        done();
      })
      .catch(error => {
        console.log("Error Delete Group", error);
        done(new Error(error));
      });
  });
});
