/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");
var ObjectMerge = require("object-merge");

/**
 * @async
 * @description This function will return the groups associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access otken
 * @param {number} [offset=0] - page number
 * @param {number} [limit=10] - page size
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @returns {Promise<object>} - Promise resolving to a list of user groups.
 */
var listGroups = function listGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups",
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

  if (filters) {
    Object.keys(filters).forEach(function (filter) {
      requestOptions.qs[filter] = filters[filter];
    });
  }
  return request(requestOptions);
};

/**
 * @async
 * @description This function will create a new group associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [body="null body"] - object conatining group data
 * @returns
 */
var createGroup = function createGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups",
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
 * @description This function will ask the cpaas groups service for a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type"
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
var getGroup = function getGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups/" + groupUUID,
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(function (filter) {
      requestOptions.qs[filter] = filters[filter];
    });
  }
  //console.log("****REQUESTOPTS****",requestOptions);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will return a list of the members of a group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type", [offset] and [limit] for pagination
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
var listGroupMembers = function listGroupMembers() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups/" + groupUUID + "/members",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(function (filter) {
      requestOptions.qs[filter] = filters[filter];
    });
  }
  //console.log("****REQUESTOPTS****",requestOptions);
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

/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to remove users from
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
var deleteGroupMembers = function deleteGroupMembers() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  var members = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/groups/" + groupUuid + "/members",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    body: members,
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
 * @description This method will deactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
var deactivateGroup = function deactivateGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups/" + groupUuid + "/deactivate",
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
 * @description This method will reactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
var reactivateGroup = function reactivateGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups/" + groupUuid + "/reactivate",
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
 * @description This method will change the group name and/or description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
var modifyGroup = function modifyGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/groups/" + groupUuid,
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
  createGroup: createGroup,
  deactivateGroup: deactivateGroup,
  deleteGroup: deleteGroup,
  deleteGroupMembers: deleteGroupMembers,
  getGroup: getGroup,
  listGroups: listGroups,
  listGroupMembers: listGroupMembers,
  modifyGroup: modifyGroup,
  reactivateGroup: reactivateGroup
};