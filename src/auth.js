/*global require module*/
"use strict";
const Util = require("./utilities");
const request = require("./requestPromise");
const Groups = require("./groups");

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const activateRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/roles/${roleUUID}/activate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 *
 * @description This function adds resources to a resource group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [resourceGroup="null resourceGroup"] - uuide of resource group to modify
 * @param {array} [resources="null resources"] - array of resource uuids to add to group
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const addResourcesToGroup = async (
  accessToken = "null accessToken",
  resourceGroup = "null resourceGroup",
  resources = "null resources",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/resource-groups/${resourceGroup}/resources`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: { resources: resources },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @description This function adds users to a user group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {array} [users="null members"] - array of user uuids
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - Promise resolving to the updated user group
 */
const addUsersToGroup = async (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  users = "null members",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${userGroupUUID}/users`,
      body: {
        users: users,
      },
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const group = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return group;
  } catch (error) {
    throw Util.formatError(error);
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
const assignPermissionsToRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/roles/${roleUUID}/permissions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "assign permission to role failed",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details:
          typeof response.body === "object" && response.body !== null
            ? [response.body]
            : [],
      };
    }
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${userGroupUUID}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "assign role to user-group failed",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details:
          typeof response.body === "object" && response.body !== null
            ? [response.body]
            : [],
      };
    }
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${userGroupUUID}/role/scopes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: {
        role: roleUUID,
        scope: [
          {
            [type]: data,
          },
        ],
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function will determine if a user has permission to perform a specified action for a given account
 * @param {string} [accessToken="null access token"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - CPaaS user uuid 
 * @param {string} [accountUUID="null accountUUID"] - CPaaS account uuid
 * @param {string} [resourceType="null resourceType"] - resource type
 * @param {array} [action="null action"] - action to be performed
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const authorizeUserByAccount = async (
  accessToken = "null access token",
  userUUID = "null userUUID",
  accountUUID = "null accountUUID",
  resourceType = "null resourceType",
  action = "null action",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/${userUUID}/authorize`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: {
        account_uuid: accountUUID,
        resource_type: resourceType,
        action: action,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return { status: "ok" };
    }
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @async
 * @description This function creates a permission
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */
const createPermission = async (
  accessToken = "null accessToken",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/permissions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @description This function will create a resource group for an oauth2 application
 * @async
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [applicationUUID="null applicationUUID"]
 * @param {string} [name=""] - name of resource group
 * @param {string} [description=""] - description of resource group
 * @param {array} [resources=[]] - array of resource uuids
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a resource group object
 */
const createApplicationResourceGroup = async (
  accessToken = "null accessToken",
  applicationUUID = "null applicationUUID",
  name = "",
  description = "",
  resources = [],
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/applications/${applicationUUID}/resource-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: {
        name: name,
        description: description,
        resources: resources,
      },
      json: true,
      resolveWithFullResponse: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const newGroup = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return newGroup;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/accounts/${accountUUID}/user-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      json: true,
      resolveWithFullResponse: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const newGroup = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return newGroup;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const createRole = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/accounts/${accountUUID}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      json: true,
      resolveWithFullResponse: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const newRole = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return newRole;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deactivateRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/roles/${roleUUID}/deactivate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    return Promise.reject(Util.formatError(error));
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
const deletePermissionFromRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  permissionUUID = "null permissionUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/roles/${roleUUID}/permissions/${permissionUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "delete permission from role failed",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details:
          typeof response.body === "object" && response.body !== null
            ? [response.body]
            : [],
      };
    }
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function deletes a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deleteRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/roles/${roleUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    return Promise.reject(Util.formatError(error));
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
const deleteRoleFromUserGroup = async (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  roleUUID = "null roleUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/user-groups/${userGroupUUID}/roles/${roleUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "delete role from user-group failed",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details:
          typeof response.body === "object" && response.body !== null
            ? [response.body]
            : [],
      };
    }
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function deletes a role from a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deleteUserGroup = async (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/user-groups/${userGroupUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.statusCode === 202) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "delete role from user-group failed",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details:
          typeof response.body === "object" && response.body !== null
            ? [response.body]
            : [],
      };
    }
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function returns an accounts default user-groups
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to object containing default admin and user group uuids.
 */
const getAccountDefaultGroups = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/user-groups`,
      qs: {
        default: "true",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const retObj = {
      admin: "",
      user: "",
    };
    const response = await request(requestOptions);
    response.items.forEach((item) => {
      if (item.hasOwnProperty("type") && item.hasOwnProperty("uuid")) {
        if (item.type === "admin") {
          retObj.admin = item.uuid;
        } else if (item.type === "user") {
          retObj.user = item.uuid;
        }
      }
    });

    // if we have no admin or user value in retObj, throw an error
    if (retObj.admin.length === 0 || retObj.user.length === 0) {
      throw {
        code: 500,
        message: "missing admin or user UUID in account default group",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details: [],
      };
    }

    return retObj;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @description This function returns an oAuth client application resource groups
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [applicationUUID="null applicationUUID"] - oauth2 client application uuid
 * @param {object} [filters= {}] - optional filters, name, default, etc
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - promise resolving to object containing resource groups.
 */
const getApplicationResourceGroups = async (
  accessToken = "null accessToken",
  applicationUUID = "null applicationUUID",
  filters = {},
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/applications/${applicationUUID}/resource-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    if (typeof filters === "object" && filters !== null) {
      Object.keys(filters).forEach((filter) => {
        if (requestOptions.qs === undefined) {
          requestOptions.qs = {};
        }
        if (
          typeof filters[filter] === "string" ||
          typeof filters[filter] === "number"
        ) {
          requestOptions.qs[filter] = filters[filter];
        }
      });
    }
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This function returns an oAuth client application default resource groups
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [applicationUUID="null applicationUUID"] - oauth2 client application uuid
 * @param {string} [type="user"] - optional type ["user", "admin", "forbidden"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - promise resolving to object containing default resource groups.
 */
const getApplicationDefaultResourceGroups = async (
  accessToken = "null accessToken",
  applicationUUID = "null applicationUUID",
  type = "user",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/applications/${applicationUUID}/resource-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: { default: "true" },
      json: true,
    };
    if (typeof type === "string") {
      requestOptions.qs.type = type;
    }
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This function returns an oAuth client application default user groups
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [applicationUUID="null applicationUUID"] - oauth2 client application uuid
 * @param {string} [type="user"] - optional type ["user", "admin", "forbidden"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - promise resolving to object containing default resource groups.
 */
const getApplicationDefaultUserGroups = async (
  accessToken = "null accessToken",
  applicationUUID = "null applicationUUID",
  type = "user",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/applications/${applicationUUID}/user-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        default: "true",
      },
      json: true,
    };
    if (typeof type === "string") {
      requestOptions.qs.type = type;
    }
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @async
 * @description This function will return the users that have permissions for a given resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise<object>} - promise resolving to a users object
 */
const getResourceUsers = async (
  accessToken = "null accessToken",
  resourceUUID = "null resourceUUID",
  trace = {}
) => {
  try {
    const groups = await listAccessByGroups(accessToken, resourceUUID, trace);
    let nextTrace = Util.generateNewMetaData(trace);
    const users = {};
    const groupTypeRegex = /^[r,u,d]{1,3}/;
    for (const group in groups.items) {
      const groupName = groupTypeRegex.exec(
        groups.items[group].user_group.group_name
      );
      users[groupName] = [];
      nextTrace = Util.generateNewMetaData(nextTrace);

      const groupUsers = await Groups.getGroup(
        accessToken,
        groups.items[group].user_group.uuid,
        {
          expand: "members",
          members_limit: 999, //hopefully we don't need pagination here. nh
        },
        nextTrace
      );
      users[groupName] = groupUsers.members.items.map((item) => {
        return item.uuid;
      });
    }
    return users;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function returns the uuids for roles required to build resource groups
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {*} [trace={}] - optional microservices lifecycle object
 * @returns {Promise} - promise resolving to roles object
 */
const getResourceGroupRoles = async (
  accessToken = "null access token",
  trace = {}
) => {
  try {
    const retObj = {};
    const rolePromises = [];
    Object.keys(Util.config.resourceRoleDescriptions).forEach(
      (resourceType) => {
        rolePromises.push(
          listRoles(
            accessToken,
            0, // offset
            100, // limit
            { description: Util.config.resourceRoleDescriptions[resourceType] },
            trace
          )
        );
      }
    );
    const rawRoles = await Promise.all(rolePromises);
    /*
     * The following seems weird, convoluted, and brittle because it is.
     * Awaiting resolution of JIRA CCORE-586 for final implimentation.
     * The resource group roles will be present in Starpaas->Admin->Roles for all account admins.
     * Because of this they are written with a human friendly name and description.
     * As such they are complex strings that need to be parsed into a format that can be used by resource groups utility.
     */
    rawRoles.forEach((element) => {
      element.items.forEach((item) => {
        const permissionType = item.name.split(" ")[1];
        if (!retObj.hasOwnProperty(permissionType)) {
          retObj[permissionType] = {};
        }
        const permissions = item.name.split("-")[1].split(",");
        let propName = "";
        permissions.forEach((permission) => {
          propName = `${propName}${permission.charAt(1)}`;
        });
        retObj[permissionType][propName] = item.uuid;
      });
    });
    return retObj;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function returns a single role by uuid.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a role object
 */
const getRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/roles/${roleUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
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
const listAccessByGroups = async (
  accessToken = "null accessToken",
  resourceUUID = "null groupUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/resources/${resourceUUID}/user-groups/access`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function lists the permissions associated with a resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const listAccessByPermissions = async (
  accessToken = "null accessToken",
  resourceUUID = "null groupUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/resources/${resourceUUID}/permissions/access`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @async
 * @description This function lists user groups associated with a CPaaS Account.
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [accountUUID="null accountUUID"] - CPaaS account uuid
 * @param {string} [offset="0"] - pagination offset
 * @param {string} [limit="10"] - pagination limit
 * @param {object} [filters=undefined] - array of filter query string parameters (user_uuid, name, sort)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
const listAccountUserGroups = async function () {
  let accessToken =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : "null accessToken";
  let offset =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  let limit =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  let filters =
    arguments.length > 3 && arguments[3] !== undefined
      ? arguments[3]
      : undefined;
  let trace =
    arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/user-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (typeof filters === "object" && filters !== null) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const listUserGroupRoles = async (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/user-groups/${userGroupUUID}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      requestOptions.qs = {};
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/permissions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/permissions/${permissionUUID}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      requestOptions.qs = {};
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const listRoles = async (
  accessToken = "null accessToken",
  offset = "0",
  limit = "10",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const listRolesForUser = async (
  accessToken = "null accessToken",
  user_uuid = "null user_uuid",
  offset = "0",
  limit = "10",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/${user_uuid}/roles`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const listRoleUserGroups = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/roles/${roleUUID}/user-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      requestOptions.qs = {};
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const listRolePermissions = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/roles/${roleUUID}/permissions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      requestOptions.qs = {};
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const listUserGroups = async (
  accessToken = "null accessToken",
  offset = "0",
  limit = "10",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/user-groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const modifyRole = async (
  accessToken = "null accessToken",
  roleUUID = "null roleUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/roles/${roleUUID}/modify`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      json: true,
      resolveWithFullResponse: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const role = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return role;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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
const modifyUserGroup = async (
  accessToken = "null accessToken",
  groupUUID = "null groupUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${groupUUID}/modify`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: body,
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const userGroup = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return userGroup;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 *
 * @description This function removes resources from a resource group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [resourceGroup="null resourceGroup"] - uuide of resource group to modify
 * @param {array} [resources="null resources"] - array of resource uuids to add to group
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const removeResourceFromGroup = async (
  accessToken = "null accessToken",
  resourceGroup = "null resourceGroup",
  resources = "null resources",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/resource-groups/${resourceGroup}/resources/remove`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: { resources: resources },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

/**
 * @description This function removes users from a user group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {array} [users="null members"] - array of user uuids
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - Promise resolving to the updated user group
 */
const removeUsersFromGroup = async (
  accessToken = "null accessToken",
  userGroupUUID = "null userGroupUUID",
  users = "null users",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${userGroupUUID}/users/remove`,
      body: {
        users: users,
      },
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${Util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const group = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await Util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return group;
  } catch (error) {
    throw Util.formatError(error);
  }
};

module.exports = {
  activateRole,
  addResourcesToGroup,
  addUsersToGroup,
  assignPermissionsToRole,
  assignRolesToUserGroup,
  assignScopedRoleToUserGroup,
  authorizeUserByAccount,
  createApplicationResourceGroup,
  createPermission,
  createUserGroup,
  createRole,
  deactivateRole,
  deletePermissionFromRole,
  deleteRole,
  deleteRoleFromUserGroup,
  deleteUserGroup,
  getAccountDefaultGroups,
  getApplicationDefaultResourceGroups,
  getApplicationDefaultUserGroups,
  getApplicationResourceGroups,
  getResourceUsers,
  getResourceGroupRoles,
  getRole,
  listAccessByGroups,
  listAccessByPermissions,
  listAccountUserGroups,
  listUserGroupRoles,
  listPermissions,
  listPermissionRoles,
  listRoleUserGroups,
  listRolePermissions,
  listRoles,
  listRolesForUser,
  listUserGroups,
  modifyRole,
  modifyUserGroup,
  removeResourceFromGroup,
  removeUsersFromGroup,
};
