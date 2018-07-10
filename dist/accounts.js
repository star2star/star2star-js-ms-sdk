/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} [body="null body"]
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
var createRelationship = function createRelationship() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "POST",
    uri: MS + "/relationships",
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    }
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {number} [offset=0] - optional; return the list starting at a specified index
 * @param {number} [limit=10] - optional; return a specified number of accounts
 * @param {string} [accountType=""] - optional; "Reseller, MasterReseller, Customer"
 * @param {string} [expand=""] optional; expand="relationships"
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
var listAccounts = function listAccounts() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var accountType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var expand = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts",
    qs: {
      type: accountType,
      expand: expand,
      offset: offset,
      limit: limit
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
 * @description This function creates a new account.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [body="null body"] - object containing account details
* @returns {Promise<object>} - Promise resolving to an account data object
 */
var createAccount = function createAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "POST",
    uri: MS + "/accounts",
    body: body,
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
 * @param {string} [expand = "identities"] - expand data in response; currently "identities" or "relationship"
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var getAccount = function getAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts/" + accountUUID,
    qs: {
      expand: "relationships"
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
 * @description This function will modify an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"]
 * @param {string} [body="null body"]
 * @param {string} [property=""]
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
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
var listAccountRelationships = function listAccountRelationships() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var account_type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts/" + accountUUID + "/relationships",
    qs: {
      "expand": "accounts",
      "offset": offset,
      "limit": limit
    },
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true

  };
  //console.log("REQUEST_OPTIONS",requestOptions);
  //TODO remove this stuff once account_type is supported
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (data) {
      var rtnObj = {};
      rtnObj.items = data.items.filter(function (i) {
        return account_type.length > 0 ? i.source.type.toLowerCase() === account_type.toLowerCase() : i;
      });
      rtnObj.accounts = data.accounts.filter(function (i) {
        return account_type.length > 0 ? i.type.toLowerCase() === account_type.toLowerCase() : i;
      });
      //console.log(JSON.stringify(data));
      resolve(rtnObj);
    }).catch(function (e) {
      reject(e);
    });
  });
};

module.exports = {
  createRelationship: createRelationship,
  createAccount: createAccount,
  listAccountRelationships: listAccountRelationships,
  listAccounts: listAccounts,
  getAccount: getAccount,
  modifyAccount: modifyAccount
};