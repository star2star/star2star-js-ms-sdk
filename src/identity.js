/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token
 * @param email - email address for an star2star account
 * @param identity_type_name - one of 'guest', 'user' TODO need to confirm possible values with Kranti
 * @param pwd - passowrd for that account.
 * @returns promise resolving to an identity data
 **/
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token
 * @param userUuid - user_uuid for alias being created
 * @param did - sms number to associate with the user
 * @returns promise resolving to an identity object with alias
 **/
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in and delete the user object matching the user_uuid submitted
 * @param accessToken - access token for cpaas systems
 * @param userUuid - uuid for a star2star user
 * @returns promise resolving to a status of 204
 **/
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
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

/**
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param user_uuid - user uuid to lookup
 * @returns promise resolving to an identity data
 **/
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
 * This function will call the identity microservice with the credentials and
 * accessToken you passed in
 * @param accessToken - access token for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
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

/**
 * This function will call the identity microservice to get list of accounts
 * @param accessToken - access token for cpaas systems
 * @returns promise resolving to array of account data
 **/
const listAccounts = (accessToken = "null accessToken") => {
  const MS = util.getEndpoint("identity");
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

  return request(requestOptions);
};

/**
 * This function will call the identity microservice to get account details
 * @param accessToken - access token for cpaas systems
 * @param accountUUID - account_uuid for an star2star account (customer)
 * @param includeIdentities - boolean to include identities in account or not
 * @returns promise resolving to an identity data
 **/
const getAccount = (accessToken = "null access token", accountUUID = "null account uuid", includeIdentities = false) => {
  const MS = util.getEndpoint("identity");
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

module.exports = {
  createIdentity,
  updateAliasWithDID,
  deleteIdentity,
  login,
  getMyIdentityData,
  lookupIdentity,
  listAccounts,
  getAccount,
  getIdentityDetails
};