/*global require module*/
"use strict";

require("core-js/modules/web.dom.iterable");

const Util = require("./utilities");

const request = require("request-promise");

const Groups = require("./groups");

const objectMerge = require("object-merge");
/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const activateRole = async function activateRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/roles/${roleUUID}/activate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const role = response.body; // create returns a 202....suspend return until the new resource is ready

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
      await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
      trace, role.hasOwnProperty("resource_status") ? role.resource_status : "complete");
    }

    return {
      status: "ok"
    };
  } catch (error) {
    return Promise.reject({
      "status": "failed",
      "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
    });
  }
};
/**
 * @async
 * @description This function will assign a permission to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [body="null body"] - object containing array of permissions
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const assignPermissionsToRole = function assignPermissionsToRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles/${roleUUID}/permissions`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
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
};
/**
 * @async
 * @description This function assigns roles to a user-group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null groupUUID"] - user-group uuid
 * @param {object} [body="null body"] - object containing an array of roles
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const assignRolesToUserGroup = async function assignRolesToUserGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/user-groups/${userGroupUUID}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
};
/**
 * @async
 * @description This function will assign specified access to a resouce for the members of the provided user-group
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user-group uuid
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [type="account"] - resource or account
 * @param {array} [data="null data"] - array of resource or account uuids to bind to group
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const assignScopedRoleToUserGroup = async function assignScopedRoleToUserGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  let roleUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null roleUUID";
  let type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "account";
  let data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "null resourceUUID";
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/user-groups/${userGroupUUID}/role/scopes`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: {
      role: roleUUID,
      scope: [{
        [type]: data
      }]
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
};
/**
 * @async
 * @description This function creates a permission
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */


const createPermission = function createPermission() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/permissions`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function creates a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [account_uuid="null account uuid"] - account uuid
 * @param {object} [body="null body"] - user-group object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a user-group data object
 */


const createUserGroup = async function createUserGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts/${accountUUID}/user-groups`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    json: true,
    resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const newGroup = response.body; // create returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, newGroup.hasOwnProperty("resource_status") ? newGroup.resource_status : "complete");
  }

  return newGroup;
};
/**
 * @async
 * @description This function creates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {object} [body="null body"] - role definition object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a role data object
 */


const createRole = async function createRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts/${accountUUID}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    json: true,
    resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const newRole = response.body; // create returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, newRole.hasOwnProperty("resource_status") ? newRole.resource_status : "complete");
  }

  return newRole;
};
/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const deactivateRole = async function deactivateRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/roles/${roleUUID}/deactivate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const role = response.body; // create returns a 202....suspend return until the new resource is ready

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
      await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
      trace, role.hasOwnProperty("resource_status") ? role.resource_status : "complete");
    }

    return {
      "status": "ok"
    };
  } catch (error) {
    return Promise.reject({
      "status": "failed",
      "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
    });
  }
};
/**
 * @async
 * @description This function deletes a permission from a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const deletePermissionFromRole = function deletePermissionFromRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let permissionUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null permissionUUID";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/roles/${roleUUID}/permissions/${permissionUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
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
};
/**
 * @async
 * @description This function deletes a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
//FIXME 202 location header to be fixed....nh 2/8/19


const deleteRole = async function deleteRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/roles/${roleUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));

    if (response.statusCode === 202) {
      return {
        "status": "ok"
      };
    } else {
      throw `unexpected status code: ${response.statusCode}`;
    }
  } catch (error) {
    return Promise.reject({
      "status": "failed",
      "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
    });
  }
};
/**
 * @async
 * @description This function deletes a role from a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


const deleteRoleFromUserGroup = function deleteRoleFromUserGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  let roleUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null roleUUID";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/user-groups/${userGroupUUID}/roles/${roleUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
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
};
/**
 * @async
 * @description This function will return the users that have permissions for a given resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise<object>} - promise resolving to a users object
 */


