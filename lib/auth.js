/*global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.function.name.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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


var activateRole = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        roleUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null accessToken";
            roleUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null roleUUID";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/activate"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context.next = 9;
            return request(requestOptions);

          case 9:
            response = _context.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context.next = 13;
              break;
            }

            _context.next = 13;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 13:
            return _context.abrupt("return", {
              status: "ok"
            });

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", Promise.reject(Util.formatError(_context.t0)));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 16]]);
  }));

  return function activateRole() {
    return _ref.apply(this, arguments);
  };
}();
/**
 *
 * @description This function adds resources to a resource group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [resourceGroup="null resourceGroup"] - uuide of resource group to modify
 * @param {array} [resources="null resources"] - array of resource uuids to add to group
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var addResourcesToGroup = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        resourceGroup,
        resources,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            resourceGroup = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null resourceGroup";
            resources = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "null resources";
            trace = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            _context2.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/resource-groups/").concat(resourceGroup, "/resources"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: {
                resources: resources
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context2.next = 10;
            return request(requestOptions);

          case 10:
            response = _context2.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context2.next = 14;
              break;
            }

            _context2.next = 14;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 14:
            return _context2.abrupt("return", {
              status: "ok"
            });

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", Promise.reject(Util.formatError(_context2.t0)));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 17]]);
  }));

  return function addResourcesToGroup() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description This function adds users to a user group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {array} [users="null members"] - array of user uuids
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - Promise resolving to the updated user group
 */


var addUsersToGroup = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        userGroupUUID,
        users,
        trace,
        MS,
        requestOptions,
        response,
        group,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null accessToken";
            userGroupUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null userGroupUUID";
            users = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "null members";
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(userGroupUUID, "/users"),
              body: {
                "users": users
              },
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context3.next = 10;
            return request(requestOptions);

          case 10:
            response = _context3.sent;
            group = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context3.next = 15;
              break;
            }

            _context3.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context3.abrupt("return", group);

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](4);
            throw Util.formatError(_context3.t0);

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 18]]);
  }));

  return function addUsersToGroup() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will assign a permission to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [body="null body"] - object containing array of permissions
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var assignPermissionsToRole = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        roleUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            accessToken = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null accessToken";
            roleUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null roleUUID";
            body = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : "null body";
            trace = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
            _context4.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/permissions"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context4.next = 10;
            return request(requestOptions);

          case 10:
            response = _context4.sent;

            if (!(response.statusCode === 204)) {
              _context4.next = 15;
              break;
            }

            return _context4.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "assign permission to role failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context4.next = 21;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](4);
            return _context4.abrupt("return", Promise.reject(Util.formatError(_context4.t0)));

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 18]]);
  }));

  return function assignPermissionsToRole() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function assigns roles to a user-group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null groupUUID"] - user-group uuid
 * @param {object} [body="null body"] - object containing an array of roles
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var assignRolesToUserGroup = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        userGroupUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null accessToken";
            userGroupUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null groupUUID";
            body = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : "null body";
            trace = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
            _context5.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(userGroupUUID, "/roles"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context5.next = 10;
            return request(requestOptions);

          case 10:
            response = _context5.sent;

            if (!(response.statusCode === 204)) {
              _context5.next = 15;
              break;
            }

            return _context5.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "assign role to user-group failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context5.next = 21;
            break;

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](4);
            return _context5.abrupt("return", Promise.reject(Util.formatError(_context5.t0)));

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 18]]);
  }));

  return function assignRolesToUserGroup() {
    return _ref5.apply(this, arguments);
  };
}();
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


var assignScopedRoleToUserGroup = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        userGroupUUID,
        roleUUID,
        type,
        data,
        trace,
        MS,
        requestOptions,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            accessToken = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null access token";
            userGroupUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null userGroupUUID";
            roleUUID = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : "null roleUUID";
            type = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : "account";
            data = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : "null resourceUUID";
            trace = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : {};
            _context6.prev = 6;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(userGroupUUID, "/role/scopes"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: {
                role: roleUUID,
                scope: [_defineProperty({}, type, data)]
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context6.next = 12;
            return request(requestOptions);

          case 12:
            response = _context6.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context6.next = 16;
              break;
            }

            _context6.next = 16;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 16:
            return _context6.abrupt("return", {
              "status": "ok"
            });

          case 19:
            _context6.prev = 19;
            _context6.t0 = _context6["catch"](6);
            return _context6.abrupt("return", Promise.reject(Util.formatError(_context6.t0)));

          case 22:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[6, 19]]);
  }));

  return function assignScopedRoleToUserGroup() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function creates a permission
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [body="null body"] - object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */


