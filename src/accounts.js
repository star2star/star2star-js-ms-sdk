/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
const createRelationship = (
  accessToken = "null access token",
  body = "null body",
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/relationships`,
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    }
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {number} [offset=0] - optional; return the list starting at a specified index
 * @param {number} [limit=10] - optional; return a specified number of accounts
  * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
const listAccounts = (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/accounts`,
    qs: {
      offset: offset,
      limit: limit,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }
  //console.log("REQUEST_OPTIONS",requestOptions);
  return request(requestOptions);
};

/**
 * @async
 * @description This function creates a new account.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [body="null body"] - object containing account details
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an account data object
 */
const createAccount = async (
  accessToken = "null accessToken",
  body = "null body",
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const newAccount = response.body;
  // create returns a 202....suspend return until the new resource is ready
  if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
  {    
    await util.pendingResource(
      response.headers.location,
      requestOptions, //reusing the request options instead of passing in multiple params
      trace,
      newAccount.hasOwnProperty("resource_status") ? newAccount.resource_status : "complete"
    );
  }
  return newAccount;  
};

/**
 * @async
 * @description This function will return an account by UUID.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {string} [expand = "identities"] - expand data in response; currently "identities" or "relationship"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getAccount = (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/accounts/${accountUUID}`,
    qs: {
      expand: "relationships"
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will modify an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const modifyAccount = (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  body = "null body",
  trace = {}
) => {
  //body = JSON.stringify(body);
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/accounts/${accountUUID}`,
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    }
  };
  util.addRequestTrace(requestOptions, trace);

  return new Promise(function(resolve, reject) {
    request(requestOptions)
      .then(function(responseData) {
        responseData.statusCode === 202
          ? resolve({ status: "ok" })
          : reject({ status: "failed" });
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [accountUUID="null account uuid"] - account uuid of the parent
 * @param {number} [offset=0] - what page number you want
 * @param {number} [limit=10] - size of the page or number of records to return
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
//TODO add sort order also
const listAccountRelationships = (
  accessToken = "null accessToken",
  accountUUID = "null account uuid",
  offset = 0,
  limit = 10,
  accountType = undefined,
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/accounts/${accountUUID}/relationships`,
    qs: {
      expand: "accounts",
      offset: offset,
      limit: limit
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (accountType) {
    requestOptions.qs.account_type = accountType;
  }

  //TODO remove this stuff once account_type is supported CSRVS-158
  return request(requestOptions);
};

/**
 * @async
 * @description This function will set an account status to "Active"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const reinstateAccount = (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts/${accountUUID}/reinstate`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  return new Promise(function(resolve, reject) {
    request(requestOptions)
      .then(function(responseData) {
        responseData.statusCode === 204
          ? resolve({ status: "ok" })
          : reject({ status: "failed" });
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

/**
 * @async
 * @description This function will set an account status to "Inactive"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const suspendAccount = (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts/${accountUUID}/suspend`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  return new Promise(function(resolve, reject) {
    request(requestOptions)
      .then(function(responseData) {
        responseData.statusCode === 204
          ? resolve({ status: "ok" })
          : reject({ status: "failed" });
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

/**
 * @async
 * @description This function will delete an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - uuid of account to delete
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const deleteAccount = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/accounts/${accountUUID}`,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      }
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // delete returns a 202....suspend return until the new resource is ready
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace,
        "deleting"
      );
    }
    return {"status": "ok"};
  } catch(error){
    return Promise.reject(
      {
        "status": "failed",
        "message": error.hasOwnProperty("message") ? error.message : JSON.stringify(error)
      }
    );
  } 
};

module.exports = {
  createRelationship,
  createAccount,
  deleteAccount,
  listAccountRelationships,
  listAccounts,
  getAccount,
  modifyAccount,
  reinstateAccount,
  suspendAccount
};
