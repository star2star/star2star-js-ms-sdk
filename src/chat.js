// TODO update tov1 API when available...
/*global require module*/
"use strict";
const util = require("./utilities");
const Groups = require("./groups");
const request = require("./requestPromise");

/**
 * @async
 * @description This function will create a new channel.
 * @param {string} [access_token="null access token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [name="no name specified for group"] - name
 * @param {string} [topic="no topic specified"] - topic
 * @param {string} [description=undefined] - description
 * @param {string} [groupUUID=undefined] - group UUID for members
 * @param {string} [accountUUID=undefined] - account uuid
 * @param {object} [metadata={}] - object for meta data
 * @param {string} [type=undefined] - type
 * @param {string} [parentUUID=undefined] - parent uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const createChannel = async (
  access_token = "null access token",
  userUUID = "null user uuid",
  name = "no name specified for group",
  topic = "no topic specified",
  description = undefined,
  groupUUID = undefined,
  accountUUID = undefined,
  metadata = {},
  type= undefined,
  parentUUID = undefined,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("chat");

    const b = {
       name,
       topic,
       description,
      account_uuid: accountUUID,
      group_uuid: groupUUID,
      owner_uuid: userUUID,
      metadata,
      type,
      parent_uuid: parentUUID
    };
    //console.log('bbbbbbbb', b)
    const requestOptions = {
      method: "POST",
      uri: `${MS}/channels`,
      body: b,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will list Channels.
 * @param {string} [access_token="null acess token"] - access token for cpaas systems
 * @param {object} [filter=undefined] - optional object,
  * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const listChannels = async (
  access_token = "null acess token",
  filter = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/channels`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    if (filter !== undefined) {
      requestOptions.qs = filter;
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get a specific Channel.
 * @param {string} [access_token="null access token"] - access token for cpaas systems
 * @param {string} [channelUUID="no Channel uuid specified"] - Channel UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const getChannel = async (
  access_token = "null access token",
  channelUUID = "no Channel uuid specified",
  trace ={}
) => {
  try {
    const MS = util.getEndpoint("chat");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/channels/${channelUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will delete a channel.
 * @param {string} [access_token="null acess token"]
 * @param {string} [channelUUID="no channel uuid specified"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise with no payload
 */
