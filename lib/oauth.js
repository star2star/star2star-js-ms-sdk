/*global module require */
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("regenerator-runtime/runtime.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Util = require("./utilities");

var request = require("request-promise");

var v4 = require("uuid");
/**
 * @async 
 * @description This function creates a client for a provided user uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [name="null name"] - client name
 * @param {string} [description="null description"] - client description
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise resolving to a client object
 */


var createClientApp = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        userUUID,
        name,
        description,
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
            userUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null userUUID";
            name = _args.length > 2 && _args[2] !== undefined ? _args[2] : "null name";
            description = _args.length > 3 && _args[3] !== undefined ? _args[3] : "null description";
            trace = _args.length > 4 && _args[4] !== undefined ? _args[4] : {};
            _context.prev = 5;
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/clients"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: {
                name: name,
                description: description,
                application_type: "connect",
                grant_types: ["client_credentials"],
                app_user: userUUID
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context.next = 11;
            return request(requestOptions);

          case 11:
            response = _context.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 15:
            return _context.abrupt("return", response.body);

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](5);
            throw Util.formatError(_context.t0);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 18]]);
  }));

  return function createClientApp() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns a Basic token from a client public ID and secret
 * @param {string} [publicID="null publicID"]
 * @param {string} [secret="null secret"]
 * @returns {string} - base64 encoded Basic token
 */


var generateBasicToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var publicID,
        secret,
        basicToken,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            publicID = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null publicID";
            secret = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null secret";
            _context2.prev = 2;
            basicToken = undefined;
            basicToken = Buffer.from("".concat(publicID, ":").concat(secret)).toString("base64");

            if (basicToken) {
              _context2.next = 9;
              break;
            }

            throw {
              "code": 500,
              "message": "base64 encoding failed"
            };

          case 9:
            return _context2.abrupt("return", basicToken);

          case 10:
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", Promise.reject(Util.formatError(_context2.t0)));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 12]]);
  }));

  return function generateBasicToken() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the oauth microservice with the credentials and
 * outh key and basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [email="null email"] - email address for a star2star account
 * @param {string} [pwd="null pwd"] - password for that account
 * @param {string} [scope="default"] - access token scopes
 * @param {string} [deviceId = undefined] - unique identifier
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */


var getAccessToken = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var oauthToken,
        email,
        pwd,
        scope,
        deviceId,
        trace,
        MS,
        VERSION,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            oauthToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null oauth token";
            email = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null email";
            pwd = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "null pwd";
            scope = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : "default";
            deviceId = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : v4();
            trace = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : {};
            _context3.prev = 6;
            MS = Util.getAuthHost();
            VERSION = Util.getVersion();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/token"),
              headers: {
                Authorization: "Basic ".concat(oauthToken),
                "x-api-version": "".concat(VERSION),
                "x-device-id": deviceId,
                "Content-type": "application/x-www-form-urlencoded"
              },
              form: {
                grant_type: "password",
                scope: scope,
                email: email,
                password: pwd
              },
              json: true // resolveWithFullResponse: true

            };
            Util.addRequestTrace(requestOptions, trace);
            _context3.next = 13;
            return request(requestOptions);

          case 13:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](6);
            return _context3.abrupt("return", Promise.reject(Util.formatError(_context3.t0)));

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 17]]);
  }));

  return function getAccessToken() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the oauth microservice with the basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */


var getClientToken = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var oauthToken,
        trace,
        MS,
        VERSION,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            oauthToken = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null oauth token";
            trace = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            _context4.prev = 2;
            MS = Util.getAuthHost();
            VERSION = Util.getVersion();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/token"),
              headers: {
                Authorization: "Basic ".concat(oauthToken),
                "x-api-version": "".concat(VERSION),
                "Content-type": "application/x-www-form-urlencoded"
              },
              form: {
                grant_type: "client_credentials",
                scope: "default"
              },
              json: true // resolveWithFullResponse: true

            };
            Util.addRequestTrace(requestOptions, trace);
            response = request(requestOptions);
            return _context4.abrupt("return", response);

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](2);
            return _context4.abrupt("return", Promise.reject(Util.formatError(_context4.t0)));

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 11]]);
  }));

  return function getClientToken() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will invalidate an access token
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [token="null token"] - access token needing validation
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise thatdoes stuff
 */


var invalidateToken = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        token,
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
            token = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null token";
            trace = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            _context5.prev = 3;
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/invalidate/access"),
              body: {
                access_token: token
              },
              resolveWithFullResponse: true,
              json: true,
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              }
            };
            Util.addRequestTrace(requestOptions, trace);
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
              "message": typeof response.body === "string" ? response.body : "invalidate token failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context5.next = 20;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", Promise.reject(Util.formatError(_context5.t0)));

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 17]]);
  }));

  return function invalidateToken() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async 
 * @description This function will return active access tokens based on the filters provided
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - token_type and username or client_id depending on token type
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise resolving to a list of access tokens.
 */


