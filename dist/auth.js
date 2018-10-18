/*global require module*/
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Util = require("./utilities");
var request = require("request-promise");
var Groups = require("./groups");
var objectMerge = require("object-merge");

/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var activateRole = function activateRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/roles/" + roleUUID + "/activate",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var assignPermissionsToRole = function assignPermissionsToRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/roles/" + roleUUID + "/permissions",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
var assignRolesToUserGroup = function assignRolesToUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/user-groups/" + userGroupUUID + "/roles",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    body: body,
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
 * @param {string} [resourceUUID="null resourceUUID"] - resource or object uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var assignScopedRoleToUserGroup = function assignScopedRoleToUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  var roleUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null roleUUID";
  var resourceUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null resourceUUID";
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/user-groups/" + userGroupUUID + "/role/scopes",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    body: {
      role: roleUUID,
      scope: [{
        resource: [resourceUUID]
      }]
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
var createPermission = function createPermission() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/permissions",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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
var createUserGroup = function createUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var account_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/accounts/" + account_uuid + "/user-groups",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    body: body,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function creates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - role definition object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a role data object
 */
var createRole = function createRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/roles",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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
var deactivateRole = function deactivateRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/roles/" + roleUUID + "/deactivate",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deletePermissionFromRole = function deletePermissionFromRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var permissionUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null permissionUUID";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/roles/" + roleUUID + "/permissions/" + permissionUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
var deleteRole = function deleteRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/roles/" + roleUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deleteRoleFromUserGroup = function deleteRoleFromUserGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  var roleUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null roleUUID";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/user-groups/" + userGroupUUID + "/roles/" + roleUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

var getResourceUsers = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null resourceUUID";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var groups, nextTrace, users, groupTypeRegex, group, groupName, groupUsers;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return listAccessByGroups(accessToken, resourceUUID, trace);

          case 2:
            groups = _context.sent;
            nextTrace = objectMerge({}, trace);
            users = {};
            groupTypeRegex = /^[r,u,d]{1,3}/;
            _context.t0 = regeneratorRuntime.keys(groups.items);

          case 7:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 18;
              break;
            }

            group = _context.t1.value;
            groupName = groupTypeRegex.exec(groups.items[group].user_group.group_name);

            users[groupName] = [];
            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context.next = 14;
            return Groups.getGroup(accessToken, groups.items[group].user_group.uuid, {
              "expand": "members",
              "members_limit": 999 //hopefully we don't need pagination here. nh
            }, nextTrace);

          case 14:
            groupUsers = _context.sent;

            users[groupName] = groupUsers.members.items.map(function (item) {
              return item.uuid;
            });
            _context.next = 7;
            break;

          case 18:
            return _context.abrupt("return", users);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getResourceUsers() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function lists the user groups associated with a resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
var listAccessByGroups = function listAccessByGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/resources/" + resourceUUID + "/user-groups/access",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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
var listAccessByPermissions = function listAccessByPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/resources/" + resourceUUID + "/permissions/access",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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
var listUserGroupRoles = function listUserGroupRoles() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userGroupUUID";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/user-groups/" + userGroupUUID + "/roles",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(function (filter) {
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
var listPermissions = function listPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/permissions",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
 * @param {array} [filters=undefined] - optional filters. currently supports "name"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listPermissionRoles = function listPermissionRoles() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var permissionUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null permissionUUID";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/permissions/" + permissionUUID + "/roles",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(function (filter) {
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
var listRoles = function listRoles() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/roles",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */
var listRoleUserGroups = function listRoleUserGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/roles/" + roleUUID + "/user-groups",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(function (filter) {
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
var listRolePermissions = function listRolePermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/roles/" + roleUUID + "/permissions",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = {};
    Object.keys(filters).forEach(function (filter) {
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
var listUserGroups = function listUserGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "10";
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "GET",
    uri: MS + "/user-groups",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */
var modifyRole = function modifyRole() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var roleUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null roleUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("auth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/roles/" + roleUUID + "/modify",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    body: body,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  activateRole: activateRole,
  assignPermissionsToRole: assignPermissionsToRole,
  assignRolesToUserGroup: assignRolesToUserGroup,
  assignScopedRoleToUserGroup: assignScopedRoleToUserGroup,
  createPermission: createPermission,
  createUserGroup: createUserGroup,
  createRole: createRole,
  deactivateRole: deactivateRole,
  deletePermissionFromRole: deletePermissionFromRole,
  deleteRole: deleteRole,
  deleteRoleFromUserGroup: deleteRoleFromUserGroup,
  getResourceUsers: getResourceUsers,
  listAccessByGroups: listAccessByGroups,
  listAccessByPermissions: listAccessByPermissions,
  listUserGroupRoles: listUserGroupRoles,
  listPermissions: listPermissions,
  listPermissionRoles: listPermissionRoles,
  listRoleUserGroups: listRoleUserGroups,
  listRolePermissions: listRolePermissions,
  listRoles: listRoles,
  listUserGroups: listUserGroups,
  modifyRole: modifyRole
};