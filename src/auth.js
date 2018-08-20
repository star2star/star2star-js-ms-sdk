/*global require module*/
"use strict";
const util = require('./utilities');
const request = require('request-promise');
const ObjectMerge = require('object-merge');

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const  activateRole = (accessToken = "null accessToken", roleUUID = "null roleUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles/${roleUUID}/activate`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  assignPermissionsToRole = (accessToken = "null accessToken", roleUUID = "null roleUUID", body = "null body") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles/${roleUUID}/permissions`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  assignRolesToUserGroup = (accessToken = "null accessToken", userGroupUUID = "null groupUUID", body = "null body") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/user-groups/${userGroupUUID}/roles`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  createPermission = (accessToken = "null accessToken", body = "null body") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/permissions`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  createUserGroup = (accessToken = "null accessToken", account_uuid = "null account uuid", body = "null body") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts/${account_uuid}/user-groups`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  createRole = (accessToken = "null accessToken", body = "null body") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  deactivateRole = (accessToken = "null accessToken", roleUUID = "null roleUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles/${roleUUID}/deactivate`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  deletePermissionFromRole = (accessToken = "null accessToken", roleUUID = "null roleUUID", permissionUUID = "null permissionUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/roles/${roleUUID}/permissions/${permissionUUID}`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  deleteRole = (accessToken = "null accessToken", roleUUID = "null roleUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/roles/${roleUUID}`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  deleteRoleFromUserGroup = (accessToken = "null accessToken", userGroupUUID = "null userGroupUUID", roleUUID = "null roleUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/user-groups/${userGroupUUID}/roles/${roleUUID}`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
   
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const  listGroupRoles = (accessToken = "null accessToken", userGroupUUID = "null userGroupUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/user-groups/${userGroupUUID}/roles`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  listPermissions = (accessToken = "null accessToken", offset = "0", limit = "10", filters = undefined) => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/permissions`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "offset": offset,
      "limit": limit,
    },
    json: true
   
  };
  if(filters) {
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
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
const  listPermissionRoles = (accessToken = "null accessToken", permissionUUID = "null permissionUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/permissions/${permissionUUID}/roles`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  listRoles = (accessToken = "null accessToken", offset = "0", limit = "10", filters = undefined) => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/roles`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "offset": offset,
      "limit": limit,
    },
    json: true
   
  };
  if(filters) {
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
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
const  listRoleGroups = (accessToken = "null accessToken", roleUUID = "null roleUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/roles/${roleUUID}/user-groups`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  listRolePermissions = (accessToken = "null accessToken", roleUUID = "null roleUUID") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/roles/${roleUUID}/permissions`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const  listUserGroups = (accessToken = "null accessToken", offset = "0", limit = "10", filters = undefined) => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/user-groups`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "offset": offset,
      "limit": limit,
    },
    json: true
   
  };
  if(filters) {
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
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */
const  modifyRole = (accessToken = "null accessToken", roleUUID = "null roleUUID", body = "null body") => {
  const MS = util.getEndpoint("auth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/roles/${roleUUID}/modify`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    body: body,
    json: true
   
  };
  return request(requestOptions);
};

module.exports = {
  activateRole,
  assignPermissionsToRole,
  assignRolesToUserGroup,
  createPermission,
  createUserGroup,
  createRole,
  deactivateRole,
  deletePermissionFromRole,
  deleteRole,
  deleteRoleFromUserGroup,
  listGroupRoles,
  listPermissions,
  listPermissionRoles,
  listRoleGroups,
  listRolePermissions,
  listRoles,
  listUserGroups,
  modifyRole
};