var createPermission = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            accessToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null accessToken";
            body = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null body";
            trace = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _context7.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/permissions"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context7.next = 9;
            return request(requestOptions);

          case 9:
            response = _context7.sent;
            return _context7.abrupt("return", response);

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](3);
            return _context7.abrupt("return", Promise.reject(Util.formatError(_context7.t0)));

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 13]]);
  }));

  return function createPermission() {
    return _ref8.apply(this, arguments);
  };
}();
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


var createApplicationResourceGroup = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        applicationUUID,
        name,
        description,
        resources,
        trace,
        MS,
        requestOptions,
        response,
        newGroup,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            accessToken = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null accessToken";
            applicationUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null applicationUUID";
            name = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : "";
            description = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : "";
            resources = _args8.length > 4 && _args8[4] !== undefined ? _args8[4] : [];
            trace = _args8.length > 5 && _args8[5] !== undefined ? _args8[5] : {};
            _context8.prev = 6;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/applications/").concat(applicationUUID, "/resource-groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: {
                "name": name,
                "description": description,
                "resources": resources
              },
              json: true,
              resolveWithFullResponse: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context8.next = 12;
            return request(requestOptions);

          case 12:
            response = _context8.sent;
            newGroup = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context8.next = 17;
              break;
            }

            _context8.next = 17;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 17:
            return _context8.abrupt("return", newGroup);

          case 20:
            _context8.prev = 20;
            _context8.t0 = _context8["catch"](6);
            return _context8.abrupt("return", Promise.reject(Util.formatError(_context8.t0)));

          case 23:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[6, 20]]);
  }));

  return function createApplicationResourceGroup() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function creates a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [account_uuid="null account uuid"] - account uuid
 * @param {object} [body="null body"] - user-group object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a user-group data object
 */


var createUserGroup = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        accountUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        newGroup,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null accessToken";
            accountUUID = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null accountUUID";
            body = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : "null body";
            trace = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : {};
            _context9.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/user-groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              json: true,
              resolveWithFullResponse: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context9.next = 10;
            return request(requestOptions);

          case 10:
            response = _context9.sent;
            newGroup = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context9.next = 15;
              break;
            }

            _context9.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context9.abrupt("return", newGroup);

          case 18:
            _context9.prev = 18;
            _context9.t0 = _context9["catch"](4);
            return _context9.abrupt("return", Promise.reject(Util.formatError(_context9.t0)));

          case 21:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[4, 18]]);
  }));

  return function createUserGroup() {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function creates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {object} [body="null body"] - role definition object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a role data object
 */


var createRole = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var accessToken,
        accountUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        newRole,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            accessToken = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : "null accessToken";
            accountUUID = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : "null accountUUID";
            body = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : "null body";
            trace = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};
            _context10.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/roles"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              json: true,
              resolveWithFullResponse: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context10.next = 10;
            return request(requestOptions);

          case 10:
            response = _context10.sent;
            newRole = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context10.next = 15;
              break;
            }

            _context10.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context10.abrupt("return", newRole);

          case 18:
            _context10.prev = 18;
            _context10.t0 = _context10["catch"](4);
            return _context10.abrupt("return", Promise.reject(Util.formatError(_context10.t0)));

          case 21:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[4, 18]]);
  }));

  return function createRole() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function deactivates a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var deactivateRole = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var accessToken,
        roleUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args11 = arguments;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            accessToken = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : "null accessToken";
            roleUUID = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : "null roleUUID";
            trace = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : {};
            _context11.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/deactivate"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context11.next = 9;
            return request(requestOptions);

          case 9:
            response = _context11.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context11.next = 13;
              break;
            }

            _context11.next = 13;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 13:
            return _context11.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context11.prev = 16;
            _context11.t0 = _context11["catch"](3);
            return _context11.abrupt("return", Promise.reject(Util.formatError(_context11.t0)));

          case 19:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[3, 16]]);
  }));

  return function deactivateRole() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function deletes a permission from a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var deletePermissionFromRole = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var accessToken,
        roleUUID,
        permissionUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            accessToken = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : "null accessToken";
            roleUUID = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : "null roleUUID";
            permissionUUID = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : "null permissionUUID";
            trace = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : {};
            _context12.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/permissions/").concat(permissionUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context12.next = 10;
            return request(requestOptions);

          case 10:
            response = _context12.sent;

            if (!(response.statusCode === 204)) {
              _context12.next = 15;
              break;
            }

            return _context12.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete permission from role failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context12.next = 21;
            break;

          case 18:
            _context12.prev = 18;
            _context12.t0 = _context12["catch"](4);
            return _context12.abrupt("return", Promise.reject(Util.formatError(_context12.t0)));

          case 21:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[4, 18]]);
  }));

  return function deletePermissionFromRole() {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function deletes a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var deleteRole = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var accessToken,
        roleUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args13 = arguments;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            accessToken = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : "null accessToken";
            roleUUID = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : "null roleUUID";
            trace = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : {};
            _context13.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/roles/").concat(roleUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context13.next = 9;
            return request(requestOptions);

          case 9:
            response = _context13.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context13.next = 13;
              break;
            }

            _context13.next = 13;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 13:
            return _context13.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context13.prev = 16;
            _context13.t0 = _context13["catch"](3);
            return _context13.abrupt("return", Promise.reject(Util.formatError(_context13.t0)));

          case 19:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[3, 16]]);
  }));

  return function deleteRole() {
    return _ref14.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function deletes a role from a user-group.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var deleteRoleFromUserGroup = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var accessToken,
        userGroupUUID,
        roleUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args14 = arguments;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            accessToken = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : "null accessToken";
            userGroupUUID = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : "null userGroupUUID";
            roleUUID = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : "null roleUUID";
            trace = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : {};
            _context14.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/user-groups/").concat(userGroupUUID, "/roles/").concat(roleUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context14.next = 10;
            return request(requestOptions);

          case 10:
            response = _context14.sent;

            if (!(response.statusCode === 204)) {
              _context14.next = 15;
              break;
            }

            return _context14.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete role from user-group failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context14.next = 21;
            break;

          case 18:
            _context14.prev = 18;
            _context14.t0 = _context14["catch"](4);
            return _context14.abrupt("return", Promise.reject(Util.formatError(_context14.t0)));

          case 21:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[4, 18]]);
  }));

  return function deleteRoleFromUserGroup() {
    return _ref15.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns an accounts default user-groups
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise} - promise resolving to object containing default admin and user group uuids.
 */


