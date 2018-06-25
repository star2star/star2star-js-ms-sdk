/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");
var ObjectMerge = require("object-merge");

/**
 * @async
 * @description This function will ask the cpaas groups service for the list of groups.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {object} [filter=undefined] - optional filter parameters
 * @returns {Promise<object>} - Promise resolving to a data object containing all associated groups
 */
var listGroups = function listGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var MS = util.getEndpoint("groups");

  var requestOptions = {
    method: "GET",
    uri: MS + "/groups",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var getGroup = function getGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups/" + groupUUID,
    qs: {
      expand: "members.type"
    },
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var deleteGroup = function deleteGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not specified";

  var MS = util.getEndpoint("groups");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/groups/" + groupUUID,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var createGroup = function createGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no name specified for group";
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var groupType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var members = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var accountUUID = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

  var MS = util.getEndpoint("groups");

  var b = {
    name: name,
    type: groupType,
    description: description,
    members: ObjectMerge([], members),
    account_uuid: accountUUID
  };
  //console.log('bbbbbbbb', b)
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups",
    body: b,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var updateGroup = function updateGroup() {
  var group_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "not specified";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var group_object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("groups");

  var requestOptions = {
    method: "PUT",
    uri: MS + "/groups/" + group_uuid,
    body: ObjectMerge({}, group_object),
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var addMembersToGroup = function addMembersToGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "group uuid not specified";
  var members = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var MS = util.getEndpoint("groups");

  var requestOptions = {
    method: "POST",
    uri: MS + "/groups/" + groupUUID + "/members",
    body: members,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  // console.log("request options", JSON.stringify(requestOptions));
  return request(requestOptions);
};

module.exports = {
  listGroups: listGroups,
  getGroup: getGroup,
  deleteGroup: deleteGroup,
  createGroup: createGroup,
  updateGroup: updateGroup,
  addMembersToGroup: addMembersToGroup
};