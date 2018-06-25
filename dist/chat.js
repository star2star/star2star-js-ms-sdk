// TODO update tov1 API when available...
/*global require module*/
"use strict";

var util = require("./utilities");
var Groups = require("./groups");
var request = require("request-promise");

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
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var createRoom = function createRoom() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no name specified for group";
  var topic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no topic specified";
  var description = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var groupUUID = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  var accountUUID = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  var metadata = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

  var MS = util.getEndpoint("chat");

  var b = {
    name: name,
    topic: topic,
    description: description,
    account_uuid: accountUUID,
    group_uuid: groupUUID,
    owner_uuid: userUUID,
    metadata: metadata
  };
  //console.log('bbbbbbbb', b)
  var requestOptions = {
    method: "POST",
    uri: MS + "/rooms",
    body: b,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will list rooms.
 * @param {string} [access_token="null acess token"] - access token for cpaas systems
 * @param {object} [filter=undefined] - optional object
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var listRooms = function listRooms() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null acess token";
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  if (filter !== undefined) {
    requestOptions.qs = filter;
  }
  return request(requestOptions);
};

/**
 * @async
 * @description This function will get a specific room.
 * @param {string} [access_token="null access token"] - access token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room UUID
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var getRoom = function getRoom() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms/" + roomUUID,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will delete a room.
 * @param {string} [access_token="null acess token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @returns {Promise<empty>} - Promise with no payload
 */
var deleteRoom = function deleteRoom() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null acess token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/rooms/" + roomUUID,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will update room info
 * @param {string} [access_token="null access_token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [info={}] - object containing attributes to update
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var updateRoomInfo = function updateRoomInfo() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  var info = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "PUT",
    uri: MS + "/rooms/" + roomUUID + "/info",
    body: info,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will udpate room meta 
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {object} [meta={}] - metedata object
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var updateRoomMeta = function updateRoomMeta() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "PUT",
    uri: MS + "/rooms/" + roomUUID + "/meta",
    body: meta,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will return a list of room members.
 * @param {string} [access_token="null access_token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var getRoomMembers = function getRoomMembers() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms/" + roomUUID + "/members",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will add a member to a room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas system
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {object} memberData - object {"uuid": "string","type": "string"}
 * @returns {Promise<object>} - Promise resolving to a member data object 
 */
var addMember = function addMember() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  var memberData = arguments[2];

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "POST",
    uri: MS + "/rooms/" + roomUUID + "/members",
    body: memberData,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will delete a member from room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - member to remove
 * @param {string} [memberUUID="empty"] - member to remove
 * @returns {Promise<object>} - Promise resolving to a member data object
 */
var deleteMember = function deleteMember() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  var memberUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "empty";

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/rooms/" + roomUUID + "/members/" + memberUUID,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get room messages.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {number} [max=100] - number of messages 
 * @returns {Promise<object>} - Promise resolving to a data object containing a colelction of message objects.
 */
var getMessages = function getMessages() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms/" + roomUUID + "/messages",
    qs: {
      max: max
    },
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will post a message to a room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {string} [message="missing text"] - message
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var sendMessage = function sendMessage() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var roomUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no room uuid specified";
  var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "missing text";

  var MS = util.getEndpoint("chat");

  var b = {
    content: {
      contentType: "string",
      content: message
    },
    user_uuid: userUUID
  };

  var requestOptions = {
    method: "POST",
    uri: MS + "/rooms/" + roomUUID + "/messages",
    body: b,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get room info, messages, and members.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - string message
 * @param {number} [message_count=100]
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var getRoomInfo = function getRoomInfo() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var roomUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no room uuid specified";
  var message_count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

  return new Promise(function (resolve, reject) {
    var pInfo = getRoom(access_token, roomUUID);
    var pMessages = getMessages(access_token, roomUUID, message_count);

    Promise.all([pInfo, pMessages]).then(function (pData) {
      //console.log('--------', pData)
      // get group data
      Groups.getGroup(access_token, pData[0].group_uuid).then(function (groupData) {
        resolve({
          "info": pData[0],
          "members": groupData.members,
          "messages": pData[1].items
        });
      }).catch(function (groupError) {
        console.log('##### Group Error in getRoomInfo', groupError);
        reject(groupError);
      });
    }).catch(function (error) {
      console.log('##### Error getRoomInfo', error);
      reject(error);
    });
  });
};

module.exports = {
  createRoom: createRoom,
  deleteRoom: deleteRoom,
  listRooms: listRooms,
  getRoom: getRoom,
  updateRoomInfo: updateRoomInfo,
  updateRoomMeta: updateRoomMeta,
  getRoomMembers: getRoomMembers,
  addMember: addMember,
  deleteMember: deleteMember,
  getMessages: getMessages,
  sendMessage: sendMessage,
  getRoomInfo: getRoomInfo
};