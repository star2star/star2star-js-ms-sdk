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
const deleteContact = (
  accessToken = "null accessToken",
  contactUUID = "null contact uuid",
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "DELETE",
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
 * @description This function will ask the cpaas contacts service to get user contacts based on input criteria
 * @param {string} [user_uuid="null user uuid"]
 * @param {object} [params={}] - object containing query params
 * @param {*} accessToken - access token
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing collection of user contacts
 */
const getContacts = (
  user_uuid = "null user uuid",
  params = {},
  accessToken,
  trace = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/contacts`,
    qs: {
      ...params
    },
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
 * @description This function will call getContacts one or more times to list all user contacts
 * @param {string} [user_uuid="null user uuid"]
 * @param {object} [params={}] - object containing query params
 * @param {*} accessToken - access token
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing collection of user contacts
 */
const listContacts = (
  user_uuid = "missing uuid",
  params,
  accessToken,
  trace = {}
) => {
  return new Promise((resolve, reject) => {
    // this array will accumulate the contact list
    let returnContacts = [];
    let parameters = {};
    // make initial call to get first contacts
    getContacts(user_uuid, params, accessToken, trace)
      .then(contactData => {
        resolve(contactData);
      })
      .catch(e => {
        console.log("Error getting contacts", e);
        reject(e);
      });
  });
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
  listContacts,
  updateContact
};
