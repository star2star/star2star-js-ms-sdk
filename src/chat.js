// TODO update tov1 API when available...
/*global require module*/
"use strict";
const util = require("./utilities");
const Groups = require("./groups");
const request = require("request-promise");

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

// list rooms
/**
 * This function will list rooms
 *
 * @param access token - access token for cpaas systems
 * @param filter - optional object
 * @returns data
 **/
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
// getRoom
/**
 * This function will get a specific room
 *
 * @param access_token - identity JWT
 * @param room UUID - optional object
 * @returns data
 **/
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
// deleteRoom
/**
 * This function will delete room
 *
 * @param access_token - access token for cpaas systems
 * @param roomUUID - room uuid
 * @returns no content
 **/
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

// updateRoom
/**
 * This function will update room info
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param info - object
 * @returns no content
 **/
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
 * This function will udpate room meta
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param meta - object
 * @returns no content
 **/
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
 * This function will udpate room meta
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @returns data
 **/
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
 * This function will udpate room meta
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @returns data
 **/
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
 * This function will delete a member from room
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param memberUUID - member to remove
 * @returns data
 **/
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
 * This function will get room messages
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param message_count - number of messages 
 * @returns data
 **/
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
 * This function will add a new message to a room
 *
 * @param access_token - access_token for cpaas systems
 * @param userUUID - user UUID to be used
 * @param roomUUID - room uuid
 * @param message - string message
 * @returns data
 **/
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
 * This function will get room info, messages, and members
 *
 * @param access_token - access_token for cpaas systems
 * @param roomUUID - room uuid
 * @param message - string message
 * @returns data
 **/
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