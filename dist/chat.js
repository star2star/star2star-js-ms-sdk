// TODO update tov1 API when available...

/*global require module*/
"use strict";

const util = require("./utilities");

const Groups = require("./groups");

const request = require("request-promise");

const objectMerge = require("object-merge");
/**
 * @async
 * @description This function will create a new room.
 * @param {string} [access_token="null access token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [name="no name specified for group"] - name
 * @param {string} [topic="no topic specified"] - topic
 * @param {string} [description=undefined] - description
 * @param {string} [groupUUID=undefined] - group UUID for members
 * @param {string} [accountUUID=undefined] - account uuid
 * @param {object} [metadata={}] - object for meta data
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const createRoom = async function createRoom() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no name specified for group";
  let topic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no topic specified";
  let description = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let groupUUID = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  let accountUUID = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  let metadata = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
  let trace = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

  try {
    const MS = util.getEndpoint("chat");
    const b = {
      name: name,
      topic: topic,
      description: description,
      account_uuid: accountUUID,
      group_uuid: groupUUID,
      owner_uuid: userUUID,
      metadata: metadata
    }; //console.log('bbbbbbbb', b)

    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/rooms"),
      body: b,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will list rooms.
 * @param {string} [access_token="null acess token"] - access token for cpaas systems
 * @param {object} [filter=undefined] - optional object,
  * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const listRooms = async function listRooms() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null acess token";
  let filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("chat");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/rooms"),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };

    if (filter !== undefined) {
      requestOptions.qs = filter;
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will get a specific room.
 * @param {string} [access_token="null access token"] - access token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const getRoom = async function getRoom() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("chat");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/rooms/").concat(roomUUID),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will delete a room.
 * @param {string} [access_token="null acess token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise with no payload
 */


const deleteRoom = async function deleteRoom() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null acess token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("chat");
    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/rooms/").concat(roomUUID),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will update room info
 * @param {string} [access_token="null access_token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [info={}] - object containing attributes to update
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const updateRoomInfo = async function updateRoomInfo() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let info = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("chat");
    const requestOptions = {
      method: "PUT",
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/info"),
      body: info,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will udpate room meta
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {object} [meta={}] - metedata object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const updateRoomMeta = async function updateRoomMeta() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

    const requestOptions = {
      method: "PUT",
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/meta"),
      body: meta,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will return a list of room members.
 * @param {string} [access_token="null access_token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const getRoomMembers = async function getRoomMembers() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/members"),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will add a member to a room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas system
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {object} memberData - object {"uuid": "string","type": "string"}
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a member data object
 */


const addMember = async function addMember() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let memberData = arguments.length > 2 ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/members"),
      body: memberData,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will delete a member from room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - member to remove
 * @param {string} [memberUUID="empty"] - member to remove
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a member data object
 */


const deleteMember = async function deleteMember() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let memberUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "empty";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/members/").concat(memberUUID),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will get room messages.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {number} [max=100] - number of messages
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a colelction of message objects.
 */


const getMessages = async function getMessages() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/messages"),
      qs: {
        max: max
      },
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will post a message to a room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {string} [message="missing text"] - message
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const sendMessage = async function sendMessage() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let roomUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no room uuid specified";
  let message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "missing text";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

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
      uri: "".concat(MS, "/rooms/").concat(roomUUID, "/messages"),
      body: b,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(access_token),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will get room info, messages, and members.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - string message
 * @param {number} [message_count=100]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const getRoomInfo = async function getRoomInfo() {
  let access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  let message_count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const newMeta = util.generateNewMetaData;
    const pInfo = getRoom(access_token, roomUUID, trace);
    let nextMeta = objectMerge({}, trace, newMeta(trace));
    const pMessages = getMessages(access_token, roomUUID, message_count, nextMeta);
    const pData = await Promise.all([pInfo, pMessages]);
    nextMeta = objectMerge({}, trace, newMeta(trace));
    const groupData = await Groups.getGroup(access_token, pData[0].group_uuid, nextMeta);
    return {
      info: pData[0],
      members: groupData.members,
      messages: pData[1].items
    };
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};

module.exports = {
  createRoom,
  deleteRoom,
  listRooms,
  getRoom,
  updateRoomInfo,
  updateRoomMeta,
  getRoomMembers,
  addMember,
  deleteMember,
  getMessages,
  sendMessage,
  getRoomInfo
};