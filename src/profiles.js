"use strict";
const request = require("./requestPromise");
const util = require("./utilities");

/**
 * @async
 * @description This function create a user profile property 
 * @param {string} [userUUID="null userUUID"] - CPaaS user uuid
 * @param {string} [propertyName="no_property_name"] - property name
 * @param {string} [propertyValue="no_property_value"] - property value
 * @param {string} [propertyLabel=undefined] - optional property label will default to name 
 * @param {string} [propertyDesc=undefined] - optional property description will default to name 
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<redirect to 3rd party oauth2 api>} - promise resolving to redirect
 */
const createUserProperty = async (
    userUUID = "null userUUID",
    propertyName = "no_property_name",
    propertyValue = "no_property_value",
    propertyLabel = undefined, 
    propertyDesc = undefined,
    trace = {}
  ) => {
    try {
      const MS = util.getEndpoint("profiles");
  
      const requestOptions = {
        "method": "POST",
        "uri": `${MS}/users/${userUUID}/properties`,
        "headers": {
            "Authorization": `Bearer ${accessToken}`,
            "Content-type": "application/json",
            "x-api-version": `${util.getVersion()}`
          }, 
        "body": {
            "context": "user",
            "name": propertyName,
            "value": propertyValue.toString(), 
            "label": propertyLabel || propertyName,
            "description": propertyDesc || propertyName,
            "context_uuid": util.createUUID()

        },
        "json": true
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
 * @description This function will return a user profile properties
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - CPaaS user uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<redirect to 3rd party oauth2 api>} - promise resolving to redirect
 */
const listUserProperties = async (
  accessToken = "null accessToken",  
  userUUID = "null userUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("profiles");

    const requestOptions = {
      "method": "GET",
      "uri": `${MS}/users/${userUUID}/properties`,
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      }, 
      "JSON": true
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
 * @description This function updates a user profile property 
 * @param {string} [propertyUUID="null propertyUUID"] - property uuid
 * @param {object} [propertyObject={}] - property object with all props that you want to change and leave the same 
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<redirect to 3rd party oauth2 api>} - promise resolving to redirect
 */
const updateProperty = async (
    propertyUUID = "null propertyUUID",
    propertyObject = {},
    trace = {}
  ) => {
    try {
      const MS = util.getEndpoint("profiles");
  
      const requestOptions = {
        "method": "PUT",
        "uri": `${MS}/context/properties/${propertyUUID}`,
        "headers": {
            "Authorization": `Bearer ${accessToken}`,
            "Content-type": "application/json",
            "x-api-version": `${util.getVersion()}`
          }, 
        "body": propertyObject,
        "json": true
      };
      util.addRequestTrace(requestOptions, trace);
      const response = await request(requestOptions);
      return response;
    } catch (error) {
      throw util.formatError(error);
    }
  };

module.exports = {
    createUserProperty,
    listUserProperties,
    updateProperty,
  };
