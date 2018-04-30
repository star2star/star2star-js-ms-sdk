/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * This function will call the identity microservice with the credentials and
 * api key you passed in
 * @param apiKey - api key for cpaas systems
 * @param email - email address for an star2star account
 * @param identity_type_name - one of 'guest', 'user' TODO need to confirm possible values with Kranti
 * @param pwd - passowrd for that account.
 * @returns promise resolving to an identity data
 **/
const createIdentity = (
  apiKey = "null api key",
  email = "null email",
  identity_type_name = "null_type_name",
  pwd = "null pwd"
) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/identities`,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json"
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
 * api key you passed in and delete the user object matching the user_uuid submitted
 * @param apiKey - api key for cpaas systems
 * @param user_uuid - uuid for a star2star user
 * @returns promise resolving to a status of 204
 **/
const deleteIdentity = (apiKey = "null api key", user_uuid = "null uuid") => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/identities/${user_uuid}`,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json"
    }
  };

  return request(requestOptions);
};

/**
 * This function will call the identity microservice with the credentials and
 * api key you passed in
 * @param apiKey - api key for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
const login = (
  apiKey = "null api key",
  email = "null email",
  pwd = "null pwd"
) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/login`,
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json"
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
 * api key you passed in
 * @param apiKey - api key for cpaas systems
 * @param email - email address for an star2star account
 * @param pwd - passowrd for that account
 * @returns promise resolving to an identity data
 **/
const lookupIdentity = (
  apiKey = "null api key",
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
      "application-key": apiKey,
      "Content-type": "application/json"
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will call the identity microservice to get list of accounts
 * @param apiKey - api key for cpaas systems
 * @returns promise resolving to array of account data
 **/
const listAccounts = (apiKey = "null api key") => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/accounts`,
    qs: {
      include_identities: false
    },
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json"
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will call the identity microservice to get account details
 * @param apiKey - api key for cpaas systems
 * @param accountUUID - account_uuid for an star2star account (customer)
 * @param includeIdentities - boolean to include identities in account or not
 * @returns promise resolving to an identity data
 **/
const getAccount = (apiKey = "null api key", accountUUID = "null account uuid", includeIdentities = false) => {
  const MS = util.getEndpoint("identity");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/accounts/${accountUUID}`,
    qs: {
      include_identities: includeIdentities
    },
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json"
    },
    json: true
  };

  return request(requestOptions);
};

module.exports = {
  createIdentity,
  deleteIdentity,
  login,
  lookupIdentity,
  listAccounts,
  getAccount
};