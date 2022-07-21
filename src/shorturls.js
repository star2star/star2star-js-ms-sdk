/* global require module*/
"use strict";

const request = require("./requestPromise");
const util = require("./utilities");
const merge = require("@star2star/merge-deep");

/**
 * @async
 * @description This function will get a list of all short urls.
 * @param {string} [userUuid='null user uuid'] - account_uuid
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {object} [options={}] - object of options
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of short urls
 */
const listShortUrls = async (
  userUuid = "null user uuid",
  accessToken = "null accessToken",
  options = {},
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("shorturls");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/shorturls?user_uuid=${userUuid}`,
      qs: options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
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
 * @description This function will create a new short url.
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {object} [options={}] - {
  "account_uuid": "string",
  "analyze_content": false,
  "expires_after": 0,
  "max_view_count": 0,
  "mode": "Proxy",
  "save_content": false,
  "save_preview": false,
  "secure_pin": "string",
  "secure_view": "None",
  "short_code": "string",
  "short_domain": "string",
  "thumbnail": false,
  "url": "string",
  "user_uuid": "string"
 }
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of short urls
 */
const createShortUrl = async (accessToken = "null accessToken", options = {}, trace ={}) => {
  try {
    const MS = util.getEndpoint("shorturls");

    const b = merge({}, options);
    if (!b.hasOwnProperty("url")) {
      return Promise.reject("options object missing url property");
    }
    //console.log('bbbbbbbb', b)
    const requestOptions = {
      method: "POST",
      uri: `${MS}/shorturls`,
      body: b,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
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
 * @description This function will delete a short url.
 * @param {string} [userUuid='null user uuid'] - account_uuid
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {string} [short_code='notdefined'] - short code for url to delete
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteShortCode = async (
  userUuid = "null user uuid",
  accessToken = "null accessToken",
  short_code = "notdefined",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("shorturls");

    //console.log('bbbbbbbb', b)
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/shorturls/${short_code}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
        user_uuid: userUuid
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if(response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "assign permission to role failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
      };
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  listShortUrls,
  createShortUrl,
  deleteShortCode
};
