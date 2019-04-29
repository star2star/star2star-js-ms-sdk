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
const createUserContact = (
  accessToken = "null accessToken",
  userUuid = "null user uuid",
  contactData = {},
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  //console.log('MMMMSSSSS', MS, contactData);

  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUuid}/contacts`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
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
const deleteContact = async (
  accessToken = "null accessToken",
  contactUUID = "null contact uuid",
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("contacts");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/contacts/${contactUUID}`,
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
    if(response.hasOwnProperty("statusCode") && response.statusCode === 204) {
      return Promise.resolve({"status": "ok"});
    }
    throw response;
  } catch (error) {
   return Promise.reject({
     "statusCode": error.hasOwnProperty("statusCode") ? error.statusCode : 500,
     //js errors should have a message. non 204 response codes should have a statusMessage
     "message": error.hasOwnProperty("message") ? error.message : error.statusMessage
   })
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
const exportContacts = async (
  accessToken = "null access token",
  user_uuid = "null user uuid",
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/contacts`,
    qs: {
      "offset": 0,
      "limit": 999
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  const response = await util.aggregate(request, requestOptions, trace);
  return response;
};

/**
 * @description This function return a single contact by uuid
 * @async
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [contactUUID="null contact_uuid"] - contact uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - promise resolving to a contact object
 */
const getContact = (
  accessToken = "null access_token",
  contactUUID = "null contact_uuid",
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/contacts/${contactUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
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
const listContacts = (
  accessToken = "null access_token",
  user_uuid = "null user_uuid",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/contacts`,
    qs: {
      offset: offset,
      limit: limit
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
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
const updateContact = (
  accessToken = "null access_token",
  contactUUID = "null contactUUID",
  body = "null body",
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/contacts/${contactUUID}`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  createUserContact,
  deleteContact,
  getContact,
  exportContacts,
  listContacts,
  updateContact
};
