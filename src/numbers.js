/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");
const logger = require("./node-logger").getInstance();

/**
 * @async
 * @description - This function will deprovision numbers from a CPaaS account and/or user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {array} [numbers=[]] - array of numbers to provision
 * @param {string} [provider="VI"] - optional number provider to associate with
 * @param {string} [accountUUID] - optional account uuid to provision on behalf of
 * @param {string} [userUUID] - optional user uuid to provision on behalf of
 * @param {string} [countryFormat] - optional country code to use to format and validate the provided numbers, defaults to "US"
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing deprovisioning confirmation details
 */
const deprovisionNumbers = async (
  accessToken = "null accessToken",
  numbers = [],
  provider = "VI",
  accountUUID,
  userUUID,
  countryFormat,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/deprovision`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        numbers: numbers,
        provider: provider,
        account_uuid: accountUUID,
        user_uuid: userUUID,
        country_format: countryFormat,
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
        "Content-type": "application/json",
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
        "Content-type": "application/json",
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
        "Content-type": "application/json",
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

/**
 * @async
 * @description - This function will list numbers provisioned to a CPaaS account
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - cpaas account_uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const getProvisionedNumbersByAccount = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/provision/numbers/account/${accountUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      qs:{
        offset: offset,
        limit: limit
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

/**
 * @async
 * @description - This function will list numbers provisioned to a CPaaS user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - cpaas user_uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const getProvisionedNumbersByUser = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/provision/numbers/user/${userUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      qs:{
        offset: offset,
        limit: limit
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


/**
 * @async
 * @description - This function will list numbers available for purchase
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [quantity=5] - number of DIDs to return
 * @param {string} [network="VI"] - telephony network
 * @param {string} [state] - 2 letter US state code
 * @param {string} [rateCenter] - town or population center name
 * @param {number} [areaCode] - npa or area code
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a list of available DIDs
 */
const listAvailableNumbers = async (
  accessToken = "null accessToken",
  quantity = 5,
  network = "VI",
  state,
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
        "Content-type": "application/json",
      },
      qs: {
        qty: quantity,
        network: network,
        state: state,
      },
      json: true,
    };
    if (typeof rateCenter === "string") {
      requestOptions.qs.ratecenter = rateCenter;
    }
    if (typeof areaCode === "string" || typeof areaCode === "number") {
      requestOptions.qs.npa = areaCode;
    }
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description - This function will provision numbers to a CPaaS account and/or user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {array} [numbers=[]] - array of numbers to provision
 * @param {string} [provider="VI"] - optional number provider to associate with
 * @param {string} [accountUUID] - optional account uuid to provision on behalf of
 * @param {string} [userUUID] - optional user uuid to provision on behalf of
 * @param {string} [helpText] - optional help message for automated sms responses
 * @param {boolean} [isCampaign] - optional sms campaign number, defaults to true
 * @param {string} [referenceID] - optional reference id
 * @param {string} [countryFormat] - optional country code to use to format and validate the provided numbers, defaults to "US"
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing provisioning confirmation details
 */
const provisionNumbers = async (
  accessToken = "null accessToken",
  numbers = [],
  provider = "VI",
  accountUUID,
  userUUID,
  helpText,
  isCampaign,
  referenceID,
  countryFormat,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/provision`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        numbers: numbers,
        account_uuid: accountUUID,
        user_uuid: userUUID,
        provider: provider,
        help_text: helpText,
        is_campaign: isCampaign,
        reference_id: referenceID,
        country_format: countryFormat,
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

/**
 * @async
 * @description - This function will update the automated help message for the provided numbers
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {array} [numbers=[]] - array of numbers to provision
 * @param {string} [helpText] - help message for automated sms responses
 * @param {string} [countryFormat] - optional country code to use to format and validate the provided numbers, defaults to "US"
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing provisioning confirmation details
 */
const provisionNumbersHelp = async (
  accessToken = "null accessToken",
  numbers = [],
  helpText,
  countryFormat,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/provision/numbers/help`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        numbers: numbers,
        help_text: helpText,
        country_format: countryFormat,
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

/**
 * @async
 * @description - This function will update the reference id for the provided numbers
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {array} [numbers=[]] - array of numbers to provision
 * @param {string} [referenceID] - reference id
 * @param {string} [referenceText] - reference text
 * @param {string} [countryFormat] - optional country code to use to format and validate the provided numbers, defaults to "US"
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing provisioning confirmation details
 */
const provisionNumbersReference = async (
  accessToken = "null accessToken",
  numbers = [],
  referenceID,
  referenceText,
  countryFormat,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/provision/numbers/reference`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        numbers: numbers,
        reference_id: referenceID,
        reference_text, referenceText,
        country_format: countryFormat,
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
  deprovisionNumbers,
  getAvailableAreaCodes,
  getAvailableRateCenters,
  getAvailableStates,
  getProvisionedNumbersByAccount,
  getProvisionedNumbersByUser,
  listAvailableNumbers,
  provisionNumbers,
  provisionNumbersHelp,
  provisionNumbersReference
};