var getAccountDefaultGroups = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var accessToken,
        accountUUID,
        trace,
        MS,
        requestOptions,
        retObj,
        response,
        _args15 = arguments;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            accessToken = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : "null access token";
            accountUUID = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : "null account uuid";
            trace = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : {};
            _context15.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/user-groups"),
              qs: {
                default: "true"
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            retObj = {
              "admin": "",
              "user": ""
            };
            _context15.next = 10;
            return request(requestOptions);

          case 10:
            response = _context15.sent;
            response.items.forEach(function (item) {
              if (item.hasOwnProperty("type") && item.hasOwnProperty("uuid")) {
                if (item.type === "admin") {
                  retObj.admin = item.uuid;
                } else if (item.type === "user") {
                  retObj.user = item.uuid;
                }
              }
            }); // if we have no admin or user value in retObj, throw an error

            if (!(retObj.admin.length === 0 || retObj.user.length === 0)) {
              _context15.next = 14;
              break;
            }

            throw {
              "code": 500,
              "message": "missing admin or user UUID in account default group",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": []
            };

          case 14:
            return _context15.abrupt("return", retObj);

          case 17:
            _context15.prev = 17;
            _context15.t0 = _context15["catch"](3);
            return _context15.abrupt("return", Promise.reject(Util.formatError(_context15.t0)));

          case 20:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[3, 17]]);
  }));

  return function getAccountDefaultGroups() {
    return _ref16.apply(this, arguments);
  };
}();
/**
 * @description This function returns an oAuth client application default resource groups
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [applicationUUID="null applicationUUID"] - oauth2 client application uuid
 * @param {string} [type="user"] - optional type ["user", "admin", "forbidden"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - promise resolving to object containing default resource groups.
 */


var getApplicationDefaultResourceGroups = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
    var accessToken,
        applicationUUID,
        type,
        trace,
        MS,
        requestOptions,
        response,
        _args16 = arguments;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            accessToken = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : "null accessToken";
            applicationUUID = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : "null applicationUUID";
            type = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : "user";
            trace = _args16.length > 3 && _args16[3] !== undefined ? _args16[3] : {};
            _context16.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/applications/").concat(applicationUUID, "/resource-groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              qs: {
                "default": "true"
              },
              json: true
            };

            if (typeof type === "string") {
              requestOptions.qs.type = type;
            }

            Util.addRequestTrace(requestOptions, trace);
            _context16.next = 11;
            return request(requestOptions);

          case 11:
            response = _context16.sent;
            return _context16.abrupt("return", response);

          case 15:
            _context16.prev = 15;
            _context16.t0 = _context16["catch"](4);
            throw Util.formatError(_context16.t0);

          case 18:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[4, 15]]);
  }));

  return function getApplicationDefaultResourceGroups() {
    return _ref17.apply(this, arguments);
  };
}();
/**
 * @description This function returns an oAuth client application default user groups
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [applicationUUID="null applicationUUID"] - oauth2 client application uuid
 * @param {string} [type="user"] - optional type ["user", "admin", "forbidden"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - promise resolving to object containing default resource groups.
 */


