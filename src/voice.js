/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function returns extensions associated with a given account
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - cpaas account uuid
 * @param {string} [accountType="customer"] - cpaas account type
 * @param {string} [include=""] - optional query param "include"
 * @param {int} [offset=0] - items offset
 * @param {int} [limit=100] - items limit
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */
const getExtensionsByAccount = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  accountType = "customer",
  include = "",
  offset = 0,
  limit = 100,
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("voice");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/extension`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        account_type: accountType,
        account_uuid: accountUUID,
        limit: 100,
        offset: 0,
      },
      json: true,
    };

    // add include query param if defined
    if (typeof include === "string" && include.length > 0) {
      requestOptions.qs.include = include;
    }

    const response = await util.aggregate(request, requestOptions, nextTrace);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  getExtensionsByAccount,
};
