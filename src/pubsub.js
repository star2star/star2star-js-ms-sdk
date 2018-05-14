/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");
const ObjectMerge = require("object-merge");
/**
 * This function will ask the cpaas pubsub service for the list of user's subscriptions
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
const listUserSubscriptions = (
    user_uuid = "no user uuid provided",
    accessToken = "null accessToken"
  ) => {
    const MS = util.getEndpoint("pubsub");
  
    const requestOptions = {
      method: "GET",
      uri: `${MS}/subscriptions`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
        "x-api-version": 'v1'
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
const deleteSubscription = (
    subscription_uuid = "no subscription uuid provided",
    accessToken = "null accessToken"
  ) => {
    const MS = util.getEndpoint("pubsub");
  
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/subscriptions/${subscription_uuid}`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
        "x-api-version": 'v1'
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
const addSubscription = (
    user_uuid = "no user uuid provided",
    account_uuid = "account uuid not provided ",
    callback_url="not set callback",
    callback_headers=[], 
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
        "events": subscriptions 
      }, 
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
        "x-api-version": 'v1'
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