var getApplicationDefaultUserGroups = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var accessToken,
        applicationUUID,
        type,
        trace,
        MS,
        requestOptions,
        response,
        _args17 = arguments;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            accessToken = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : "null accessToken";
            applicationUUID = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : "null applicationUUID";
            type = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : "user";
            trace = _args17.length > 3 && _args17[3] !== undefined ? _args17[3] : {};
            _context17.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/applications/").concat(applicationUUID, "/user-groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              qs: {
                "default": "true"
              },
              json: true
            };

            if (typeof type === "string") {
              requestOptions.qs.type = type;
            }

            Util.addRequestTrace(requestOptions, trace);
            _context17.next = 11;
            return request(requestOptions);

          case 11:
            response = _context17.sent;
            return _context17.abrupt("return", response);

          case 15:
            _context17.prev = 15;
            _context17.t0 = _context17["catch"](4);
            throw Util.formatError(_context17.t0);

          case 18:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[4, 15]]);
  }));

  return function getApplicationDefaultUserGroups() {
    return _ref18.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will return the users that have permissions for a given resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise<object>} - promise resolving to a users object
 */


var getResourceUsers = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    var accessToken,
        resourceUUID,
        trace,
        groups,
        nextTrace,
        users,
        groupTypeRegex,
        group,
        groupName,
        groupUsers,
        _args18 = arguments;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            accessToken = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : "null accessToken";
            resourceUUID = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : "null resourceUUID";
            trace = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : {};
            _context18.prev = 3;
            _context18.next = 6;
            return listAccessByGroups(accessToken, resourceUUID, trace);

          case 6:
            groups = _context18.sent;
            nextTrace = objectMerge({}, trace);
            users = {};
            groupTypeRegex = /^[r,u,d]{1,3}/;
            _context18.t0 = regeneratorRuntime.keys(groups.items);

          case 11:
            if ((_context18.t1 = _context18.t0()).done) {
              _context18.next = 22;
              break;
            }

            group = _context18.t1.value;
            groupName = groupTypeRegex.exec(groups.items[group].user_group.group_name);
            users[groupName] = [];
            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context18.next = 18;
            return Groups.getGroup(accessToken, groups.items[group].user_group.uuid, {
              "expand": "members",
              "members_limit": 999 //hopefully we don't need pagination here. nh

            }, nextTrace);

          case 18:
            groupUsers = _context18.sent;
            users[groupName] = groupUsers.members.items.map(function (item) {
              return item.uuid;
            });
            _context18.next = 11;
            break;

          case 22:
            return _context18.abrupt("return", users);

          case 25:
            _context18.prev = 25;
            _context18.t2 = _context18["catch"](3);
            return _context18.abrupt("return", Promise.reject(Util.formatError(_context18.t2)));

          case 28:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[3, 25]]);
  }));

  return function getResourceUsers() {
    return _ref19.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns the uuids for roles required to build resource groups
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {*} [trace={}] - optional microservices lifecycle object
 * @returns {Promise} - promise resolving to roles object
 */


var getResourceGroupRoles = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var accessToken,
        trace,
        retObj,
        rolePromises,
        rawRoles,
        _args19 = arguments;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            accessToken = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : "null access token";
            trace = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : {};
            _context19.prev = 2;
            retObj = {};
            rolePromises = [];
            Object.keys(Util.config.resourceRoleDescriptions).forEach(function (resourceType) {
              rolePromises.push(listRoles(accessToken, 0, // offset
              100, // limit
              {
                "description": Util.config.resourceRoleDescriptions[resourceType]
              }, trace));
            });
            _context19.next = 8;
            return Promise.all(rolePromises);

          case 8:
            rawRoles = _context19.sent;

            /*
            * The following seems weird, convoluted, and brittle because it is.
            * Awaiting resolution of JIRA CCORE-586 for final implimentation.
            * The resource group roles will be present in Starpaas->Admin->Roles for all account admins.
            * Because of this they are written with a human friendly name and description.
            * As such they are complex strings that need to be parsed into a format that can be used by resource groups utility.
            */
            rawRoles.forEach(function (element) {
              element.items.forEach(function (item) {
                var permissionType = item.name.split(" ")[1];

                if (!retObj.hasOwnProperty(permissionType)) {
                  retObj[permissionType] = {};
                }

                var permissions = item.name.split("-")[1].split(",");
                var propName = "";
                permissions.forEach(function (permission) {
                  propName = "".concat(propName).concat(permission.charAt(1));
                });
                retObj[permissionType][propName] = item.uuid;
              });
            });
            return _context19.abrupt("return", retObj);

          case 13:
            _context19.prev = 13;
            _context19.t0 = _context19["catch"](2);
            return _context19.abrupt("return", Promise.reject(Util.formatError(_context19.t0)));

          case 16:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[2, 13]]);
  }));

  return function getResourceGroupRoles() {
    return _ref20.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns a single role by uuid.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a role object
 */


var getRole = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    var accessToken,
        roleUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args20 = arguments;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            accessToken = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : "null accessToken";
            roleUUID = _args20.length > 1 && _args20[1] !== undefined ? _args20[1] : "null roleUUID";
            trace = _args20.length > 2 && _args20[2] !== undefined ? _args20[2] : {};
            _context20.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/roles/").concat(roleUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context20.next = 9;
            return request(requestOptions);

          case 9:
            response = _context20.sent;
            return _context20.abrupt("return", response);

          case 13:
            _context20.prev = 13;
            _context20.t0 = _context20["catch"](3);
            return _context20.abrupt("return", Promise.reject(Util.formatError(_context20.t0)));

          case 16:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[3, 13]]);
  }));

  return function getRole() {
    return _ref21.apply(this, arguments);
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


var listAccessByGroups = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
    var accessToken,
        resourceUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args21 = arguments;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            accessToken = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : "null accessToken";
            resourceUUID = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : "null groupUUID";
            trace = _args21.length > 2 && _args21[2] !== undefined ? _args21[2] : {};
            _context21.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/resources/").concat(resourceUUID, "/user-groups/access"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context21.next = 9;
            return request(requestOptions);

          case 9:
            response = _context21.sent;
            return _context21.abrupt("return", response);

          case 13:
            _context21.prev = 13;
            _context21.t0 = _context21["catch"](3);
            return _context21.abrupt("return", Promise.reject(Util.formatError(_context21.t0)));

          case 16:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[3, 13]]);
  }));

  return function listAccessByGroups() {
    return _ref22.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function lists the permissions associated with a resource
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - resource uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


var listAccessByPermissions = /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
    var accessToken,
        resourceUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args22 = arguments;
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            accessToken = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : "null accessToken";
            resourceUUID = _args22.length > 1 && _args22[1] !== undefined ? _args22[1] : "null groupUUID";
            trace = _args22.length > 2 && _args22[2] !== undefined ? _args22[2] : {};
            _context22.prev = 3;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/resources/").concat(resourceUUID, "/permissions/access"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context22.next = 9;
            return request(requestOptions);

          case 9:
            response = _context22.sent;
            return _context22.abrupt("return", response);

          case 13:
            _context22.prev = 13;
            _context22.t0 = _context22["catch"](3);
            return _context22.abrupt("return", Promise.reject(Util.formatError(_context22.t0)));

          case 16:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, null, [[3, 13]]);
  }));

  return function listAccessByPermissions() {
    return _ref23.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {array} [filters=undefined] - optional filters. currently supports "name"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


var listUserGroupRoles = /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
    var accessToken,
        userGroupUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args23 = arguments;
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            accessToken = _args23.length > 0 && _args23[0] !== undefined ? _args23[0] : "null accessToken";
            userGroupUUID = _args23.length > 1 && _args23[1] !== undefined ? _args23[1] : "null userGroupUUID";
            filters = _args23.length > 2 && _args23[2] !== undefined ? _args23[2] : undefined;
            trace = _args23.length > 3 && _args23[3] !== undefined ? _args23[3] : {};
            _context23.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/user-groups/").concat(userGroupUUID, "/roles"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context23.next = 11;
            return request(requestOptions);

          case 11:
            response = _context23.sent;
            return _context23.abrupt("return", response);

          case 15:
            _context23.prev = 15;
            _context23.t0 = _context23["catch"](4);
            return _context23.abrupt("return", Promise.reject(Util.formatError(_context23.t0)));

          case 18:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, null, [[4, 15]]);
  }));

  return function listUserGroupRoles() {
    return _ref24.apply(this, arguments);
  };
}();
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


