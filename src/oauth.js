/*global module require */
"use strict";
import "@babel/polyfill";
const Util = require("./utilities");
const request = require("request-promise");

/**
 * @async 
 * @description This function creates a client for a provided user uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [name="null name"] - client name
 * @param {string} [description="null description"] - client description
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise resolving to a client object
 */
const createClientApp = async (
  accessToken = "null access token",
  userUUID = "null userUUID",
  name = "null name",
  description = "null description",
  trace = {}
) => {
  const MS = Util.getAuthHost();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/clients`,
    body: {
      name: name,
      description: description,
      application_type: "connect",
      grant_types: ["client_credentials"],
      app_user: userUUID
    },
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    }
  };
  Util.addRequestTrace(requestOptions, trace);
  const response =  request(requestOptions);
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
  return response;  
};

/**
 * @async
 * @description This function returns a Basic token from a client public ID and secret
 * @param {string} [publicID="null publicID"]
 * @param {string} [secret="null secret"]
 * @returns {string} - base64 encoded Basic token
 */
const generateBasicToken = (
  publicID = "null publicID",
  secret = "null secret"
) => {
  let basicToken = undefined;
  basicToken = Buffer.from(`${publicID}:${secret}`).toString("base64");
  if(!basicToken) {
    throw new Error("base64 encoding failed");
  }
  else { 
    return Promise.resolve(basicToken);
  }
};

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
const getAccessToken = async (
  oauthToken = "null oauth token",
  email = "null email",
  pwd = "null pwd",
  scope = "default",
  trace = {}
) => {
  const MS = Util.getAuthHost();
  const VERSION = Util.getVersion();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
    headers: {
      Authorization: `Basic ${oauthToken}`,
      "x-api-version": `${VERSION}`,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "password",
      scope: scope,
      email: email,
      password: pwd
    },
    json: true
    // resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response =  await request(requestOptions);
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
  return response;
};

/**
 * @async
 * @description This function will call the oauth microservice with the basic token you passed in.
 * @param {string} [oauthToken="null oauth token"] - token for authentication to cpaas oauth system
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an oauth token data object
 */
const getClientToken = async (oauthToken = "null oauth token", trace = {}) => {
  const MS = Util.getAuthHost();
  const VERSION = Util.getVersion();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
    headers: {
      Authorization: `Basic ${oauthToken}`,
      "x-api-version": `${VERSION}`,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "client_credentials",
      scope: "default"
    },
    json: true
    // resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = request(requestOptions);
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
  return response;

};

/**
 * @async
 * @description This function will invalidate an access token
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [token="null token"] - access token needing validation
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise thatdoes stuff
 */
const invalidateToken = async (accessToken = "null accessToken", token = "null token", trace = {}) => {
  const MS = Util.getAuthHost();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/invalidate/access`,
    body: {
      access_token: token
    },
    resolveWithFullResponse: true,
    json: true,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    }
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  return response.statusCode === 204 ? Promise.resolve({ status: "ok" }) : Promise.reject({ status: "failed" });
};

/**
 * @async 
 * @description This function will return active access tokens based on the filters provided
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - token_type and username or client_id depending on token type
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise resolving to a list of access tokens.
 */
const listClientTokens = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  const MS = Util.getAuthHost();
  const requestOptions = {
    method: "GET",
    uri: `${MS}/oauth/tokens`,
    qs: {
      offset: offset,
      limit: limit
    },
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    }
  };
  if (filters && typeof filters == "object") {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }
  Util.addRequestTrace(requestOptions, trace);
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
const refreshAccessToken = async (
  oauthToken = "null oauth token",
  refreshToken = "null refresh token",
  trace = {}
) => {
  const MS = Util.getAuthHost();
  const VERSION = Util.getVersion();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/token`,
    headers: {
      Authorization: `Basic ${oauthToken}`,
      "x-api-version": `${VERSION}`,
      "Content-type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    json: true
    // resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return await request(requestOptions);
};

/**
 * @async
 * @description This function will restrict the client token to specific microservices
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [clientUUID="null clientUUID"] - client uuid (obtained when creating using createClientApp()
 * @param {string} [scope=["default"]] - array of microservices the token should be able to access
 * @param {object} [trace={}] - optional trace headers for debugging.
 * @returns {Promise} - promise resolving to a request status message.
 */
const scopeClientApp = async (
  accessToken = "null accessToken",
  clientUUID = "null clientUUID",
  scope = ["default"],
  trace = {}
) => {
  const MS = Util.getAuthHost();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/clients/${clientUUID}/scopes`,
    body: {
      scope: scope
    },
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    }
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  await new Promise(resolve => setTimeout(resolve, Util.config.msDelay));
  if (response.statusCode === 204) {
    return Promise.resolve({"status":"ok"}); 
  } else {
    return Promise.reject({"status":"failed"});
  }
};

/**
 * @async
 * @description This function checks if an access token is valid
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [token="null token"] - access token needing validation
 * @param {object} [trace={}] - optional trace headers for debugging
 * @returns {Promise} - promise thatdoes stuff
 */
const validateToken = async (accessToken = "null accessToken", token= "null token", trace = {}) => {
  const MS = Util.getAuthHost();
  const requestOptions = {
    method: "POST",
    uri: `${MS}/oauth/validate/access`,
    body: {
      access_token: token
    },
    resolveWithFullResponse: true,
    json: true,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    }
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  return response.statusCode === 204 ? Promise.resolve({ status: "ok" }) : Promise.reject({ status: "failed" });
};

module.exports = {
  createClientApp,
  generateBasicToken,
  getAccessToken,
  getClientToken,
  invalidateToken,
  listClientTokens,
  refreshAccessToken,
  scopeClientApp,
  validateToken
};
