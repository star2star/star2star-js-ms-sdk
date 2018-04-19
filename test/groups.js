var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

beforeEach(function() {
  //process.env.NODE_ENV = 'dev';
  process.env.BASE_URL = "https://cpaas.star2star.net";
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("Groups", function() {
  it("List Groups", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password).then(
      identityData => {
        //console.log(identityData)
        s2sMS.Groups.listGroups(
          creds.CPAAS_KEY,
          // identityData.user_uuid,
          identityData.token
        ).then(responseData => {
          //console.log(responseData)
          assert(responseData.metadata !== null);
          done();
        });
      }
    );
  });
  it("List Groups with filter", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password).then(
      identityData => {
        //console.log(identityData)
        const filter = { group_type: "x" };
        s2sMS.Groups.listGroups(
          creds.CPAAS_KEY,
          identityData.token,
          filter
        ).then(responseData => {
          //console.log(responseData)
          assert(responseData.metadata !== null);
          done();
        });
      }
    );
  });

  it("Create /  Delete Group ", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password).then(
      identityData => {
        /*
      * @param name - String group Name
      * @param description - description
      * @param groupType = string group type
      * @param members - array of type, uuid,
      * @param accountUUID - account uuid optional
      */
        s2sMS.Groups.createGroup(
          creds.CPAAS_KEY,
          identityData.token,
          "foo",
          "desc",
          "footype",
          []
        ).then(responseData => {
          //console.log(identityData.token)
          //console.log(responseData)
          assert(responseData.metadata !== null);
          done();
          s2sMS.Groups.deleteGroup(
            creds.CPAAS_KEY,
            responseData.uuid,
            identityData.token
          ).then(d => {});
        });
      }
    );
  });

  it("Create, update and  Delete Group", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password).then(
      identityData => {
        s2sMS.Groups.createGroup(
          creds.CPAAS_KEY,
          identityData.token,
          "foo",
          "desc",
          "footype",
          []
        ).then(responseData => {
          // console.log(responseData);
          responseData.name = "james";

          s2sMS.Groups.updateGroup(
            creds.CPAAS_KEY,
            responseData.uuid,
            identityData.token,
            responseData
          ).then(updatedData => {
            assert(updatedData.name === "james");
            done();
            s2sMS.Groups.deleteGroup(
              creds.CPAAS_KEY,
              responseData.uuid,
              identityData.token
            ).then(d => {
              //console.log(d)
            });
          });
        });
      }
    );
  });
  it("Create, get and  Delete Group", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password).then(
      identityData => {
        s2sMS.Groups.createGroup(
          creds.CPAAS_KEY,
          identityData.token,
          "foo",
          "desc",
          "footype",
          []
        ).then(responseData => {
          //console.log(responseData);
          s2sMS.Groups.getGroup(
            creds.CPAAS_KEY,
            responseData.uuid,
            identityData.token
          ).then(updatedData => {
            assert(updatedData.uuid === responseData.uuid);
            done();
            s2sMS.Groups.deleteGroup(
              creds.CPAAS_KEY,
              updatedData.uuid,
              identityData.token
            ).then(d => {
              //console.log(d)
            });
          });
        });
      }
    );
  });
  it("Create, Add Members and  Delete Group", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password).then(
      identityData => {
        // console.log("user_uuid", identityData.user_uuid);
        s2sMS.Groups.createGroup(
          creds.CPAAS_KEY,
          identityData.token,
          "foo",
          "desc",
          "footype",
          []
        ).then(responseData => {
          // console.log("responseData group uuid", responseData.uuid);
          const testMembers = [{ uuid: identityData.user_uuid }];
          s2sMS.Groups.addMembersToGroup(
            creds.CPAAS_KEY,
            identityData.token,
            responseData.uuid, // group uuid
            testMembers
          ).then(respData => {
            // console.log("resolved -- add members %j", respData);
            assert(
              respData.total_members === 1 &&
                respData.members[0].type === "user" &&
                respData.members[0].uuid === identityData.user_uuid
            );
            done();
            s2sMS.Groups.deleteGroup(
              creds.CPAAS_KEY,
              responseData.uuid,
              identityData.token
            ).then(d => {
              //console.log("DELETED Group", responseData.uuid);
            });
          });
        });
      }
    );
  });
});
