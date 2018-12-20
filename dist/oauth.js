/*global module require */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _nodeLogger = require("./node-logger");

var _nodeLogger2 = _interopRequireDefault(_nodeLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Util = require("./utilities");
var request = require("request-promise");

var logger = new _nodeLogger2.default();
logger.setLevel(Util.getLogLevel());
logger.setPretty(Util.getLogPretty());

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
var createClientApp = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
    var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null name";
    var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null description";
    var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/clients",
              body: {
                name: name,
                description: description,
                application_type: "connect",
                grant_types: ["client_credentials"],
                app_user: userUUID
              },
              json: true,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + Util.getVersion()
              }
            };

            Util.addRequestTrace(requestOptions, trace);
            _context.next = 8;
            return request(requestOptions);

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
var generateBasicToken = function generateBasicToken() {
  var publicID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null publicID";
  var secret = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null secret";

  try {
    var basicToken = undefined;
    basicToken = Buffer.from(publicID + ":" + secret).toString("base64");
    if (!basicToken) {
      throw new Error("base64 encoding failed");
    } else {
      return Promise.resolve(basicToken);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * @async
 * @description This function will call the oauth microservice with the credentials and
 * outh key and basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [email="null email"] - email address for a star2star account
 * @param {string} [pwd="null pwd"] - password for that account
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
var getAccessToken = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
    var email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
    var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null pwd";
    var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var MS, VERSION, requestOptions;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            MS = Util.getAuthHost();
            VERSION = Util.getVersion();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/token",
              headers: {
                Authorization: "Basic " + oauthToken,
                "x-api-version": "" + VERSION,
                "Content-type": "application/x-www-form-urlencoded"
              },
              form: {
                grant_type: "password",
                scope: "message.list",
                email: email,
                password: pwd
              },
              json: true
              // resolveWithFullResponse: true
            };

            Util.addRequestTrace(requestOptions, trace);
            _context2.next = 9;
            return request(requestOptions);

          case 9:
            return _context2.abrupt("return", _context2.sent);

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 12]]);
  }));

  return function getAccessToken() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will call the oauth microservice with the basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
var getClientToken = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
    var trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var MS, VERSION, requestOptions;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            MS = Util.getAuthHost();
            VERSION = Util.getVersion();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/token",
              headers: {
                Authorization: "Basic " + oauthToken,
                "x-api-version": "" + VERSION,
                "Content-type": "application/x-www-form-urlencoded"
              },
              form: {
                grant_type: "client_credentials",
                scope: "default"
              },
              json: true
              // resolveWithFullResponse: true
            };

            Util.addRequestTrace(requestOptions, trace);
            return _context3.abrupt("return", request(requestOptions));

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", Promise.reject(_context3.t0));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 10]]);
  }));

  return function getClientToken() {
    return _ref3.apply(this, arguments);
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
var invalidateToken = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null token";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, requestOptions, response;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            //delay is to ensure clean-up operations work
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/invalidate/access",
              body: {
                access_token: token
              },
              resolveWithFullResponse: true,
              json: true,
              headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + Util.getVersion()
              }
            };

            Util.addRequestTrace(requestOptions, trace);
            _context4.next = 8;
            return request(requestOptions);

          case 8:
            response = _context4.sent;
            return _context4.abrupt("return", response.statusCode === 204 ? Promise.resolve({ status: "ok" }) : Promise.reject({ status: "failed" }));

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", Promise.reject({ status: "failed", "error": _context4.t0 }));

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 12]]);
  }));

  return function invalidateToken() {
    return _ref4.apply(this, arguments);
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
var listClientTokens = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            MS = Util.getAuthHost();
            requestOptions = {
              method: "GET",
              uri: MS + "/oauth/tokens",
              qs: {
                offset: offset,
                limit: limit
              },
              json: true,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + Util.getVersion()
              }
            };

            if (filters && (typeof filters === "undefined" ? "undefined" : _typeof(filters)) == "object") {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }
            Util.addRequestTrace(requestOptions, trace);
            return _context5.abrupt("return", request(requestOptions));

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", Promise.reject(_context5.t0));

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 10]]);
  }));

  return function listClientTokens() {
    return _ref5.apply(this, arguments);
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
var refreshAccessToken = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
    var refreshToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null refresh token";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, VERSION, requestOptions;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            MS = Util.getAuthHost();
            VERSION = Util.getVersion();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/token",
              headers: {
                Authorization: "Basic " + oauthToken,
                "x-api-version": "" + VERSION,
                "Content-type": "application/x-www-form-urlencoded"
              },
              form: {
                grant_type: "refresh_token",
                refresh_token: refreshToken
              },
              json: true
              // resolveWithFullResponse: true
            };

            Util.addRequestTrace(requestOptions, trace);
            _context6.next = 9;
            return request(requestOptions);

          case 9:
            return _context6.abrupt("return", _context6.sent);

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", Promise.reject(_context6.t0));

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[0, 12]]);
  }));

  return function refreshAccessToken() {
    return _ref6.apply(this, arguments);
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
var scopeClientApp = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var clientUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null clientUUID";
    var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["default"];
    var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var MS, requestOptions, response;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/clients/" + clientUUID + "/scopes",
              body: {
                scope: scope
              },
              resolveWithFullResponse: true,
              json: true,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + Util.getVersion()
              }
            };

            Util.addRequestTrace(requestOptions, trace);
            _context7.prev = 3;
            _context7.next = 6;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 6:
            _context7.next = 8;
            return request(requestOptions);

          case 8:
            response = _context7.sent;

            if (!(response.statusCode === 204)) {
              _context7.next = 13;
              break;
            }

            return _context7.abrupt("return", Promise.resolve({ "status": "ok" }));

          case 13:
            return _context7.abrupt("return", Promise.reject({ "status": "failed" }));

          case 14:
            _context7.next = 19;
            break;

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7["catch"](3);
            return _context7.abrupt("return", Promise.reject(_context7.t0));

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[3, 16]]);
  }));

  return function scopeClientApp() {
    return _ref7.apply(this, arguments);
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
var validateToken = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null token";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, requestOptions, response;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, Util.config.msDelay);
            });

          case 3:
            //delay is to ensure clean-up operations work
            MS = Util.getAuthHost();
            requestOptions = {
              method: "POST",
              uri: MS + "/oauth/validate/access",
              body: {
                access_token: token
              },
              resolveWithFullResponse: true,
              json: true,
              headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + Util.getVersion()
              }
            };

            Util.addRequestTrace(requestOptions, trace);
            _context8.next = 8;
            return request(requestOptions);

          case 8:
            response = _context8.sent;
            return _context8.abrupt("return", response.statusCode === 204 ? Promise.resolve({ status: "ok" }) : Promise.reject({ status: "failed" }));

          case 12:
            _context8.prev = 12;
            _context8.t0 = _context8["catch"](0);
            return _context8.abrupt("return", Promise.reject({ status: "failed", "error": _context8.t0 }));

          case 15:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[0, 12]]);
  }));

  return function validateToken() {
    return _ref8.apply(this, arguments);
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