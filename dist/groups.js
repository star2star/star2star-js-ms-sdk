/* global require module*/
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
var listGroups = function listGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
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
var createGroup = function createGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
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
var getGroup = function getGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups/" + groupUUID,
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(function (filter) {
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
var listGroupMembers = function listGroupMembers() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups/" + groupUUID + "/members",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  if (filters) {
    requestOptions.qs = [];
    Object.keys(filters).forEach(function (filter) {
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
var deleteGroup = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not specified";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 3:
            MS = util.getEndpoint("groups");
            requestOptions = {
              method: "DELETE",
              uri: MS + "/groups/" + groupUUID,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer " + accessToken,
                "x-api-version": "" + util.getVersion()
              },
              resolveWithFullResponse: true,
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            _context.next = 8;
            return new Promise(function (resolve, reject) {
              request(requestOptions).then(function (responseData) {
                responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
              }).catch(function (error) {
                reject(error);
              });
            });

          case 8:
            return _context.abrupt("return", _context.sent);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject(_context.t0));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 11]]);
  }));

  return function deleteGroup() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will add users to a user group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="group uuid not specified"] - data object UUID
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<array>} - Promise resolving to an array of added users
 */
var addMembersToGroup = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "group uuid not specified";
    var members = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 3:
            MS = util.getEndpoint("groups");
            requestOptions = {
              method: "POST",
              uri: MS + "/groups/" + groupUUID + "/members",
              body: members,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer " + accessToken,
                "x-api-version": "" + util.getVersion()
              },
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            // console.log("request options", JSON.stringify(requestOptions));
            _context2.next = 8;
            return request(requestOptions);

          case 8:
            return _context2.abrupt("return", _context2.sent);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 11]]);
  }));

  return function addMembersToGroup() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to remove users from
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
var deleteGroupMembers = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
    var members = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 3:
            MS = util.getEndpoint("groups");
            requestOptions = {
              method: "DELETE",
              uri: MS + "/groups/" + groupUuid + "/members",
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer " + accessToken,
                "x-api-version": "" + util.getVersion()
              },
              body: members,
              resolveWithFullResponse: true,
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            _context3.next = 8;
            return new Promise(function (resolve, reject) {
              request(requestOptions).then(function (responseData) {
                responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
              }).catch(function (error) {
                reject(error);
              });
            });

          case 8:
            return _context3.abrupt("return", _context3.sent);

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", Promise.reject(_context3.t0));

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 11]]);
  }));

  return function deleteGroupMembers() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This method will deactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
var deactivateGroup = function deactivateGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups/" + groupUuid + "/deactivate",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
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
var reactivateGroup = function reactivateGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "POST",
    uri: MS + "/groups/" + groupUuid + "/reactivate",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
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
var modifyGroup = function modifyGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var groupUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null groupUuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("groups");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/groups/" + groupUuid,
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion()
    },
    body: body,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

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