/* global require module*/
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.concat.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");
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


var listGroups = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        offset,
        limit,
        filters,
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
            offset = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
            limit = _args.length > 2 && _args[2] !== undefined ? _args[2] : 10;
            filters = _args.length > 3 && _args[3] !== undefined ? _args[3] : undefined;
            trace = _args.length > 4 && _args[4] !== undefined ? _args[4] : {};
            _context.prev = 5;
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/user-groups"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                offset: offset,
                limit: limit
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter]; //groups moved to auth...ensure backward compatibility

                if (filter === "member_uuid") {
                  requestOptions.qs.user_uuid = filters[filter];
                }
              });
            }

            _context.next = 12;
            return request(requestOptions);

          case 12:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](5);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 16]]);
  }));

  return function listGroups() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will create a new group associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [body="null body"] - object conatining group data
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


var createGroup = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        body,
        trace,
        newBody,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            body = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null body";
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            newBody = {
              "name": body.name,
              "description": body.description
            };
            newBody.users = body.members.map(function (member) {
              return member.uuid;
            });
            MS = util.getEndpoint("auth");
            requestOptions = {
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
            _context2.next = 11;
            return request(requestOptions);

          case 11:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 15]]);
  }));

  return function createGroup() {
    return _ref2.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will ask the cpaas groups service for a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */


var getGroup = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        groupUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null accessToken";
            groupUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null uuid";
            filters = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : undefined;
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/user-groups/").concat(groupUUID),
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
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            } //console.log("****REQUESTOPTS****",requestOptions);


            _context3.next = 11;
            return request(requestOptions);

          case 11:
            response = _context3.sent;

            // ensure backward compatibility now that this has been moved out of Groups microservice
            if (response.hasOwnProperty("users")) {
              response.members = response.users;
            }

            return _context3.abrupt("return", response);

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](4);
            Promise.reject(util.formatError(_context3.t0));

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 16]]);
  }));

  return function getGroup() {
    return _ref3.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will return a list of the members of a group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type", [offset] and [limit] for pagination
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */


var listGroupMembers = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        groupUUID,
        filters,
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
            groupUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null uuid";
            filters = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : undefined;
            trace = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
            _context4.prev = 4;
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/user-groups/").concat(groupUUID, "/users"),
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
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            } //console.log("****REQUESTOPTS****",requestOptions);


            response = request(requestOptions); // ensure backward compatibility now that this has been moved out of Groups microservice

            if (response.hasOwnProperty("users")) {
              response.members = response.users;
            }

            return _context4.abrupt("return", response);

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](4);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 14]]);
  }));

  return function listGroupMembers() {
    return _ref4.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will delete a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="not specified"] - group UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteGroup = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        groupUUID,
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
            groupUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "not specified";
            trace = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            _context5.prev = 3;
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/user-groups/").concat(groupUUID),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 9;
            return request(requestOptions);

          case 9:
            response = _context5.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context5.next = 13;
              break;
            }

            _context5.next = 13;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace, "deleting");

          case 13:
            return _context5.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", Promise.reject(util.formatError(_context5.t0)));

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 16]]);
  }));

  return function deleteGroup() {
    return _ref5.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will add users to a user group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="group uuid not specified"] - data object UUID
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<array>} - Promise resolving to an array of added users
 */


var addMembersToGroup = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        groupUUID,
        members,
        trace,
        newMembers,
        MS,
        requestOptions,
        response,
        group,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            accessToken = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null accessToken";
            groupUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "group uuid not specified";
            members = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : [];
            trace = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {};
            _context6.prev = 4;
            // ensure backward compatibility with groups api consumers
            newMembers = members.map(function (member) {
              return member.hasOwnProperty("uuid") ? member.uuid : undefined;
            });
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(groupUUID, "/users"),
              body: {
                "users": newMembers
              },
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context6.next = 11;
            return request(requestOptions);

          case 11:
            response = _context6.sent;
            group = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context6.next = 16;
              break;
            }

            _context6.next = 16;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 16:
            group.total_members = group.hasOwnProperty("total_members") ? group.total_members + 1 : undefined;
            return _context6.abrupt("return", group);

          case 20:
            _context6.prev = 20;
            _context6.t0 = _context6["catch"](4);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 23:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 20]]);
  }));

  return function addMembersToGroup() {
    return _ref6.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUUID="null groupUUID"] - group to remove users from
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */


