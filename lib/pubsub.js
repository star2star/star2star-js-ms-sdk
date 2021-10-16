/* global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.concat.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");
/**
 * @async
 * @description This function will add a subscription.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [account_uuid="account uuid not provided "] - account to subscribe to
 * @param {string} [callback_url="not set callback"] - callback URL
 * @param {array}  [callback_headers=[]] - callback headers
 * @param {array}  criteria - optional filter criteria
 * @param {object} [subscriptions={}] - events to subscribe to (voice, fax, conferencing, messagin, sms,  presence)
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [expiresDate=undefined] - optional expires date (RFC3339 format)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a new subscription
 */


var addSubscription = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var user_uuid,
        account_uuid,
        callback_url,
        callback_headers,
        criteria,
        subscriptions,
        accessToken,
        expiresDate,
        trace,
        MS,
        requestOptions,
        qs,
        filteredCriteria,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user_uuid = _args.length > 0 && _args[0] !== undefined ? _args[0] : "no user uuid provided";
            account_uuid = _args.length > 1 && _args[1] !== undefined ? _args[1] : "account uuid not provided ";
            callback_url = _args.length > 2 && _args[2] !== undefined ? _args[2] : "not set callback";
            callback_headers = _args.length > 3 && _args[3] !== undefined ? _args[3] : [];
            criteria = _args.length > 4 ? _args[4] : undefined;
            subscriptions = _args.length > 5 && _args[5] !== undefined ? _args[5] : {};
            accessToken = _args.length > 6 && _args[6] !== undefined ? _args[6] : "null accessToken";
            expiresDate = _args.length > 7 && _args[7] !== undefined ? _args[7] : undefined;
            trace = _args.length > 8 && _args[8] !== undefined ? _args[8] : {};
            _context.prev = 9;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/subscriptions"),
              body: {
                user_uuid: user_uuid,
                account_uuid: account_uuid,
                callback: {
                  url: callback_url,
                  headers: callback_headers
                },
                //criteria: criteria, temporary sms workaround
                events: subscriptions
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            }; // begin temporary sms workaround

            if (Array.isArray(criteria)) {
              filteredCriteria = criteria.filter(function (elem) {
                return !(_typeof(elem) === "object" && elem.hasOwnProperty("qs") && (qs = elem.qs));
              });

              if (typeof qs !== "undefined") {
                requestOptions.qs = qs;
              }

              if (filteredCriteria.length > 0) {
                requestOptions.body.criteria = filteredCriteria;
              }
            } // end temporary sms workaround


            if (expiresDate) {
              requestOptions.body.expiration_date = expiresDate;
            }

            util.addRequestTrace(requestOptions, trace);
            _context.next = 17;
            return request(requestOptions);

          case 17:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](9);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 21]]);
  }));

  return function addSubscription() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will add a subscription for a custom application and event.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [app_uuid="app_uuid uuid not provided "] - account to subscribe to
 * @param {string} [callback_url="not set callback"] - callback URL
 * @param {array}  [callback_headers=[]] - callback headers
 * @param {array}  criteria - optional filter criteria
 * @param {object} [events={}] - events to subscribe to (voice, fax, conferencing, messagin, sms,  presence)
 * @param {string} [expiresDate=undefined] - optional expires date (RFC3339 format)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a new subscription
 */


var addCustomEventSubscription = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        app_uuid,
        callback_url,
        callback_headers,
        criteria,
        events,
        expiresDate,
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
            app_uuid = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "account uuid not provided ";
            callback_url = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "not set callback";
            callback_headers = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : [];
            criteria = _args2.length > 4 ? _args2[4] : undefined;
            events = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : [];
            expiresDate = _args2.length > 6 && _args2[6] !== undefined ? _args2[6] : undefined;
            trace = _args2.length > 7 && _args2[7] !== undefined ? _args2[7] : {};
            _context2.prev = 8;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              "method": "POST",
              "headers": {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              "uri": "".concat(MS, "/customevents"),
              "body": {
                "app_uuid": app_uuid,
                "callback": {
                  "url": callback_url,
                  "headers": callback_headers
                },
                "events": events
              },
              "json": true
            };

            if (Array.isArray(criteria) && criteria.length > 0) {
              requestOptions.body.criteria = criteria;
            }

            if (expiresDate) {
              requestOptions.body.expiration_date = expiresDate;
            }

            util.addRequestTrace(requestOptions, trace);
            _context2.next = 16;
            return request(requestOptions);

          case 16:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](8);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 20]]);
  }));

  return function addCustomEventSubscription() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will send a message to subscribers of a custom application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application uuid
 * @param {string} [event="null event"] - even string to broadcast
 * @param {object} [payload={}] - data to include in the broadcast
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to success or failure
 */


