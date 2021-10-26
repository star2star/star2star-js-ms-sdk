/*global module require */
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var request = require("request-promise");
/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {object} [body="null body"] - JSON object containing new user info
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var createIdentity = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        accountUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        identity,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null accessToken";
            accountUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null accountUUID";
            body = _args.length > 2 && _args[2] !== undefined ? _args[2] : "null body";
            trace = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            _context.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/identities"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              body: body,
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 10;
            return request(requestOptions);

          case 10:
            response = _context.sent;
            identity = response.body; // update returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context.abrupt("return", identity);

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](4);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 18]]);
  }));

  return function createIdentity() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will allow you to modify all details of identity except account_uuid, username and external_id, password and provider.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var modifyIdentity = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        userUuid,
        body,
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
            userUuid = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null userUuid";
            body = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "null body";
            trace = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            _context2.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/identities/").concat(userUuid, "/modify"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              body: body,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 10;
            return request(requestOptions);

          case 10:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 14]]);
  }));

  return function modifyIdentity() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function updates properties of an identity
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {object} [body="null body"] - property body
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise} - return a promise containing the updataded idenity
 */


var modifyIdentityProps = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        userUuid,
        body,
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
            userUuid = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null userUuid";
            body = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "null body";
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/identities/").concat(userUuid, "/properties/modify"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              body: body,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 10;
            return request(requestOptions);

          case 10:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](4);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 14]]);
  }));

  return function modifyIdentityProps() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will deactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an status data object
 */


var deactivateIdentity = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        userUuid,
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
            userUuid = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null userUuid";
            trace = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.prev = 3;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/identities/").concat(userUuid, "/deactivate"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 9;
            return request(requestOptions);

          case 9:
            response = _context4.sent;

            if (!(response.statusCode === 204)) {
              _context4.next = 14;
              break;
            }

            return _context4.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "deactivate identity failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](3);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 17]]);
  }));

  return function deactivateIdentity() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will reactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an status data object
 */


var reactivateIdentity = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        userUuid,
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
            userUuid = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null userUuid";
            trace = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            _context5.prev = 3;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/identities/").concat(userUuid, "/reactivate"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 9;
            return request(requestOptions);

          case 9:
            response = _context5.sent;

            if (!(response.statusCode === 204)) {
              _context5.next = 14;
              break;
            }

            return _context5.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "reactivate identity failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context5.next = 20;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", Promise.reject(util.formatError(_context5.t0)));

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 17]]);
  }));

  return function reactivateIdentity() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will add aliases to an identity
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {object} [body="null body"] - object containing any combination of email, nickname, or sms alias assignments.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */


var createAlias = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        userUuid,
        body,
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
            userUuid = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null user uuid";
            body = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : "null body";
            trace = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {};
            _context6.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/identities/").concat(userUuid, "/aliases"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              body: body,
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace); //Returning "ok" here as response object does not contain alias.

            _context6.next = 10;
            return request(requestOptions);

          case 10:
            response = _context6.sent;

            if (!(response.statusCode === 201)) {
              _context6.next = 15;
              break;
            }

            return _context6.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "create alias failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context6.next = 21;
            break;

          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6["catch"](4);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 21:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 18]]);
  }));

  return function createAlias() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {string} [did="null DID"] - sms number to associate with the user
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */


var updateAliasWithDID = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        userUuid,
        did,
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
            userUuid = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null user uuid";
            did = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "null DID";
            trace = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : {};
            _context7.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/identities/").concat(userUuid, "/aliases/").concat(did),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context7.next = 10;
            return request(requestOptions);

          case 10:
            response = _context7.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context7.next = 14;
              break;
            }

            _context7.next = 14;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 14:
            return _context7.abrupt("return", {
              "status": "ok"
            });

          case 17:
            _context7.prev = 17;
            _context7.t0 = _context7["catch"](4);
            return _context7.abrupt("return", Promise.reject(util.formatError(_context7.t0)));

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[4, 17]]);
  }));

  return function updateAliasWithDID() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in and delete the user object matching the user_uuid submitted.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUuid="null uuid"] - uuid for a star2star user
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteIdentity = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        userUuid,
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
            userUuid = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null uuid";
            trace = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            _context8.prev = 3;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/identities/").concat(userUuid),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
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
            return _context8.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](3);
            return _context8.abrupt("return", Promise.reject(util.formatError(_context8.t0)));

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 16]]);
  }));

  return function deleteIdentity() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns a single identity object
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null uuid"] - user uuid
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @param {string} [include=undefined] - optional query param -"properties" and "alias" are valid values
 * @returns {Promise} - promise resolving to identity object
 */


