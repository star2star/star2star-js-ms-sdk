/*global require module*/
"use strict";

var util = require('./utilities');
var request = require('request-promise');
var ObjectMerge = require('object-merge');

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var activateRole = function activateRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/roles/' + roleUUID + '/activate',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function will assign a permission to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [body="null body"] - object containing array of permissions
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var assignPermissionsToRole = function assignPermissionsToRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/roles/' + roleUUID + '/permissions',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function assigns roles to a user-group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null groupUUID"] - user-group uuid
 * @param {object} [body="null body"] - object containing an array of roles
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var assignRolesToUserGroup = function assignRolesToUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/user-groups/' + userGroupUUID + '/roles',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function creates a permission
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - object 
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */
var createPermission = function createPermission() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/permissions',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    body: body,
    json: true

  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function creates a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [account_uuid="null account uuid"] - account uuid
 * @param {object} [body="null body"] - user-group object
 * @returns {Promise<object>} - Promise resolving to a user-group data object
 */
var createUserGroup = function createUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var account_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/accounts/' + account_uuid + '/user-groups',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    body: body,
    json: true

  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function creates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - role definition object
 * @returns {Promise<object>} - Promise resolving to a role data object
 */
var createRole = function createRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/roles',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    body: body,
    json: true

  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deactivateRole = function deactivateRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/roles/' + roleUUID + '/deactivate',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function deletes a permission from a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deletePermissionFromRole = function deletePermissionFromRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var permissionUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null permissionUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "DELETE",
    uri: MS + '/roles/' + roleUUID + '/permissions/' + permissionUUID,
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function deletes a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deleteRole = function deleteRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "DELETE",
    uri: MS + '/roles/' + roleUUID,
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function deletes a role from a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deleteRoleFromUserGroup = function deleteRoleFromUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  var roleUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null roleUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "DELETE",
    uri: MS + '/user-groups/' + userGroupUUID + '/roles/' + roleUUID,
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
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
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listUserGroupRoles = function listUserGroupRoles() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/user-groups/' + userGroupUUID + '/roles',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    json: true

  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function lists permissions.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [offset="0"]
 * @param {string} [limit="10"]
 * @param {array} [filters=undefined] - array of filter query parameters
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of permissions
 */
var listPermissions = function listPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/permissions',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    qs: {
      "offset": offset,
      "limit": limit
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
 * @description This function lists roles a permission is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listPermissionRoles = function listPermissionRoles() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var permissionUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null permissionUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/permissions/' + permissionUUID + '/roles',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    json: true

  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function lists roles.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [offset="0"] - pagination offset
 * @param {string} [limit="10"] - pagination limit
 * @param {array} [filters=undefined] - array of filter query parameters
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of roles
 */
var listRoles = function listRoles() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/roles',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    qs: {
      "offset": offset,
      "limit": limit
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
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listRoleUserGroups = function listRoleUserGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/roles/' + roleUUID + '/user-groups',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    json: true

  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function lists permissions assigned to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listRolePermissions = function listRolePermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/roles/' + roleUUID + '/permissions',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    json: true

  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function lists user groups.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [offset="0"] - pagination offset
 * @param {string} [limit="10"] - pagination limit
 * @param {array} [filters=undefined] - array of filter query string parameters
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listUserGroups = function listUserGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + '/user-groups',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    qs: {
      "offset": offset,
      "limit": limit
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
 * @description This function modifies a role
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID = "null roleUUID"] - uuid of role being modified
 * @param {object} [body="null body"] - object 
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */
var modifyRole = function modifyRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + '/roles/' + roleUUID + '/modify',
    headers: {
      "Authorization": 'Bearer ' + accessToken,
      "Content-type": "application/json",
      'x-api-version': '' + util.getVersion()
    },
    body: body,
    json: true

  };
  return request(requestOptions);
};

module.exports = {
  activateRole: activateRole,
  assignPermissionsToRole: assignPermissionsToRole,
  assignRolesToUserGroup: assignRolesToUserGroup,
  createPermission: createPermission,
  createUserGroup: createUserGroup,
  createRole: createRole,
  deactivateRole: deactivateRole,
  deletePermissionFromRole: deletePermissionFromRole,
  deleteRole: deleteRole,
  deleteRoleFromUserGroup: deleteRoleFromUserGroup,
  listUserGroupRoles: listUserGroupRoles,
  listPermissions: listPermissions,
  listPermissionRoles: listPermissionRoles,
  listRoleUserGroups: listRoleUserGroups,
  listRolePermissions: listRolePermissions,
  listRoles: listRoles,
  listUserGroups: listUserGroups,
  modifyRole: modifyRole
};