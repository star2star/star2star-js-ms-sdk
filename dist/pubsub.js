/* global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");
/**
 * @async
 * @description This function will add a subscription.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [account_uuid="account uuid not provided "] - account to subscribe to
 * @param {string} [callback_url="not set callback"] - callback URL
 * @param {array}  [callback_headers=[]] - callback headers
 * @param {array}  criteria - optional filter criteria
 * @param {object} [subscriptions={}] - events to subscribe to (voice, fax, conferencing, messagin, sms,  presence)
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [expiresDate=undefined] - optional expires date (RFC3339 format)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a new subscription
 */


const addSubscription = async function addSubscription() {
  let user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  let account_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  let callback_url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "not set callback";
  let callback_headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  let criteria = arguments.length > 4 ? arguments[4] : undefined;
  let subscriptions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  let accessToken = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "null accessToken";
  let expiresDate = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : undefined;
  let trace = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/subscriptions"),
      body: {
        user_uuid: user_uuid,
        account_uuid: account_uuid,
        callback: {
          url: callback_url,
          headers: callback_headers
        },
        //criteria: criteria, temporary sms workaround
        events: subscriptions
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    }; // begin temporary sms workaround

    if (Array.isArray(criteria)) {
      let qs;
      const filteredCriteria = criteria.filter(elem => {
        return !(typeof elem === "object" && elem.hasOwnProperty("qs") && (qs = elem.qs));
      });

      if (typeof qs !== "undefined") {
        requestOptions.qs = qs;
      }

      if (filteredCriteria.length > 0) {
        requestOptions.body.criteria = filteredCriteria;
      }
    } // end temporary sms workaround


    if (expiresDate) {
      requestOptions.body.expiration_date = expiresDate;
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
 * @description This function will add a subscription for a custom application and event.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [app_uuid="app_uuid uuid not provided "] - account to subscribe to
 * @param {string} [callback_url="not set callback"] - callback URL
 * @param {array}  [callback_headers=[]] - callback headers
 * @param {array}  criteria - optional filter criteria
 * @param {object} [events={}] - events to subscribe to (voice, fax, conferencing, messagin, sms,  presence)
 * @param {string} [expiresDate=undefined] - optional expires date (RFC3339 format)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a new subscription
 */


const addCustomEventSubscription = async function addCustomEventSubscription() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let app_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  let callback_url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "not set callback";
  let callback_headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  let criteria = arguments.length > 4 ? arguments[4] : undefined;
  let events = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  let expiresDate = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  let trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      "uri": "".concat(MS, "/customevents"),
      "body": {
        "app_uuid": app_uuid,
        "callback": {
          "url": callback_url,
          "headers": callback_headers
        },
        "events": events
      },
      "json": true
    };

    if (Array.isArray(criteria) && criteria.length > 0) {
      requestOptions.body.criteria = criteria;
    }

    if (expiresDate) {
      requestOptions.body.expiration_date = expiresDate;
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
 * @description - This function will send a message to subscribers of a custom application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application uuid
 * @param {string} [event="null event"] - even string to broadcast
 * @param {object} [payload={}] - data to include in the broadcast
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to success or failure
 */


const broadcastCustomApplication = async function broadcastCustomApplication() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let app_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  let event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null event";
  let payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      "uri": "".concat(MS, "/broadcasts/applications"),
      "body": {
        "app_uuid": app_uuid,
        "event": event
      },
      "json": true
    };
    Object.keys(payload).forEach(prop => {
      requestOptions.body[prop] = payload[prop];
    });
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description - This function will create a custom pubsub application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application_uuid
 * @param {array} [events=[]] - events as array of objects
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to success or failure
 */


const createCustomApplication = async function createCustomApplication() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let app_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  let events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      "uri": "".concat(MS, "/applications"),
      "body": {
        "app_uuid": app_uuid,
        "events": events
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
 * @desc - This function will delete a custom pubsub application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application uuid
 * @param {*} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to success or failure
 */


const deleteCustomApplication = async function deleteCustomApplication() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let app_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "DELETE",
      "headers": {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      "uri": "".concat(MS, "/applications/").concat(app_uuid),
      "resolveWithFullResponse": true,
      "json": true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description - This function will delete a custom subscription
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [subscription_uuid="no subscription uuid provided"]
 * @param {*} [trace={}]
 * @returns {Promise} - promise resolving to success or failure
 */


const deleteCustomSubscription = async function deleteCustomSubscription() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let subscription_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no subscription uuid provided";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "DELETE",
      "uri": "".concat(MS, "/customevents/").concat(subscription_uuid),
      "headers": {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      "resolveWithFullResponse": true,
      "json": true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will delete a user subscriptions based on subscription id.
 * @param {string} [subscription_uuid="no subscription uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


const deleteSubscription = async function deleteSubscription() {
  let subscription_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no subscription uuid provided";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/subscriptions/").concat(subscription_uuid),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description - This function will return a custom pubsub application
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [app_uuid="account uuid not provided "] - application uuid
 * @param {*} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to custom application object
 */


const getCustomApplication = async function getCustomApplication() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let app_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "account uuid not provided ";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "GET",
      "headers": {
        "Authorization": "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      "uri": "".concat(MS, "/applications/").concat(app_uuid),
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
 * @description - This function will return a custom subscription
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [subscription_uuid="no subscription uuid provided"]
 * @param {*} [trace={}]
 * @returns {Promise} - promise resolving to subscription object
 */


const getCustomSubscription = async function getCustomSubscription() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let subscription_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "no subscription uuid provided";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/customevents/").concat(subscription_uuid),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
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
 * @description This function will get a user subscription based on subscription id.
 * @param {string} [subscription_uuid="no subscription uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


const getSubscription = async function getSubscription() {
  let subscription_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no subscription uuid provided";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/subscriptions/").concat(subscription_uuid),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
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
 * @description This function will ask the cpaas pubsub service for the list of user's subscriptions.
 * @param {string} [user_uuid="no user uuid provided"] - uuid for a star2star user
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions for this user
 */


const listUserSubscriptions = async function listUserSubscriptions() {
  let user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/subscriptions"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        user_uuid: user_uuid
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
 * @description This function updates a subscription expiration date
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {*} subscriptionUUID - uuid for a star2star user
 * @param {*} [expiresDate=new Date(Date.now()).toISOString()]
 * @param {*} [trace={}]
 * @returns {Promise<object>} - Promise resolving to a data object containing updated subscription
 */


const updateSubscriptionExpiresDate = async function updateSubscriptionExpiresDate() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let subscriptionUUID = arguments.length > 1 ? arguments[1] : undefined;
  let expiresDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date(Date.now()).toISOString();
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "PUT",
      uri: "".concat(MS, "/subscriptions/").concat(subscriptionUUID),
      body: {
        expiration_date: expiresDate
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
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

module.exports = {
  addSubscription,
  addCustomEventSubscription,
  broadcastCustomApplication,
  createCustomApplication,
  deleteCustomApplication,
  deleteCustomSubscription,
  deleteSubscription,
  getCustomApplication,
  getCustomSubscription,
  getSubscription,
  listUserSubscriptions,
  updateSubscriptionExpiresDate
};