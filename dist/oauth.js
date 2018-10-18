/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will call the oauth microservice with the credentials and
 * outh key and basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [email="null email"] - email address for a star2star account
 * @param {string} [pwd="null pwd"] - password for that account
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
var getAccessToken = function getAccessToken() {
  var oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
  var email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
  var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null pwd";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getAuthHost();
  var VERSION = util.getVersion();
  var requestOptions = {
    method: "POST",
    uri: MS + "/oauth/token",
    headers: {
      Authorization: "Basic " + oauthToken,
      "x-api-version": "" + VERSION,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "password",
      scope: "message.list",
      email: email,
      password: pwd
    },
    json: true
    // resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will call the identity microservice to refresh user based on token.
 * @param {string} [oauthKey="null oauth key"] - key for oauth cpaas system
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [refreshToken="null refresh token"] - refresh token for oauth token.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var refreshAccessToken = function refreshAccessToken() {
  var oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
  var refreshToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null refresh token";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getAuthHost();
  var VERSION = util.getVersion();
  var requestOptions = {
    method: "POST",
    uri: MS + "/oauth/token",
    headers: {
      Authorization: "Basic " + oauthToken,
      "x-api-version": "" + VERSION,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    json: true
    // resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will call the oauth microservice with the basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
var getClientToken = function getClientToken() {
  var oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
  var trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var MS = util.getAuthHost();
  var VERSION = util.getVersion();
  var requestOptions = {
    method: "POST",
    uri: MS + "/oauth/token",
    headers: {
      Authorization: "Basic " + oauthToken,
      "x-api-version": "" + VERSION,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "client_credentials",
      scope: "default"
    },
    json: true
    // resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  getClientToken: getClientToken,
  getAccessToken: getAccessToken,
  refreshAccessToken: refreshAccessToken
};