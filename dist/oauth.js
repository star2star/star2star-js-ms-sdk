/*global module require */
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.to-string");

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


const createClientApp = async function createClientApp() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null name";
  let description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null description";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
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
  const response = request(requestOptions);
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


const generateBasicToken = function generateBasicToken() {
  let publicID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null publicID";
  let secret = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null secret";
  let basicToken = undefined;
  basicToken = Buffer.from(`${publicID}:${secret}`).toString("base64");

  if (!basicToken) {
    throw new Error("base64 encoding failed");
  } else {
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


const getAccessToken = async function getAccessToken() {
  let oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
  let email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
  let pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null pwd";
  let scope = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "default";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
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
    json: true // resolveWithFullResponse: true

  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
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


const getClientToken = async function getClientToken() {
  let oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
  let trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
    json: true // resolveWithFullResponse: true

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


const invalidateToken = async function invalidateToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null token";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
  return response.statusCode === 204 ? Promise.resolve({
    status: "ok"
  }) : Promise.reject({
    status: "failed"
  });
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


const listClientTokens = async function listClientTokens() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
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


const refreshAccessToken = async function refreshAccessToken() {
  let oauthToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null oauth token";
  let refreshToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null refresh token";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
    json: true // resolveWithFullResponse: true

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


const scopeClientApp = async function scopeClientApp() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let clientUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null clientUUID";
  let scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["default"];
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
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
    return Promise.resolve({
      "status": "ok"
    });
  } else {
    return Promise.reject({
      "status": "failed"
    });
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


const validateToken = async function validateToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null token";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
  return response.statusCode === 204 ? Promise.resolve({
    status: "ok"
  }) : Promise.reject({
    status: "failed"
  });
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