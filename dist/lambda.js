/* global require module*/
"use strict";

const util = require("./utilities");

const request = require("request-promise");
/**
 * @async
 * @description This function lists lambdas
 * @param {string} [accessToken='null access Token'] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


const listLambdas = function listLambdas() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access Token";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("lambda");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/actions"),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion()),
      "Content-Type": "application/json"
    },
    qs: {
      limit: limit,
      skip: offset
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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


const invokeLambda = function invokeLambda() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access Token";
  let lambdaName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not defined";
  let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("lambda");
  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/actions/").concat(lambdaName, "/invoke"),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion()),
      "Content-Type": "application/json"
    },
    body: params,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  listLambdas,
  invokeLambda
};