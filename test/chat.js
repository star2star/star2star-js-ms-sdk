var assert = require('assert');
var s2sMS = require('../index');
var fs = require('fs');


var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: 'email@email.com',
  password: 'pwd',
  isValid: false
}

beforeEach(function(){
  process.env.NODE_ENV = 'dev';
  // file system uses full path so will do it like this
  if (fs.existsSync('./test/credentials.json')) {
    // do not need test folder here
    creds = require('./credentials.json');
  }
});

describe('Chat', function() {
  it('List Rooms', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      s2sMS.Chat.listRooms(creds.CPAAS_KEY, identityData.user_uuid, identityData.token).then((responseData)=>{
        //console.log(responseData)
        console.log('number of rooms are: '+responseData.data.length)
        assert(responseData.data  )
        done();
      })
    })
  });
  it('Create Room / Delete', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((groupData)=>{
          s2sMS.Chat.createRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
          "name", 'topic', 'desc', groupData.uuid, identityData.account_uuid, {'foo': 'bar'}).then((roomData)=>{
            //console.log('>>>>', roomData)
            assert(roomData.name === 'name' && roomData.topic === 'topic' &&  roomData.status === 'active' &&
                    roomData.owner_uuid === identityData.user_uuid && roomData.group_uuid === groupData.uuid &&
                    roomData.account_uuid === identityData.account_uuid );
            done();
            s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
            });
            s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
            });
          })
      }); // end create group
    }); // end getIdendity
  }); // end it

  it('Modify Room Info', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((groupData)=>{
          s2sMS.Chat.createRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
          "name", 'topic', 'desc', groupData.uuid, identityData.account_uuid, undefined).then((roomData)=>{
            //console.log('.....', roomData)
            const newInfo =  {};
            newInfo.status = 'inactive';
            newInfo.name = 'james';
            newInfo.topic = 'test2';
            newInfo.description = 'updated description';
            s2sMS.Chat.updateRoomInfo(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid, newInfo ).then((roomUpdate)=>{
              assert(roomUpdate.name === newInfo.name && roomUpdate.topic === newInfo.topic &&  roomUpdate.status === newInfo.status &&
                      roomUpdate.owner_uuid === identityData.user_uuid && roomUpdate.group_uuid === groupData.uuid &&
                      roomUpdate.account_uuid === identityData.account_uuid && roomUpdate.description === newInfo.description );
              done();
              s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
              });
              s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
              });
            }).catch(()=>{
              s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
              });
              s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
              });
            }); // end update room info

          }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it

  it('Modify Room Metadata ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((groupData)=>{
          s2sMS.Chat.createRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
          "name", 'topic', 'desc', groupData.uuid, identityData.account_uuid, undefined).then((roomData)=>{
            //console.log(roomData)
            const newMeta =  {};
            newMeta.foo = 'bar';
            s2sMS.Chat.updateRoomMeta(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid, newMeta ).then((roomUpdate)=>{
              //console.log('uuuuuuuu', roomUpdate)
              assert( typeof(roomUpdate.metadata) === 'object' && roomUpdate.metadata.foo === newMeta.foo );
              done();
              s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
              });
              s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
              });
            }).catch((xError)=>{
              //console.log(xError);
              assert(false);
              done();
              s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
              });
              s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
              });
            }); // end update room info

          }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it

  it('Modify Room Metadata which had old metadata ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((groupData)=>{
          s2sMS.Chat.createRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
          "name", 'topic', 'desc', groupData.uuid, identityData.account_uuid, {'foo':'foo'}).then((roomData)=>{
            //console.log( 'ccccc', roomData)
            const newMeta =  {};
            newMeta.foo = 'bar';
            s2sMS.Chat.updateRoomMeta(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid, newMeta ).then((roomUpdate)=>{
              //console.log('uuuuuuuu', roomUpdate)
              assert( typeof(roomUpdate.metadata) === 'object' && roomUpdate.metadata.foo === newMeta.foo );
              done();
              s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
              });
              s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
              });
            }).catch((xError)=>{
              //console.log(xError);
              assert(false);
              done();
              s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid).then((x)=>{
              });
              s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, groupData.uuid ).then((d)=>{
              });
            }); // end update room info

          }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it

  let roomStuf;
  let idData;
  it('add Member To Room', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      idData = identityData;
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((groupData)=>{
          s2sMS.Chat.createRoom(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
          "name", 'topic', 'desc', groupData.uuid, identityData.account_uuid, {'foo':'foo'}).then((roomData)=>{
            roomStuf = roomData;
            s2sMS.Chat.addMember(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, roomData.uuid, {"uuid": identityData.user_uuid, 'type': "user" }).then((memberData)=>{
              //console.log('aaadd member:', memberData)
              assert(  memberData.uuid && memberData.type );
              done();

            }).catch((xError)=>{
              console.log('xxxxx', xError);
              assert(false);
              done();
            }); // end update room info

          }); //end create room
      }); // end create group
    }); // end getIdendity
  }); // end it


  it('get Room Members', function(done) {
    if (!creds.isValid) return done();
      s2sMS.Chat.getRoomMembers(creds.CPAAS_KEY, idData.user_uuid, idData.token, roomStuf.uuid).then((memberData)=>{
        //console.log('mmmmm', memberData)
        assert(  memberData.length > 0 );
        done();
        s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, idData.user_uuid, idData.token, roomStuf.uuid).then((x)=>{
        });
        s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, idData.user_uuid, idData.token, roomStuf.group_uuid ).then((d)=>{
        });
      }).catch((xError)=>{
        console.log('xxxxx', xError);
        assert(false);
        done();
        s2sMS.Chat.deleteRoom(creds.CPAAS_KEY, idData.user_uuid, idData.token, roomStuf.uuid).then((x)=>{
        });
        s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, idData.user_uuid, idData.token, roomStuf.group_uuid ).then((d)=>{
        });
      }); // end update room info

  }); // end it

});
