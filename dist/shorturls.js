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


const listShortUrls = function listShortUrls() {
  let userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
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
  return request(requestOptions);
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


const createShortUrl = function createShortUrl() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("shorturls");
  const b = objectMerge({}, options);

  if (!b.hasOwnProperty("url")) {
    return Promise.reject("options object missing url property");
  } //console.log('bbbbbbbb', b)


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
  return request(requestOptions);
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


const deleteShortCode = function deleteShortCode() {
  let userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let short_code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "notdefined";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("shorturls"); //console.log('bbbbbbbb', b)

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
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({
        status: "ok"
      }) : reject({
        status: "failed"
      });
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports = {
  listShortUrls,
  createShortUrl,
  deleteShortCode
};