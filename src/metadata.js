/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * @async
 * @description This function will return metadata for all API's or a subset of API's
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [subsystems=""] - empty or comma-separated list of requested subsystems
 * @returns {Promise}
 */
const getMetadataSubsystems = async (
  accessToken = "null access token",
  subsystems,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("metadata");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/subsystems/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      }
    };

    if (subsystems !== undefined) {
      requestOptions.qs = { "subsystems": subsystems }
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
