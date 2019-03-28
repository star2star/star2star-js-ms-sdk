/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * @async
 * @description This function will return the groups associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access otken
 * @param {number} [offset=0] - page number
 * @param {number} [limit=10] - page size
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a list of user groups.
 */
const listGroups = (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    qs: {
      offset,
      limit
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  if (filters) {
    Object.keys(filters).forEach(filter => {
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const createGroup = (
  accessToken = "null accessToken",
  body = "null body",
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/groups`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    body: body,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas groups service for a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const getGroup = (
  accessToken = "null accessToken",
  groupUUID = "null uuid",
  filters = undefined,
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups/${groupUUID}`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(filter => {
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const listGroupMembers = (
  accessToken = "null accessToken",
  groupUUID = "null uuid",
  filters = undefined,
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups/${groupUUID}/members`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(filter => {
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteGroup = async (
  accessToken = "null accessToken",
  groupUUID = "not specified",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("groups");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/groups/${groupUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response =  await request(requestOptions);
    // delete returns a 202....suspend return until the new resource is ready
    if (response.hasOwnProperty("statusCode") && 
          response.statusCode === 202 &&
          response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace,
        "deleting"
      );
    }
    return Promise.resolve({"status":"ok"});
  } catch(error){
    return Promise.reject(
      {
        "status": "failed",
        "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
      }
    );
  }
  
};

/**
 * @async
 * @description This function will add users to a user group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="group uuid not specified"] - data object UUID
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<array>} - Promise resolving to an array of added users
 */
const addMembersToGroup = async (
  accessToken = "null accessToken",
  groupUUID = "group uuid not specified",
  members = [],
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/groups/${groupUUID}/members`,
    body: members,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  // console.log("request options", JSON.stringify(requestOptions));
  return await request(requestOptions);

};

/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to remove users from
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
const deleteGroupMembers = async (
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  members = [],
  trace = {}
) => { 
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/groups/${groupUuid}/members`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    body: members,
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return await new Promise(function(resolve, reject) {
    request(requestOptions)
      .then(function(responseData) {
        responseData.statusCode === 204
          ? resolve({ status: "ok" })
          : reject({ status: "failed" });
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

/**
 * @async
 * @description This method will deactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const deactivateGroup = (
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/groups/${groupUuid}/deactivate`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This method will reactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const reactivateGroup = (
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/groups/${groupUuid}/reactivate`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This method will change the group name and description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const modifyGroup = (
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  body = "null body",
  trace = {}
) => {
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/groups/${groupUuid}`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    body: body,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  addMembersToGroup,
  createGroup,
  deactivateGroup,
  deleteGroup,
  deleteGroupMembers,
  getGroup,
  listGroups,
  listGroupMembers,
  modifyGroup,
  reactivateGroup
};
