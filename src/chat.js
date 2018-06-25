// TODO update tov1 API when available...
/*global require module*/
"use strict";
const util = require("./utilities");
const Groups = require("./groups");
const request = require("request-promise");

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
const createRoom = (
  access_token = "null access token",
  userUUID = "null user uuid",
  name = "no name specified for group",
  topic = "no topic specified",
  description = undefined,
  groupUUID = undefined,
  accountUUID = undefined,
  metadata = {}
) => {
  const MS = util.getEndpoint("chat");

  const b = {
    name: name,
    topic: topic,
    description: description,
    account_uuid: accountUUID,
    group_uuid: groupUUID,
    owner_uuid: userUUID,
    metadata: metadata
  };
  //console.log('bbbbbbbb', b)
  const requestOptions = {
    method: "POST",
    uri: `${MS}/rooms`,
    body: b,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const listRooms = (
  access_token = "null acess token",
  filter = undefined
) => {
  const MS = util.getEndpoint("chat");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/rooms`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const getRoom = (
  access_token = "null access token",
  roomUUID = "no room uuid specified",
) => {
  const MS = util.getEndpoint("chat");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/rooms/${roomUUID}`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const deleteRoom = (
  access_token = "null acess token",
  roomUUID = "no room uuid specified"
) => {
  const MS = util.getEndpoint("chat");

  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/rooms/${roomUUID}`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const updateRoomInfo = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified",
  info = {}
) => {
  const MS = util.getEndpoint("chat");

  const requestOptions = {
    method: "PUT",
    uri: `${MS}/rooms/${roomUUID}/info`,
    body: info,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const updateRoomMeta = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified",
  meta = {}
) => {
  const MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/rooms/${roomUUID}/meta`,
    body: meta,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const getRoomMembers = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified"
) => {
  const MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
    method: "GET",
    uri: `${MS}/rooms/${roomUUID}/members`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const addMember = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified",
  memberData
) => {
  const MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
    method: "POST",
    uri: `${MS}/rooms/${roomUUID}/members`,
    body: memberData,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const deleteMember = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified",
  memberUUID = "empty"
) => {
  const MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/rooms/${roomUUID}/members/${memberUUID}`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const getMessages = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified",
  max = 100
) => {
  const MS = util.getEndpoint("chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
    method: "GET",
    uri: `${MS}/rooms/${roomUUID}/messages`,
    qs: {
      max: max
    },
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const sendMessage = (
  access_token= "null access_token",
  userUUID = "null user uuid",
  roomUUID = "no room uuid specified",
  message = "missing text"
) => {
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
    uri: `${MS}/rooms/${roomUUID}/messages`,
    body: b,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      'x-api-version': `${util.getVersion()}`
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
const getRoomInfo = (
  access_token = "null access_token",
  roomUUID = "no room uuid specified",
  message_count = 100
) => {
  return new Promise((resolve, reject) => {
    const pInfo = getRoom(access_token, roomUUID);
    const pMessages = getMessages(access_token, roomUUID, message_count);

    Promise.all([pInfo, pMessages]).then((pData) => {
      //console.log('--------', pData)
      // get group data
      Groups.getGroup(access_token, pData[0].group_uuid)
        .then((groupData) => {
          resolve({
            "info": pData[0],
            "members": groupData.members,
            "messages": pData[1].items
          });
        }).catch((groupError) => {
          console.log('##### Group Error in getRoomInfo', groupError);
          reject(groupError);
        });
    }).catch((error) => {
      console.log('##### Error getRoomInfo', error);
      reject(error);
    });
  });
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