/* global require module*/
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var request = require("request-promise");
var Util = require("./utilities");
var logger = Util.logger;

/**
 * @async
 * @description "This function will delete a scheduled event"
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] schedule uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - status object
 */
var deleteEvent = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, requestOptions, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            MS = Util.getEndpoint("scheduler");
            requestOptions = {
              method: "DELETE",
              uri: MS + "/events/" + eventUUID,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + Util.getVersion()
              },
              resolveWithFullResponse: true,
              json: true
            };

            Util.addRequestTrace(requestOptions, trace);
            _context.next = 6;
            return request(requestOptions);

          case 6:
            response = _context.sent;

            if (!(response.statusCode === 204)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", Promise.resolve({ status: "ok" }));

          case 11:
            throw new Error(response);

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject({ status: "failed", "error": _context.t0 }));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 14]]);
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
var getEvent = function getEvent() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("scheduler");
  var requestOptions = {
    method: "GET",
    uri: MS + "/events/" + eventUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  return request(requestOptions);
};
/**
 * @async
 * @description This function returns infor on the upcoming schedule event
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - schedule event uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - event info object
 */
var getNextEventInfo = function getNextEventInfo() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = Util.getEndpoint("scheduler");
  var requestOptions = {
    method: "GET",
    uri: MS + "/events/" + eventUUID + "/next",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);

  return request(requestOptions);
};

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
var listEvents = function listEvents() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = Util.getEndpoint("scheduler");
  var requestOptions = {
    method: "GET",
    uri: MS + "/events",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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

  return request(requestOptions);
};

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
var listEventsHistory = function listEventsHistory() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = Util.getEndpoint("scheduler");
  var requestOptions = {
    method: "GET",
    uri: MS + "/events/history",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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

  return request(requestOptions);
};

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
var scheduleEvent = function scheduleEvent() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  var startDateTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date().toISOString();
  var timezone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "America/New_York";
  var title = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "null title";
  var description = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "null description";
  var frequency = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {
    "type": "once"
  };
  var trigger = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
  var notification = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};
  var metadata = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : {};
  var trace = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : {};

  var MS = Util.getEndpoint("scheduler");
  var requestOptions = {
    method: "POST",
    uri: MS + "/events",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
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
  logger.debug(requestOptions, null, "\t");
  return request(requestOptions);
};

/**
 * @async 
 * @description This function will update an event schedule
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - event uuid
 * @param {object} [body="null body"] - full event object
 * @param {object} [trace={}] - option debug headers
 * @returns {Promise} - updated event object
 */
var updateEvent = function updateEvent() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = Util.getEndpoint("scheduler");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/events/" + eventUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + Util.getVersion()
    },
    body: body,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  deleteEvent: deleteEvent,
  getEvent: getEvent,
  getNextEventInfo: getNextEventInfo,
  listEvents: listEvents,
  listEventsHistory: listEventsHistory,
  scheduleEvent: scheduleEvent,
  updateEvent: updateEvent
};