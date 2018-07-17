/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {object} [body="null body"] - JSON object containing new user info
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var createIdentity = function createIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    body: body,
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will allow you to modify all details of identity except account_uuid, username and external_id, password and provider.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [body="null body"]
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var modifyIdentity = function modifyIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/modify",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    body: body,
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will deactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @returns {Promise<object>} - Promise resolving to an status data object
 */
var deactivateIdentity = function deactivateIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/deactivate",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true,
    resolveWithFullResponse: true
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will reactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @returns {Promise<object>} - Promise resolving to an status data object
 */
var reactivateIdentity = function reactivateIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/reactivate",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true,
    resolveWithFullResponse: true
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
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
    json: true,
    resolveWithFullResponse: true
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
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
 * @param {string} [accessToken="null accessToken"]
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {string} [filterType=undefined] - optional "username" or "sms" 
 * @param {string} [filterValue=undefined] - value of username or sms
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var lookupIdentity = function lookupIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filterType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var filterValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/identities",
    qs: {
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
  if (filterType && filterValue) {
    requestOptions.qs[filterType] = filterValue;
  }
  // console.log("REQUEST********",requestOptions);
  return request(requestOptions);
};

/** 
 * @async
 * @description This function will update a user's password.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null passwordToken"] - Reset token received via email
 * @param {object} [body="null body"] - object containing email address and new password
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
var resetPassword = function resetPassword() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var passwordToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null passwordToken";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/users/password-tokens/" + passwordToken,
    body: body,
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
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
 * @description This function will initiate a request for a password reset token via the user email account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [emailAddress="null emailAddress"] - target email address
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
var generatePasswordToken = function generatePasswordToken() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var emailAddress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null emailAddress";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/password-tokens",
    body: {
      email: emailAddress
    },
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
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
 * @description This function will validate a password reset token received from email.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null password token"] - password reset token received via email
 * @returns {Promise<object>} - Promise resolving to an object confirming the token and target email
 */
var validatePasswordToken = function validatePasswordToken() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var password_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null password token";

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/password-tokens/" + password_token,
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
  modifyIdentity: modifyIdentity,
  reactivateIdentity: reactivateIdentity,
  deactivateIdentity: deactivateIdentity,
  updateAliasWithDID: updateAliasWithDID,
  deleteIdentity: deleteIdentity,
  login: login,
  getMyIdentityData: getMyIdentityData,
  lookupIdentity: lookupIdentity,
  getIdentityDetails: getIdentityDetails,
  generatePasswordToken: generatePasswordToken,
  resetPassword: resetPassword,
  validatePasswordToken: validatePasswordToken
};