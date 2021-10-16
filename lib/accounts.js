/*global module require */
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.concat.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var request = require("request-promise");
/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */


var createRelationship = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null access token";
            body = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null body";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/relationships"),
              body: body,
              resolveWithFullResponse: true,
              json: true,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              }
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 9;
            return request(requestOptions);

          case 9:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 13]]);
  }));

  return function createRelationship() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {number} [offset=0] - optional; return the list starting at a specified index
 * @param {number} [limit=10] - optional; return a specified number of accounts
  * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */


var listAccounts = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        offset,
        limit,
        filters,
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
            offset = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
            limit = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 10;
            filters = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : undefined;
            trace = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : {};
            _context2.prev = 5;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/accounts"),
              qs: {
                offset: offset,
                limit: limit
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            } //console.log("REQUEST_OPTIONS",requestOptions);


            _context2.next = 12;
            return request(requestOptions);

          case 12:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](5);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 16]]);
  }));

  return function listAccounts() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function creates a new account.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [body="null body"] - object containing account details
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an account data object
 */


var createAccount = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        body,
        trace,
        MS,
        requestOptions,
        response,
        newAccount,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null accessToken";
            body = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null body";
            trace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.prev = 3;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/accounts"),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            response = _context3.sent;
            newAccount = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context3.next = 14;
              break;
            }

            _context3.next = 14;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 14:
            return _context3.abrupt("return", newAccount);

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](3);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 17]]);
  }));

  return function createAccount() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will return an account by UUID.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {string} [expand = "identities"] - expand data in response; currently "identities" or "relationship"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var getAccount = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        accountUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            accessToken = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null access token";
            accountUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null account uuid";
            trace = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.prev = 3;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/accounts/").concat(accountUUID),
              qs: {
                expand: "relationships"
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 9;
            return request(requestOptions);

          case 9:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](3);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 13]]);
  }));

  return function getAccount() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will modify an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var modifyAccount = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        accountUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        modifiedAccount,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null access token";
            accountUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null account uuid";
            body = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : "null body";
            trace = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
            _context5.prev = 4;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/accounts/").concat(accountUUID),
              body: body,
              resolveWithFullResponse: true,
              json: true,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              }
            };
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 10;
            return request(requestOptions);

          case 10:
            response = _context5.sent;
            modifiedAccount = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context5.next = 15;
              break;
            }

            _context5.next = 15;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context5.abrupt("return", modifiedAccount);

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](4);
            throw util.formatError(_context5.t0);

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 18]]);
  }));

  return function modifyAccount() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [accountUUID="null account uuid"] - account uuid of the parent
 * @param {number} [offset=0] - what page number you want
 * @param {number} [limit=10] - size of the page or number of records to return
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
//TODO add sort order also


var listAccountRelationships = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        accountUUID,
        offset,
        limit,
        accountType,
        trace,
        MS,
        requestOptions,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            accessToken = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null accessToken";
            accountUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null account uuid";
            offset = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : 0;
            limit = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : 10;
            accountType = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : undefined;
            trace = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : {};
            _context6.prev = 6;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/relationships"),
              qs: {
                expand: "accounts",
                offset: offset,
                limit: limit
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (accountType) {
              requestOptions.qs.account_type = accountType;
            }

            _context6.next = 13;
            return request(requestOptions);

          case 13:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](6);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[6, 17]]);
  }));

  return function listAccountRelationships() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will set an account status to "Active"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var reinstateAccount = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        accountUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            accessToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null access token";
            accountUUID = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null account uuid";
            trace = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _context7.prev = 3;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/reinstate"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context7.next = 9;
            return request(requestOptions);

          case 9:
            response = _context7.sent;

            if (!(response.statusCode === 204)) {
              _context7.next = 14;
              break;
            }

            return _context7.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "reinstate account failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context7.next = 20;
            break;

          case 17:
            _context7.prev = 17;
            _context7.t0 = _context7["catch"](3);
            return _context7.abrupt("return", Promise.reject(util.formatError(_context7.t0)));

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 17]]);
  }));

  return function reinstateAccount() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will set an account status to "Inactive"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var suspendAccount = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        accountUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            accessToken = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null access token";
            accountUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null account uuid";
            trace = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            _context8.prev = 3;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/suspend"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
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

            if (!(response.statusCode === 204)) {
              _context8.next = 14;
              break;
            }

            return _context8.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "suspend account failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context8.next = 20;
            break;

          case 17:
            _context8.prev = 17;
            _context8.t0 = _context8["catch"](3);
            return _context8.abrupt("return", Promise.reject(util.formatError(_context8.t0)));

          case 20:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 17]]);
  }));

  return function suspendAccount() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - uuid of account to delete
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */


var deleteAccount = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        accountUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null access token";
            accountUUID = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null account uuid";
            trace = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            _context9.prev = 3;
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/accounts/").concat(accountUUID),
              resolveWithFullResponse: true,
              json: true,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              }
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
            trace, "deleting");

          case 13:
            return _context9.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context9.prev = 16;
            _context9.t0 = _context9["catch"](3);
            return _context9.abrupt("return", Promise.reject(util.formatError(_context9.t0)));

          case 19:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 16]]);
  }));

  return function deleteAccount() {
    return _ref9.apply(this, arguments);
  };
}();

module.exports = {
  createRelationship: createRelationship,
  createAccount: createAccount,
  deleteAccount: deleteAccount,
  listAccountRelationships: listAccountRelationships,
  listAccounts: listAccounts,
  getAccount: getAccount,
  modifyAccount: modifyAccount,
  reinstateAccount: reinstateAccount,
  suspendAccount: suspendAccount
};