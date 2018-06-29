/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [identity_type_name="null_type_name"]- one of 'guest', 'user' TODO need to confirm possible values
 * @param {string} [pwd="null pwd"] - passowrd for that account.
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const createIdentity = (
  accessToken = "null accessToken",
  email = "null email",
  identity_type_name = "null_type_name",
  pwd = "null pwd"
) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/identities`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const updateAliasWithDID = (
  accessToken = "null accessToken",
  userUuid = "null user uuid",
  did = "null DID"
) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/identities/${userUuid}/aliases/${did}`,
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
 * @description This function will call the identity microservice with the credentials and 
 * accessToken you passed in and delete the user object matching the user_uuid submitted.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUuid="null uuid"] - uuid for a star2star user
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteIdentity = (accessToken = "null accessToken", userUuid = "null uuid") => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/identities/${userUuid}`,
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
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [pwd="null pwd"] - passowrd for that account
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const login = (
  accessToken = "null access token",
  email = "null email",
  pwd = "null pwd"
) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/login`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
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
const getMyIdentityData = (accessToken = "null access token") => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/me`,
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
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [user_uuid="null user uuid"] - user uuid to lookup
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getIdentityDetails = (accessToken = "null access token", user_uuid="null user uuid") => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/identities/${user_uuid}`,
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
 * @description This function will look up an identity by username.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [username="null username"] - query by username
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const lookupIdentity = (
  accessToken = "null accessToken",
  username = "null username"
) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/identities`,
    qs: {
      username: username
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



module.exports = {
  createIdentity,
  updateAliasWithDID,
  deleteIdentity,
  login,
  getMyIdentityData,
  lookupIdentity,
  getIdentityDetails
};