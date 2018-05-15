// TODO update tov1 API when available...
var assert = require("assert");
var s2sMS = require("../src/index");
var fs = require("fs");
var ObjectMerge = require('object-merge');



describe("Chat", function () {
  let accessToken;
  let identityData;
  
  let creds = {
    CPAAS_KEY: "yourkeyhere",
    email: "email@email.com",
    password: "pwd",
    isValid: false
  };
  
  let test_roomUUID, test_roomOwner;

  before(function () {
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    // For tests, use the dev msHost
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return new Promise((resolve, reject)=>{
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      )
      .then(oauthData => {
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

  it("List Rooms", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Chat.listRooms(
      accessToken
    ).then(responseData => {
      //console.log("Got List Room response", responseData);
      // setup for getRoom test
      test_roomUUID =
        responseData.items.length > 0 ? responseData.items[0].uuid : undefined;
      test_roomOwner =
        responseData.items.length > 0 ?
        responseData.items[0].owner_uuid :
        undefined;
      // console.log("TTTTTTTT", test_roomUUID, test_roomOwner);
      //console.log("number of rooms are: " + responseData.items.length);
      assert(responseData.items && responseData.items.length >=0, "chat returned with invalid structure must have items" );
      done();
    });
  });

  it("Get Room", function (done) {
    if ( !creds.isValid || test_roomUUID === undefined) return done();

    s2sMS.Chat.getRoom(
      accessToken,
      test_roomUUID
    ).then(roomData => {
      // console.log("Got Room Data", roomData);
      assert(
        roomData.uuid === test_roomUUID &&
        roomData.owner_uuid === test_roomOwner
      );
      done();
    });
  });

  it("Create Room / Delete", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Groups.createGroup(
      accessToken, 
      "foo",
      "desc",
      "footype", []
    ).then(groupData => {
      //console.log('GroupData', groupData);
      s2sMS.Chat.createRoom(
        accessToken,
        identityData.uuid,
        "name",
        "topic",
        "desc",
        groupData.uuid,
        identityData.account_uuid, 
        { foo: "bar" } // metadata 
      ).then(roomData => {
        //console.log('>>>>>>>>>>>>>', identityData.uuid )
        //console.log('roomData >>>>', identityData, roomData)
        assert(
          roomData.name === "name" &&
          roomData.topic === "topic" &&
          roomData.status === "active" &&
          roomData.owner_uuid === identityData.uuid &&
          roomData.group_uuid === groupData.uuid &&
          roomData.account_uuid === identityData.account_uuid
        );
        done();
        s2sMS.Chat.deleteRoom(
          accessToken, 
          roomData.uuid
        );
        s2sMS.Groups.deleteGroup(
          accessToken, 
          groupData.uuid
        );
      });
    }); // end create group

  }); // end it

  it("Modify Room Info", function (done) {
    if (!creds.isValid) return done();
      s2sMS.Groups.createGroup(
        accessToken, 
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        //console.log('ggggg', groupData)
        //gData = groupData;
        s2sMS.Chat.createRoom(
          accessToken,
          identityData.uuid,
          "name",
          "topic",
          "desc",
          groupData.uuid,
          identityData.account_uuid, 
          { foo: "bar" } // metadata 
        ).then(roomData => {
          //console.log('.....', roomData)
          const newInfo = ObjectMerge({}, roomData);
          newInfo.status = "inactive";
          newInfo.name = "james";
          newInfo.topic = "test2";
          newInfo.description = "updated description";
          s2sMS.Chat.updateRoomInfo(
              accessToken, 
              roomData.uuid,
              newInfo
            )
            .then(roomUpdate => {
              //console.log('uuuuu', roomUpdate)
              assert(
                roomUpdate.name === newInfo.name &&
                roomUpdate.topic === newInfo.topic &&
                roomUpdate.status === newInfo.status &&
                roomUpdate.owner_uuid === identityData.uuid &&
                roomUpdate.group_uuid === groupData.uuid &&
                roomUpdate.account_uuid === identityData.account_uuid &&
                roomUpdate.description === newInfo.description
              );
              done();
              s2sMS.Chat.deleteRoom(
                accessToken,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                accessToken, 
                groupData.uuid
              ).then(d => {});
            })
            .catch(() => {
              s2sMS.Chat.deleteRoom(
                accessToken, 
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                accessToken, 
                groupData.uuid
              ).then(x => {});
            }); // end update room info
        }); //end create room
      }); // end create group
  }); // end it

  it("Modify Room Metadata ", function (done) {
    if (!creds.isValid) return done();
      //console.log(identityData)
      s2sMS.Groups.createGroup(
        accessToken, 
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          accessToken,
          identityData.uuid,
          "name",
          "topic",
          "desc",
          groupData.uuid,
          identityData.account_uuid,
          undefined
        ).then(roomData => {
          //console.log(roomData)
          const newMeta = {};
          newMeta.foo = "bar";
          s2sMS.Chat.updateRoomMeta(
              accessToken, 
              roomData.uuid,
              newMeta
            )
            .then(roomUpdate => {
              //console.log('uuuuuuuu', roomUpdate)
              assert(
                typeof roomUpdate.metadata === "object" &&
                roomUpdate.metadata.foo === newMeta.foo
              );
              done();
              s2sMS.Chat.deleteRoom(
                accessToken,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                accessToken,
                groupData.uuid
              ).then(d => {});
            })
            .catch(xError => {
              //console.log(xError);
              assert(false);
              done();
              s2sMS.Chat.deleteRoom(
                accessToken,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                accessToken,
                groupData.uuid 
              ).then(d => {});
            }); // end update room info
        }); //end create room
      }); // end create group
  }); // end it

  it("Modify Room Metadata which had old metadata ", function (done) {
    if (!creds.isValid) return done();
 
      //console.log(identityData)
      s2sMS.Groups.createGroup(
        accessToken, 
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          accessToken, 
          identityData.uuid,
          "name",
          "topic",
          "desc",
          groupData.uuid,
          identityData.account_uuid, {
            foo: "foo"
          }
        ).then(roomData => {
          //console.log( 'ccccc', roomData)
          const newMeta = {};
          newMeta.foo = "bar";
          s2sMS.Chat.updateRoomMeta(
              accessToken,
              roomData.uuid,
              newMeta
            )
            .then(roomUpdate => {
              //console.log('uuuuuuuu', roomUpdate)
              assert(
                typeof roomUpdate.metadata === "object" &&
                roomUpdate.metadata.foo === newMeta.foo
              );
              done();
              s2sMS.Chat.deleteRoom(
                accessToken, 
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                accessToken, 
                groupData.uuid 
              ).then(d => {});
            })
            .catch(xError => {
              //console.log(xError);
              assert(false);
              done();
              s2sMS.Chat.deleteRoom(
                accessToken, 
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                accessToken, 
                groupData.uuid 
              ).then(d => {});
            }); // end update room info
        }); //end create room
      }); // end create group
  }); // end it

  let roomStuf;
  let idData;
  it("add Member To Room", function (done) {
    if (!creds.isValid) return done();
 
      //console.log(identityData)
      idData = identityData;
      s2sMS.Groups.createGroup(
        accessToken, 
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          accessToken, 
          identityData.uuid,
          "name",
          "topic",
          "desc",
          groupData.uuid,
          identityData.account_uuid, {
            foo: "foo"
          }
        ).then(roomData => {
          roomStuf = roomData;
          s2sMS.Chat.addMember(
              accessToken, 
              roomData.uuid, {
                uuid: identityData.uuid,
                type: "user"
              }
            )
            .then(memberData => {
              //console.log('aaadd member:', memberData)
              assert(memberData.uuid && memberData.type);
              done();
            })
            .catch(xError => {
              console.log("xxxxxaddMemberToRoom", xError);
              assert(false);
              done();
            }); // end update room info
        }); //end create room
      }); // end create group
 
  }); // end it
