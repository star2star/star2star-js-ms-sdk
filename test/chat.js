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
const logger = require("../src/node-logger").getInstance();
const objectMerge = require("object-merge");
let trace = Util.generateNewMetaData();

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

  let test_channel, test_groupUUID;

  before(async () => {
    try {

      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
    
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
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
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(1 === 1, response);
  //   return response;
  // },"change me"));

  it("Create Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
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

    trace = Util.generateNewMetaData(trace);
    let groupData;
    try{
      groupData = await s2sMS.Groups.createGroup(accessToken, body, trace);
    } catch(error){
      console.log("!!!!!!!!!!!",error);
    }
    //test_groupUUID and test_channel saved for other tests
    test_groupUUID = groupData.uuid;
    test_channel = await s2sMS.Chat.createChannel(
      accessToken,
      identityData.uuid,
      "name",
      "topic",
      "desc",
      test_groupUUID,
      identityData.account_uuid,
      { foo: "bar" } // metadata
    );
    // console.log('>>>>>>>', test_channel);
    
    assert.ok(
      test_channel.name === "name" &&
      test_channel.topic === "topic" &&
      test_channel.status === "active" &&
      test_channel.owner_uuid === identityData.uuid &&
      test_channel.group_uuid === groupData.uuid &&
      test_channel.account_uuid === identityData.account_uuid,
      JSON.stringify(test_channel, null, "\t")

    );
    return test_channel;
  },"Create Channel"));

  it("List Channels", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const responseData = await s2sMS.Chat.listChannels(accessToken, trace);
    assert.ok(
      responseData.items &&
      responseData.items.length >= 0,
      JSON.stringify(responseData, null, "\t")
    );
    return responseData;
  },"List Channels"));

  it("Get Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const channelData = await s2sMS.Chat.getChannel(
      accessToken,
      test_channel.uuid,
      100, //message count
      trace
    );
    assert.ok(
      channelData.uuid === test_channel.uuid &&
      channelData.owner_uuid === test_channel.owner_uuid,
      JSON.stringify(channelData, null, "\t")
    );
    return channelData;
  },"Get Channel"));
  it("Modify Channel Info", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    const newInfo = objectMerge({}, test_channel);
    newInfo.name = "james";
    newInfo.topic = "test2";
    newInfo.description = "updated description";
    trace = Util.generateNewMetaData(trace);
    const channelUpdate = await s2sMS.Chat.updateChannelInfo(
      accessToken,
      test_channel.uuid,
      newInfo,
      trace
    );
    assert.ok(
      channelUpdate.name === newInfo.name &&
      channelUpdate.topic === newInfo.topic &&
      channelUpdate.status === newInfo.status &&
      channelUpdate.owner_uuid === identityData.uuid &&
      channelUpdate.group_uuid === test_groupUUID &&
      channelUpdate.account_uuid === identityData.account_uuid &&
      channelUpdate.description === newInfo.description, 
      JSON.stringify(channelUpdate, null, "\t")
    );
    return channelUpdate;
  },"Modify Channel Info"));
  
  it("Modify Channel Metadata", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    const newMeta = {};
    newMeta.foo = "bar";
    trace = Util.generateNewMetaData(trace);
    const channelUpdate = await s2sMS.Chat.updateChannelMeta(
      accessToken,
      test_channel.uuid,
      newMeta,
      trace
    );
    assert.ok(
      typeof channelUpdate.metadata === "object" &&
      channelUpdate.metadata.foo === newMeta.foo,
      JSON.stringify(channelUpdate, null, "\t")
    );
    return channelUpdate;
  },"Modify Channel Metadata"));
  
  it("Modify Channel Metadata which had old metadata", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    const newMeta = {};
    newMeta.foo = "baz";
    trace = Util.generateNewMetaData(trace);
    const channelUpdate = await s2sMS.Chat.updateChannelMeta(
      accessToken,
      test_channel.uuid,
      newMeta,
      trace
    );
    assert.ok(
      typeof channelUpdate.metadata === "object" &&
      channelUpdate.metadata.foo === newMeta.foo,
      JSON.stringify(channelUpdate, null, "\t")
    );
    return channelUpdate;
  },"Modify Channel Metadata which had old metadata"));
  
  it("Delete A Member", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const memberData = await s2sMS.Chat.deleteMember(
      accessToken,
      test_channel.uuid,
      identityData.uuid,
      trace
    );
    assert.ok(
      memberData.uuid === identityData.uuid,
      JSON.stringify(memberData, null, "\t")
    );
    return memberData;
  },"Delete A Member"));

  it("Add Member To Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const memberData = await s2sMS.Chat.addMember(
      accessToken,
      test_channel.uuid,
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
  },"Add Member To Channel"));

  it("Get Channel Members", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const memberData = await s2sMS.Chat.getChannelMembers(
      accessToken,
      test_channel.uuid,
      100, // message count
      trace
    );
    assert.ok(
      memberData.items.length > 0,
      JSON.stringify(memberData, null, "\t")
    );
    return memberData;
  },"Get Channel Members"));

  it("Send Message", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const sendResponse = await s2sMS.Chat.sendMessage(
      accessToken,
      identityData.uuid,
      test_channel.uuid,
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
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const messageData = await s2sMS.Chat.getMessages(
      accessToken,
      test_channel.uuid,
      100, //message count
      trace
    );
    assert.ok(
      messageData.items && messageData.items.length > 0,
      JSON.stringify(messageData, null, "\t")
    );
    return messageData;
  },"Get Messages"));
  
  it("Get Channel Info (data, members, messages)", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const channelInfo = await s2sMS.Chat.getChannelInfo(
      accessToken,
      test_channel.uuid,
      100, //message count
      trace
    );
    assert.ok(
      channelInfo.info.uuid === test_channel.uuid,
      channelInfo.info.owner_uuid === identityData.uuid,
      JSON.stringify(channelInfo, null, "\t")
    );
    return channelInfo;
  },"Get Channel Info (data, members, messages)"));

  it("Send Simple Message to Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Chat.sendMessageToChannel(
      accessToken,
      test_channel.uuid,
      "a simple unit test message",
      trace
    );
    assert.ok(
      response.channel_uuid === test_channel.uuid,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Simple Message to Channel"));

  it("Send Multipart Message to Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Chat.sendMessageToChannel(
      accessToken,
      test_channel.uuid,
      [
        {
          "contentType": "s2s-kvp",
          "content":"[{\"label\": \"New label\", \"value\": \"New value\"},{\"label\": \"New label Second\", \"value\": \"New cool value\"}]"
        },
        {
          "contentType":"text/csv",
          "content": "\"Month\", \"1958\", \"1959\", \"1960\"\n\"JAN\",  340,  360,  417\n\"FEB\",  318,  342,  391\n\"MAR\",  362,  406,  419\n\"APR\",  348,  396,  461\n\"MAY\",  363,  420,  472\n\"JUN\",  435,  472,  535\n\"JUL\",  491,  548,  622\n\"AUG\",  505,  559,  606\n\"SEP\",  404,  463,  508\n\"OCT\",  359,  407,  461\n\"NOV\",  310,  362,  390\n\"DEC\",  337,  405,  432"
        }
      ],
      trace
    );
    assert.ok(
      response.channel_uuid === test_channel.uuid,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Multipart Message to Channel"));

  it("Send Invalid Message to Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    try{
      trace = Util.generateNewMetaData(trace);
      const response = await s2sMS.Chat.sendMessageToChannel(
        accessToken,
        process.env.TEST_CHAT_CHANNEL,
        {}, //object is invalid
        trace
      );
      //should not get here
      assert.ok(
        1 !== 1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch (error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
      return error;
    }
  },"Send Invalid Message to Channel"));

  it("List User's Channles", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Chat.listUsersChannels(
      accessToken,
      identityData.uuid,
      identityData.account_uuid,
      0,
      1,
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      Array.isArray(response.items) &&
      response.items[0].hasOwnProperty("uuid") &&
      response.items.length === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List User's Channels"));

  it("Delete Channel", mochaAsync(async () => {
    // if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = Util.generateNewMetaData(trace);
    const groupResponse = await s2sMS.Groups.deleteGroup(accessToken, test_groupUUID, trace);
    assert.ok(
      groupResponse.status === "ok",
      JSON.stringify(groupResponse, null, "\t")
    );
    trace = Util.generateNewMetaData(trace);
    const channelResponse = await s2sMS.Chat.deleteChannel(accessToken, test_channel.uuid, trace);
    assert.ok(
      1 === 1,
      JSON.stringify(channelResponse, null, "\t")
    );
    return {"groupResponse": groupResponse, "channelResponse": channelResponse};
  },"Delete Channel"));
});
