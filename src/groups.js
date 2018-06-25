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

module.exports = {
  listGroups,
  getGroup,
  deleteGroup,
  createGroup,
  updateGroup,
  addMembersToGroup
};