var listPermissions = /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
    var accessToken,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args24 = arguments;
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            accessToken = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : "null accessToken";
            offset = _args24.length > 1 && _args24[1] !== undefined ? _args24[1] : "0";
            limit = _args24.length > 2 && _args24[2] !== undefined ? _args24[2] : "10";
            filters = _args24.length > 3 && _args24[3] !== undefined ? _args24[3] : undefined;
            trace = _args24.length > 4 && _args24[4] !== undefined ? _args24[4] : {};
            _context24.prev = 5;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/permissions"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context24.next = 12;
            return request(requestOptions);

          case 12:
            response = _context24.sent;
            return _context24.abrupt("return", response);

          case 16:
            _context24.prev = 16;
            _context24.t0 = _context24["catch"](5);
            return _context24.abrupt("return", Promise.reject(Util.formatError(_context24.t0)));

          case 19:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[5, 16]]);
  }));

  return function listPermissions() {
    return _ref25.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function lists roles a permission is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [permissionUUID="null permissionUUID"] - permission uuid
 * @param {array} [filters=undefined] - optional filters. currently supports "name"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


var listPermissionRoles = /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
    var accessToken,
        permissionUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args25 = arguments;
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            accessToken = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : "null accessToken";
            permissionUUID = _args25.length > 1 && _args25[1] !== undefined ? _args25[1] : "null permissionUUID";
            filters = _args25.length > 2 && _args25[2] !== undefined ? _args25[2] : undefined;
            trace = _args25.length > 3 && _args25[3] !== undefined ? _args25[3] : {};
            _context25.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/permissions/").concat(permissionUUID, "/roles"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context25.next = 11;
            return request(requestOptions);

          case 11:
            response = _context25.sent;
            return _context25.abrupt("return", response);

          case 15:
            _context25.prev = 15;
            _context25.t0 = _context25["catch"](4);
            return _context25.abrupt("return", Promise.reject(Util.formatError(_context25.t0)));

          case 18:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[4, 15]]);
  }));

  return function listPermissionRoles() {
    return _ref26.apply(this, arguments);
  };
}();
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