const getResourceUsers = async function getResourceUsers() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null resourceUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const groups = await listAccessByGroups(accessToken, resourceUUID, trace);
  let nextTrace = objectMerge({}, trace);
  const users = {};
  const groupTypeRegex = /^[r,u,d]{1,3}/;

  for (const group in groups.items) {
    const groupName = groupTypeRegex.exec(groups.items[group].user_group.group_name);
    users[groupName] = [];
    nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
    const groupUsers = await Groups.getGroup(accessToken, groups.items[group].user_group.uuid, {
      "expand": "members",
      "members_limit": 999 //hopefully we don't need pagination here. nh

    }, nextTrace);
    users[groupName] = groupUsers.members.items.map(item => {
      return item.uuid;
    });
  }

  return users;
};
/**
 * @async
 * @description This function returns a single role by uuid.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a role object
 */


const getRole = async function getRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/roles/${roleUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
      },
      json: true
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject({
      "status": "failed",
      "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
    });
  }
};
/**
 * @async
 * @description This function lists the user groups associated with a resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


const listAccessByGroups = async function listAccessByGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/resources/${resourceUUID}/user-groups/access`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function lists the permissions associated with a resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


const listAccessByPermissions = function listAccessByPermissions() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/resources/${resourceUUID}/permissions/access`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {array} [filters=undefined] - optional filters. currently supports "name"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


const listUserGroupRoles = function listUserGroupRoles() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/user-groups/${userGroupUUID}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists permissions.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [offset="0"]
 * @param {string} [limit="10"]
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of permissions
 */


const listPermissions = async function listPermissions() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/permissions`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists roles a permission is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @param {array} [filters=undefined] - optional filters. currently supports "name"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


const listPermissionRoles = async function listPermissionRoles() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let permissionUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null permissionUUID";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/permissions/${permissionUUID}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists roles.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [offset="0"] - pagination offset
 * @param {string} [limit="10"] - pagination limit
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of roles
 */


const listRoles = function listRoles() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists roles.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [user_uuid="null user_uuid"] - user_uuid
 * @param {string} [offset="0"] - pagination offset
 * @param {string} [limit="10"] - pagination limit
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of roles
 */


const listRolesForUser = function listRolesForUser() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user_uuid";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "0";
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "10";
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


const listRoleUserGroups = function listRoleUserGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/roles/${roleUUID}/user-groups`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists permissions assigned to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


const listRolePermissions = function listRolePermissions() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/roles/${roleUUID}/permissions`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists user groups.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [offset="0"] - pagination offset
 * @param {string} [limit="10"] - pagination limit
 * @param {array} [filters=undefined] - array of filter query string parameters (user_uuid, name, sort)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


const listUserGroups = function listUserGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/user-groups`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function modifies a role
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID = "null roleUUID"] - uuid of role being modified
 * @param {object} [body="null body"] - object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */


const modifyRole = async function modifyRole() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles/${roleUUID}/modify`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    json: true,
    resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const role = response.body; // create returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, role.hasOwnProperty("resource_status") ? role.resource_status : "complete");
  }

  return role;
};
/**
 * @async
 * @description This method will change the user-group name and/or description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUUID="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


const modifyUserGroup = async function modifyUserGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = Util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/user-groups/${groupUUID}/modify`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const userGroup = response.body; // create returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, userGroup.hasOwnProperty("resource_status") ? userGroup.resource_status : "complete");
  }

  return userGroup;
};

module.exports = {
  activateRole,
  assignPermissionsToRole,
  assignRolesToUserGroup,
  assignScopedRoleToUserGroup,
  createPermission,
  createUserGroup,
  createRole,
  deactivateRole,
  deletePermissionFromRole,
  deleteRole,
  deleteRoleFromUserGroup,
  getResourceUsers,
  getRole,
  listAccessByGroups,
  listAccessByPermissions,
  listUserGroupRoles,
  listPermissions,
  listPermissionRoles,
  listRoleUserGroups,
  listRolePermissions,
  listRoles,
  listRolesForUser,
  listUserGroups,
  modifyRole,
  modifyUserGroup
};