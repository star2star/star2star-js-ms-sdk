/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * This function will call the oauth microservice with the credentials and
 * outh key and basic token you passed in
 * @param oauthKey -  key for oauth cpaas system
 * @param oauthToken - token for authentication to cpaas oauth system
 * @param apiVersion - string with api version to specify in header
 * @param email - email address for a star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an oauth token data
 **/
var getAccessToken = function getAccessToken() {
  var oauthKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth key";
  var oauthToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null oauth token";
  var apiVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null api version";
  var email = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null email";
  var pwd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "null pwd";

  var MS = util.getEndpoint("oauth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/oauth/token",
    headers: {
      "application-key": oauthKey,
      "Authorization": oauthToken,
      "Content-type": "application/x-www-form-urlencoded",
      "x-api-version": apiVersion
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

  return request(requestOptions);
};

/**
 * This function will call the identity microservice to refresh user based on token
 * @param apiKey - api key for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
var refreshAccessToken = function refreshAccessToken() {
  var oauthKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth key";
  var oauthToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null oauth token";
  var apiVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null api version";
  var refreshToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null refresh token";

  var MS = util.getEndpoint("oauth");
  var requestOptions = {
    method: "POST",
    uri: MS + "/oauth/token",
    headers: {
      "application-key": oauthKey,
      "Authorization": oauthToken,
      "Content-type": "application/x-www-form-urlencoded",
      "x-api-version": apiVersion
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    json: true
    // resolveWithFullResponse: true
  };

  return request(requestOptions);
};

module.exports = {
  getAccessToken: getAccessToken,
  refreshAccessToken: refreshAccessToken
};