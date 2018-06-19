/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token
 * @param email - email address for an star2star account
 * @param identity_type_name - one of 'guest', 'user' TODO need to confirm possible values with Kranti
 * @param pwd - passowrd for that account.
 * @returns promise resolving to an identity data
 **/
var createIdentity = function createIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
  var identity_type_name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null_type_name";
  var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null pwd";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    body: {
      email: email,
      identity_type_name: identity_type_name,
      password: pwd
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token
 * @param userUuid - user_uuid for alias being created
 * @param did - sms number to associate with the user
 * @returns promise resolving to an identity object with alias
 **/
var updateAliasWithDID = function updateAliasWithDID() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var did = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null DID";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/identities/" + userUuid + "/aliases/" + did,
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in and delete the user object matching the user_uuid submitted
 * @param accessToken - access token for cpaas systems
 * @param userUuid - uuid for a star2star user
 * @returns promise resolving to a status of 204
 **/
var deleteIdentity = function deleteIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/identities/" + userUuid,
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
var login = function login() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
  var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null pwd";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/login",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    body: {
      email: email,
      password: pwd
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
var getMyIdentityData = function getMyIdentityData() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/me",
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param user_uuid - user uuid to lookup
 * @returns promise resolving to an identity data
 **/
var getIdentityDetails = function getIdentityDetails() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/identities/" + user_uuid,
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
var lookupIdentity = function lookupIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var username = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null username";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/identities",
    qs: {
      username: username
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
 * This function will call the identity microservice to get list of accounts
 * @param accessToken - access token for cpaas systems
 * @returns promise resolving to array of account data
 **/
var listAccounts = function listAccounts() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";

  var MS = util.getEndpoint("identity");
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

  return request(requestOptions);
};

/**
 * This function will call the identity microservice to get account details
 * @param accessToken - access token for cpaas systems
 * @param accountUUID - account_uuid for an star2star account (customer)
 * @param includeIdentities - boolean to include identities in account or not
 * @returns promise resolving to an identity data
 **/
var getAccount = function getAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var includeIdentities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var MS = util.getEndpoint("identity");
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
 * This function will call the identity microservice to get account details
 * @param accessToken - access token for cpaas systems
 * @param accountUUID - account_uuid for an star2star account (customer)
 * @returns promise resolving to an identity data
 **/
var getAccountAvailProps = function getAccountAvailProps() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var includeIdentities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var MS = util.getEndpoint("identity");
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

module.exports = {
  createIdentity: createIdentity,
  updateAliasWithDID: updateAliasWithDID,
  deleteIdentity: deleteIdentity,
  login: login,
  getMyIdentityData: getMyIdentityData,
  lookupIdentity: lookupIdentity,
  listAccounts: listAccounts,
  getAccount: getAccount,
  getAccountAvailProps: getAccountAvailProps,
  getIdentityDetails: getIdentityDetails
};