var getIdentity = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        userUuid,
        trace,
        include,
        MS,
        requestOptions,
        response,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null accessToken";
            userUuid = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null uuid";
            trace = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            include = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : undefined;
            _context9.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/identities/").concat(userUuid),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            }; // add include query param if defined

            if (include !== undefined) {
              requestOptions.qs = {
                "include": include
              };
            }

            util.addRequestTrace(requestOptions, trace);
            _context9.next = 11;
            return request(requestOptions);

          case 11:
            response = _context9.sent;
            return _context9.abrupt("return", response);

          case 15:
            _context9.prev = 15;
            _context9.t0 = _context9["catch"](4);
            return _context9.abrupt("return", Promise.reject(util.formatError(_context9.t0)));

          case 18:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[4, 15]]);
  }));

  return function getIdentity() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [pwd="null pwd"] - passowrd for that account
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var login = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var accessToken,
        email,
        pwd,
        trace,
        MS,
        requestOptions,
        response,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            accessToken = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : "null access token";
            email = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : "null email";
            pwd = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : "null pwd";
            trace = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};
            _context10.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/users/login"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              body: {
                email: email,
                password: pwd
              },
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

  return function login() {
    return _ref10.apply(this, arguments);
  };
}(); //TODO not seeing this call in Tyk...investigate.

/**
 * @async
 * @description This function will return the identity data for the authenticated user.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var getMyIdentityData = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args11 = arguments;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            accessToken = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : "null access token";
            trace = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : {};
            _context11.prev = 2;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/me"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context11.next = 8;
            return request(requestOptions);

          case 8:
            response = _context11.sent;
            return _context11.abrupt("return", response);

          case 12:
            _context11.prev = 12;
            _context11.t0 = _context11["catch"](2);
            return _context11.abrupt("return", Promise.reject(util.formatError(_context11.t0)));

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[2, 12]]);
  }));

  return function getMyIdentityData() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [user_uuid="null user uuid"] - user uuid to lookup
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var getIdentityDetails = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var accessToken,
        user_uuid,
        trace,
        MS,
        requestOptions,
        response,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            accessToken = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : "null access token";
            user_uuid = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : "null user uuid";
            trace = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
            _context12.prev = 3;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/identities/").concat(user_uuid, "?include=alias&include=properties"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context12.next = 9;
            return request(requestOptions);

          case 9:
            response = _context12.sent;
            return _context12.abrupt("return", response);

          case 13:
            _context12.prev = 13;
            _context12.t0 = _context12["catch"](3);
            return _context12.abrupt("return", Promise.reject(util.formatError(_context12.t0)));

          case 16:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[3, 13]]);
  }));

  return function getIdentityDetails() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will list the identities associated with a given account.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var listIdentitiesByAccount = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var accessToken,
        accountUUID,
        offset,
        limit,
        filters,
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
            accountUUID = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : "null accountUUID";
            offset = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : 0;
            limit = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : 10;
            filters = _args13.length > 4 && _args13[4] !== undefined ? _args13[4] : undefined;
            trace = _args13.length > 5 && _args13[5] !== undefined ? _args13[5] : {};
            _context13.prev = 6;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/accounts/").concat(accountUUID, "/identities"),
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
            } //console.log("REQUEST********",requestOptions);


            _context13.next = 13;
            return request(requestOptions);

          case 13:
            response = _context13.sent;
            return _context13.abrupt("return", response);

          case 17:
            _context13.prev = 17;
            _context13.t0 = _context13["catch"](6);
            return _context13.abrupt("return", Promise.reject(util.formatError(_context13.t0)));

          case 20:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[6, 17]]);
  }));

  return function listIdentitiesByAccount() {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will look up an identity by username.
 * @param {string} [accessToken="null accessToken"]
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var lookupIdentity = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var accessToken,
        offset,
        limit,
        filters,
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
            offset = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : 0;
            limit = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : 10;
            filters = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : undefined;
            trace = _args14.length > 4 && _args14[4] !== undefined ? _args14[4] : {};
            _context14.prev = 5;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/identities"),
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
            } //console.log("REQUEST********",requestOptions);


            _context14.next = 12;
            return request(requestOptions);

          case 12:
            response = _context14.sent;
            return _context14.abrupt("return", response);

          case 16:
            _context14.prev = 16;
            _context14.t0 = _context14["catch"](5);
            return _context14.abrupt("return", Promise.reject(util.formatError(_context14.t0)));

          case 19:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[5, 16]]);
  }));

  return function lookupIdentity() {
    return _ref14.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will update a user's password.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null passwordToken"] - Reset token received via email
 * @param {object} [body="null body"] - object containing email address and new password
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */


