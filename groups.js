/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");
const ObjectMerge = require("object-merge");

/**
 * This function will ask the cpaas groups service for the list of groups
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
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
      Authorization: `Bearer ${accessToken}`
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
      Authorization: `Bearer ${accessToken}`
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
      Authorization: `Bearer ${accessToken}`
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
      Authorization: `Bearer ${accessToken}`
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
      Authorization: `Bearer ${accessToken}`
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
      Authorization: `Bearer ${accessToken}`
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