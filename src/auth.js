/*global require module*/
"use strict";
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
const activateRole = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
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
 * @description This function will assign a permission to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [body="null body"] - object containing array of permissions
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const assignPermissionsToRole = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  body = "null body",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
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
 * @description This function assigns roles to a user-group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null groupUUID"] - user-group uuid
 * @param {object} [body="null body"] - object containing an array of roles
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const assignRolesToUserGroup = async (
  accessToken = "null accessToken",
  userGroupUUID = "null groupUUID",
  body = "null body",
  trace = {}
) => {
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
 * @description This function will assign specified access to a resouce for the members of the provided user-group
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user-group uuid
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [type="account"] - resource or account
 * @param {array} [data="null data"] - array of resource or account uuids to bind to group
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const assignScopedRoleToUserGroup = async (
  accessToken = "null access token",
  userGroupUUID = "null userGroupUUID",
  roleUUID = "null roleUUID",
  type = "account",
  data = "null resourceUUID",
  trace = {}
) => {
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
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
      scope: [
        {
          [type]: data
        }
      ]
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
 * @description This function creates a permission
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */
const createPermission = (
  accessToken = "null accessToken",
  body = "null body",
  trace = {}
) => {
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
const createUserGroup = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  body = "null body",
  trace = {}
) => {
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
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
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return await request(requestOptions);
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
const createRole = (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  body = "null body",
  trace = {}
) => {
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
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deactivateRole = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
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
 * @description This function deletes a permission from a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deletePermissionFromRole = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  permissionUUID = "null permissionUUID",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
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
 * @description This function deletes a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deleteRole = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
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
 * @description This function deletes a role from a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deleteRoleFromUserGroup = (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  roleUUID = "null roleUUID",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
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

const getResourceUsers = async (accessToken = "null accessToken", resourceUUID = "null resourceUUID", trace = {}) => {
  const groups = await listAccessByGroups(accessToken, resourceUUID, trace);
  let nextTrace = objectMerge({}, trace);
  const users = {};
  const groupTypeRegex = /^[r,u,d]{1,3}/;
  for (const group in groups.items) {
    const groupName = groupTypeRegex.exec(
      groups.items[group].user_group.group_name
    );
    users[groupName] = [];
    nextTrace = objectMerge(
      {},
      nextTrace,
      Util.generateNewMetaData(nextTrace)
    );
    const groupUsers = await Groups.getGroup(
      accessToken,
      groups.items[group].user_group.uuid,
      {
        "expand":"members",
        "members_limit":999 //hopefully we don't need pagination here. nh
      },
      nextTrace
    );
    users[groupName] = groupUsers.members.items.map(item => {
      return item.uuid;
    });
  }
  return users;
};

/**
 * @async
 * @description This function lists the user groups associated with a resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const listAccessByGroups = async (
  accessToken = "null accessToken",
  resourceUUID = "null groupUUID",
  trace = {}
) => {
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
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
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
const listAccessByPermissions = (
  accessToken = "null accessToken",
  resourceUUID = "null groupUUID",
  trace = {}
) => {
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
const listUserGroupRoles = (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  filters = undefined,
  trace = {}
) => {
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
const listPermissions = async (
  accessToken = "null accessToken",
  offset = "0",
  limit = "10",
  filters = undefined,
  trace = {}
) => {
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
const listPermissionRoles = async (
  accessToken = "null accessToken",
  permissionUUID = "null permissionUUID",
  filters = undefined,
  trace = {}
) => {
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
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
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
const listRoles = (
  accessToken = "null accessToken",
  offset = "0",
  limit = "10",
  filters = undefined,
  trace = {}
) => {
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
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
const listRoleUserGroups = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  filters = undefined,
  trace = {}
) => {
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
const listRolePermissions = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  filters = undefined,
  trace = {}
) => {
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
 * @param {array} [filters=undefined] - array of filter query string parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
const listUserGroups = (
  accessToken = "null accessToken",
  offset = "0",
  limit = "10",
  filters = undefined,
  trace = {}
) => {
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
const modifyRole = (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  body = "null body",
  trace = {}
) => {
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
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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
const modifyUserGroup = (
  accessToken = "null accessToken",
  groupUUID = "null groupUUID",
  body = "null body",
  trace = {}
) => {
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
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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
  listAccessByGroups,
  listAccessByPermissions,
  listUserGroupRoles,
  listPermissions,
  listPermissionRoles,
  listRoleUserGroups,
  listRolePermissions,
  listRoles,
  listUserGroups,
  modifyRole,
  modifyUserGroup
};
