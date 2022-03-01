/* global require module*/
"use strict";
const request = require("./requestPromise");
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
    throw util.formatError(error);
  }
};

/**
 *
 * @description This function will redirect the caller to complete oauth2 authorization and redirect the response with access_token to specified URL
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [providerUUID="null providerUUID"] - Oauth2 provider identifier
 * @param {string} [policyUUID = "null policyUUID"] - cpaas provider API policy id used to generate access token
 * @param {string} userUUID - optional cpaas user uuid. only required if the access_token does not belong to the cpaas user
 * @param {string} redirectURL - optional completed request redirect URL
 * @param {string} providerUser - optional 3rd party user name for CPaaS identities with multiple connections for the same provider
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */

const getProviderToken = async (
  accessToken = "null accessToken",
  providerUUID = "null providerUUID",
  policyUUID = "null policyUUID",
  userUUID,
  redirectURL,
  providerUser,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/providers/${providerUUID}/oauth/token`,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        policy_uuid: policyUUID,
        authorize: true
      },
      json: true
    };

    if(typeof userUUID === "string" && userUUID.length > 0){
      requestOptions.headers["x-login-hint"] = userUUID;
    }

    if(typeof redirectURL === "string" && redirectURL.length > 0){
      requestOptions.qs.redirect_url = redirectURL;
    }

    if(typeof providerUser === "string" && providerUser.length > 0){
      requestOptions.headers["x-login-hint"] = providerUser;
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 *
 * @description This function will return a refreshed access token for the associated provider
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [connectionUUID = "null connectionUUID"] - provider API connection uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to oauth2 provider access token
 */
const getProviderTokenByConnection = async (
  accessToken = "null accessToken",
  connectionUUID = "null connectionUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/connections/${connectionUUID}/oauth/token`,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        "authorize": true
      },
      json: true
    };
    
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
const listUserProviderConnections = async (
  accessToken = "no accessToken",
  user_uuid = "no user uuid",
  policy_uuid = undefined,
  provider_uuid = undefined,
  user_name = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("providers");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/${user_uuid}/connections`,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };

    // add query string filters if we have any
    const optionalParams = { policy_uuid, provider_uuid, user_name};
    Object.keys(optionalParams).forEach(option => {
      if (typeof optionalParams[option] !== "undefined"){
        if(!requestOptions.hasOwnProperty("qs") || typeof requestOptions.qs !== "object"){
          requestOptions.qs = {};
        }
        requestOptions.qs[option] = optionalParams[option];
      }
    });

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  authorizeProvider,
  getProviderToken,
  getProviderTokenByConnection,
  listAvailableProviders,
  listUserProviderConnections,
  listUsersProviders
};
 