var deleteGroupMembers = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        groupUUID,
        members,
        trace,
        newMembers,
        MS,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            accessToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null accessToken";
            groupUUID = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null groupUuid";
            members = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : [];
            trace = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : {};
            _context7.prev = 4;
            // ensure backward compatibility with groups api consumers
            newMembers = members.map(function (member) {
              return member.hasOwnProperty("uuid") ? member.uuid : undefined;
            });
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(groupUUID, "/users/remove"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              body: {
                "users": newMembers
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context7.next = 11;
            return request(requestOptions);

          case 11:
            response = _context7.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context7.next = 15;
              break;
            }

            _context7.next = 15;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context7.abrupt("return", {
              "status": "ok"
            });

          case 18:
            _context7.prev = 18;
            _context7.t0 = _context7["catch"](4);
            return _context7.abrupt("return", Promise.reject(util.formatError(_context7.t0)));

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[4, 18]]);
  }));

  return function deleteGroupMembers() {
    return _ref7.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This method will deactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


var deactivateGroup = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        groupUuid,
        trace,
        MS,
        requestOptions,
        response,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            accessToken = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null accessToken";
            groupUuid = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null groupUuid";
            trace = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            _context8.prev = 3;
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(groupUuid, "/deactivate"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context8.next = 9;
            return request(requestOptions);

          case 9:
            response = _context8.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context8.next = 13;
              break;
            }

            _context8.next = 13;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 13:
            response.resource_status = "complete";
            response.status = "Inactive";
            return _context8.abrupt("return", response);

          case 18:
            _context8.prev = 18;
            _context8.t0 = _context8["catch"](3);
            Promise.reject(util.formatError(_context8.t0));

          case 21:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 18]]);
  }));

  return function deactivateGroup() {
    return _ref8.apply(this, arguments);
  };
}(); // TODO this call needs to be migrated out of groups to auth. CCORE-662

/**
 * @async
 * @description This method will reactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


var reactivateGroup = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        groupUuid,
        trace,
        MS,
        requestOptions,
        response,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null accessToken";
            groupUuid = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null groupUuid";
            trace = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            _context9.prev = 3;
            MS = util.getEndpoint("auth");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/user-groups/").concat(groupUuid, "/reactivate"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context9.next = 9;
            return request(requestOptions);

          case 9:
            response = _context9.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context9.next = 13;
              break;
            }

            _context9.next = 13;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 13:
            response.resource_status = "complete";
            response.status = "Active";
            return _context9.abrupt("return", response);

          case 18:
            _context9.prev = 18;
            _context9.t0 = _context9["catch"](3);
            Promise.reject(util.formatError(_context9.t0));

          case 21:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 18]]);
  }));

  return function reactivateGroup() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This method will change the group name and description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */


var modifyGroup = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var accessToken,
        groupUuid,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            accessToken = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : "null accessToken";
            groupUuid = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : "null groupUuid";
            body = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : "null body";
            trace = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};
            _context10.prev = 4;
            MS = util.getEndpoint("auth");
            requestOptions = {
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
            _context10.next = 10;
            return request(requestOptions);

          case 10:
            response = _context10.sent;
            return _context10.abrupt("return", response);

          case 14:
            _context10.prev = 14;
            _context10.t0 = _context10["catch"](4);
            return _context10.abrupt("return", Promise.reject(util.formatError(_context10.t0)));

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[4, 14]]);
  }));

  return function modifyGroup() {
    return _ref10.apply(this, arguments);
  };
}();

module.exports = {
  addMembersToGroup: addMembersToGroup,
  createGroup: createGroup,
  deactivateGroup: deactivateGroup,
  deleteGroup: deleteGroup,
  deleteGroupMembers: deleteGroupMembers,
  getGroup: getGroup,
  listGroups: listGroups,
  listGroupMembers: listGroupMembers,
  modifyGroup: modifyGroup,
  reactivateGroup: reactivateGroup
};