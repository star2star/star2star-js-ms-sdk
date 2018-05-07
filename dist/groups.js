/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");
var ObjectMerge = require("object-merge");

/**
 * This function will ask the cpaas groups service for the list of groups
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
var listGroups = function listGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var MS = util.getEndpoint("groups");

  var requestOptions = {
    method: "GET",
    uri: MS + "/groups",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken
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
 * This function will ask the cpaas groups service for a specific group
 *
 * @param accessToken - access Token
 * @param groupUUID - group UUID
 * @returns group
 **/
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
      Authorization: "Bearer " + accessToken
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will delete a specific group
 *
 * @param accessToken - access Token
 * @param groupUUID - group UUID
 * @returns No Content
 **/
var deleteGroup = function deleteGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not specified";

  var MS = util.getEndpoint("groups");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/groups/" + groupUUID,
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will create a new group
 *
 * @param accessToken - access Token
 * @param name - String group Name
 * @param description - description
 * @param groupType = string group type
 * @param members - array of type, uuid,
 * @param accountUUID - account uuid optional
 * @returns data
 **/
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
      Authorization: "Bearer " + accessToken
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will update a group
 *
 * @param accessToken - access Token
 * @param group_uuid - data object UUID
 * @param group_object - group object to be updated too
 * @returns data
 **/
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
      Authorization: "Bearer " + accessToken
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will add users to a user group
 *
 * @param accessToken - access Token
 * @param groupUUID - data object UUID
 * @param members - array of objects containing 'uuid' (for known users)
 * @returns data
 **/
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
      Authorization: "Bearer " + accessToken
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