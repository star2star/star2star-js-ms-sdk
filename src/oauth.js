/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function will call the oauth microservice with the credentials and
 * outh key and basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [email="null email"] - email address for a star2star account
 * @param {string} [pwd="null pwd"] - password for that account
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
const getAccessToken = (
  oauthToken = "null oauth token",
  email = "null email",
  pwd = "null pwd"
) => {
  const MS = util.getAuthHost();
  const VERSION = util.getVersion();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
    headers: {
      "Authorization": `Basic ${oauthToken}`,
      'x-api-version': `${VERSION}`,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "password",
      scope: "message.list",
      email: email,
      password: pwd
    },
    json:true 
    // resolveWithFullResponse: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will call the identity microservice to refresh user based on token.
 * @param {string} [oauthKey="null oauth key"] - key for oauth cpaas system
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {string} [refreshToken="null refresh token"] - refresh token for oauth token.
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const refreshAccessToken = (
  oauthToken = "null oauth token",
  refreshToken = "null refresh token"
) => {
  const MS = util.getAuthHost();
  const VERSION = util.getVersion();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
    headers: {
      "Authorization": `Basic ${oauthToken}`,
      'x-api-version': `${VERSION}`,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    json:true 
    // resolveWithFullResponse: true
  };
  
  return request(requestOptions);
};

/**
 * @async
 * @description This function will call the oauth microservice with the basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
const getClientToken = (
  oauthToken = "null oauth token"
) => {
  const MS = util.getAuthHost();
  const VERSION = util.getVersion();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
    headers: {
      "Authorization": `Basic ${oauthToken}`,
      'x-api-version': `${VERSION}`,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "client_credentials",
      scope: "default"
    },
    json:true 
    // resolveWithFullResponse: true
  };

  return request(requestOptions);
};


module.exports = {
  getClientToken,
  getAccessToken,
  refreshAccessToken
};