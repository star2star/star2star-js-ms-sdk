/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 *
 * @description This function will redirect the caller to complete oauth2 authorization and redirect the response with access_token to specified URL
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [providerUUID="null providerUUID"] - Oauth2 provider identifier
 * @param {string} [redirectURL="null redirectURL"] - completed request redirect URL
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */
const getProviderToken = async (
  accessToken = "null accessToken",
  providerUUID = "null providerUUID",
  redirectURL = "null redirectURL",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/providers/${providerUUID}/oauth/token`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        redirect_url: redirectURL
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  getProviderToken
};