var listRoles = /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
    var accessToken,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args26 = arguments;
    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            accessToken = _args26.length > 0 && _args26[0] !== undefined ? _args26[0] : "null accessToken";
            offset = _args26.length > 1 && _args26[1] !== undefined ? _args26[1] : "0";
            limit = _args26.length > 2 && _args26[2] !== undefined ? _args26[2] : "10";
            filters = _args26.length > 3 && _args26[3] !== undefined ? _args26[3] : undefined;
            trace = _args26.length > 4 && _args26[4] !== undefined ? _args26[4] : {};
            _context26.prev = 5;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/roles"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context26.next = 12;
            return request(requestOptions);

          case 12:
            response = _context26.sent;
            return _context26.abrupt("return", response);

          case 16:
            _context26.prev = 16;
            _context26.t0 = _context26["catch"](5);
            return _context26.abrupt("return", Promise.reject(Util.formatError(_context26.t0)));

          case 19:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, null, [[5, 16]]);
  }));

  return function listRoles() {
    return _ref27.apply(this, arguments);
  };
}();
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


var listRolesForUser = /*#__PURE__*/function () {
  var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
    var accessToken,
        user_uuid,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args27 = arguments;
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            accessToken = _args27.length > 0 && _args27[0] !== undefined ? _args27[0] : "null accessToken";
            user_uuid = _args27.length > 1 && _args27[1] !== undefined ? _args27[1] : "null user_uuid";
            offset = _args27.length > 2 && _args27[2] !== undefined ? _args27[2] : "0";
            limit = _args27.length > 3 && _args27[3] !== undefined ? _args27[3] : "10";
            filters = _args27.length > 4 && _args27[4] !== undefined ? _args27[4] : undefined;
            trace = _args27.length > 5 && _args27[5] !== undefined ? _args27[5] : {};
            _context27.prev = 6;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(user_uuid, "/roles"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context27.next = 13;
            return request(requestOptions);

          case 13:
            response = _context27.sent;
            return _context27.abrupt("return", response);

          case 17:
            _context27.prev = 17;
            _context27.t0 = _context27["catch"](6);
            return _context27.abrupt("return", Promise.reject(Util.formatError(_context27.t0)));

          case 20:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, null, [[6, 17]]);
  }));

  return function listRolesForUser() {
    return _ref28.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function lists user groups a role is assigned to.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


var listRoleUserGroups = /*#__PURE__*/function () {
  var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28() {
    var accessToken,
        roleUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args28 = arguments;
    return regeneratorRuntime.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            accessToken = _args28.length > 0 && _args28[0] !== undefined ? _args28[0] : "null accessToken";
            roleUUID = _args28.length > 1 && _args28[1] !== undefined ? _args28[1] : "null roleUUID";
            filters = _args28.length > 2 && _args28[2] !== undefined ? _args28[2] : undefined;
            trace = _args28.length > 3 && _args28[3] !== undefined ? _args28[3] : {};
            _context28.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/user-groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context28.next = 11;
            return request(requestOptions);

          case 11:
            response = _context28.sent;
            return _context28.abrupt("return", response);

          case 15:
            _context28.prev = 15;
            _context28.t0 = _context28["catch"](4);
            return _context28.abrupt("return", Promise.reject(Util.formatError(_context28.t0)));

          case 18:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, null, [[4, 15]]);
  }));

  return function listRoleUserGroups() {
    return _ref29.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function lists permissions assigned to a role.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID="null roleUUID"] - role uuid
 * @param {array} [filters=undefined] - array of filter query parameters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of user groups
 */


