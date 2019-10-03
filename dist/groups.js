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


const listGroups = function listGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/user-groups"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
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


const createGroup = function createGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const newBody = {
    "name": body.name,
    "description": body.description
  };
  newBody.users = body.members.map(member => {
    return member.uuid;
  });
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/accounts/").concat(body.account_uuid, "/user-groups"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    body: newBody,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will ask the cpaas groups service for a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */


const getGroup = function getGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/groups/").concat(groupUUID),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  } //console.log("****REQUESTOPTS****",requestOptions);


  return request(requestOptions);
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will return a list of the members of a group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type", [offset] and [limit] for pagination
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */


const listGroupMembers = function listGroupMembers() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/groups/").concat(groupUUID, "/members"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  } //console.log("****REQUESTOPTS****",requestOptions);


  return request(requestOptions);
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will delete a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="not specified"] - group UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


const deleteGroup = async function deleteGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not specified";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("groups");
    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/groups/").concat(groupUUID),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions); // delete returns a 202....suspend return until the new resource is ready

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
      await util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
      trace, "deleting");
    }

    return Promise.resolve({
      "status": "ok"
    });
  } catch (error) {
    return Promise.reject({
      "status": "failed",
      "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
    });
  }
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will add users to a user group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="group uuid not specified"] - data object UUID
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<array>} - Promise resolving to an array of added users
 */


const addMembersToGroup = async function addMembersToGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "group uuid not specified";
  let members = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/groups/").concat(groupUUID, "/members"),
    body: members,
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace); // console.log("request options", JSON.stringify(requestOptions));

  return await request(requestOptions);
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to remove users from
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */


const deleteGroupMembers = async function deleteGroupMembers() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  let members = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "DELETE",
    uri: "".concat(MS, "/groups/").concat(groupUuid, "/members"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    body: members,
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return await new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({
        status: "ok"
      }) : reject({
        status: "failed"
      });
    }).catch(function (error) {
      reject(error);
    });
  });
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This method will deactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


const deactivateGroup = function deactivateGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/groups/").concat(groupUuid, "/deactivate"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
}; // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This method will reactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


const reactivateGroup = function reactivateGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("groups");
  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/groups/").concat(groupUuid, "/reactivate"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
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


const modifyGroup = function modifyGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/user-groups/").concat(groupUuid, "/modify"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
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