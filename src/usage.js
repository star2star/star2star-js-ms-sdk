/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");
 
/**
 * @async
 * @description This function creates a new usage event.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="undefined"] - account UUID
 * @param {string} [applicationUUID="undefined"] - application UUID
 * @param {string} [eventType="undefined"] - event type 
 * @param {string} [metadata="undefined"] - object containing metadata for this event
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to the created usage event object
 */
const createEvent = async (
  accessToken = "null accessToken",
  accountUUUID = undefined,
  applicationUUID = undefined,
  eventType= undefined,
  metadata = undefined,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("usage");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/events`,
      body: {
        "account_uuid": accountUUUID,
        "application_uuid": applicationUUID,
        "event_type": eventType,
        "metadata": metadata
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true,
      resolveWithFullResponse: false
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    throw util.formatError(error);
  }  
};

module.exports = {
    createEvent
};
