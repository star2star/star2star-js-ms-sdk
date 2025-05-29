/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function will return UCaaS destinations for a given CPaaS account_uuid.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=100] - number of destinations to return
 * @param {object} [filters = {}] - optional array of key-value pairs to filter response.
 * @param {boolean} [aggregate=false] - retrieves all results for client side search or pagination
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getAccountDestinations = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  offset = 0,
  limit = 100,
  filters = {},
  aggregate = false,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("dbsip");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/destinations`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    if (typeof filters === "object" && filters !== null) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    } else {
      throw {code: 400, message: "Invalid filters parameter. Must be an object."};
    }
    let response;
    if (aggregate === true) {
      const nextTrace = util.generateNewMetaData(trace);
      response = await util.aggregate(request, requestOptions, nextTrace);
    } else {
      util.addRequestTrace(requestOptions, trace);
      response = await request(requestOptions);
    }
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will return UCaaS destination by ID.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [destinationId="null destinationId"] - destination id
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getDestinationById = async (
  accessToken = "null accessToken",
  destinationId = "null destinationId",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("dbsip");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/destinations/${destinationId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  getAccountDestinations,
  getDestinationById
};
