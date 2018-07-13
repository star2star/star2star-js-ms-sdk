/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");
const ObjectMerge = require("object-merge");

/**
 * @async
 * @description This function will ask the cpaas pubsub service for the list of user's subscriptions.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions for this user
 */
const listUserSubscriptions = (
    user_uuid = "no user uuid provided",
    accessToken = "null accessToken"
  ) => {
    const MS = util.getEndpoint("pubsub");
  
    const requestOptions = {
      method: "GET",
      uri: `${MS}/subscriptions`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/json',
        'x-api-version': `${util.getVersion()}`
      },
      qs: {
          "user_uuid": user_uuid
      }, 
      json: true
    };
  
    return request(requestOptions);
  };

/**
 * @async
 * @description This function will delete a user subscriptions based on subscription id.
 * @param {string} [subscription_uuid="no subscription uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteSubscription = (
    subscription_uuid = "no subscription uuid provided",
    accessToken = "null accessToken"
  ) => {
    const MS = util.getEndpoint("pubsub");
  
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/subscriptions/${subscription_uuid}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/json',
        'x-api-version': `${util.getVersion()}`
      },

      json: true
    };
  
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
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions for this user
 */
const addSubscription = (
    user_uuid = "no user uuid provided",
    account_uuid = "account uuid not provided ",
    callback_url="not set callback",
    callback_headers=[],
    criteria=[], 
    subscriptions = {}, 
    accessToken = "null accessToken"
  ) => {
    const MS = util.getEndpoint("pubsub");
  
    const requestOptions = {
      method: "POST",
      uri: `${MS}/subscriptions`,
      body: {
        "user_uuid": user_uuid, 
        "account_uuid": account_uuid, 
        "callback": {
            "url": callback_url, 
            "headers": callback_headers
        },
        "criteria": criteria, 
        "events": subscriptions 
      }, 
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/json',
        'x-api-version': `${util.getVersion()}`
      },

      json: true
    };
  
    return request(requestOptions);
  };

module.exports = {
    listUserSubscriptions,
    deleteSubscription,
    addSubscription
};