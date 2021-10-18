/*global module require */
"use strict";

const util = require("./utilities");

const request = require("request-promise");
/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [instanceUUID="null uuid"] - CMS instanc uuid
 * @param {int} [offset=0] - instance rows offset
 * @param {int} [limit=100] - instance rows limit
 * @param {string} [include=undefined] - optional query param "include"
 * @param {string} [expand=undefined] - optional query param "expand"
 * @param {string} [referenceFilter=undefined] - optional query paran "reference_filter"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */


const getResourceInstance = async function getResourceInstance() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let instanceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
  let include = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let expand = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  let referenceFilter = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  let trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

  try {
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/instance/").concat(instanceUUID, "/"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        ["rows.limit"]: limit,
        ["rows.offset"]: offset
      },
      json: true,
      resolveWithFullResponse: true
    }; // add expand query param if defined

    if (expand !== undefined) {
      requestOptions.qs.expand = expand;
    } // add include query param if defined


    if (include !== undefined) {
      requestOptions.qs.include = include;
    } // add reference filter query param if defined


    if (referenceFilter !== undefined) {
      requestOptions.qs["reference_filter"] = referenceFilter;
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};
/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [include=undefined] - optional query param "include"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */


const listResources = async function listResources() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let include = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/instance/"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    }; // add include query param if defined

    if (include !== undefined) {
      requestOptions.qs = {
        include: include
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
  getResourceInstance,
  listResources
};