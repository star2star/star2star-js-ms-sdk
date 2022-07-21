/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function lists lambdas
 * @param {string} [accessToken='null access Token'] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const listLambdas = async (
  accessToken = "null access Token",
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("lambda");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/actions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-Type": "application/json"
      },
      qs: {
        limit: limit,
        skip: offset
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [lambdaName='not defined'] - string representing the lambda name
 * @param {object} [params={}] - json object of parameters to be passed to the lambda function
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const invokeLambda = async (
  accessToken = "null access Token",
  lambdaName = "not defined",
  params = {},
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("lambda");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/actions/${lambdaName}/invoke`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-Type": "application/json"
      },
      body: params,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  listLambdas,
  invokeLambda
};
