/* global require module*/
"use strict";
const request = require("./requestPromise");
const util = require("./utilities");

/**
 * @async
 * @description This function will return a list of push notification registrations by user uuid
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null fileUUID"] - user UUID
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing user push notification registrations
 */
const getUserRegistrations = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/registration`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        "user_uuid": userUUID
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
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {string} [userUUID="no user uuid provided"] - UUID for user
 * @param {string} [pushToken="no push token provided"]
 * @param {string} [pushToken="no push token provided"]
 * @param {string} [application="no application provided"]
 * @param {string} [platform="no platform provided"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - promise resolving to registration object 
 */
const registerPushToken = async (
  accessToken = "null accessToken",
  userUUID = "no user uuid provided",
  deviceID = "no device uuid provided",
  pushToken = "no push token provided",
  application = "no application provided",
  platform = "no platform provided",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      "method": "POST",
      "uri": `${MS}/registration`,
      "headers": {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      "body": {
        "user_uuid": userUUID,
        "device_id": deviceID,
        "push_token": pushToken,
        "application": application,
        "platform": platform
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
 * @description This function will send a push notification to a mobile device
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [application="no application provided"] - target application
 * @param {string} [userUUID="no user uuid provided"] - user uuid
 * @param {array} [userUUID="no user uuid provided"] - array of device_ids to send notification to
 * @param {object} [data=undefined] - optional additiona data to accompany the message text as payload
 * @param {object} [platformData=undefined] - optional platform (ios/android) specific payload data
 * @param {string} [title=undefined] - notification title
 * @param {string} [message=undefined] - notification messge
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - promise resolving to a push notification object
 */
const sendPushNotification = async (
  accessToken = "null accessToken",
  application = "no application provided",
  userUUID = "no user uuid provided",
  deviceIDs = "no deviceIDs array provided",
  title = undefined,
  message = undefined,
  data = undefined,
  platformData = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      "method": "POST",
      "uri": `${MS}/notification`,
      "headers": {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      "body": {
        "application": application,
        "user_uuid": userUUID,
        "device_ids": deviceIDs
      },
      "json": true
    };

    const optionalParams = {
      "title": title,
      "message": message,
      "data": data,
      "platform_specific_data": platformData,
    };

    Object.keys(optionalParams).forEach(param => {
      if(typeof optionalParams[param] !== "undefined"){
        requestOptions.body[param] = optionalParams[param];
      }
    });
    
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {string} [pushToken="no push token provided"]
 * @returns {Promise<object>} - promise resolving to success or failure
 */
const unregisterPushToken = async (
  accessToken = "null accessToken",
  pushToken = "no push token provided",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      "method": "DELETE",
      "uri": `${MS}/registration/${pushToken}`,
      "headers": {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      "resolveWithFullResponse": true,
      "json": true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.statusCode === 202) {
      return {status: "ok"};
    } else {
      throw util.formatError(response);
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  getUserRegistrations,
  registerPushToken,
  sendPushNotification,
  unregisterPushToken
};
