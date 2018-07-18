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
var assignGroupsToUser = function assignGroupsToUser() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/" + userUuid + "/groups/assign",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var createUserGroup = function createUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/" + userUuid + "/groups",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
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
var deleteGroupMembers = function deleteGroupMembers() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var groupUuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null groupUuid";
  var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null body";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/users/" + userUuid + "/groups/" + groupUuid + "/members",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    body: body,
    resolveWithFullResponse: true,
    json: true

  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
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
var deleteUserGroup = function deleteUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var groupUuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null groupUuid";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/users/" + userUuid + "/groups/" + groupUuid,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true

  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will return the groups associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access otken
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {number} [offset=0] - page number
 * @param {number} [limit=10] - page size
 * @param {string} [expand=undefined] - optional; values are "members" or "members.type"
 * @param {string} [members_limit=undefined] - optional; specify the number of members to return. Default is 20
 * @returns {Promise<object>} - Promise resolving to a list of user groups.
 */
var listUserGroups = function listUserGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var expand = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var members_limit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUuid + "/groups",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };

  if (expand) {
    requestOptions.qs.expand = expand;
  }
  if (members_limit) {
    requestOptions.qs.members_limit = members_limit;
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
var modifyUserGroup = function modifyUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var groupUuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null groupUuid";
  var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null body";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/users/" + userUuid + "/groups/" + groupUuid,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    body: body,
    json: true
  };

  return request(requestOptions);
};

module.exports = {
  addMembersToGroup: addMembersToGroup,
  assignGroupsToUser: assignGroupsToUser,
  createGroup: createGroup,
  createUserGroup: createUserGroup,
  deleteGroup: deleteGroup,
  deleteGroupMembers: deleteGroupMembers,
  deleteUserGroup: deleteUserGroup,
  getGroup: getGroup,
  listGroups: listGroups,
  listUserGroups: listUserGroups,
  modifyUserGroup: modifyUserGroup,
  updateGroup: updateGroup
};