var listClientTokens = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        offset,
        limit,
        filters,
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
            offset = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 0;
            limit = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : 10;
            filters = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : undefined;
            trace = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : {};
            _context6.prev = 5;
            MS = Util.getEndpoint("oauth");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/oauth/tokens"),
              qs: {
                offset: offset,
                limit: limit
              },
              json: true,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              }
            };

            if (filters && _typeof(filters) == "object") {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            Util.addRequestTrace(requestOptions, trace);
            response = request(requestOptions);
            return _context6.abrupt("return", response);

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](5);
            return _context6.abrupt("return", Promise.reject(Util.formatError(_context6.t0)));

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[5, 14]]);
  }));

  return function listClientTokens() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will call the identity microservice to refresh user based on token.
 * @param {string} [oauthKey="null oauth key"] - key for oauth cpaas system
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [refreshToken="null refresh token"] - refresh token for oauth token.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


var refreshAccessToken = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var oauthToken,
        refreshToken,
        trace,
        MS,
        VERSION,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            oauthToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null oauth token";
            refreshToken = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null refresh token";
            trace = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _context7.prev = 3;
            MS = Util.getAuthHost();
            VERSION = Util.getVersion();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/token"),
              headers: {
                "x-api-version": "".concat(VERSION),
                "Content-type": "application/x-www-form-urlencoded"
              },
              form: {
                grant_type: "refresh_token",
                refresh_token: refreshToken
              },
              json: true
            }; // backwards compatibility

            if (!(typeof oauthToken === "string")) {
              _context7.next = 11;
              break;
            }

            requestOptions.headers.Authorization = "Basic ".concat(oauthToken);
            _context7.next = 16;
            break;

          case 11:
            if (!(_typeof(oauthToken) === "object" && typeof oauthToken.clientId === "string")) {
              _context7.next = 15;
              break;
            }

            requestOptions.form.client_id = oauthToken.clientId;
            _context7.next = 16;
            break;

          case 15:
            throw {
              "code": 400,
              "message": "oauth token param missing basic token or client id"
            };

          case 16:
            Util.addRequestTrace(requestOptions, trace);
            response = request(requestOptions);
            return _context7.abrupt("return", response);

          case 21:
            _context7.prev = 21;
            _context7.t0 = _context7["catch"](3);
            throw Util.formatError(_context7.t0);

          case 24:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 21]]);
  }));

  return function refreshAccessToken() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will restrict the client token to specific microservices
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [clientUUID="null clientUUID"] - client uuid (obtained when creating using createClientApp()
 * @param {string} [scope=["default"]] - array of microservices the token should be able to access
 * @param {object} [trace={}] - optional trace headers for debugging.
 * @returns {Promise} - promise resolving to a request status message.
 */


var scopeClientApp = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        clientUUID,
        scope,
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
            clientUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null clientUUID";
            scope = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : ["default"];
            trace = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : {};
            _context8.prev = 4;
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/clients/").concat(clientUUID, "/scopes"),
              body: {
                scope: scope
              },
              resolveWithFullResponse: true,
              json: true,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              }
            };
            Util.addRequestTrace(requestOptions, trace);
            _context8.next = 10;
            return request(requestOptions);

          case 10:
            response = _context8.sent;

            if (!(response.statusCode === 204)) {
              _context8.next = 15;
              break;
            }

            return _context8.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "scope client app failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context8.next = 21;
            break;

          case 18:
            _context8.prev = 18;
            _context8.t0 = _context8["catch"](4);
            return _context8.abrupt("return", Promise.reject(Util.formatError(_context8.t0)));

          case 21:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[4, 18]]);
  }));

  return function scopeClientApp() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function checks if an access token is valid
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [token="null token"] - access token needing validation
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise thatdoes stuff
 */


var validateToken = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        token,
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
            token = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null token";
            trace = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            _context9.prev = 3;
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/oauth/validate/access"),
              body: {
                access_token: token
              },
              resolveWithFullResponse: true,
              json: true,
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              }
            };
            Util.addRequestTrace(requestOptions, trace);
            _context9.next = 9;
            return request(requestOptions);

          case 9:
            response = _context9.sent;

            if (!(response.statusCode === 204)) {
              _context9.next = 14;
              break;
            }

            return _context9.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "validate token failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context9.next = 20;
            break;

          case 17:
            _context9.prev = 17;
            _context9.t0 = _context9["catch"](3);
            return _context9.abrupt("return", Promise.reject(Util.formatError(_context9.t0)));

          case 20:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 17]]);
  }));

  return function validateToken() {
    return _ref9.apply(this, arguments);
  };
}();

module.exports = {
  createClientApp: createClientApp,
  generateBasicToken: generateBasicToken,
  getAccessToken: getAccessToken,
  getClientToken: getClientToken,
  invalidateToken: invalidateToken,
  listClientTokens: listClientTokens,
  refreshAccessToken: refreshAccessToken,
  scopeClientApp: scopeClientApp,
  validateToken: validateToken
};