var broadcastCustomApplication = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        app_uuid,
        event,
        payload,
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
            app_uuid = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "account uuid not provided ";
            event = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "null event";
            payload = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            trace = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {};
            _context3.prev = 5;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              "method": "POST",
              "headers": {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              "uri": "".concat(MS, "/broadcasts/applications"),
              "body": {
                "app_uuid": app_uuid,
                "event": event
              },
              "json": true
            };
            Object.keys(payload).forEach(function (prop) {
              requestOptions.body[prop] = payload[prop];
            });
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 12;
            return request(requestOptions);

          case 12:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](5);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 16]]);
  }));

  return function broadcastCustomApplication() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will create a custom pubsub application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application_uuid
 * @param {array} [events=[]] - events as array of objects
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to success or failure
 */


var createCustomApplication = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        app_uuid,
        events,
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
            app_uuid = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "account uuid not provided ";
            events = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : [];
            trace = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
            _context4.prev = 4;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              "method": "POST",
              "headers": {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              "uri": "".concat(MS, "/applications"),
              "body": {
                "app_uuid": app_uuid,
                "events": events
              },
              "json": true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 10;
            return request(requestOptions);

          case 10:
            response = _context4.sent;
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

  return function createCustomApplication() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @desc - This function will delete a custom pubsub application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application uuid
 * @param {*} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to success or failure
 */


var deleteCustomApplication = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        app_uuid,
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
            app_uuid = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "account uuid not provided ";
            trace = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            _context5.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              "method": "DELETE",
              "headers": {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              "uri": "".concat(MS, "/applications/").concat(app_uuid),
              "resolveWithFullResponse": true,
              "json": true
            };
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 9;
            return request(requestOptions);

          case 9:
            response = _context5.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 204)) {
              _context5.next = 14;
              break;
            }

            return _context5.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
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

  return function deleteCustomApplication() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will delete a custom subscription
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [subscription_uuid="no subscription uuid provided"]
 * @param {*} [trace={}]
 * @returns {Promise} - promise resolving to success or failure
 */


var deleteCustomSubscription = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        subscription_uuid,
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
            subscription_uuid = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "no subscription uuid provided";
            trace = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
            _context6.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              "method": "DELETE",
              "uri": "".concat(MS, "/customevents/").concat(subscription_uuid),
              "headers": {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              "resolveWithFullResponse": true,
              "json": true
            };
            util.addRequestTrace(requestOptions, trace);
            _context6.next = 9;
            return request(requestOptions);

          case 9:
            response = _context6.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 204)) {
              _context6.next = 14;
              break;
            }

            return _context6.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context6.next = 20;
            break;

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](3);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 17]]);
  }));

  return function deleteCustomSubscription() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete a user subscriptions based on subscription id.
 * @param {string} [subscription_uuid="no subscription uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteSubscription = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var subscription_uuid,
        accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            subscription_uuid = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "no subscription uuid provided";
            accessToken = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null accessToken";
            trace = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _context7.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/subscriptions/").concat(subscription_uuid),
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

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 204)) {
              _context7.next = 14;
              break;
            }

            return _context7.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
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

  return function deleteSubscription() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will return a custom pubsub application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application uuid
 * @param {*} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to custom application object
 */


var getCustomApplication = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        app_uuid,
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
            app_uuid = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "account uuid not provided ";
            trace = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            _context8.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              "method": "GET",
              "headers": {
                "Authorization": "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              "uri": "".concat(MS, "/applications/").concat(app_uuid),
              "json": true
            };
            util.addRequestTrace(requestOptions, trace);
            _context8.next = 9;
            return request(requestOptions);

          case 9:
            response = _context8.sent;
            return _context8.abrupt("return", response);

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](3);
            return _context8.abrupt("return", Promise.reject(util.formatError(_context8.t0)));

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 13]]);
  }));

  return function getCustomApplication() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will return a custom subscription
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [subscription_uuid="no subscription uuid provided"]
 * @param {*} [trace={}]
 * @returns {Promise} - promise resolving to subscription object
 */


