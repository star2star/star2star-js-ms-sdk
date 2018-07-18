var assert = require("assert");
var s2sMS = require("../src/index");
var fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Groups Test Suite", function () {

  let accessToken, identityData;

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
    })
  });

  it("List Groups", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.listGroups(
        accessToken
      ).then(responseData => {
        // console.log(responseData);
        // TODO other asserts?
        assert(
          responseData.hasOwnProperty('items') &&
          responseData.hasOwnProperty('metadata')
        );
        done();
      })
      .catch((error) => {
        console.log('Error list groups [list groups]', error);
        done(new Error(error));
      });
  });

  it("Create Group", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.createGroup(
        accessToken,
        "Test Group",
        "unit test group",
        "xyz", []
      ).then(responseData => {
        // console.log('create groups responses [CreateGroups]', responseData);
        assert(
          responseData.name === 'Test Group' &&
          responseData.type === 'xyz');
        done();
        // cleanup
        s2sMS.Groups.deleteGroup(
            accessToken,
            responseData.uuid
          ).then((d) => {
            // console.log('deleted group [createGroups]', responseData.uuid);
          })
          .catch((error) => {
            console.log('Error delete group [create group]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error create group [create group]', error);
        done(new Error(error));
      });
  });


  it("List Groups with filter", function (done) {
    if (!creds.isValid) return done();
    const filter = {
      group_type: "unit_test_group_type"
    };

    const testGroupNames = ['UnitTestGroup1', 'UnitTestGroup2', 'UnitTestGroup3']

    let groupPromiseArray = [];

    testGroupNames.forEach((gName) => {
      groupPromiseArray.push(
        s2sMS.Groups.createGroup(
          accessToken,
          gName,
          "unit test group",
          "unit_test_group_type", []
        ));
    });

    Promise.all(groupPromiseArray).then((responseArray) => {
        s2sMS.Groups.listGroups(
            accessToken,
            filter
          ).then(responseData => {
            // console.log('Filtered group list -- unit_test_group_type', responseData);
            // TODO other assertions??
            assert(
              responseData.items.length > 0 &&
              responseData.items[0].type === 'unit_test_group_type' &&
              responseData.items[responseData.items.length - 1].type === 'unit_test_group_type'
            );
            done();
            // cleanup
            responseData.items.forEach((group) => {
              s2sMS.Groups.deleteGroup(
                  accessToken,
                  group.uuid
                ).then((d) => {
                  // console.log('deleted group [createGroups]', group.uuid);
                })
                .catch((error) => {
                  console.log('Error deleting groups [filter list]', error);
                  done(new Error(error));
                });
            });
          })
          .catch((error) => {
            console.log('Error list groups with filter', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error creating groups for list filter test', error);
        done(new Error(error));
      });
  });

  it("Delete Groups ", function (done) {
    if (!creds.isValid) return done();
    const testGroupName = 'UnitTestDeleteMe';

    s2sMS.Groups.createGroup(
        accessToken,
        testGroupName,
        "unit test group",
        "unit_test_group_delete_type", []
      ).then((responseData) => {
        s2sMS.Groups.deleteGroup(
            accessToken,
            responseData.uuid
          ).then((d) => {
            // console.log('Deleted group ', responseData.uuid);
            done();
          })
          .catch((error) => {
            console.log('error deleting group [delete group]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('error creating group [delete group]', error);
        done(new Error(error));
      });
  });

  it("Create, get and  Delete Group", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.createGroup(
        accessToken,
        "Unit Test Group" + Date.now(),
        "group description",
        "group_type", []
      ).then(responseData => {
        //console.log(responseData);
        s2sMS.Groups.getGroup(
            accessToken,
            responseData.uuid
          ).then(updatedData => {
            assert(updatedData.uuid === responseData.uuid);
            done();
            s2sMS.Groups.deleteGroup(
                accessToken,
                updatedData.uuid
              ).then(d => {
                //console.log('deleted group', updatedData.uuid);
              })
              .catch((error) => {
                console.log('Error deleting group [create/get/delete group]', error);
                done(new Error(error));
              });
          })
          .catch((error) => {
            console.log('Error getting group', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('ERrror creating group [create/get/delete group]', error);
        done(new Error(error));
      });
  });

  it("Create, update and  Delete Group", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Groups.createGroup(
        accessToken,
        "Unit Test Group" + Date.now(),
        "group description",
        "group_type", []
      ).then(responseData => {
        // console.log('CreateGroup response [create/update/delete]', responseData);
        responseData.name = "UPDATED NAME";
        s2sMS.Groups.updateGroup(
            responseData.uuid,
            accessToken,
            responseData
          ).then(updatedData => {
            assert(updatedData.name === "UPDATED NAME");
            done();
            s2sMS.Groups.deleteGroup(
                accessToken,
                responseData.uuid
              ).then(d => {
                //console.log(d)
              })
              .catch((error) => {
                console.log('Error deleting group [create/update/delete group', error);
                done(new Error(error));
              });
          })
          .catch((error) => {
            console.log('Error updating group [create/update/delete group]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error creating group [create/update/delete]', error);
        done(new Error(error));
      });
  });

  it("Create, Add Members and  Delete Group", function (done) {
    if (!creds.isValid) return done();

    const groupName = "GroupWithMembers " + Date.now();
        s2sMS.Groups.createGroup(
            accessToken,
            groupName,
            "Unit test for group -- add members",
            "unit_test_type", []
          ).then(responseData => {
            // console.log("responseData group uuid", responseData.uuid);
            const testMembers = [{
              uuid: identityData.uuid
            }];
            s2sMS.Groups.addMembersToGroup(
                accessToken,
                responseData.uuid, // group uuid
                testMembers
              ).then(responseData => {
                // console.log("Add Members response %j", responseData);
                assert(
                  responseData.name === groupName &&
                  responseData.total_members === 1
                );
                done();
                s2sMS.Groups.deleteGroup(
                    accessToken,
                    responseData.uuid
                  ).then(d => {
                    //console.log("DELETED Group", responseData.uuid);
                  })
                  .catch((error) => {
                    console.log('Error deleting group [create/add members/delete]', error);
                    done(new Error(error));
                  });
              })
              .catch((error) => {
                console.log('Error adding member to group [create/add members/delete]', error);
                done(new Error(error));
              });
          })
          .catch((error) => {
            console.log('Error creating group [create/add members/delete]', error);
            done(new Error(error));
          });
  });
 
  let testGroupUuid;

  it("Create User Group", function (done) {
    if (!creds.isValid) return done();
    
    const body = {
      "account_id": identityData.account_uuid,
      "description": "A test group",
      "members": [
        {
          "uuid": "fake-uuid"
        }
      ],
      "name": "Test",
      "type": "user"
    }
    s2sMS.Groups.createUserGroup(
        accessToken,
        identityData.uuid,
        body
      ).then(responseData => {
        testGroupUuid = responseData.uuid; //Use this uuid for other tests.
        // console.log(responseData);
        assert(
          responseData.account_uuid === identityData.account_uuid
        );
        done();
      })
      .catch((error) => {
        console.log('Error Create User Group', error);
        done(new Error(error));
      });
  });

  it("List User Groups", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.listUserGroups(
        accessToken,
        identityData.uuid,
        0, //offset
        10, //limit
        "member", //expand
        5 //member_limit
      ).then(responseData => {
        // console.log(responseData);
        assert(
          responseData.hasOwnProperty('items')
        );
        done();
      })
      .catch((error) => {
        console.log('Error List User Groups', error);
        done(new Error(error));
      });
  });

  it("Modify User Group", function (done) {
    if (!creds.isValid) return done();
    const body = {
      "description": "new description",
      "name": "new name"
    }
    s2sMS.Groups.modifyUserGroup(
        accessToken,
        identityData.uuid,
        testGroupUuid,
        body
      ).then(responseData => {
        // console.log(responseData);
        assert(responseData.name === "new name");
        done();
      })
      .catch((error) => {
        console.log('Error List User Groups', error);
        done(new Error(error));
      });
  });
  
  it("Add Group to User", function (done) {
    if (!creds.isValid) return done();
    const body = {
      "groups": [
        testGroupUuid
      ]
    }
    s2sMS.Groups.assignGroupsToUser(
        accessToken,
        identityData.uuid,
        body
      ).then(responseData => {
        // console.log(responseData);
        assert(responseData[0].uuid === testGroupUuid);
        done();
      })
      .catch((error) => {
        console.log('Error Add Group to User', error);
        done(new Error(error));
      });
  });

  it("Delete User from Group", function (done) {
    if (!creds.isValid) return done();
    body = [
      {
        "uuid": identityData.uuid
      }
    ];
    s2sMS.Groups.deleteGroupMembers(
        accessToken,
        identityData.uuid,
        testGroupUuid,
        body
      ).then(responseData => {
        // console.log(responseData);
        assert(responseData.status === "ok");

        done();
      })
      .catch((error) => {
        console.log('Error Delete User Group', error);
        done(new Error(error));
      });
  });

  it("Delete User Group", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Groups.deleteUserGroup(
        accessToken,
        identityData.uuid,
        testGroupUuid
      ).then(responseData => {
        // console.log(responseData);
        assert(responseData.status === "ok");
        done();
      })
      .catch((error) => {
        console.log('Error Delete User Group', error);
        done(new Error(error));
      });
  });

});