var resetPassword = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var accessToken,
        passwordToken,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args15 = arguments;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            accessToken = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : "null access token";
            passwordToken = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : "null passwordToken";
            body = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : "null body";
            trace = _args15.length > 3 && _args15[3] !== undefined ? _args15[3] : {};
            _context15.prev = 4;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/users/password-tokens/").concat(passwordToken),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context15.next = 10;
            return request(requestOptions);

          case 10:
            response = _context15.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context15.next = 14;
              break;
            }

            _context15.next = 14;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 14:
            return _context15.abrupt("return", {
              "status": "ok"
            });

          case 17:
            _context15.prev = 17;
            _context15.t0 = _context15["catch"](4);
            return _context15.abrupt("return", Promise.reject(util.formatError(_context15.t0)));

          case 20:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[4, 17]]);
  }));

  return function resetPassword() {
    return _ref15.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will initiate a request for a password reset token via the user email account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [emailAddress="null emailAddress"] - target email address
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */


var generatePasswordToken = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
    var accessToken,
        emailAddress,
        trace,
        MS,
        requestOptions,
        response,
        _args16 = arguments;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            accessToken = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : "null access token";
            emailAddress = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : "null emailAddress";
            trace = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : {};
            _context16.prev = 3;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/users/password-tokens"),
              body: {
                email: emailAddress
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context16.next = 9;
            return request(requestOptions);

          case 9:
            response = _context16.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context16.next = 13;
              break;
            }

            _context16.next = 13;
            return util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 13:
            return _context16.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context16.prev = 16;
            _context16.t0 = _context16["catch"](3);
            return _context16.abrupt("return", Promise.reject(util.formatError(_context16.t0)));

          case 19:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[3, 16]]);
  }));

  return function generatePasswordToken() {
    return _ref16.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will validate a password reset token received from email.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null password token"] - password reset token received via email
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object confirming the token and target email
 */


var validatePasswordToken = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var accessToken,
        password_token,
        trace,
        MS,
        requestOptions,
        response,
        _args17 = arguments;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            accessToken = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : "null access token";
            password_token = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : "null password token";
            trace = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : {};
            _context17.prev = 3;
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/password-tokens/").concat(password_token),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context17.next = 9;
            return request(requestOptions);

          case 9:
            response = _context17.sent;
            return _context17.abrupt("return", response);

          case 13:
            _context17.prev = 13;
            _context17.t0 = _context17["catch"](3);
            return _context17.abrupt("return", Promise.reject(util.formatError(_context17.t0)));

          case 16:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[3, 13]]);
  }));

  return function validatePasswordToken() {
    return _ref17.apply(this, arguments);
  };
}();

module.exports = {
  createAlias: createAlias,
  createIdentity: createIdentity,
  modifyIdentity: modifyIdentity,
  modifyIdentityProps: modifyIdentityProps,
  reactivateIdentity: reactivateIdentity,
  deactivateIdentity: deactivateIdentity,
  updateAliasWithDID: updateAliasWithDID,
  deleteIdentity: deleteIdentity,
  login: login,
  getMyIdentityData: getMyIdentityData,
  listIdentitiesByAccount: listIdentitiesByAccount,
  lookupIdentity: lookupIdentity,
  getIdentity: getIdentity,
  getIdentityDetails: getIdentityDetails,
  generatePasswordToken: generatePasswordToken,
  resetPassword: resetPassword,
  validatePasswordToken: validatePasswordToken
};