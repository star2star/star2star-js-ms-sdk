/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [identity_type_name="null_type_name"]- one of 'guest', 'user' TODO need to confirm possible values
 * @param {string} [pwd="null pwd"] - passowrd for that account.
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
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
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {string} [did="null DID"] - sms number to associate with the user
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */
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
 * @async
 * @description This function will call the identity microservice with the credentials and 
 * accessToken you passed in and delete the user object matching the user_uuid submitted.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUuid="null uuid"] - uuid for a star2star user
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
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
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [pwd="null pwd"] - passowrd for that account
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
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

//TODO not seeing this call in Tyk...investigate.
/**
 * @async
 * @description This function will return the identity data for the authenticated user.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
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
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [user_uuid="null user uuid"] - user uuid to lookup
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
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
 * @async
 * @description This function will look up an identity by username.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [username="null username"] - query by username
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
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

module.exports = {
  createIdentity: createIdentity,
  updateAliasWithDID: updateAliasWithDID,
  deleteIdentity: deleteIdentity,
  login: login,
  getMyIdentityData: getMyIdentityData,
  lookupIdentity: lookupIdentity,
  getIdentityDetails: getIdentityDetails
};