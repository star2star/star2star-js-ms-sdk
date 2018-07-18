/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");
const ObjectMerge = require("object-merge");

/**
 * @async
 * @description This function will ask the cpaas groups service for the list of groups.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {object} [filter=undefined] - optional filter parameters
 * @returns {Promise<object>} - Promise resolving to a data object containing all associated groups
 */
const listGroups = (
  accessToken = "null accessToken",
  filter = undefined
) => {
  const MS = util.getEndpoint("groups");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  if (filter) {
    // ok have filter build query string
    requestOptions.qs = filter;
  }
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas groups service for a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const getGroup = (
  accessToken = "null accessToken",
  groupUUID = "null uuid"
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups/${groupUUID}`,
    qs: {
      expand: "members.type"
    },
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will delete a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="not specified"] - group UUID
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteGroup = (
  accessToken = "null accessToken",
  groupUUID = "not specified"
) => {
  const MS = util.getEndpoint("groups");

  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/groups/${groupUUID}`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will create a new group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [name="no name specified for group"] - group name
 * @param {string} [description=undefined] - description
 * @param {string} [groupType=undefined] - group type
 * @param {array} [members=[]]- array of type, uuid
 * @param {string} [accountUUID=undefined] - account uuid optional
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const createGroup = (
  accessToken = "null accessToken",
  name = "no name specified for group",
  description = undefined,
  groupType = undefined,
  members = [],
  accountUUID = undefined
) => {
  const MS = util.getEndpoint("groups");

  const b = {
    name: name,
    type: groupType,
    description: description,
    members: ObjectMerge([], members),
    account_uuid: accountUUID
  };
  //console.log('bbbbbbbb', b)
  const requestOptions = {
    method: "POST",
    uri: `${MS}/groups`,
    body: b,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will update a group
 * @param {string} [group_uuid="not specified"] - data object UUID
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {object} [group_object={}] - new group object
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const updateGroup = (
  group_uuid = "not specified",
  accessToken = "null accessToken",
  group_object = {}
) => {
  const MS = util.getEndpoint("groups");

  const requestOptions = {
    method: "PUT",
    uri: `${MS}/groups/${group_uuid}`,
    body: ObjectMerge({}, group_object),
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will add users to a user group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="group uuid not specified"] - data object UUID
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @returns {Promise<array>} - Promise resolving to an array of added users
 */
const addMembersToGroup = (
  accessToken = "null accessToken",
  groupUUID = "group uuid not specified",
  members = []
) => {
  const MS = util.getEndpoint("groups");

  const requestOptions = {
    method: "POST",
    uri: `${MS}/groups/${groupUUID}/members`,
    body: members,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  // console.log("request options", JSON.stringify(requestOptions));
  return request(requestOptions);
};

/***********************************************
 * Begin user-controller
 ***********************************************/

/**
 * @async
 * @description This function will assign one or more groups to a user.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - user being assigned to groups
 * @param {object} [body="null body"] - object containing array of groups
 * @returns {Promise<array>} - Promise resolving to an array of groups added to user
 */
const assignGroupsToUser = (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  body = "null body"
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUuid}/groups/assign`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    body: body,
    json: true
  };
  
  return request(requestOptions);
};

/**
 * @async
 * @description This function will create a new group associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - user_uuid
 * @param {string} [body="null body"] - object conatining group data
 * @returns
 */
const createUserGroup = (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  body = "null body"
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUuid}/groups`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    body: body,
    json: true
  };
  
  return request(requestOptions);
};

/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - group owner uuid
 * @param {string} [groupUuid="null groupUuid"] - group to remove users from
 * @param {array} [body="null body"] - array of objects containing member uuids to remove from group
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
const deleteGroupMembers = (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  groupUuid = "null groupUuid",
  body = "null body"
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/users/${userUuid}/groups/${groupUuid}/members`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    body: body,
    resolveWithFullResponse: true,
    json: true,
    
  };

  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
        reject(error);
    })
  });
};

/**
 * @async
 * @description This function will delete a group created by a specific user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - group owner uuid
 * @param {string} [groupUuid="null groupUuid"] - group uuid
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
const deleteUserGroup = (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  groupUuid = "null groupUuid",
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/users/${userUuid}/groups/${groupUuid}`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true,
    
  };

  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
        reject(error);
    })
  });
};

/**
 * @async
 * @description This function will return the groups associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access otken
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {number} [offset=0] - page number
 * @param {number} [limit=10] - page size
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {string} [members_limit=undefined] - optional; specify the number of members to return. Default is 20
 * @returns {Promise<object>} - Promise resolving to a list of user groups.
 */
const listUserGroups = (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  offset = 0,
  limit = 10,
  filters = undefined
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUuid}/groups`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      offset,
      limit
    },
    json: true
  };
  
  if(filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }
  return request(requestOptions);
};

/**
 * @async
 * @description This method will change the group name and/or description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - user owning group
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const modifyUserGroup = (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  groupUuid = "null groupUuid",
  body = "null body"
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/users/${userUuid}/groups/${groupUuid}`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
   body:body,
   json: true
  };
  
  return request(requestOptions);
};

module.exports = {
  addMembersToGroup,
  assignGroupsToUser,
  createGroup,
  createUserGroup,
  deleteGroup,
  deleteGroupMembers,
  deleteUserGroup,
  getGroup, 
  listGroups,
  listUserGroups,
  modifyUserGroup,
  updateGroup
};