const deleteChannel = async (
  access_token = "null acess token",
  channelUUID = "no channel uuid specified",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/channels/${channelUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response  = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will update channel info
 * @param {string} [access_token="null access_token"]
 * @param {string} [channelUUID="no channel uuid specified"]
 * @param {object} [info={}] - object containing attributes to update
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const updateChannelInfo = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  info = {},
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    const requestOptions = {
      method: "PUT",
      uri: `${MS}/channels/${channelUUID}/info`,
      body: info,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will udpate channel meta
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [channelUUID="no channel uuid specified"] - channel uuid
 * @param {object} [meta={}] - metedata object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const updateChannelMeta = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  meta = {},
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    //console.log('mmmmmmm', meta)
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/channels/${channelUUID}/meta`,
      body: meta,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will return a list of channel members.
 * @param {string} [access_token="null access_token"]
 * @param {string} [channelUUID="no channel uuid specified"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const getChannelMembers = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    //console.log('mmmmmmm', meta)
    const requestOptions = {
      method: "GET",
      uri: `${MS}/channels/${channelUUID}/members`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will add a member to a channel.
 * @param {string} [access_token="null access_token"] - access_token for cpaas system
 * @param {string} [channelUUID="no channel uuid specified"] - channel uuid
 * @param {object} memberData - object {"uuid": "string","type": "string"}
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a member data object
 */
const addMember = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  memberData,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    //console.log('mmmmmmm', meta)
    const requestOptions = {
      method: "POST",
      uri: `${MS}/channels/${channelUUID}/members`,
      body: memberData,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will delete a member from channel.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [channelUUID="no channel uuid specified"] - member to remove
 * @param {string} [memberUUID="empty"] - member to remove
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a member data object
 */
const deleteMember = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  memberUUID = "empty",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    //console.log('mmmmmmm', meta)
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/channels/${channelUUID}/members/${memberUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }  
};

/**
 * @async
 * @description This function will get channel messages.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [channelUUID="no channel uuid specified"] - channel uuid
 * @param {number} [max=100] - number of messages
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a colelction of message objects.
 */
const getMessages = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  max = 100,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    //console.log('mmmmmmm', meta)
    const requestOptions = {
      method: "GET",
      uri: `${MS}/channels/${channelUUID}/messages`,
      qs: {
        max: max
      },
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will post a message to a channel.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [channelUUID="no channel uuid specified"] - channel uuid
 * @param {string} [message="missing text"] - message
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */

const sendMessage = async (
  access_token = "null access_token",
  userUUID = "null user uuid",
  channelUUID = "no channel uuid specified",
  message = "missing text",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("chat");

    const b = {
      content: {
        contentType: "string",
        content: message
      },
      user_uuid: userUUID
    };

    const requestOptions = {
      method: "POST",
      uri: `${MS}/channels/${channelUUID}/messages`,
      body: b,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get channel info, messages, and members.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [channelUUID="no channel uuid specified"] - string message
 * @param {number} [message_count=100]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const getChannelInfo = async (
  access_token = "null access_token",
  channelUUID = "no channel uuid specified",
  message_count = 100,
  trace = {}
) => {
  try {
    const newMeta = util.generateNewMetaData;
    const pInfo = getChannel(access_token, channelUUID, trace);
    let nextMeta = newMeta(trace);
    const pMessages = getMessages(access_token, channelUUID, message_count, nextMeta);
    const pData = await Promise.all([pInfo, pMessages]);
    nextMeta = newMeta(trace);
    const groupData = await Groups.getGroup(access_token, pData[0].group_uuid, nextMeta);
      

    return {
      info: pData[0],
      members: groupData.members,
      messages: pData[1].items
    };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will send a message to a chat channel
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [channelUUID="null channelUUID"] - channel uuid
 * @param {string|array} [content=undefined] - message content, string or array
 * @param {object} [trace={}] - optional CPaaS request lifecycle headers
 * @returns {Promise<object>} - promise resolving to a message confirmation object
 */
const sendMessageToChannel = async (
  accessToken = "null accessToken",
  channelUUID = "null channelUUID",
  content = undefined,
  trace = {}
) => {

  try {
    const MS = util.getEndpoint("chat");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/channels/${channelUUID}/messages`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      "body": {}, 
          
      "json": true
    };
    if(typeof content === "string"){
      requestOptions.body.content = {
        "contentType": "plain/text",
        "content": content
      };
    } else if(Array.isArray(content)){
      requestOptions.body.content = {
        "contentType": "multipart",
        "parts": content
      };
    } else {
      throw {"code": 400, "message": `content must be string or array. received ${typeof content}` };
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will send a message to a chat channel
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {string} [offset=0] - pagination offset
 * @param {string} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional CPaaS request lifecycle headers
 * @returns {Promise<object>} - promise resolving to a list of channel objects
 */
const listUsersChannels = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID", // who knows why we are using a header for this
  accountUUID = "null accountUUID", // this should be temporary
  offset = 0,
  limit = 10,
  trace = {}
) => {

  try {
    const MS = util.getEndpoint("chat");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/channels`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "x-user-uuid": userUUID
      },
      "qs": {
        "account_uuid": accountUUID,
        "offset": offset,
        "limit": limit
      }, 
          
      json: true
    };  
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  createChannel,
  deleteChannel,
  listChannels,
  getChannel,
  updateChannelInfo,
  updateChannelMeta,
  getChannelMembers,
  addMember,
  deleteMember,
  getMessages,
  sendMessage,
  getChannelInfo,
  sendMessageToChannel,
  listUsersChannels
};
