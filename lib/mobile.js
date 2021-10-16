/* global require module*/
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.concat.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");
/**
 * @async
 * @description This function will return a list of push notification registrations by user uuid
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null fileUUID"] - user UUID
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing user push notification registrations
 */


var getUserRegistrations = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
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
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null accessToken";
            userUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null userUUID";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = util.getEndpoint("mobile");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/registration"),
              headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                "user_uuid": userUUID
              },
              json: true
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

  return function getUserRegistrations() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {string} [userUUID="no user uuid provided"] - UUID for user
 * @param {string} [pushToken="no push token provided"]
 * @param {string} [pushToken="no push token provided"]
 * @param {string} [application="no application provided"]
 * @param {string} [platform="no platform provided"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - promise resolving to registration object 
 */


var registerPushToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        userUUID,
        deviceID,
        pushToken,
        application,
        platform,
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
            userUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "no user uuid provided";
            deviceID = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "no device uuid provided";
            pushToken = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : "no push token provided";
            application = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : "no application provided";
            platform = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : "no platform provided";
            trace = _args2.length > 6 && _args2[6] !== undefined ? _args2[6] : {};
            _context2.prev = 7;
            MS = util.getEndpoint("mobile");
            requestOptions = {
              "method": "POST",
              "uri": "".concat(MS, "/registration"),
              "headers": {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              "body": {
                "user_uuid": userUUID,
                "device_id": deviceID,
                "push_token": pushToken,
                "application": application,
                "platform": platform
              },
              "json": true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 13;
            return request(requestOptions);

          case 13:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](7);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 17]]);
  }));

  return function registerPushToken() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will send a push notification to a mobile device
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [application="no application provided"] - target application
 * @param {string} [userUUID="no user uuid provided"] - user uuid
 * @param {array} [userUUID="no user uuid provided"] - array of device_ids to send notification to
 * @param {object} [data=undefined] - optional additiona data to accompany the message text as payload
 * @param {object} [platformData=undefined] - optional platform (ios/android) specific payload data
 * @param {string} [title=undefined] - notification title
 * @param {string} [message=undefined] - notification messge
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - promise resolving to a push notification object
 */


var sendPushNotification = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        application,
        userUUID,
        deviceIDs,
        title,
        message,
        data,
        platformData,
        trace,
        MS,
        requestOptions,
        optionalParams,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null accessToken";
            application = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "no application provided";
            userUUID = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "no user uuid provided";
            deviceIDs = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : "no deviceIDs array provided";
            title = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : undefined;
            message = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : undefined;
            data = _args3.length > 6 && _args3[6] !== undefined ? _args3[6] : undefined;
            platformData = _args3.length > 7 && _args3[7] !== undefined ? _args3[7] : undefined;
            trace = _args3.length > 8 && _args3[8] !== undefined ? _args3[8] : {};
            _context3.prev = 9;
            MS = util.getEndpoint("mobile");
            requestOptions = {
              "method": "POST",
              "uri": "".concat(MS, "/notification"),
              "headers": {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              "body": {
                "application": application,
                "user_uuid": userUUID,
                "device_ids": deviceIDs
              },
              "json": true
            };
            optionalParams = {
              "title": title,
              "message": message,
              "data": data,
              "platform_specific_data": platformData
            };
            Object.keys(optionalParams).forEach(function (param) {
              if (typeof optionalParams[param] !== "undefined") {
                requestOptions.body[param] = optionalParams[param];
              }
            });
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 17;
            return request(requestOptions);

          case 17:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](9);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[9, 21]]);
  }));

  return function sendPushNotification() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {string} [pushToken="no push token provided"]
 * @returns {Promise<object>} - promise resolving to success or failure
 */


var unregisterPushToken = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        pushToken,
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
            pushToken = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "no push token provided";
            trace = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.prev = 3;
            MS = util.getEndpoint("mobile");
            requestOptions = {
              "method": "DELETE",
              "uri": "".concat(MS, "/registration/").concat(pushToken),
              "headers": {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              "resolveWithFullResponse": true,
              "json": true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 9;
            return request(requestOptions);

          case 9:
            response = _context4.sent;

            if (!(response.statusCode === 202)) {
              _context4.next = 14;
              break;
            }

            return _context4.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw util.formatError(response);

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

  return function unregisterPushToken() {
    return _ref4.apply(this, arguments);
  };
}();

module.exports = {
  getUserRegistrations: getUserRegistrations,
  registerPushToken: registerPushToken,
  sendPushNotification: sendPushNotification,
  unregisterPushToken: unregisterPushToken
};