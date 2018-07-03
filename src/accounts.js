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
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
const listAccounts = (accessToken = "null accessToken") => {
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts`,
      qs: {
        include_identities: false
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
   * @description This function will return an account by UUID.
   * @param {string} [accessToken="null access token"] - access token for cpaas systems
   * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
   * @param {boolean} [includeIdentities=false] - boolean to include identities in account or not
   * @returns {Promise<object>} - Promise resolving to an identity data object
   */
  const getAccount = (accessToken = "null access token", accountUUID = "null account uuid", includeIdentities = false) => {
    const MS = util.getEndpoint("accounts");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}`,
      qs: {
        include_identities: includeIdentities
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

  module.exports = {
    createRelationship,
    listAccounts,
    getAccount,
    modifyAccount
  };