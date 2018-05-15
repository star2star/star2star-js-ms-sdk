/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");
var ObjectMerge = require("object-merge");
/**
 * This function will ask the cpaas pubsub service for the list of user's subscriptions
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
var listUserSubscriptions = function listUserSubscriptions() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";

  var MS = util.getEndpoint("pubsub");

  var requestOptions = {
    method: "GET",
    uri: MS + "/subscriptions",
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    qs: {
      "user_uuid": user_uuid
    },
    json: true
  };

  return request(requestOptions);
};
/**
 * This function will delete a user subscriptions based on subscription id 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
var deleteSubscription = function deleteSubscription() {
  var subscription_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no subscription uuid provided";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";

  var MS = util.getEndpoint("pubsub");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/subscriptions/" + subscription_uuid,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },

    json: true
  };

  return request(requestOptions);
};

/**
 * This function will add a subscription 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
var addSubscription = function addSubscription() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  var account_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  var callback_url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "not set callback";
  var callback_headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var subscriptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var accessToken = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "null accessToken";

  var MS = util.getEndpoint("pubsub");

  var requestOptions = {
    method: "POST",
    uri: MS + "/subscriptions",
    body: {
      "user_uuid": user_uuid,
      "account_uuid": account_uuid,
      "callback": {
        "url": callback_url,
        "headers": callback_headers
      },
      "events": subscriptions
    },
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },

    json: true
  };

  return request(requestOptions);
};

module.exports = {
  listUserSubscriptions: listUserSubscriptions,
  deleteSubscription: deleteSubscription,
  addSubscription: addSubscription
};