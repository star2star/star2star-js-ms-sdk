/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function creates a new usage event.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="undefined"] - account UUID
 * @param {string} [applicationUUID="undefined"] - application UUID
 * @param {string} [eventType="undefined"] - event type
 * @param {string} [metadata="undefined"] - object containing metadata for this event
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to the created usage event object
 */
const createEvent = async (
  accessToken = "null accessToken",
  accountUUID = undefined,
  applicationUUID = undefined,
  eventType = undefined,
  metadata = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/events`,
      body: {
        account_uuid: accountUUID,
        application_uuid: applicationUUID,
        event_type: eventType,
        metadata: metadata,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: false,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function get a CPaaS account billing cycle.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="undefined"] - account UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to the created usage event object
 */
const getAccountBillingCycle = async (
  accessToken = "null accessToken",
  accountUUID = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/billing_cycle`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: false,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function gets a completed usage report.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [reportUUID="undefined"] - repor UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing report location and details
 */
const getUsageReport = async (
  accessToken = "null accessToken",
  reportUUID = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/reports/${reportUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: false,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function gets a usage template by uuid.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="undefined"] - account UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a usage report template
 */
const getUsageTemplate = async (
  accessToken = "null accessToken",
  templateUUID = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/reports/templates/${templateUUID}}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: false,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function lists available usage report templates.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [offset=0] - pagination offset
 * @param {string} [limit=0] - pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a list of report templates
 */
const listUsageTemplates = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 100,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/reports/templates`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
      resolveWithFullResponse: false,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function starts a usage report.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [templateUUID="null templateUUID"] - report template uuid UUID
 * @param {string} [since="null since"] - report start
 * @param {string} [until="null until"] - report end
 * @param {string} accountUUID - optional CPaaS account uuid
 * @param {string} applicationUUID - optional CPaaS application uuid
 * @param {string} eventType - optional event type
 * @param {number} offset - optional offset
 * @param {number} limit - optional limit
 * @param {object} filterValues - optional filters expression object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to the created usage report metadata
 */
const runUsageReport = async (
  accessToken = "null accessToken",
  templateUUID = "null templateUUID",
  since,
  until,
  accountUUID,
  applicationUUID,
  eventType,
  offset,
  limit,
  filterValues,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/reports/templates/${templateUUID}/events/evaluate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: {
        account_uuid: accountUUID,
        application_uuid: applicationUUID,
        event_type: eventType,
        since: since,
        until: until,
        offset: offset,
        limit: limit,
        filter_values: filterValues,
      },
      json: true,
      resolveWithFullResponse: false,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  createEvent,
  getAccountBillingCycle,
  getUsageReport,
  getUsageTemplate,
  listUsageTemplates,
  runUsageReport,
};