var getCustomSubscription = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        subscription_uuid,
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
            subscription_uuid = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "no subscription uuid provided";
            trace = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            _context9.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/customevents/").concat(subscription_uuid),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context9.next = 9;
            return request(requestOptions);

          case 9:
            response = _context9.sent;
            return _context9.abrupt("return", response);

          case 13:
            _context9.prev = 13;
            _context9.t0 = _context9["catch"](3);
            return _context9.abrupt("return", Promise.reject(util.formatError(_context9.t0)));

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 13]]);
  }));

  return function getCustomSubscription() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get a user subscription based on subscription id.
 * @param {string} [subscription_uuid="no subscription uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var getSubscription = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var subscription_uuid,
        accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            subscription_uuid = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : "no subscription uuid provided";
            accessToken = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : "null accessToken";
            trace = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : {};
            _context10.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/subscriptions/").concat(subscription_uuid),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context10.next = 9;
            return request(requestOptions);

          case 9:
            response = _context10.sent;
            return _context10.abrupt("return", response);

          case 13:
            _context10.prev = 13;
            _context10.t0 = _context10["catch"](3);
            return _context10.abrupt("return", Promise.reject(util.formatError(_context10.t0)));

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[3, 13]]);
  }));

  return function getSubscription() {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will return a custom subscription
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [appUUID="no app uuid provided"] - custom application uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to object containing items array of subscriptions
 */


var listCustomSubscriptions = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var accessToken,
        appUUID,
        offset,
        limit,
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
            appUUID = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : "no app uuid provided";
            offset = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : 0;
            limit = _args11.length > 3 && _args11[3] !== undefined ? _args11[3] : 10;
            trace = _args11.length > 4 && _args11[4] !== undefined ? _args11[4] : {};
            _context11.prev = 5;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/customevents"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                app_uuid: appUUID,
                offset: offset,
                limit: limit
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context11.next = 11;
            return request(requestOptions);

          case 11:
            response = _context11.sent;
            return _context11.abrupt("return", response);

          case 15:
            _context11.prev = 15;
            _context11.t0 = _context11["catch"](5);
            throw util.formatError(_context11.t0);

          case 18:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[5, 15]]);
  }));

  return function listCustomSubscriptions() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas pubsub service for the list of user's subscriptions.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions for this user
 */


var listUserSubscriptions = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var user_uuid,
        accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            user_uuid = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : "no user uuid provided";
            accessToken = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : "null accessToken";
            trace = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
            _context12.prev = 3;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/subscriptions"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                user_uuid: user_uuid
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

  return function listUserSubscriptions() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function updates a subscription expiration date
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {*} subscriptionUUID - uuid for a star2star user
 * @param {*} [expiresDate=new Date(Date.now()).toISOString()]
 * @param {*} [trace={}]
 * @returns {Promise<object>} - Promise resolving to a data object containing updated subscription
 */


var updateSubscriptionExpiresDate = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var accessToken,
        subscriptionUUID,
        expiresDate,
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
            subscriptionUUID = _args13.length > 1 ? _args13[1] : undefined;
            expiresDate = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : new Date(Date.now()).toISOString();
            trace = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : {};
            _context13.prev = 4;
            MS = util.getEndpoint("pubsub");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/subscriptions/").concat(subscriptionUUID),
              body: {
                expiration_date: expiresDate
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context13.next = 10;
            return request(requestOptions);

          case 10:
            response = _context13.sent;
            return _context13.abrupt("return", response);

          case 14:
            _context13.prev = 14;
            _context13.t0 = _context13["catch"](4);
            return _context13.abrupt("return", Promise.reject(util.formatError(_context13.t0)));

          case 17:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[4, 14]]);
  }));

  return function updateSubscriptionExpiresDate() {
    return _ref13.apply(this, arguments);
  };
}();

module.exports = {
  addSubscription: addSubscription,
  addCustomEventSubscription: addCustomEventSubscription,
  broadcastCustomApplication: broadcastCustomApplication,
  createCustomApplication: createCustomApplication,
  deleteCustomApplication: deleteCustomApplication,
  deleteCustomSubscription: deleteCustomSubscription,
  deleteSubscription: deleteSubscription,
  getCustomApplication: getCustomApplication,
  getCustomSubscription: getCustomSubscription,
  getSubscription: getSubscription,
  listCustomSubscriptions: listCustomSubscriptions,
  listUserSubscriptions: listUserSubscriptions,
  updateSubscriptionExpiresDate: updateSubscriptionExpiresDate
};