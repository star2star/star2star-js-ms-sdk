/* global require module*/
"use strict";

const request = require("request-promise");
const util = require("./utilities");


/**
 * @async
 * @description This function list user forms.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=100] - pagination limit
 * @param {object} [filter=undefined] - optional filter options 
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const listUserForms = async (
  accessToken = "null access token",
  accountUUID = undefined,
  offset = 0,
  limit = 100,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/forms`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset: offset,
        limit: limit,
        account_uuid: accountUUID
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    // console.log('hhhhhh', requestOptions)
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};


module.exports = {
  listUserForms
};
