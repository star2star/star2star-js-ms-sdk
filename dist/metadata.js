/* global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");
/**
 * @async
 * @description This function will return metadata for all API's or a subset of API's
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [subsystems=""] - empty or comma-separated list of requested subsystems
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise}
 */


const getMetadataSubsystems = async function getMetadataSubsystems() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let subsystems = arguments.length > 1 ? arguments[1] : undefined;
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("metadata");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/subsystems/"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };

    if (subsystems !== undefined) {
      requestOptions.qs = {
        "subsystems": subsystems
      };
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  getMetadataSubsystems
};