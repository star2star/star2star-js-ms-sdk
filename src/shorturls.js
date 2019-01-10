/* global require module*/
"use strict";
import "@babel/polyfill";
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
const listShortUrls = (
  userUuid = "null user uuid",
  accessToken = "null accessToken",
  options = {},
  trace = {}
) => {
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
const createShortUrl = (accessToken = "null accessToken", options = {}, trace ={}) => {
  const MS = util.getEndpoint("shorturls");

  const b = objectMerge({}, options);
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
const deleteShortCode = (
  userUuid = "null user uuid",
  accessToken = "null accessToken",
  short_code = "notdefined",
  trace = {}
) => {
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
  return new Promise(function(resolve, reject) {
    request(requestOptions)
      .then(function(responseData) {
        responseData.statusCode === 204
          ? resolve({ status: "ok" })
          : reject({ status: "failed" });
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

module.exports = {
  listShortUrls,
  createShortUrl,
  deleteShortCode
};
