/* global require module*/
"use strict";

const request = require("./requestPromise");
const util = require("./utilities");
const logger = require("./node-logger").getInstance();

console.log("!!!!", request);
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
const addSubscription = async (
  user_uuid = "no user uuid provided",
  account_uuid = "account uuid not provided ",
  callback_url = "not set callback",
  callback_headers = [],
  criteria,
  subscriptions = {},
  accessToken = "null accessToken",
  expiresDate = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/subscriptions`,
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
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },

      json: true
    };
    
    // begin temporary sms workaround
    if(Array.isArray(criteria)){
      let qs;
      const filteredCriteria = criteria.filter(elem =>{
        return !(typeof elem === "object" && elem.hasOwnProperty("qs") && (qs = elem.qs));
      });

      if(typeof qs !== "undefined"){
        requestOptions.qs = qs;
      }
      if(filteredCriteria.length > 0){
        requestOptions.body.criteria = filteredCriteria;
      }
    }
    // end temporary sms workaround
    
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
const addCustomEventSubscription = async (
  accessToken = "null accessToken",
  app_uuid = "account uuid not provided ",
  callback_url = "not set callback",
  callback_headers = [],
  criteria,
  events = [],
  expiresDate = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    
    const requestOptions = {
      "method": "POST",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      "uri": `${MS}/customevents`,
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
    if(Array.isArray(criteria) && criteria.length > 0){
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
const broadcastCustomApplication = async (
  accessToken = "null accessToken",
  app_uuid = "account uuid not provided ",
  event = "null event",
  payload = {},
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "POST",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      "uri": `${MS}/broadcasts/applications`,
      "body": {
        "app_uuid": app_uuid,
        "event": event
      },
      "json": true
    };
    Object.keys(payload).forEach(prop =>{
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
const createCustomApplication = async (
  accessToken = "null accessToken",
  app_uuid = "account uuid not provided ",
  events = [],
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "POST",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      "uri": `${MS}/applications`,
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
const deleteCustomApplication = async (
  accessToken = "null accessToken",
  app_uuid = "account uuid not provided ",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "DELETE",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      "uri": `${MS}/applications/${app_uuid}`,
      "resolveWithFullResponse": true,
      "json": true
    };   
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return {"status": "ok"};
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
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
const deleteCustomSubscription = async (
  accessToken = "null accessToken",
  subscription_uuid = "no subscription uuid provided",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");

    const requestOptions = {
      "method": "DELETE",
      "uri": `${MS}/customevents/${subscription_uuid}`,
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      "resolveWithFullResponse": true,
      "json": true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return {"status": "ok"};
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
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
const deleteSubscription = async (
  subscription_uuid = "no subscription uuid provided",
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");

    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/subscriptions/${subscription_uuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return {"status": "ok"};
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete pubsub failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
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
const getCustomApplication = async (
  accessToken = "null accessToken",
  app_uuid = "account uuid not provided ",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      "method": "GET",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      "uri": `${MS}/applications/${app_uuid}`,
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
const getCustomSubscription = async (
  accessToken = "null accessToken",
  subscription_uuid = "no subscription uuid provided",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/customevents/${subscription_uuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
const getSubscription = async (
  subscription_uuid = "no subscription uuid provided",
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/subscriptions/${subscription_uuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
 * @description - This function will return a custom subscription
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [appUUID="no app uuid provided"] - custom application uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise} - promise resolving to object containing items array of subscriptions
 */
const listCustomSubscriptions = async (
  accessToken = "null accessToken",
  appUUID = "no app uuid provided",
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/customevents`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        app_uuid: appUUID,
        offset: offset,
        limit: limit
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
 * @description This function will ask the cpaas pubsub service for the list of user's subscriptions.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="no account uuid provided"] - cpaas account uuid
 * @param {number} [offset=0] pagination offset
 * @param {number} [limit=10] pagination limit
 * @param {object} filters optional response filters in key-value
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of subscriptions
 */
 const listAccountSubscriptions = async (
  accessToken = "null accessToken",
  accountUUID = "no user uuid provided",
  offset = 0,
  limit = 10,
  filters,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/subscriptions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        account_uuid: accountUUID,
        offset: offset,
        limit: limit
      },
      json: true
    };

    let response;
    if (typeof filters !== "undefined" && (typeof filters !== "object" || filters === null)) {
      // filter param has been passed in, make sure it is an array befor proceeding
      throw {
        "code": 400,
        "message": "filters param not an object",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": [{"filters": filters}]
      };
    }

    if (typeof filters === "undefined" || Object.keys(filters).length === 0) {
      requestOptions.qs.offset = offset;
      requestOptions.qs.limit = limit;
      response = await request(requestOptions);
      return response;
    } else {
      response = await util.aggregate(request, requestOptions, trace);
      //logger.debug("****** AGGREGATE RESPONSE *******",response);
      if (response.hasOwnProperty("items") && response.items.length > 0) {
        const filteredResponse = util.filterResponse(response, filters);
        //logger.debug("******* FILTERED RESPONSE ********",filteredResponse);
        const paginatedResponse = util.paginate(
          filteredResponse,
          offset,
          limit
        );
        //logger.debug("******* PAGINATED RESPONSE ********",paginatedResponse);
        return paginatedResponse;
      } else {
        return response;
      } 
    }
  } catch (error) {
    throw util.formatError(error);
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
 const listSubscriptions = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/subscriptions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {},
      json: true
    };

    let response;
    if (typeof filters !== "undefined" && (typeof filters !== "object" || filters === null)) {
      // filter param has been passed in, make sure it is an array befor proceeding
      throw {
        "code": 400,
        "message": "filters param not an object",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": [{"filters": filters}]
      };
    }

    if (typeof filters === "undefined" || Object.keys(filters).length === 0) {
      requestOptions.qs.offset = offset;
      requestOptions.qs.limit = limit;
      response = await request(requestOptions);
      return response;
    } else {
      response = await util.aggregate(request, requestOptions, trace);
      // logger.debug("****** AGGREGATE RESPONSE *******",response);
      if (response.hasOwnProperty("items") && response.items.length > 0) {
        const filteredResponse = util.filterResponse(response, filters);
        // logger.debug("******* FILTERED RESPONSE ********",filteredResponse);
        const paginatedResponse = util.paginate(
          filteredResponse,
          offset,
          limit
        );
        //logger.debug("******* PAGINATED RESPONSE ********",paginatedResponse);
        return paginatedResponse;
      } else {
        return response;
      } 
    }
  } catch (error) {
    throw util.formatError(error);
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
const listUserSubscriptions = async (
  user_uuid = "no user uuid provided",
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/subscriptions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
 * @param {string} subscriptionUUID - subscription uuid
 * @param {object} [body="null body"] - subscription
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - Promise resolving to a data object containing updated subscription
 */
 const updateSubscription = async (
  accessToken = "null accessToken",
  subscriptionUUID,
  body = "null body",
  trace = {}
) => {
  try {
    if(typeof body !== "object" || body === null){
      throw {
        code: 400,
        message: "request body invalid format"
      };
    }
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/subscriptions/${subscriptionUUID}`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
 * @description This function updates a subscription expiration date
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {*} subscriptionUUID - uuid for a star2star user
 * @param {*} [expiresDate=new Date(Date.now()).toISOString()]
 * @param {*} [trace={}]
 * @returns {Promise<object>} - Promise resolving to a data object containing updated subscription
 */
const updateSubscriptionExpiresDate = async (
  accessToken = "null accessToken",
  subscriptionUUID,
  expiresDate = new Date(Date.now()).toISOString(),
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("pubsub");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/subscriptions/${subscriptionUUID}`,
      body: {
        expiration_date: expiresDate
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
  listCustomSubscriptions,
  listAccountSubscriptions,
  listSubscriptions,
  listUserSubscriptions,
  updateSubscription,
  updateSubscriptionExpiresDate 
};
