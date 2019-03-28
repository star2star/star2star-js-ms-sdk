/*global require module*/
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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


const createUserContact = function createUserContact() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let contactData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
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
  return request(requestOptions);
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
      return Promise.resolve({
        "status": "ok"
      });
    }

    throw response;
  } catch (error) {
    return Promise.reject({
      "statusCode": error.hasOwnProperty("statusCode") ? error.statusCode : 500,
      //js errors should have a message. non 204 response codes should have a statusMessage
      "message": error.hasOwnProperty("message") ? error.message : error.statusMessage
    });
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
};
/**
 * @async
 * @description This function will ask the cpaas contacts service to get user contacts based on input criteria
 * @param {string} [user_uuid="null user uuid"]
 * @param {object} [params={}] - object containing query params
 * @param {*} accessToken - access token
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing collection of user contacts
 */


const getContacts = function getContacts() {
  let user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let accessToken = arguments.length > 2 ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/users/").concat(user_uuid, "/contacts"),
    qs: _objectSpread({}, params),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(util.getVersion())
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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


const listContacts = function listContacts() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user_uuid";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
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

  return request(requestOptions);
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


const updateContact = function updateContact() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  let contactUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null contactUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
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
  return request(requestOptions);
};

module.exports = {
  createUserContact,
  deleteContact,
  exportContacts,
  listContacts,
  updateContact
};