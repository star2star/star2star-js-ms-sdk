/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
var listAccounts = function listAccounts() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts",
    qs: {
      include_identities: false
    },
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
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
var getAccount = function getAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var includeIdentities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts/" + accountUUID,
    qs: {
      include_identities: includeIdentities
    },
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function returns all possible properties to be assigned to account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for a star2star account (customer)
 * @returns {Promise<object>} - Promise resolving to a data object containing all possible properties.
 */
var getAccountAvailProps = function getAccountAvailProps() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts/" + accountUUID + "/availableProperties",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

var modifyAccount = function modifyAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var property = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

  //body = JSON.stringify(body);
  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/accounts/" + accountUUID + "/" + property,
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    }
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 202 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports = {
  listAccounts: listAccounts,
  getAccount: getAccount,
  getAccountAvailProps: getAccountAvailProps,
  modifyAccount: modifyAccount
};