/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} [body="null body"]
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
const createRelationship = (accessToken = "null access token", body = "null body") => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/relationships`,
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    }
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [accountType=""] - optional; "Reseller, MasterReseller, Customer"
 * @param {number} [offset=0] - optional; return the list starting at a specified index
 * @param {number} [limit=10] - optional; return a specified number of accounts
 * @param {string} [expand=""] optional; expand="relationships"
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
const listAccounts = (accessToken = "null accessToken", accountType = "", offset = 0, limit = 10, expand = "") => {
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts`,
      qs: {
        type: accountType,
        expand: expand,
        offset: offset,
        limit: limit
      },
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        'x-api-version': `${util.getVersion()}`
      },
      json: true
     
    };
    //console.log("REQUEST_OPTIONS",requestOptions);
  
    return request(requestOptions);
  };
  
/**
 * @async
 * @description This function creates a new account.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [body="null body"] - object containing account details
 * @returns
 */
const createAccount = (accessToken = "null accessToken", body = "null body") => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/accounts`,
    body: body,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    json: true
   
  };
  //console.log("REQUEST_OPTIONS",requestOptions);

  return request(requestOptions);
};

  /**
   * @async
   * @description This function will return an account by UUID.
   * @param {string} [accessToken="null access token"] - access token for cpaas systems
   * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
   * @param {string} [expand = "identities"] - expand data in response; currently "identities" or "relationship"
   * @returns {Promise<object>} - Promise resolving to an identity data object
   */
  const getAccount = (accessToken = "null access token", accountUUID = "null account uuid") => {
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}`,
      qs: {
        expand: "relationships"
      },
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        'x-api-version': `${util.getVersion()}`
      },
      json: true
    };
    return request(requestOptions);
  };

  /**
   * @async
   * @description This function will modify an account.
   * @param {string} [accessToken="null access token"] - access token for cpaas systems
   * @param {string} [accountUUID="null account uuid"]
   * @param {string} [body="null body"]
   * @param {string} [property=""]
   * @returns {Promise<object>} - Promise resolving to a status data object
   */
  const modifyAccount = (accessToken = "null access token", accountUUID = "null account uuid", body = "null body", property = "") => {
    //body = JSON.stringify(body);
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/accounts/${accountUUID}/${property}`,
      body: body,
      resolveWithFullResponse: true,
      json: true,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        'x-api-version': `${util.getVersion()}`
      }
    };

    return new Promise (function (resolve, reject){
        request(requestOptions).then(function(responseData){
            responseData.statusCode === 202 ?  resolve({"status":"ok"}): reject({"status":"failed"});
        }).catch(function(error){
            reject(error);
        })
    }); 
  };

  /**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [accountUUID="null account uuid"] - account uuid of the parent
 * @param {number} [offset=0] - what page number you want 
 * @param {number} [limit=10] - size of the page or number of records to return 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
//TODO add sort order also 
const listAccountRelationships = (accessToken = "null accessToken", accountUUID = "null account uuid", account_type="", offset=0, limit=10 ) => {
  const MS = util.getEndpoint("accounts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/accounts/${accountUUID}/relationships`,
    qs: {
      "expand": "accounts",
      "offset": offset,
      "limit": limit
    },
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    json: true
   
  };
  //console.log("REQUEST_OPTIONS",requestOptions);
  //TODO remove this stuff once account_type is supported
  return new Promise((resolve, reject)=>{
    request(requestOptions).then((data)=>{
      const rtnObj = {};
      rtnObj.items = data.items.filter((i)=>{
        return account_type.length > 0 ? i.source.type.toLowerCase() === account_type.toLowerCase() : i;
      });
      rtnObj.accounts = data.accounts.filter((i)=>{
        return account_type.length > 0 ? i.type.toLowerCase() === account_type.toLowerCase() : i;
      });
      //console.log(JSON.stringify(data));
      resolve(rtnObj);
    }).catch((e)=>{
      reject(e);
    });
  });
};

  module.exports = {
    createRelationship,
    createAccount,
    listAccountRelationships,
    listAccounts,
    getAccount,
    modifyAccount
  };