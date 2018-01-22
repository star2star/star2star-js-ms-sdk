"use strict";
const util = require('./utilities');
const request = require('request-promise');
const ObjectMerge = require('object-merge');

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
const createRoom = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        name="no name specified for group", topic="no topic specified", description=undefined, groupUUID=undefined,
                      accountUUID=undefined, metadata={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  const b = {
  "name": name,
  "topic": topic,
  "description": description,
  "account_uuid": accountUUID,
  "group_uuid": groupUUID,
  "owner_uuid": userUUID,
  "metadata": metadata
}
  //console.log('bbbbbbbb', b)
  const requestOptions = {
      method: 'POST',
      uri: `${MS}/rooms`,
      body: b,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

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
const listRooms = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      filter= undefined ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  const requestOptions = {
      method: 'GET',
      uri: `${MS}/rooms`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  if (filter !== undefined){
    requestOptions.qs = filter;
  }
  return request(requestOptions);
}
// getRoom
/**
* This function will get a specific room
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param filter - optional object
* @returns data
**/
const getRoom = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified" ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  const requestOptions = {
      method: 'GET',
      uri: `${MS}/rooms/${roomUUID}`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}
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
const deleteRoom = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified" ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  const requestOptions = {
      method: 'DELETE',
      uri: `${MS}/rooms/${roomUUID}`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}

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
const updateRoomInfo = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified", info={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  const requestOptions = {
      method: 'PUT',
      uri: `${MS}/rooms/${roomUUID}/info`,
      body: info,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}

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
const updateRoomMeta = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified", meta={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
      method: 'PUT',
      uri: `${MS}/rooms/${roomUUID}/meta`,
      body: meta,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}

/**
* This function will udpate room meta
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param roomUUID - room uuid
* @returns data
**/
const getRoomMembers = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified" ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/rooms/${roomUUID}/members`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}

/**
* This function will udpate room meta
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param roomUUID - room uuid
* @returns data
**/
const addMember = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified", memberData ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
      method: 'POST',
      uri: `${MS}/rooms/${roomUUID}/members`,
      body: memberData,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}
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
const deleteMember = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                      roomUUID="no room uuid specified", memberUUID="empty" ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "chat");

  //console.log('mmmmmmm', meta)
  const requestOptions = {
      method: 'DELETE',
      uri: `${MS}/rooms/${roomUUID}/members/${memberUUID}`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };

  return request(requestOptions);
}

module.exports = { createRoom, deleteRoom, listRooms, getRoom, updateRoomInfo, updateRoomMeta, getRoomMembers, addMember, deleteMember   }
