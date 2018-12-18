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

describe("Chat", function() {
  let accessToken;
  let identityData;

  let creds = {
    CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
    CPAAS_API_VERSION: "v1",
    email: "email@email.com",
    password: "pwd",
    isValid: false
  };

  let test_room, test_groupUUID;

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

  it("Create Room", function(done) {
    if (!creds.isValid) return done();

    //create temporary group
    const body = {
      account_uuid: identityData.account_uuid,
      description: "A test group",
      members: [
        {
          uuid: identityData.uuid
        }
      ],
      name: "Test",
      type: "user-default"
    };
    s2sMS.Groups.createGroup(accessToken, body)
      .then(groupData => {
        //console.log('GroupData', groupData);
        test_groupUUID = groupData.uuid;
        s2sMS.Chat.createRoom(
          accessToken,
          identityData.uuid,
          "name",
          "topic",
          "desc",
          test_groupUUID,
          identityData.account_uuid,
          { foo: "bar" } // metadata
        )
          .then(roomData => {
            //Save this roomData for other tests
            test_room = roomData;
            assert(
              roomData.name === "name" &&
                roomData.topic === "topic" &&
                roomData.status === "active" &&
                roomData.owner_uuid === identityData.uuid &&
                roomData.group_uuid === groupData.uuid &&
                roomData.account_uuid === identityData.account_uuid
            );
            done();
          })
          .catch(error => {
            console.log("Error Creating Room", error);
            done();
          });
      })
      .catch(error => {
        console.log("Error Creating Temporary Group", error);
        done();
      });
  });

  it("List Rooms", function(done) {
    if (!creds.isValid) return done();

    s2sMS.Chat.listRooms(accessToken).then(responseData => {
      //console.log("Got List Room response", responseData);
      assert(
        responseData.items && responseData.items.length >= 0,
        "chat returned with invalid structure must have items"
      );
      done();
    });
  });

  it("Get Room", function(done) {
    if (!creds.isValid || test_room.uuid === undefined) return done();

    s2sMS.Chat.getRoom(accessToken, test_room.uuid).then(roomData => {
      //  console.log("Got Room Data", roomData);
      assert(
        roomData.uuid === test_room.uuid &&
          roomData.owner_uuid === test_room.owner_uuid
      );
      done();
    });
  });

  it("Modify Room Info", function(done) {
    if (!creds.isValid) return done();
    const newInfo = objectMerge({}, test_room);
    newInfo.name = "james";
    newInfo.topic = "test2";
    newInfo.description = "updated description";
    s2sMS.Chat.updateRoomInfo(accessToken, test_room.uuid, newInfo)
      .then(roomUpdate => {
        //console.log('uuuuu', roomUpdate)
        assert(
          roomUpdate.name === newInfo.name &&
            roomUpdate.topic === newInfo.topic &&
            roomUpdate.status === newInfo.status &&
            roomUpdate.owner_uuid === identityData.uuid &&
            roomUpdate.group_uuid === test_groupUUID &&
            roomUpdate.account_uuid === identityData.account_uuid &&
            roomUpdate.description === newInfo.description
        );
        done();
      })
      .catch(error => {
        console.log("Error Modifying Room Info", error);
      }); // end update room info
  });

  it("Modify Room Metadata ", function(done) {
    if (!creds.isValid) return done();
    //console.log(identityData
    const newMeta = {};
    newMeta.foo = "bar";
    s2sMS.Chat.updateRoomMeta(accessToken, test_room.uuid, newMeta)
      .then(roomUpdate => {
        //console.log('uuuuuuuu', roomUpdate)
        assert(
          typeof roomUpdate.metadata === "object" &&
            roomUpdate.metadata.foo === newMeta.foo
        );
        done();
      })
      .catch(error => {
        //console.log(error);
        assert(false);
        done();
      });
  });

  it("Modify Room Metadata which had old metadata ", function(done) {
    if (!creds.isValid) return done();
    //console.log(identityData
    const newMeta = {};
    newMeta.foo = "baz";
    s2sMS.Chat.updateRoomMeta(accessToken, test_room.uuid, newMeta)
      .then(roomUpdate => {
        //console.log('uuuuuuuu', roomUpdate)
        assert(
          typeof roomUpdate.metadata === "object" &&
            roomUpdate.metadata.foo === newMeta.foo
        );
        done();
      })
      .catch(error => {
        //console.log(error);
        assert(false);
        done();
      });
  });

  it("Delete A Member", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.deleteMember(accessToken, test_room.uuid, identityData.uuid)
      .then(memberData => {
        assert(memberData.uuid === identityData.uuid);
        done();
      })
      .catch(error => {
        console.log("xxxxx", error);
        assert(false);
        done();
      });
  });

  it("Add Member To Room", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.addMember(accessToken, test_room.uuid, {
      uuid: identityData.uuid,
      type: "user"
    })
      .then(memberData => {
        //console.log('add member:', memberData)
        assert(memberData.uuid && memberData.type);
        done();
      })
      .catch(error => {
        console.log("xxxxxaddMemberToRoom", error);
        assert(false);
        done();
      });
  });

  it("Get Room Members", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getRoomMembers(accessToken, test_room.uuid)
      .then(memberData => {
        //console.log('mmmmm', memberData)
        assert(memberData.items.length > 0);
        done();
      })
      .catch(xError => {
        console.log("xxxxxgetRoomMembers", xError);
        assert(false);
        done();
      });
  });

  it("Send Message", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.sendMessage(
      accessToken,
      identityData.uuid,
      test_room.uuid,
      "test"
    )
      .then(sendResponse => {
        //console.log('send message data: ', sendResponse)
        assert(sendResponse.content.content === "test");
        done();
      })
      .catch(error => {
        console.log("xxxxxsendMessage", error);
        assert(false);
        done();
      });
  });

  it("Get Messages", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getMessages(accessToken, test_room.uuid)
      .then(messageData => {
        //console.log('message Data:', messageData)
        assert(messageData.items && messageData.items.length > 0);
        done();
      })
      .catch(error => {
        console.log("xxxxxgetMessages", error);
        assert(false);
        done();
      });
  });

  it("Get Room Info (data, members, messages)", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getRoomInfo(accessToken, test_room.uuid)
      .then(roomInfo => {
        //console.log('RoomInfo', roomInfo);
        assert(roomInfo.info.uuid === test_room.uuid, "uuid is not valid ");
        assert(
          roomInfo.info.owner_uuid === identityData.uuid,
          "owner is valid"
        );
        //TODO fix when api fixed assert(roomInfo.members.length === 1, "member length invalid");
        assert(
          roomInfo.messages.length === 1,
          "message length should be greater than 1"
        );
        assert(
          roomInfo.messages[0].content.content === "test",
          "first message should be test "
        );
        done();
      })
      .catch(error => {
        console.log("xxxxxgetRoomInfo", error);
        done();
      });
  });

  it("Delete Room", function(done) {
    if (!creds.isValid) return done();
    //Delete the temporary group
    s2sMS.Groups.deleteGroup(accessToken, test_groupUUID)
      .then(response => {
        //console.log("DELETED GROUP",response);
        assert(response.status === "ok");
        s2sMS.Chat.deleteRoom(accessToken, test_room.uuid)
          .then(response => {
            //console.log("DELETED ROOM", response);
            assert(typeof response === "object");
            done();
          })
          .catch(error => {
            console.log("ERROR DELETING ROOM", error);
            done();
          });
      })
      .catch(error => {
        console.log("ERROR DELETING GROUP", error);
        done();
      });
  });
});
