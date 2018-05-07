// TODO update tov1 API when available...
/*global require module*/
"use strict";

var util = require("./utilities");
var Groups = require("./groups");
var request = require("request-promise");

//create room
/**
 * This function will create a new room
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param name - String  Name
 * @param topic - topic string
 * @param description - description
 * @param groupUUID - group UUID for members ,
 * @param accountUUID - account uuid optional
 * @param metadata - object for meta data optional
 * @returns data
 **/
var createRoom = function createRoom() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no name specified for group";
  var topic = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "no topic specified";
  var description = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  var groupUUID = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  var accountUUID = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : undefined;
  var metadata = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

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
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };
  return request(requestOptions);
};

// list rooms
/**
 * This function will list rooms
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param filter - optional object
 * @returns data
 **/
var listRooms = function listRooms() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms",
    headers: {
      // "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };
  if (filter !== undefined) {
    requestOptions.qs = filter;
  }
  return request(requestOptions);
};
// getRoom
/**
 * This function will get a specific room
 *
 * @param apiKey - api key for cpaas systems
 * @param identityJWT - identity JWT
 * @param filter - optional object
 * @returns data
 **/
var getRoom = function getRoom() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var roomUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no room uuid specified";

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms/" + roomUUID,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};
// deleteRoom
/**
 * This function will delete room
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @returns no content
 **/
var deleteRoom = function deleteRoom() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var roomUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no room uuid specified";

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/rooms/" + roomUUID,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

// updateRoom
/**
 * This function will update room info
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @param info - object
 * @returns no content
 **/
var updateRoomInfo = function updateRoomInfo() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var roomUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no room uuid specified";
  var info = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = util.getEndpoint("chat");

  var requestOptions = {
    method: "PUT",
    uri: MS + "/rooms/" + roomUUID + "/info",
    body: info,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will udpate room meta
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @param meta - object
 * @returns no content
 **/
var updateRoomMeta = function updateRoomMeta() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var roomUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no room uuid specified";
  var meta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "PUT",
    uri: MS + "/rooms/" + roomUUID + "/meta",
    body: meta,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will udpate room meta
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @returns data
 **/
var getRoomMembers = function getRoomMembers() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var roomUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no room uuid specified";

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms/" + roomUUID + "/members",
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will udpate room meta
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @returns data
 **/
var addMember = function addMember() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var roomUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no room uuid specified";
  var memberData = arguments[4];

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "POST",
    uri: MS + "/rooms/" + roomUUID + "/members",
    body: memberData,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};
/**
 * This function will delete a member from room
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @param memberUUID - member to remove
 * @returns data
 **/
var deleteMember = function deleteMember() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var roomUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no room uuid specified";
  var memberUUID = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "empty";

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/rooms/" + roomUUID + "/members/" + memberUUID,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will get room messages
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @returns data
 **/
var getMessages = function getMessages() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var roomUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no room uuid specified";
  var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;

  var MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "GET",
    uri: MS + "/rooms/" + roomUUID + "/messages",
    qs: {
      max: max
    },
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will add a new message to a room
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @param message - string message
 * @returns data
 **/
var sendMessage = function sendMessage() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var roomUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no room uuid specified";
  var message = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "missing text";

  var MS = util.getEndpoint("chat");

  var b = {
    content: {
      contentType: "string",
      content: message
    },
    user_uuid: userUUID
  };

  //console.log('mmmmmmm', meta)
  var requestOptions = {
    method: "POST",
    uri: MS + "/rooms/" + roomUUID + "/messages",
    body: b,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json",
      Authorization: "Bearer " + identityJWT
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will get room info, messages, and members
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param roomUUID - room uuid
 * @param message - string message
 * @returns data
 **/
var getRoomInfo = function getRoomInfo() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var roomUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no room uuid specified";
  var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

  return new Promise(function (resolve, reject) {
    var pInfo = getRoom(apiKey, identityJWT, roomUUID);
    var pMessages = getMessages(apiKey, identityJWT, roomUUID, max);

    Promise.all([pInfo, pMessages]).then(function (pData) {
      // get group data
      Groups.getGroup(apiKey, pData[0].group_uuid, identityJWT).then(function (groupData) {
        resolve({
          "info": pData[0],
          "members": groupData.members,
          "messages": pData[1].data
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