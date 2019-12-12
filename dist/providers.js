/* global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");
/**
 *
 * @description This function will redirect the caller to complete oauth2 authorization and redirect the response with access_token to specified URL
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [clientID = "null clientID"] - cpaas client id used to generate access token
 * @param {string} [providerUUID="null providerUUID"] - Oauth2 provider identifier
 * @param {string} [redirectURL="null redirectURL"] - completed request redirect URL
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */


const getProviderToken = async function getProviderToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let clientID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null clientID";
  let providerUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null providerUUID";
  let redirectURL = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null redirectURL";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = util.getEndpoint("providers");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/providers/").concat(providerUUID, "/oauth/token"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "X-Client-id": clientID,
        "x-api-version": "".concat(util.getVersion())
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