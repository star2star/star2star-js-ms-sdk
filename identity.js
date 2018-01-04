"use strict";
const util = require('./utilities');
const request = require('request-promise');

/**
* This function will call the identity microservice with the credentials and
* api key you passed in
* @param apiKey - api key for cpaas systems
* @param email - email address for an star2star account
* @param pwd - passowrd for that account
* @returns promise resolving to an identity data
**/
const getIdentity = (apiKey='null api key', email='null email', pwd='null pwd')=>{
  const MS = util.getEndpoint(process.env.NODE_ENV, "identity");
  const requestOptions = {
    method: 'POST',
    uri: `${MS}/users/login`,
    headers: {
        'application-key': apiKey,
        'Content-type': 'application/json'
    },
    body: {
      "email": email,
      "password": pwd
    },
    json: true
  };

  return request(requestOptions);
}

/**
* This function will call the identity microservice to refresh user based on token
* @param apiKey - api key for cpaas systems
* @param email - email address for an star2star account
* @param pwd - passowrd for that account
* @returns promise resolving to an identity data
**/
const refreshToken = (apiKey='null api key', token='null token' )=>{
  const MS = util.getEndpoint(process.env.NODE_ENV, "identity");
  const requestOptions = {
    method: 'POST',
    uri: `${MS}/oauth/token`,
    headers: {
        'application-key': apiKey,
        'Content-type': 'application/json'
    },
    body: {
      "refresh_token": token
    },
    json: true
  };

  return request(requestOptions);
}

module.exports = { getIdentity, refreshToken }