/* broken waiting on core api team to fix 
  it("get Room Members", function (done) {
    if (!creds.isValid || roomStuf === undefined ) return done();
    s2sMS.Chat.getRoomMembers(
        accessToken, 
        roomStuf.uuid
      )
      .then(memberData => {
        console.log('mmmmm', roomStuf, memberData)
        assert(memberData.length > 0);
        done();
      })
      .catch(xError => {
        console.log("xxxxxgetRoomMembers", xError);
        assert(false);
        done();
      }); // end update room info
  }); // end it
 */
  it("send Message", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.sendMessage(
        accessToken, 
        identityData.uuid,
        roomStuf.uuid,
        "test"
      )
      .then(sendResponse => {
        //console.log('send message data: ', sendResponse)
        assert(sendResponse.content.content === "test");
        done();
      })
      .catch(xError => {
        console.log("xxxxxsendMessage", xError);
        assert(false);
        done();
      }); // end update room info
  }); // end it

  it("get Messages", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getMessages(
        accessToken, 
        roomStuf.uuid
      )
      .then(messageData => {
        //console.log('message Data:', messageData)
        assert(messageData.items && messageData.items.length > 0);
        done();
      })
      .catch(xError => {
        console.log("xxxxxgetMessages", xError);
        assert(false);
        done();
      }); // end update room info
  }); // end it

  it("get room info (data, members, messages)", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getRoomInfo(
      accessToken,
      roomStuf.uuid
    ).then(roomInfo => {
      //console.log('RoomInfo', JSON.stringify(roomInfo));
      assert(roomInfo.info.uuid === roomStuf.uuid, "uuid is not valid ");
      assert(roomInfo.info.owner_uuid === identityData.uuid , "owner is valid");
      //TODO fix when api fixed assert(roomInfo.members.length === 1, "member length invalid"); 
      assert(roomInfo.messages.length === 1, "message length should be greater than 1");
      assert(roomInfo.messages[0].content.content === 'test', "first message should be test ");
 
      //TODO remove because needed for next test 
      s2sMS.Chat.deleteRoom(
        accessToken, 
        roomStuf.uuid
      );
      s2sMS.Groups.deleteGroup(
        accessToken, 
        roomStuf.group_uuid 
      );
      // end remove 
      done();
    }).catch(xError => {
      console.log('xxxxxgetRoomInfo', xError);
      done(xError);
    });


  });
 
  /*
  it("delete a  Member", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getRoomMembers(
        accessToken, 
        roomStuf.uuid
      )
      .then(memberData => {
        //console.log('mmmmm', memberData)
        s2sMS.Chat.deleteMember(
            accessToken, 
            roomStuf.uuid,
            memberData[0].uuid
          )
          .then(memberData => {
            s2sMS.Chat.getRoomMembers(
                accessToken, 
                roomStuf.uuid
              )
              .then(newMembers => {
                console.log('>>>>>', newMembers )
                assert(newMembers.items.length === 0);
                done();
                s2sMS.Chat.deleteRoom(
                  accessToken, 
                  roomStuf.uuid
                );
                s2sMS.Groups.deleteGroup(
                  accessToken, 
                  roomStuf.group_uuid 
                );
              })
              .catch(e => {
                console.log(e);
                assert(false);
                done();
                s2sMS.Chat.deleteRoom(
                  accessToken, 
                  roomStuf.uuid
                );
                s2sMS.Groups.deleteGroup(
                  accessToken, 
                  roomStuf.group_uuid
                );
              });
          })
          .catch(e1 => {
            console.log(e1);
            assert(false);
            done();
            s2sMS.Chat.deleteRoom(
              accessToken, 
              roomStuf.uuid
            );
            s2sMS.Groups.deleteGroup(
              accessToken, 
              roomStuf.group_uuid
            );
          });
      })
      .catch(xError => {
        console.log("xxxxx", xError);
        assert(false);
        done();
        s2sMS.Chat.deleteRoom(
          accessToken, 
          roomStuf.uuid
        ).then(x => {});
        s2sMS.Groups.deleteGroup(
          accessToken, 
          roomStuf.group_uuid
        ).then(d => {});
      }); // end update room info
  }); // end it
  */
});