var listRolePermissions = /*#__PURE__*/function () {
  var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
    var accessToken,
        roleUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args29 = arguments;
    return regeneratorRuntime.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            accessToken = _args29.length > 0 && _args29[0] !== undefined ? _args29[0] : "null accessToken";
            roleUUID = _args29.length > 1 && _args29[1] !== undefined ? _args29[1] : "null roleUUID";
            filters = _args29.length > 2 && _args29[2] !== undefined ? _args29[2] : undefined;
            trace = _args29.length > 3 && _args29[3] !== undefined ? _args29[3] : {};
            _context29.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/permissions"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context29.next = 11;
            return request(requestOptions);

          case 11:
            response = _context29.sent;
            return _context29.abrupt("return", response);

          case 15:
            _context29.prev = 15;
            _context29.t0 = _context29["catch"](4);
            return _context29.abrupt("return", Promise.reject(Util.formatError(_context29.t0)));

          case 18:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, null, [[4, 15]]);
  }));

  return function listRolePermissions() {
    return _ref30.apply(this, arguments);
  };
}();
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


var listUserGroups = /*#__PURE__*/function () {
  var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
    var accessToken,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args30 = arguments;
    return regeneratorRuntime.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            accessToken = _args30.length > 0 && _args30[0] !== undefined ? _args30[0] : "null accessToken";
            offset = _args30.length > 1 && _args30[1] !== undefined ? _args30[1] : "0";
            limit = _args30.length > 2 && _args30[2] !== undefined ? _args30[2] : "10";
            filters = _args30.length > 3 && _args30[3] !== undefined ? _args30[3] : undefined;
            trace = _args30.length > 4 && _args30[4] !== undefined ? _args30[4] : {};
            _context30.prev = 5;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/user-groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
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

            _context30.next = 12;
            return request(requestOptions);

          case 12:
            response = _context30.sent;
            return _context30.abrupt("return", response);

          case 16:
            _context30.prev = 16;
            _context30.t0 = _context30["catch"](5);
            return _context30.abrupt("return", Promise.reject(Util.formatError(_context30.t0)));

          case 19:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, null, [[5, 16]]);
  }));

  return function listUserGroups() {
    return _ref31.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function modifies a role
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [roleUUID = "null roleUUID"] - uuid of role being modified
 * @param {object} [body="null body"] - object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a permission data object
 */


var modifyRole = /*#__PURE__*/function () {
  var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
    var accessToken,
        roleUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        role,
        _args31 = arguments;
    return regeneratorRuntime.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            accessToken = _args31.length > 0 && _args31[0] !== undefined ? _args31[0] : "null accessToken";
            roleUUID = _args31.length > 1 && _args31[1] !== undefined ? _args31[1] : "null roleUUID";
            body = _args31.length > 2 && _args31[2] !== undefined ? _args31[2] : "null body";
            trace = _args31.length > 3 && _args31[3] !== undefined ? _args31[3] : {};
            _context31.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/roles/").concat(roleUUID, "/modify"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              json: true,
              resolveWithFullResponse: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context31.next = 10;
            return request(requestOptions);

          case 10:
            response = _context31.sent;
            role = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context31.next = 15;
              break;
            }

            _context31.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context31.abrupt("return", role);

          case 18:
            _context31.prev = 18;
            _context31.t0 = _context31["catch"](4);
            return _context31.abrupt("return", Promise.reject(Util.formatError(_context31.t0)));

          case 21:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31, null, [[4, 18]]);
  }));

  return function modifyRole() {
    return _ref32.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This method will change the user-group name and/or description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUUID="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


var modifyUserGroup = /*#__PURE__*/function () {
  var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
    var accessToken,
        groupUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        userGroup,
        _args32 = arguments;
    return regeneratorRuntime.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            accessToken = _args32.length > 0 && _args32[0] !== undefined ? _args32[0] : "null accessToken";
            groupUUID = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : "null groupUUID";
            body = _args32.length > 2 && _args32[2] !== undefined ? _args32[2] : "null body";
            trace = _args32.length > 3 && _args32[3] !== undefined ? _args32[3] : {};
            _context32.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(groupUUID, "/modify"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context32.next = 10;
            return request(requestOptions);

          case 10:
            response = _context32.sent;
            userGroup = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context32.next = 15;
              break;
            }

            _context32.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context32.abrupt("return", userGroup);

          case 18:
            _context32.prev = 18;
            _context32.t0 = _context32["catch"](4);
            return _context32.abrupt("return", Promise.reject(Util.formatError(_context32.t0)));

          case 21:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32, null, [[4, 18]]);
  }));

  return function modifyUserGroup() {
    return _ref33.apply(this, arguments);
  };
}();
/**
 *
 * @description This function removes resources from a resource group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [resourceGroup="null resourceGroup"] - uuide of resource group to modify
 * @param {array} [resources="null resources"] - array of resource uuids to add to group
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var removeResourceFromGroup = /*#__PURE__*/function () {
  var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33() {
    var accessToken,
        resourceGroup,
        resources,
        trace,
        MS,
        requestOptions,
        response,
        _args33 = arguments;
    return regeneratorRuntime.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            accessToken = _args33.length > 0 && _args33[0] !== undefined ? _args33[0] : "null accessToken";
            resourceGroup = _args33.length > 1 && _args33[1] !== undefined ? _args33[1] : "null resourceGroup";
            resources = _args33.length > 2 && _args33[2] !== undefined ? _args33[2] : "null resources";
            trace = _args33.length > 3 && _args33[3] !== undefined ? _args33[3] : {};
            _context33.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/resource-groups/").concat(resourceGroup, "/resources/remove"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: {
                "resources": resources
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context33.next = 10;
            return request(requestOptions);

          case 10:
            response = _context33.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context33.next = 14;
              break;
            }

            _context33.next = 14;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 14:
            return _context33.abrupt("return", {
              status: "ok"
            });

          case 17:
            _context33.prev = 17;
            _context33.t0 = _context33["catch"](4);
            return _context33.abrupt("return", Promise.reject(Util.formatError(_context33.t0)));

          case 20:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33, null, [[4, 17]]);
  }));

  return function removeResourceFromGroup() {
    return _ref34.apply(this, arguments);
  };
}();
/**
 * @description This function removes users from a user group
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userGroupUUID="null userGroupUUID"] - user group uuid
 * @param {array} [users="null members"] - array of user uuids
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - Promise resolving to the updated user group
 */


