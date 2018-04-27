// TODO update tov1 API when available...
var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

var test_roomUUID, test_roomOwner;

beforeEach(function () {
  s2sMS.setMsHost("https://cpaas.star2starglobal.net");
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("Chat", function () {
  it("List Rooms", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      // console.log("Got identity data", identityData);
      s2sMS.Chat.listRooms(
        creds.CPAAS_KEY,
        identityData.token
      ).then(responseData => {
        console.log("Got List Room response", responseData);
        // setup for getRoom test
        test_roomUUID =
          responseData.data.length > 0 ? responseData.data[0].uuid : undefined;
        test_roomOwner =
          responseData.data.length > 0 ?
          responseData.data[0].owner_uuid :
          undefined;
        // console.log("TTTTTTTT", test_roomUUID, test_roomOwner);
        console.log("number of rooms are: " + responseData.data.length);
        assert(responseData.data);
        done();
      });
    });
  });
  it("Get Room", function (done) {
    if (!creds.isValid && test_roomUUID !== undefined) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Chat.getRoom(
        creds.CPAAS_KEY,
        identityData.token,
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
  });

  it("Create Room / Delete", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      s2sMS.Groups.createGroup(
        creds.CPAAS_KEY,
        identityData.token,
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        // console.log('GroupData', groupData);
        s2sMS.Chat.createRoom(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          "name",
          "topic",
          "desc",
          groupData.uuid,
          identityData.account_uuid, {
            foo: "bar"
          }
        ).then(roomData => {
          // console.log('roomData >>>>', roomData)
          assert(
            roomData.name === "name" &&
            roomData.topic === "topic" &&
            roomData.status === "active" &&
            roomData.owner_uuid === identityData.user_uuid &&
            roomData.group_uuid === groupData.uuid &&
            roomData.account_uuid === identityData.account_uuid
          );
          done();
          s2sMS.Chat.deleteRoom(
            creds.CPAAS_KEY,
            identityData.token,
            roomData.uuid
          ).then(x => {});
          s2sMS.Groups.deleteGroup(
            creds.CPAAS_KEY,
            groupData.uuid,
            identityData.token,
          ).then(d => {});
        });
      }); // end create group
    }); // end getIdendity
  }); // end it

  it("Modify Room Info", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      s2sMS.Groups.createGroup(
        creds.CPAAS_KEY,
        identityData.token,
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          "name",
          "topic",
          "desc",
          groupData.uuid,
          identityData.account_uuid,
          undefined
        ).then(roomData => {
          //console.log('.....', roomData)
          const newInfo = {};
          newInfo.status = "inactive";
          newInfo.name = "james";
          newInfo.topic = "test2";
          newInfo.description = "updated description";
          s2sMS.Chat.updateRoomInfo(
              creds.CPAAS_KEY,
              identityData.user_uuid,
              identityData.token,
              roomData.uuid,
              newInfo
            )
            .then(roomUpdate => {
              assert(
                roomUpdate.name === newInfo.name &&
                roomUpdate.topic === newInfo.topic &&
                roomUpdate.status === newInfo.status &&
                roomUpdate.owner_uuid === identityData.user_uuid &&
                roomUpdate.group_uuid === groupData.uuid &&
                roomUpdate.account_uuid === identityData.account_uuid &&
                roomUpdate.description === newInfo.description
              );
              done();
              s2sMS.Chat.deleteRoom(
                creds.CPAAS_KEY,
                identityData.token,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                creds.CPAAS_KEY,
                groupData.uuid,
                identityData.token
              ).then(d => {});
            })
            .catch(() => {
              s2sMS.Chat.deleteRoom(
                creds.CPAAS_KEY,
                identityData.token,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                creds.CPAAS_KEY,
                groupData.uuid,
                identityData.token
              ).then(d => {});
            }); // end update room info
        }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it

  it("Modify Room Metadata ", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      s2sMS.Groups.createGroup(
        creds.CPAAS_KEY,
        identityData.token,
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
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
              creds.CPAAS_KEY,
              identityData.user_uuid,
              identityData.token,
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
                creds.CPAAS_KEY,
                identityData.token,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                creds.CPAAS_KEY,
                groupData.uuid,
                identityData.token
              ).then(d => {});
            })
            .catch(xError => {
              //console.log(xError);
              assert(false);
              done();
              s2sMS.Chat.deleteRoom(
                creds.CPAAS_KEY,
                identityData.token,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                creds.CPAAS_KEY,
                groupData.uuid,
                identityData.token
              ).then(d => {});
            }); // end update room info
        }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it

  it("Modify Room Metadata which had old metadata ", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      s2sMS.Groups.createGroup(
        creds.CPAAS_KEY,
        identityData.token,
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
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
              creds.CPAAS_KEY,
              identityData.user_uuid,
              identityData.token,
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
                creds.CPAAS_KEY,
                identityData.token,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                creds.CPAAS_KEY,
                groupData.uuid,
                identityData.token,
              ).then(d => {});
            })
            .catch(xError => {
              //console.log(xError);
              assert(false);
              done();
              s2sMS.Chat.deleteRoom(
                creds.CPAAS_KEY,
                identityData.token,
                roomData.uuid
              ).then(x => {});
              s2sMS.Groups.deleteGroup(
                creds.CPAAS_KEY,
                groupData.uuid,
                identityData.token
              ).then(d => {});
            }); // end update room info
        }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it

  let roomStuf;
  let idData;
  it("add Member To Room", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      idData = identityData;
      s2sMS.Groups.createGroup(
        creds.CPAAS_KEY,
        identityData.token,
        "foo",
        "desc",
        "footype", []
      ).then(groupData => {
        s2sMS.Chat.createRoom(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
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
              creds.CPAAS_KEY,
              identityData.user_uuid,
              identityData.token,
              roomData.uuid, {
                uuid: identityData.user_uuid,
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
    }); // end getIdendity
  }); // end it

  it("get Room Members", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getRoomMembers(
        creds.CPAAS_KEY,
        idData.user_uuid,
        idData.token,
        roomStuf.uuid
      )
      .then(memberData => {
        //console.log('mmmmm', memberData)
        assert(memberData.length > 0);
        done();
      })
      .catch(xError => {
        console.log("xxxxxgetRoomMembers", xError);
        assert(false);
        done();
      }); // end update room info
  }); // end it

  it("send Message", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.sendMessage(
        creds.CPAAS_KEY,
        idData.user_uuid,
        idData.token,
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
        creds.CPAAS_KEY,
        idData.token,
        roomStuf.uuid
      )
      .then(messageData => {
        //console.log('message Data:', messageData)
        assert(messageData.data && messageData.data.length > 0);
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
      creds.CPAAS_KEY,
      idData.token,
      roomStuf.uuid
    ).then(roomInfo => {
      // console.log('RoomInfo', JSON.stringify(roomInfo));
      assert(roomInfo.info.uuid === roomStuf.uuid &&
        roomInfo.info.owner_uuid === idData.user_uuid &&
        roomInfo.members.length === 1 &&
        roomInfo.messages.length === 1 &&
        roomInfo.messages[0].content.content === 'test'
      );
      done();
    }).catch(xError => {
      console.log('xxxxxgetRoomInfo', xError);
      done(xError);
    });


  });


  it("delete a  Member", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Chat.getRoomMembers(
        creds.CPAAS_KEY,
        idData.user_uuid,
        idData.token,
        roomStuf.uuid
      )
      .then(memberData => {
        //console.log('mmmmm', memberData)
        s2sMS.Chat.deleteMember(
            creds.CPAAS_KEY,
            idData.user_uuid,
            idData.token,
            roomStuf.uuid,
            memberData[0].uuid
          )
          .then(memberData => {
            s2sMS.Chat.getRoomMembers(
                creds.CPAAS_KEY,
                idData.user_uuid,
                idData.token,
                roomStuf.uuid
              )
              .then(newMembers => {
                assert(newMembers.length === 0);
                done();
                s2sMS.Chat.deleteRoom(
                  creds.CPAAS_KEY,
                  idData.token,
                  roomStuf.uuid
                );
                s2sMS.Groups.deleteGroup(
                  creds.CPAAS_KEY,
                  roomStuf.group_uuid,
                  idData.token
                );
              })
              .catch(e => {
                console.log(e);
                assert(false);
                done();
                s2sMS.Chat.deleteRoom(
                  creds.CPAAS_KEY,
                  idData.token,
                  roomStuf.uuid
                );
                s2sMS.Groups.deleteGroup(
                  creds.CPAAS_KEY,
                  idData.user_uuid,
                  idData.token,
                  roomStuf.group_uuid
                );
              });
          })
          .catch(e1 => {
            console.log(e1);
            assert(false);
            done();
            s2sMS.Chat.deleteRoom(
              creds.CPAAS_KEY,
              idData.token,
              roomStuf.uuid
            );
            s2sMS.Groups.deleteGroup(
              creds.CPAAS_KEY,
              idData.user_uuid,
              idData.token,
              roomStuf.group_uuid
            );
          });
      })
      .catch(xError => {
        console.log("xxxxx", xError);
        assert(false);
        done();
        s2sMS.Chat.deleteRoom(
          creds.CPAAS_KEY,
          idData.token,
          roomStuf.uuid
        ).then(x => {});
        s2sMS.Groups.deleteGroup(
          creds.CPAAS_KEY,
          idData.user_uuid,
          idData.token,
          roomStuf.group_uuid
        ).then(d => {});
      }); // end update room info
  }); // end it
});