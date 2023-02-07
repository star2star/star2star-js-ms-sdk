/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");
const logger = require("./node-logger").getInstance();

/**
 * @async
 * @description - This function will list area codes with available numbers base on state and rate center
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [state] - US state
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const getAvailableAreaCodes = async (
  accessToken = "null accessToken",
  state,
  rateCenter,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/number/available/${state}/${rateCenter}/npas`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json"
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
 * @description - This function will list rate centers with available numbers based on the state
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [state] - US state
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const getAvailableRateCenters = async (
  accessToken = "null accessToken",
  state,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/number/available/${state}/centers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json"
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
 * @description - This function will list states with available numbers
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const getAvailableStates = async (
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/number/available/states`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json"
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
 * @description - This function will list numbers available for purchase
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [quantity=5] - number of DIDs to return
 * @param {string} [network="VI"] - telephony network
 * @param {string} [state="AL"] - US state
 * @param {string} [rateCenter] - town or population center name
 * @param {number} [areaCode] - npa or area code
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const listAvailableNumbers = async (
  accessToken = "null accessToken",
  quantity = 5,
  network = "VI",
  state = "AL",
  rateCenter,
  areaCode,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/number/available/dids`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json"
      },
      qs: {
        qty: quantity,
        network: network,
        state: state
      },
      json: true
    };
    if(typeof rateCenter === "string"){
      requestOptions.qs.rateCenter = rateCenter;
    }
    if(typeof areaCode === "string" || typeof areaCode === "number"){
      requestOptions.qs.npa = areaCode
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  } 
};



module.exports = {
  getAvailableAreaCodes,
  getAvailableRateCenters,
  getAvailableStates,
  listAvailableNumbers
};