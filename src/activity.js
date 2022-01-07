/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function will get an already created report.
 * @param {string} [accessToken="null access token"]
 * @param {string} reportUUID
 * @param {string} templateUUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
const getReport = async (
  accessToken = "null access token",
  reportUUID = "null report uuid",
  templateUUID = "null template uuid",
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/report`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        report_uuid: reportUUID,
        template_uuid: templateUUID
      },
      resolveWithFullResponse: true,
      json: true
      
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if(response.statusCode === 204){
      return {};
    }
    return response.body;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will list available report templates.
 * @param {string} [accessToken="null access token"]
 * @param {number} [offset = 0] - pagination offset
 * @param {number} [limit = 10] = pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
const listReportTemplates = async (
  accessToken = "null access token",
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/report/template`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset: offset,
        limit: limit
      },
      resolveWithFullResponse: false,
      json: true
      
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will create a report based on a template.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [templateUuid="null account uuid"] - report template uuid
 * @param {string} [ownerUuid=undefined] - owner uuid (CPaaS user_uuid) - required if account uuid not specified
 * @param {string} [accountUuid=undefined] - CPaaS account uuid - required if owner uuid not specified
 * @param {object} [paramaters={}] - report parameters
 * @param {object} [trace={}] - optional CPaaS microservice lifecycle headers
 * @returns {Promise<object>} - Promise resolving to an object containing report uuid
 */
const runReport = async (
  accessToken = "null access token",
  templateUuid = "null account uuid",
  ownerUuid,
  accountUuid, 
  parameters = {},
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/report/${templateUuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {},
      body: {parameters: parameters},
      json: true
    };
    if(typeof ownerUuid !== "undefined"){
      requestOptions.qs.owner_uuid = ownerUuid;
    } else if(typeof accountUuid !== "undefined"){
      requestOptions.qs.account_uuid = accountUuid;
    } else {
      throw {
        "code": 400,
        "message": "request requires either owner or account uuid"
      };
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will list registered activity types
 * @param {string} [accessToken="null access token"]
 * @param {string} [include=undefined] - optional include 
 * @param {number} [offset = 0] - pagination offset
 * @param {number} [limit = 10] = pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
 const listRegisteredTypes = async (
  accessToken = "null access token",
  include=undefined,
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/register`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset,
        limit,
        include
      },
      json: true
      
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will list registered sub activity types
 * @param {string} [accessToken="null access token"]
 * @param {string} [include=undefined] - optional include 
 * @param {number} [offset = 0] - pagination offset
 * @param {number} [limit = 10] = pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
 const listRegisteredSubTypes = async (
  accessToken = "null access token",
  include=undefined,
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("activity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/register/subtype`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset,
        limit,
        include
      },
      json: true
      
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }
};

module.exports = {
  getReport,
  listReportTemplates,
  runReport,
  listRegisteredTypes,
  listRegisteredSubTypes
};
