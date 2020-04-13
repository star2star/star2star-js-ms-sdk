/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * @async
 * @description This function will create a token provider for the given user and service
 * @param {string} [clientID="null clientID"] - Star2Star's clientID assigned by third party
 * @param {string} [providerUUID="null providerUUID"] - provider API policy uuid
 * @param {string} [redirectURL="null redirectURL"] - auth code redirect URL
 * @param {string} [userUUID="null userUUID"] - CPaaS user uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<redirect to 3rd party oauth2 api>} - promise resolving to redirect
 */
const authorizeProvider = async (
  clientID = "null clientID",
  providerUUID = "null providerUUID",
  redirectURL = "null redirectURL",
  userUUID = "null userUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/providers/${providerUUID}/oauth/authorize`,
      headers: {}, // empty object allows us to add the trace headers
      qs: {
        client_id: clientID,
        redirect_url: redirectURL,
        user_uuid: userUUID,
      },
      followAllRedirects: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

/**
 *
 * @description This function will redirect the caller to complete oauth2 authorization and redirect the response with access_token to specified URL
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [clientID = "null clientID"] - cpaas client id used to generate access token
 * @param {string} [providerUUID="null providerUUID"] - Oauth2 provider identifier
 * @param {string} [redirectURL="null redirectURL"] - completed request redirect URL
 * @param {string} [userUUID="null userUUID"] - CPaas user uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */
const getProviderToken = async (
  accessToken = "null accessToken",
  clientID = "null clientID",
  providerUUID = "null providerUUID",
  redirectURL = "null redirectURL",
  userUUID = "null userUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/providers/${providerUUID}/oauth/token`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-id": clientID,
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        redirect_url: redirectURL,
        user_uuid: userUUID
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
 *
 * @description This function will  list all avaialble providers
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */
const listAvailableProviders = async (
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/providers?type=identity&policy.type=oauth`,
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
    return Promise.reject(util.formatError(error));
  }
};

/**
 *
 * @description This function will list all the providers of a given user
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - CPaas user uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */
const listUsersProviders = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/${userUUID}/providers?policy.type=oauth`,
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
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  authorizeProvider,
  getProviderToken,
  listAvailableProviders,
  listUsersProviders
};
