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

var Util = require("./utilities");
/**
 * @async
 * @description "This function will delete a scheduled event"
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] schedule uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - status object
 */


var deleteEvent = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        eventUUID,
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
            eventUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null eventUUID";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/events/").concat(eventUUID),
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

            if (!(response.statusCode === 204)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", {
              status: "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete event failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", Promise.reject(Util.formatError(_context.t0)));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 17]]);
  }));

  return function deleteEvent() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description "This function will return a single event"
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - schedule event uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - schedule event object
 */


var getEvent = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        eventUUID,
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
            eventUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null eventUUID";
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/events/").concat(eventUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context2.next = 9;
            return request(requestOptions);

          case 9:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", Promise.reject(Util.formatError(_context2.t0)));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 13]]);
  }));

  return function getEvent() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns infor on the upcoming schedule event
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - schedule event uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - event info object
 */


var getNextEventInfo = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        eventUUID,
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
            eventUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null eventUUID";
            trace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.prev = 3;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/events/").concat(eventUUID, "/next"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](3);
            return _context3.abrupt("return", Promise.reject(Util.formatError(_context3.t0)));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 13]]);
  }));

  return function getNextEventInfo() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function lists sheduled events 
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - optional filters
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - array of event items
 */


var listEvents = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        offset,
        limit,
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
            offset = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 0;
            limit = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 10;
            filters = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : undefined;
            trace = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : {};
            _context4.prev = 5;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/events"),
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

            _context4.next = 12;
            return request(requestOptions);

          case 12:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](5);
            return _context4.abrupt("return", Promise.reject(Util.formatError(_context4.t0)));

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 16]]);
  }));

  return function listEvents() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns the run history of previously scheduled events
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - optional filters
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - array of event history items
 */


var listEventsHistory = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        offset,
        limit,
        filters,
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
            offset = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 0;
            limit = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 10;
            filters = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : undefined;
            trace = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : {};
            _context5.prev = 5;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/events/history"),
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

            _context5.next = 12;
            return request(requestOptions);

          case 12:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](5);
            return _context5.abrupt("return", Promise.reject(Util.formatError(_context5.t0)));

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[5, 16]]);
  }));

  return function listEventsHistory() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will schedule an event
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {date} [startDateTime=(new Date()).toISOString()] - future RFC3339 timestamp 
 * @param {string} [timezone="America/New_York"] - IANA timezone
 * @param {string} [title="null title"] - optional schedule title
 * @param {string} [description="null description"] - optional schedule description
 * @param {object} [frequency={
 *     "type": "once"
 *   }] - frequency object
 * @param {object} [trigger={}] - action to perform at the specified schedule
 * @param {object} [notification={}] - optional notification
 * @param {object} [metadata={}] - optional custom data to include with the event.
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - scheduled event object
 */


var scheduleEvent = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        userUUID,
        startDateTime,
        timezone,
        title,
        description,
        frequency,
        trigger,
        notification,
        metadata,
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
            startDateTime = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : new Date().toISOString();
            timezone = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : "America/New_York";
            title = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : "null title";
            description = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : "null description";
            frequency = _args6.length > 6 && _args6[6] !== undefined ? _args6[6] : {
              "type": "once"
            };
            trigger = _args6.length > 7 && _args6[7] !== undefined ? _args6[7] : {};
            notification = _args6.length > 8 && _args6[8] !== undefined ? _args6[8] : {};
            metadata = _args6.length > 9 && _args6[9] !== undefined ? _args6[9] : {};
            trace = _args6.length > 10 && _args6[10] !== undefined ? _args6[10] : {};
            _context6.prev = 11;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/events"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: {
                "user_uuid": userUUID,
                "start_datetime": startDateTime,
                "timezone": timezone,
                "title": title,
                "description": description,
                "status": "active",
                "frequency": frequency,
                "trigger": trigger,
                "notification": notification,
                "metadata": metadata
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context6.next = 17;
            return request(requestOptions);

          case 17:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 21:
            _context6.prev = 21;
            _context6.t0 = _context6["catch"](11);
            return _context6.abrupt("return", Promise.reject(Util.formatError(_context6.t0)));

          case 24:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[11, 21]]);
  }));

  return function scheduleEvent() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async 
 * @description This function will update an event schedule
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - event uuid
 * @param {object} [body="null body"] - full event object
 * @param {object} [trace={}] - option debug headers
 * @returns {Promise} - updated event object
 */


var updateEvent = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        eventUUID,
        body,
        trace,
        MS,
        requestOptions,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            accessToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null accessToken";
            eventUUID = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null eventUUID";
            body = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "null body";
            trace = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : {};
            _context7.prev = 4;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/events/").concat(eventUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              body: body,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            return _context7.abrupt("return", request(requestOptions));

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7["catch"](4);
            return _context7.abrupt("return", Promise.reject(Util.formatError(_context7.t0)));

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[4, 11]]);
  }));

  return function updateEvent() {
    return _ref7.apply(this, arguments);
  };
}();

module.exports = {
  deleteEvent: deleteEvent,
  getEvent: getEvent,
  getNextEventInfo: getNextEventInfo,
  listEvents: listEvents,
  listEventsHistory: listEventsHistory,
  scheduleEvent: scheduleEvent,
  updateEvent: updateEvent
};