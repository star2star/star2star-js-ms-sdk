/*global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");
/**
 * @async
 * @description This function will ask the cpaas contacts service to create a contact.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user UUID to be used
 * @param {*} [contactData={}] - contact data object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a contact data object
 */


const createUserContact = async function createUserContact() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let contactData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("contacts"); //console.log('MMMMSSSSS', MS, contactData);

    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/").concat(userUuid, "/contacts"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: contactData,
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
 * @description This function will ask the cpaas contacts service to delete a contact
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [contactUUID="null contact uuid"] - contact UUID to be used
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - Promise resolving to a data object
 */


const deleteContact = async function deleteContact() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let contactUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null contact uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("contacts");
    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/contacts/").concat(contactUUID),
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
        "message": typeof response.body === "string" ? response.body : "delete contact failed",
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
 * @description - This function will return 
 * @param {string} [accessToken="null access token"]
 * @param {string} [user_uuid="null user uuid"]
 * @param {*} [trace={}]
 * @returns
 */


const exportContacts = async function exportContacts() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("contacts");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/").concat(user_uuid, "/contacts"),
      qs: {
        "offset": 0,
        "limit": 999
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await util.aggregate(request, requestOptions, trace);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @description This function return a single contact by uuid
 * @async
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [contactUUID="null contact_uuid"] - contact uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - promise resolving to a contact object
 */


const getContact = async function getContact() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let contactUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null contact_uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("contacts");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/contacts/").concat(contactUUID),
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
 * @description This function will list a user's contacts
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [user_uuid="null user_uuid"] - user uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters={}] - optional filters or search params
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns
 */


const listContacts = async function listContacts() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user_uuid";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("contacts");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/").concat(user_uuid, "/contacts"),
      qs: {
        offset: offset,
        limit: limit
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will update a contact
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [contactUUID="null contactUUID"] - contact uuid
 * @param {string} [body="null body"] - contact data (PUT)
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to updated contact data
 */


const updateContact = async function updateContact() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let contactUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null contactUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("contacts");
    const requestOptions = {
      method: "PUT",
      uri: "".concat(MS, "/contacts/").concat(contactUUID),
      body: body,
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
  createUserContact,
  deleteContact,
  getContact,
  exportContacts,
  listContacts,
  updateContact
};