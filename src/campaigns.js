/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");
const logger = require("./node-logger").getInstance();

/**
 * @async
 * @description - This function will create an SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a new 10DLC Brand
 */
const createBrand = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  legalName,
  brandName,
  organizationType,
  registrationCountry = "US",
  taxId,
  taxIdCountry = "US",
  altBusinessIdType,
  altBusinessId,
  vertical,
  address,
  city,
  state,
  postalCode,
  website,
  stockSymbol,
  stockExchange,
  emailAddress,
  phoneNumber,
  firstName,
  lastName,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/10dlc/customers`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json",
      },
      body: {
        legal_name: legalName,
        brand_name: brandName,
        organization_type: organizationType,
        registration_country: registrationCountry,
        e_i_n: taxId,
        e_i_n_country: taxIdCountry,
        alt_business_id_type: altBusinessIdType,
        alt_business_id: altBusinessId,
        vertical: vertical,
        address: address,
        city: city,
        state: state,
        postal_code: postalCode,
        website: website,
        stock_symbol: stockSymbol,
        stock_exchange: stockExchange,
        email_address: emailAddress,
        phone_number: phoneNumber,
        first_name: firstName,
        last_name: lastName,
        account_uuid: accountUUID,
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
 * @description - This function will delete an SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object confirming the delete request was received
 */
const deleteBrand = async (
  accessToken = "null accessToken",
  accountUUID,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/10dlc/customers/${accountUUID}`,
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
 * @description - This function will get an SMS 10DLC Brand
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID] - account uuid to provision on behalf of
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing a CPaaS account 10DLC brand registrations
 */
const getBrand = async (
  accessToken = "null accessToken",
  accountUUID,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/customers/${accountUUID}`,
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
 * @description - This function will deprovision numbers from a CPaaS account and/or user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a object containing deprovisioning confirmation details
 */
const getEnumerations = async (
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("campaigns");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/10dlc/help/get_enumerations`,
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

module.exports = {
  createBrand,
  deleteBrand,
  getBrand,
  getEnumerations
};
