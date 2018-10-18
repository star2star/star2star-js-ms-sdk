/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");

/**
 * @async
 * @description This function will ask the cpaas pubsub service for the list of user's subscriptions.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions for this user
 */
var listUserSubscriptions = function listUserSubscriptions() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("pubsub");

  var requestOptions = {
    method: "GET",
    uri: MS + "/subscriptions",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    qs: {
      user_uuid: user_uuid
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will delete a user subscriptions based on subscription id.
 * @param {string} [subscription_uuid="no subscription uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
var deleteSubscription = function deleteSubscription() {
  var subscription_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no subscription uuid provided";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("pubsub");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/subscriptions/" + subscription_uuid,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },

    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will add a subscription.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [account_uuid="account uuid not provided "] - account to subscribe to
 * @param {string} [callback_url="not set callback"] - callback URL
 * @param {array} [callback_headers=[]] - callback headers
 * @param {array} [criteria=[]] - filter criteria
 * @param {object} [subscriptions={}] - events to subscribe to (voice, fax, conferencing, messagin, sms,  presence)
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions for this user
 */
var addSubscription = function addSubscription() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  var account_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  var callback_url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "not set callback";
  var callback_headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var criteria = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var subscriptions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var accessToken = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "null accessToken";
  var trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

  var MS = util.getEndpoint("pubsub");

  var requestOptions = {
    method: "POST",
    uri: MS + "/subscriptions",
    body: {
      user_uuid: user_uuid,
      account_uuid: account_uuid,
      callback: {
        url: callback_url,
        headers: callback_headers
      },
      criteria: criteria,
      events: subscriptions
    },
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },

    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  listUserSubscriptions: listUserSubscriptions,
  deleteSubscription: deleteSubscription,
  addSubscription: addSubscription
};