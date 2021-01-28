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


const authorizeProvider = async function authorizeProvider() {
  let clientID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null clientID";
  let providerUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null providerUUID";
  let redirectURL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null redirectURL";
  let userUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null userUUID";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = util.getEndpoint("providers");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/providers/").concat(providerUUID, "/oauth/authorize"),
      headers: {},
      // empty object allows us to add the trace headers
      qs: {
        client_id: clientID,
        redirect_url: redirectURL,
        user_uuid: userUUID
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


const getProviderToken = async function getProviderToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let clientID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null clientID";
  let providerUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null providerUUID";
  let redirectURL = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null redirectURL";
  let userUUID = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "null userUUID";
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("providers");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/providers/").concat(providerUUID, "/oauth/token"),
      headers: {
        "Authorization": "Bearer ".concat(accessToken),
        "X-Client-id": clientID,
        "x-api-version": "".concat(util.getVersion())
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


const listAvailableProviders = async function listAvailableProviders() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    const MS = util.getEndpoint("providers");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/providers?type=identity&policy.type=oauth"),
      headers: {
        "Authorization": "Bearer ".concat(accessToken),
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
 *
 * @description This function will list 3rd party oauth2 connections/authorizations. 
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [user_uuid="null userUUID"] - CPaas user uuid
 * @param {string} [policy_uuid=undefined] - option policy uuid
 * @param {string} [provider_uuid=undefined] - option provider uuid
 * @param {string} [userName=undefined] - optional user name
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to a list of user's providers API connections
 */


const listUserProviderConnections = async function listUserProviderConnections() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no accessToken";
  let user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no user uuid";
  let policy_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let provider_uuid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let user_name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("providers");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/").concat(user_uuid, "/connections"),
      headers: {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    }; // add query string filters if we have any

    const optionalParams = {
      policy_uuid,
      provider_uuid,
      user_name
    };
    Object.keys(optionalParams).forEach(option => {
      if (typeof optionalParams[option] !== "undefined") {
        if (!requestOptions.hasOwnProperty("qs") || typeof requestOptions.qs !== "object") {
          requestOptions.qs = {};
        }

        requestOptions.qs[option] = optionalParams[option];
      }
    });
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


const listUsersProviders = async function listUsersProviders() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("providers");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/").concat(userUUID, "/providers?policy.type=oauth"),
      headers: {
        "Authorization": "Bearer ".concat(accessToken),
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

module.exports = {
  authorizeProvider,
  getProviderToken,
  listAvailableProviders,
  listUserProviderConnections,
  listUsersProviders
};