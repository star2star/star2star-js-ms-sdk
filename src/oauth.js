/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");


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
const getAccessToken = (
  oauthKey = "null oauth key",
  oauthToken = "null oauth token",
  apiVersion = "null api version",
  email = "null email",
  pwd = "null pwd"
) => {
  const MS = util.getEndpoint("oauth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
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
const refreshAccessToken = (
  oauthKey = "null oauth key",
  oauthToken = "null oauth token",
  apiVersion = "null api version",
  refreshToken = "null refresh token"
) => {
  const MS = util.getEndpoint("oauth");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
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
    // resolveWithFullResponse: true
  };

  return request(requestOptions);
};


module.exports = {
  getAccessToken,
  refreshAccessToken
};