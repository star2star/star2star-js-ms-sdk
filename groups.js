"use strict";
const request = require('request-promise');
const util = require('./utilities');
const ObjectMerge = require('object-merge');

/**
* This function will ask the cpaas groups service for the list of groups
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @returns promise for list of groups for this user
**/
const listGroups = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "groups");
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/groups`,
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
* This function will ask the cpaas groups service for a specific group
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param groupUUID - group UUID
* @returns group
**/
const getGroup = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              groupUUID='null uuid' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "groups");
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/groups/${groupUUID}`,
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
* This function will delete a specific group
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param groupUUID - group UUID
* @returns No Content
**/
const deleteGroup = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        groupUUID ='not specified' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "groups");

  const requestOptions = {
      method: 'DELETE',
      uri: `${MS}/groups/${groupUUID}`,
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
* This function will create a new group
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param name - String group Name
* @param description - description
* @param groupType = string group type
* @param members - array of type, uuid,
* @param accountUUID - account uuid optional
* @returns data
**/
const createGroup = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        name="no name specified for group", description=undefined, groupType=undefined, members=[],
                      accountUUID=undefined ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "groups");

  const b = {
    "name": name,
    "type": groupType,
    "description": description,
    "members": ObjectMerge([], members),
    "account_uuid": accountUUID
  }
  //console.log('bbbbbbbb', b)
  const requestOptions = {
      method: 'POST',
      uri: `${MS}/groups`,
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

/**
* This function will update a group
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param group_uuid - data object UUID
* @param group_object - group object to be updated too
* @returns data
**/
const updateGroup = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        group_uuid ='not specified', group_object={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "groups");

  const requestOptions = {
      method: 'PUT',
      uri: `${MS}/groups/${group_uuid}`,
      body: ObjectMerge({}, group_object) ,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

module.exports = { listGroups, getGroup, deleteGroup, createGroup, updateGroup }