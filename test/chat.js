//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = Util.getLogger();
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();

describe("Chat MS Test Suite", function() {
  let accessToken;
  let identityData;

  //utility function to simplify test code
  const mochaAsync = (func, name) => {
    return async () => {
      try {
        const response = await func(name);
        logger.debug(name, response);
        return response; 
      } catch (error) {
        //mocha will log out the error
        return Promise.reject(error);
      }
    };
  };

  let creds = {
    CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
    CPAAS_API_VERSION: "v1",
    email: "email@email.com",
    password: "pwd",
    isValid: false
  };

  let test_room, test_groupUUID;

  before(async () => {
    try {
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
        // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost(creds.MS_HOST);
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(creds.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      const oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error){
      return Promise.reject(error);
    }
  });

  // Template for New Test............
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(1 === 1, response);
  //   return response;
  // },"change me"));

  it("Create Room", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
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

    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const groupData = await s2sMS.Groups.createGroup(accessToken, body, trace);
    //test_groupUUID and test_room saved for other tests
    test_groupUUID = groupData.uuid;
    test_room = await s2sMS.Chat.createRoom(
      accessToken,
      identityData.uuid,
      "name",
      "topic",
      "desc",
      test_groupUUID,
      identityData.account_uuid,
      { foo: "bar" } // metadata
    );
    
    assert.ok(
      test_room.name === "name" &&
      test_room.topic === "topic" &&
      test_room.status === "active" &&
      test_room.owner_uuid === identityData.uuid &&
      test_room.group_uuid === groupData.uuid &&
      test_room.account_uuid === identityData.account_uuid,
      JSON.stringify(test_room, null, "\t")

    );
    return test_room;
  },"Create Room"));

  it("List Rooms", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const responseData = await s2sMS.Chat.listRooms(accessToken, trace);
    assert.ok(
      responseData.items &&
      responseData.items.length >= 0,
      JSON.stringify(responseData, null, "\t")
    );
    return responseData;
  },"List Rooms"));

  it("Get Room", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const roomData = await s2sMS.Chat.getRoom(
      accessToken,
      test_room.uuid,
      100, //message count
      trace
    );
    assert.ok(
      roomData.uuid === test_room.uuid &&
      roomData.owner_uuid === test_room.owner_uuid,
      JSON.stringify(roomData, null, "\t")
    );
    return roomData;
  },"Get Room"));

  it("Modify Room Info", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const newInfo = objectMerge({}, test_room);
    newInfo.name = "james";
    newInfo.topic = "test2";
    newInfo.description = "updated description";
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const roomUpdate = await s2sMS.Chat.updateRoomInfo(
      accessToken,
      test_room.uuid,
      newInfo,
      trace
    );
    assert.ok(
      roomUpdate.name === newInfo.name &&
      roomUpdate.topic === newInfo.topic &&
      roomUpdate.status === newInfo.status &&
      roomUpdate.owner_uuid === identityData.uuid &&
      roomUpdate.group_uuid === test_groupUUID &&
      roomUpdate.account_uuid === identityData.account_uuid &&
      roomUpdate.description === newInfo.description, 
      JSON.stringify(roomUpdate, null, "\t")
    );
    return roomUpdate;
  },"Modify Room Info"));
  
  it("Modify Room Metadata", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const newMeta = {};
    newMeta.foo = "bar";
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const roomUpdate = await s2sMS.Chat.updateRoomMeta(
      accessToken,
      test_room.uuid,
      newMeta,
      trace
    );
    assert.ok(
      typeof roomUpdate.metadata === "object" &&
      roomUpdate.metadata.foo === newMeta.foo,
      JSON.stringify(roomUpdate, null, "\t")
    );
    return roomUpdate;
  },"Modify Room Metadata"));
  
  it("Modify Room Metadata which had old metadata", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    const newMeta = {};
    newMeta.foo = "baz";
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const roomUpdate = await s2sMS.Chat.updateRoomMeta(
      accessToken,
      test_room.uuid,
      newMeta,
      trace
    );
    assert.ok(
      typeof roomUpdate.metadata === "object" &&
      roomUpdate.metadata.foo === newMeta.foo,
      JSON.stringify(roomUpdate, null, "\t")
    );
    return roomUpdate;
  },"Modify Room Metadata which had old metadata"));
  
  it("Delete A Member", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const memberData = await s2sMS.Chat.deleteMember(
      accessToken,
      test_room.uuid,
      identityData.uuid,
      trace
    );
    assert.ok(
      memberData.uuid === identityData.uuid,
      JSON.stringify(memberData, null, "\t")
    );
    return memberData;
  },"Delete A Member"));

  it("Add Member To Room", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const memberData = await s2sMS.Chat.addMember(
      accessToken,
      test_room.uuid,
      {
        uuid: identityData.uuid,
        type: "user"
      },
      trace
    );
    assert.ok(
      memberData.uuid && memberData.type,
      JSON.stringify(memberData, null, "\t")
    );
    return memberData;
  },"Add Member To Room"));

  it("Get Room Members", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const memberData = await s2sMS.Chat.getRoomMembers(
      accessToken,
      test_room.uuid,
      100, // message count
      trace
    );
    assert.ok(
      memberData.items.length > 0,
      JSON.stringify(memberData, null, "\t")
    );
    return memberData;
  },"Get Room Members"));

  it("Send Message", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const sendResponse = await s2sMS.Chat.sendMessage(
      accessToken,
      identityData.uuid,
      test_room.uuid,
      "test",
      trace
    );
    assert.ok(
      sendResponse.content.content === "test",
      JSON.stringify(sendResponse, null, "\t")
    );
    return sendResponse;
  },"Send Message"));
  
  it("Get Messages", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const messageData = await s2sMS.Chat.getMessages(
      accessToken,
      test_room.uuid,
      100, //message count
      trace
    );
    assert.ok(
      messageData.items && messageData.items.length > 0,
      JSON.stringify(messageData, null, "\t")
    );
    return messageData;
  },"Get Messages"));
  
  it("Get Room Info (data, members, messages)", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const roomInfo = await s2sMS.Chat.getRoomInfo(
      accessToken,
      test_room.uuid,
      100, //message count
      trace
    );
    assert.ok(
      roomInfo.info.uuid === test_room.uuid,
      roomInfo.info.owner_uuid === identityData.uuid,
      JSON.stringify(roomInfo, null, "\t")
    );
    return roomInfo;
  },"Get Room Info (data, members, messages)"));
  
  it("Delete Room", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const groupResponse = await s2sMS.Groups.deleteGroup(accessToken, test_groupUUID, trace);
    assert.ok(
      groupResponse.status === "ok",
      JSON.stringify(groupResponse, null, "\t")
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const roomResponse = await s2sMS.Chat.deleteRoom(accessToken, test_room.uuid, trace);
    assert.ok(
      typeof roomResponse === "object",
      JSON.stringify(roomResponse, null, "\t")
    );
    return {"groupResponse": groupResponse, "roomResponse": roomResponse};
  },"Delete Room"));
});
