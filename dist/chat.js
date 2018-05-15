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
 * @param access_token - access_token for cpaas systems
 * @param userUUID - user UUID to be used
 * @param name - String  Name
 * @param topic - topic string
 * @param description - description
 * @param groupUUID - group UUID for members ,
 * @param accountUUID - account uuid optional
 * @param metadata - object for meta data optional
 * @returns data
 **/
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

// list rooms
/**
 * This function will list rooms
 *
 * @param access token - access token for cpaas systems
 * @param filter - optional object
 * @returns data
 **/
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
// getRoom
/**
 * This function will get a specific room
 *
 * @param access_token - identity JWT
 * @param room UUID - optional object
 * @returns data
 **/
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
// deleteRoom
/**
 * This function will delete room
 *
 * @param access_token - access token for cpaas systems
 * @param roomUUID - room uuid
 * @returns no content
 **/
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

// updateRoom
/**
 * This function will update room info
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param info - object
 * @returns no content
 **/
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
 * This function will udpate room meta
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param meta - object
 * @returns no content
 **/
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
 * This function will udpate room meta
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @returns data
 **/
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
 * This function will udpate room meta
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @returns data
 **/
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
 * This function will delete a member from room
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param memberUUID - member to remove
 * @returns data
 **/
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
 * This function will get room messages
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param message_count - number of messages 
 * @returns data
 **/
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
 * This function will add a new message to a room
 *
 * @param access_token - access_token for cpaas systems
 * @param userUUID - user UUID to be used
 * @param roomUUID - room uuid
 * @param message - string message
 * @returns data
 **/
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
 * This function will get room info, messages, and members
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param message - string message
 * @returns data
 **/
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