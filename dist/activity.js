/*global module require */
"use strict";

const util = require("./utilities");

const request = require("request-promise");
/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} reportUUID
 * @param {string} templateUUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */


const getReport = async function getReport() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let reportUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null report uuid";
  let templateUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null template uuid";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/report"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        report_uuid: reportUUID,
        template_uuid: templateUUID
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.statusCode === 204) {
      return {};
    }

    return response.body;
  } catch (error) {
    throw util.formatError(error);
  }
};
/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {number} [offset = 0] - pagination offset
 * @param {number} [limit = 10] = pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */


const listReportTemplates = async function listReportTemplates() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/report/template"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        offset: offset,
        limit: limit
      },
      resolveWithFullResponse: false,
      json: true
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
 * @description This function will run a report.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [templateUuid="null account uuid"] - report template uuid
 * @param {string} [ownerUuid=undefined] - owner uuid (CPaaS user_uuid) - required if account uuid not specified
 * @param {string} [accountUuid=undefined] - CPaaS account uuid - required if owner uuid not specified
 * @param {object} [paramaters={}] - report parameters
 * @param {object} [trace={}] - optional CPaaS microservice lifecycle headers
 * @returns {Promise<object>} - Promise resolving to an object containing report uuid
 */


const runReport = async function runReport() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let templateUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  let ownerUuid = arguments.length > 2 ? arguments[2] : undefined;
  let accountUuid = arguments.length > 3 ? arguments[3] : undefined;
  let parameters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/report/").concat(templateUuid),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {},
      body: {
        parameters: parameters
      },
      json: true
    };

    if (typeof ownerUuid !== "undefined") {
      requestOptions.qs.owner_uuid = ownerUuid;
    } else if (typeof accountUuid !== "undefined") {
      requestOptions.qs.account_uuid = accountUuid;
    } else {
      throw {
        "code": 400,
        "message": "request requires either owner or account uuid"
      };
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  getReport,
  listReportTemplates,
  runReport
};