var removeUsersFromGroup = /*#__PURE__*/function () {
  var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34() {
    var accessToken,
        userGroupUUID,
        users,
        trace,
        MS,
        requestOptions,
        response,
        group,
        _args34 = arguments;
    return regeneratorRuntime.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            accessToken = _args34.length > 0 && _args34[0] !== undefined ? _args34[0] : "null accessToken";
            userGroupUUID = _args34.length > 1 && _args34[1] !== undefined ? _args34[1] : "null userGroupUUID";
            users = _args34.length > 2 && _args34[2] !== undefined ? _args34[2] : "null users";
            trace = _args34.length > 3 && _args34[3] !== undefined ? _args34[3] : {};
            _context34.prev = 4;
            MS = Util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(userGroupUUID, "/users/remove"),
              body: {
                "users": users
              },
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context34.next = 10;
            return request(requestOptions);

          case 10:
            response = _context34.sent;
            group = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context34.next = 15;
              break;
            }

            _context34.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context34.abrupt("return", group);

          case 18:
            _context34.prev = 18;
            _context34.t0 = _context34["catch"](4);
            throw Util.formatError(_context34.t0);

          case 21:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34, null, [[4, 18]]);
  }));

  return function removeUsersFromGroup() {
    return _ref35.apply(this, arguments);
  };
}();

module.exports = {
  activateRole: activateRole,
  addResourcesToGroup: addResourcesToGroup,
  addUsersToGroup: addUsersToGroup,
  assignPermissionsToRole: assignPermissionsToRole,
  assignRolesToUserGroup: assignRolesToUserGroup,
  assignScopedRoleToUserGroup: assignScopedRoleToUserGroup,
  createApplicationResourceGroup: createApplicationResourceGroup,
  createPermission: createPermission,
  createUserGroup: createUserGroup,
  createRole: createRole,
  deactivateRole: deactivateRole,
  deletePermissionFromRole: deletePermissionFromRole,
  deleteRole: deleteRole,
  deleteRoleFromUserGroup: deleteRoleFromUserGroup,
  getAccountDefaultGroups: getAccountDefaultGroups,
  getApplicationDefaultResourceGroups: getApplicationDefaultResourceGroups,
  getApplicationDefaultUserGroups: getApplicationDefaultUserGroups,
  getResourceUsers: getResourceUsers,
  getResourceGroupRoles: getResourceGroupRoles,
  getRole: getRole,
  listAccessByGroups: listAccessByGroups,
  listAccessByPermissions: listAccessByPermissions,
  listUserGroupRoles: listUserGroupRoles,
  listPermissions: listPermissions,
  listPermissionRoles: listPermissionRoles,
  listRoleUserGroups: listRoleUserGroups,
  listRolePermissions: listRolePermissions,
  listRoles: listRoles,
  listRolesForUser: listRolesForUser,
  listUserGroups: listUserGroups,
  modifyRole: modifyRole,
  modifyUserGroup: modifyUserGroup,
  removeResourceFromGroup: removeResourceFromGroup,
  removeUsersFromGroup: removeUsersFromGroup
};