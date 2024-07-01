/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
const createRelationship = async (
  accessToken = "null access token",
  body = "null body",
  trace = {}
) => {
  try{
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
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
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
const listAccounts = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try{
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
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
  try{
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
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return newAccount;
  } catch (error){
    throw util.formatError(error);
  }  
};

/**
 * @async
 * @description This function will return an account by UUID.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {string} [expand] - expand data in response; currently "identities" or "relationship"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getAccount = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  expand,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    if(typeof expand === "string"){
      requestOptions.qs = {
        expand: expand
      };
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
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
const modifyAccount = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  body = "null body",
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    const modifiedAccount = response.body;
    
    // create returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") && 
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return modifiedAccount;
  } catch (error){
    throw util.formatError(error);
  }
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
const listAccountRelationships = async (
  accessToken = "null accessToken",
  accountUUID = "null account uuid",
  offset = 0,
  limit = 10,
  accountType = undefined,
  trace = {}
) => {
  try{
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
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }   
};

/**
 * @async
 * @description This function will set an account status to "Active"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const reinstateAccount = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    if(response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "reinstate account failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
      };
    }  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will set an account status to "Inactive"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
const suspendAccount = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    if(response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "suspend account failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
      };
    }
  } catch (error) {
    throw util.formatError(error);
  }
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
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace,
        "deleting"
      );
    }
    return {"status": "ok"};
  } catch(error){
    throw util.formatError(error);
  } 
};

/**
 * @async
 * @description This function returns a list of child accounts for a given CPaaS account uuid.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [userUUID="null user uuid"] - CPaaS user uuid
 * @param {number} [offset=0] - what page number you want
 * @param {number} [limit=10] - size of the page or number of records to return
 * @param {object} [filters={}] - optional filters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
//TODO add sort order also
const listAccountChildren = async (
  accessToken = "null accessToken",
  accountUUID = "null account uuid",
  offset = 0,
  limit = 10,
  filters = {},
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/children'`,
      qs: {
        offset: offset,
        limit: limit,
        type: "Customer" // default to Customer as it is expected this will be 95% of requests
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    if(typeof filters === "object" && filters !== null && !Array.isArray(filters)){
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }   
};

/**
 * @async
 * @description This function returns a CPaaS user's highest level accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [userUUID="null user uuid"] - CPaaS user uuid
 * @param {number} [offset=0] - what page number you want
 * @param {number} [limit=10] - size of the page or number of records to return
 * @param {object} [filters={}] - optional filters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
//TODO add sort order also
const listUserRootAccounts = async (
  accessToken = "null accessToken",
  userUUID = "null user uuid",
  offset = 0,
  limit = 10,
  filters = {},
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/users/${userUUID}/root`,
      qs: {
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
    if(typeof filters === "object" && filters !== null && !Array.isArray(filters)){
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }   
};

module.exports = {
  createRelationship,
  createAccount,
  deleteAccount,
  getAccount,
  listAccountChildren,
  listAccountRelationships,
  listAccounts,
  listUserRootAccounts,
  modifyAccount,
  reinstateAccount,
  suspendAccount
};
