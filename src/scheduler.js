/* global require module*/
"use strict";

const request = require("./requestPromise");
const Util = require("./utilities");

/**
 * @async
 * @description "This function will delete a scheduled event"
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [eventUUID="null eventUUID"] schedule uuid
 * @param {object} [trace={}] - optional debug headers
 * @returns {Promise} - status object
 */
const deleteEvent = async (
  accessToken = "null accessToken",
  eventUUID = "null eventUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/events/${eventUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if(response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete event failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
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
const getEvent = async (
  accessToken = "null accessToken",
  eventUUID = "null eventUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/events/${eventUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
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
const getNextEventInfo = async (
  accessToken = "null accessToken",
  eventUUID = "null eventUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/events/${eventUUID}/next`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
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
const listEvents = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try { 
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/events`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
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
const listEventsHistory = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/events/history`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
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
const scheduleEvent = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  startDateTime = (new Date()).toISOString(),
  timezone = "America/New_York",
  title = "null title",
  description = "null description",
  frequency = {
    "type": "once"
  },
  trigger = {},
  notification = {},
  metadata = {},
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/events`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
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
const updateEvent = async (
  accessToken = "null accessToken",
  eventUUID = "null eventUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("scheduler");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/events/${eventUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`
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
  updateEvent,  
};