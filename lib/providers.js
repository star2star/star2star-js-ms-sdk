/* global require module*/
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

var request = require("request-promise");

var util = require("./utilities");
/**
 * @async
 * @description This function will create a token provider for the given user and service
 * @param {string} [clientID="null clientID"] - Star2Star's clientID assigned by third party
 * @param {string} [providerUUID="null providerUUID"] - provider API policy uuid
 * @param {string} [redirectURL="null redirectURL"] - auth code redirect URL
 * @param {string} [userUUID="null userUUID"] - CPaaS user uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<redirect to 3rd party oauth2 api>} - promise resolving to redirect
 */


var authorizeProvider = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var clientID,
        providerUUID,
        redirectURL,
        userUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            clientID = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null clientID";
            providerUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null providerUUID";
            redirectURL = _args.length > 2 && _args[2] !== undefined ? _args[2] : "null redirectURL";
            userUUID = _args.length > 3 && _args[3] !== undefined ? _args[3] : "null userUUID";
            trace = _args.length > 4 && _args[4] !== undefined ? _args[4] : {};
            _context.prev = 5;
            MS = util.getEndpoint("providers");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/providers/").concat(providerUUID, "/oauth/authorize"),
              headers: {},
              // empty object allows us to add the trace headers
              qs: {
                client_id: clientID,
                redirect_url: redirectURL,
                user_uuid: userUUID
              },
              followAllRedirects: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 11;
            return request(requestOptions);

          case 11:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](5);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 15]]);
  }));

  return function authorizeProvider() {
    return _ref.apply(this, arguments);
  };
}();
/**
 *
 * @description This function will redirect the caller to complete oauth2 authorization and redirect the response with access_token to specified URL
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [providerUUID="null providerUUID"] - Oauth2 provider identifier
 * @param {string} [policyUUID = "null policyUUID"] - cpaas provider API policy id used to generate access token
 * @param {string} userUUID - optional cpaas user uuid. only required if the access_token does not belong to the cpaas user
 * @param {string} redirectURL - optional completed request redirect URL
 * @param {string} providerUser - optional 3rd party user name for CPaaS identities with multiple connections for the same provider
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */


var getProviderToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        providerUUID,
        policyUUID,
        userUUID,
        redirectURL,
        providerUser,
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
            providerUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null providerUUID";
            policyUUID = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "null policyUUID";
            userUUID = _args2.length > 3 ? _args2[3] : undefined;
            redirectURL = _args2.length > 4 ? _args2[4] : undefined;
            providerUser = _args2.length > 5 ? _args2[5] : undefined;
            trace = _args2.length > 6 && _args2[6] !== undefined ? _args2[6] : {};
            _context2.prev = 7;
            MS = util.getEndpoint("providers");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/providers/").concat(providerUUID, "/oauth/token"),
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                policy_uuid: policyUUID,
                authorize: true
              },
              json: true
            };

            if (typeof userUUID === "string" && userUUID.length > 0) {
              requestOptions.headers["x-login-hint"] = userUUID;
            }

            if (typeof redirectURL === "string" && redirectURL.length > 0) {
              requestOptions.qs.redirect_url = redirectURL;
            }

            if (typeof providerUser === "string" && providerUser.length > 0) {
              requestOptions.headers["x-login-hint"] = providerUser;
            }

            util.addRequestTrace(requestOptions, trace);
            _context2.next = 16;
            return request(requestOptions);

          case 16:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](7);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 20]]);
  }));

  return function getProviderToken() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 *
 * @description This function will return a refreshed access token for the associated provider
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [connectionUUID = "null connectionUUID"] - provider API connection uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */


var getProviderTokenByConnection = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        connectionUUID,
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
            connectionUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null connectionUUID";
            trace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.prev = 3;
            MS = util.getEndpoint("providers");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/connections/").concat(connectionUUID, "/oauth/token"),
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                "authorize": true
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](3);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 13]]);
  }));

  return function getProviderTokenByConnection() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 *
 * @description This function will  list all avaialble providers
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */


var listAvailableProviders = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
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
            trace = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            _context4.prev = 2;
            MS = util.getEndpoint("providers");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/providers?type=identity&policy.type=oauth"),
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 8;
            return request(requestOptions);

          case 8:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](2);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 12]]);
  }));

  return function listAvailableProviders() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 *
 * @description This function will list 3rd party oauth2 connections/authorizations. 
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [user_uuid="null userUUID"] - CPaas user uuid
 * @param {string} [policy_uuid=undefined] - option policy uuid
 * @param {string} [provider_uuid=undefined] - option provider uuid
 * @param {string} [userName=undefined] - optional user name
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to a list of user's providers API connections
 */


var listUserProviderConnections = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        user_uuid,
        policy_uuid,
        provider_uuid,
        user_name,
        trace,
        MS,
        requestOptions,
        optionalParams,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "no accessToken";
            user_uuid = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "no user uuid";
            policy_uuid = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : undefined;
            provider_uuid = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : undefined;
            user_name = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : undefined;
            trace = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : {};
            _context5.prev = 6;
            MS = util.getEndpoint("providers");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(user_uuid, "/connections"),
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            }; // add query string filters if we have any

            optionalParams = {
              policy_uuid: policy_uuid,
              provider_uuid: provider_uuid,
              user_name: user_name
            };
            Object.keys(optionalParams).forEach(function (option) {
              if (typeof optionalParams[option] !== "undefined") {
                if (!requestOptions.hasOwnProperty("qs") || _typeof(requestOptions.qs) !== "object") {
                  requestOptions.qs = {};
                }

                requestOptions.qs[option] = optionalParams[option];
              }
            });
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 14;
            return request(requestOptions);

          case 14:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](6);
            return _context5.abrupt("return", Promise.reject(util.formatError(_context5.t0)));

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[6, 18]]);
  }));

  return function listUserProviderConnections() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 *
 * @description This function will list all the providers of a given user
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - CPaas user uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */


var listUsersProviders = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        userUUID,
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
            userUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null userUUID";
            trace = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
            _context6.prev = 3;
            MS = util.getEndpoint("providers");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(userUUID, "/providers?policy.type=oauth"),
              headers: {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context6.next = 9;
            return request(requestOptions);

          case 9:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](3);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 13]]);
  }));

  return function listUsersProviders() {
    return _ref6.apply(this, arguments);
  };
}();

module.exports = {
  authorizeProvider: authorizeProvider,
  getProviderToken: getProviderToken,
  getProviderTokenByConnection: getProviderTokenByConnection,
  listAvailableProviders: listAvailableProviders,
  listUserProviderConnections: listUserProviderConnections,
  listUsersProviders: listUsersProviders
};