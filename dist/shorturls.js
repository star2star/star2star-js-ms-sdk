/* global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");

const objectMerge = require("object-merge");
/**
 * @async
 * @description This function will get a list of all short urls.
 * @param {string} [userUuid='null user uuid'] - account_uuid
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {object} [options={}] - object of options
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of short urls
 */


const listShortUrls = async function listShortUrls() {
  let userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("shorturls");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/shorturls?user_uuid=").concat(userUuid),
      qs: options,
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const createShortUrl = async function createShortUrl() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("shorturls");
    const b = objectMerge({}, options);

    if (!b.hasOwnProperty("url")) {
      return Promise.reject("options object missing url property");
    } //console.log('bbbbbbbb', b)


    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/shorturls"),
      body: b,
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const deleteShortCode = async function deleteShortCode() {
  let userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let short_code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "notdefined";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("shorturls"); //console.log('bbbbbbbb', b)

    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/shorturls/").concat(short_code),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion()),
        user_uuid: userUuid
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.statusCode === 204) {
      return {
        status: "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "assign permission to role failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  listShortUrls,
  createShortUrl,
  deleteShortCode
};