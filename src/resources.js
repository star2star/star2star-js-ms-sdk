/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [type="null uuid"] - CMS instance uuid
 * @param {int} [offset=0] - instance rows offset
 * @param {int} [limit=100] - instance rows limit
 * @param {string} [include=undefined] - optional query param "include"
 * @param {string} [expand=undefined] - optional query param "expand"
 * @param {string} [referenceFilter=undefined] - optional query paran "reference_filter"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */
const getResourceInstance = async (
  accessToken = "null accessToken",
  type = "null type",
  offset = 0,
  limit = 100,
  include = undefined,
  expand = undefined,
  referenceFilter = undefined,
  trace = {}
) => {
  try {
    
    const listResponse = await listResources(
      accessToken,
      type,
      undefined, //not using include here
      trace
    );

    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/${listResponse?.items?.[0]?.uuid}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        ["rows.limit"] : limit,
        ["rows.offset"]: offset
      },
      json: true
    };

    // add expand query param if defined
    if (expand !== undefined) {
      requestOptions.qs.expand = expand;
    }

    // add include query param if defined
    if (include !== undefined) {
      requestOptions.qs.include = include;
    }
    
    // add reference filter query param if defined
    if (referenceFilter !== undefined) {
      requestOptions.qs["reference_filter"] = referenceFilter;
    }

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

 /**
  *
  * @description This function returns a CMS resource instance row.
  * @param {string} [accessToken="null accessToken"]
  * @param {string} [instance_uuid="null instance_uuid"]
  * @param {string} [row_id="null row_id"]
  * @param {string} [include="content"]
  * @param {object} [trace={}] - optional microservice lifcycle headers
  * @returns {Promise<object>} - promise resolving to a CMS instance row object
  * @returns
  */

 const getResourceInstanceRow = async (
  accessToken = "null accessToken",
  instance_uuid = "null instance_uuid",
  row_id = "null row_id",
  include = "content",
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/${instance_uuid}/row/${row_id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {include: include},
      json: true
    };

    util.addRequestTrace(requestOptions, nextTrace);
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
const listResources = async (
  accessToken = "null accessToken",
  type = undefined,
  include = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {},
      json: true,
    };

    // add include query param if defined
    if (typeof type === "string") {
      requestOptions.qs.type = type;
    }

    // add include query param if defined
    if (typeof include === "string") {
      requestOptions.qs.include = include;
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
  getResourceInstanceRow,
  listResources
};
