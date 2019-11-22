/* global require module*/
"use strict";

const request = require("request-promise");

const Util = require("./utilities");
/**
 * @async
 * @description "This function will delete a scheduled event"
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] schedule uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - status object
 */


const deleteEvent = async function deleteEvent() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
    const response = await request(requestOptions);

    if (response.statusCode === 204) {
      return {
        status: "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete event failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};
/**
 * @async
 * @description "This function will return a single event"
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - schedule event uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - schedule event object
 */


const getEvent = async function getEvent() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};
/**
 * @async
 * @description This function returns infor on the upcoming schedule event
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] - schedule event uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - event info object
 */


const getNextEventInfo = async function getNextEventInfo() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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


const listEvents = async function listEvents() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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


const listEventsHistory = async function listEventsHistory() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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


const scheduleEvent = async function scheduleEvent() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let startDateTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date().toISOString();
  let timezone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "America/New_York";
  let title = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "null title";
  let description = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "null description";
  let frequency = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {
    "type": "once"
  };
  let trigger = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
  let notification = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};
  let metadata = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : {};
  let trace = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
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


const updateEvent = async function updateEvent() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let eventUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null eventUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
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
    return request(requestOptions);
  } catch (error) {
    return Promise.reject(Util.formatError(error));
  }
};

module.exports = {
  deleteEvent,
  getEvent,
  getNextEventInfo,
  listEvents,
  listEventsHistory,
  scheduleEvent,
  updateEvent
};