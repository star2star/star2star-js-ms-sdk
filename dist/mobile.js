/* global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");
/**
 * @async
 * @description This function will return a list of push notification registrations by user uuid
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null fileUUID"] - user UUID
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing user push notification registrations
 */


const getUserRegistrations = async function getUserRegistrations() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/registration"),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
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
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {string} [userUUID="no user uuid provided"] - UUID for user
 * @param {string} [pushToken="no push token provided"]
 * @param {string} [application="no application provided"]
 * @param {string} [platform="no platform provided"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - promise resolving to registration object 
 */


const registerPushToken = async function registerPushToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no user uuid provided";
  let pushToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no push token provided";
  let application = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no application provided";
  let platform = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "no platform provided";
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      "method": "POST",
      "uri": "".concat(MS, "/registration"),
      "headers": {
        "Content-type": "application/json",
        "Authorization": "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      "body": {
        "user_uuid": userUUID,
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
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will send a push notification to a mobile device
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [title="no user uuid provided"] - notification title
 * @param {string} [message="no push token provided"] - notification messge
 * @param {string} [application="no application provided"] - target application
 * @param {string} [userUUID="no user uuid provided"] - user uuid
 * @param {object} [data=undefined] - optional additiona data to accompany the message text as payload
 * @param {object} [platformData=undefined] - optional platform (ios/android) specific payload data
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} - promise resolving to a push notification object
 */


const sendPushNotification = async function sendPushNotification() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no user uuid provided";
  let message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "no push token provided";
  let application = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no application provided";
  let userUUID = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "no user uuid provided";
  let data = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  let platformData = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  let trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      "method": "POST",
      "uri": "".concat(MS, "/notification"),
      "headers": {
        "Content-type": "application/json",
        "Authorization": "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      "body": {
        "title": title,
        "message": message,
        "application": application,
        "user_uuid": userUUID
      },
      "json": true
    };

    if (typeof data !== "undefined") {
      requestOptions.body.data = data;
    }

    if (typeof platformData !== "undefined") {
      requestOptions.body.platformData = platformData;
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {string} [pushToken="no push token provided"]
 * @returns {Promise<object>} - promise resolving to success or failure
 */


const unregisterPushToken = async function unregisterPushToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let pushToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no push token provided";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("mobile");
    const requestOptions = {
      "method": "DELETE",
      "uri": "".concat(MS, "/registration/").concat(pushToken),
      "headers": {
        "Content-type": "application/json",
        "Authorization": "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      "resolveWithFullResponse": true,
      "json": true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.statusCode === 202) {
      return {
        status: "ok"
      };
    } else {
      throw util.formatError(response);
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  getUserRegistrations,
  registerPushToken,
  sendPushNotification,
  unregisterPushToken
};