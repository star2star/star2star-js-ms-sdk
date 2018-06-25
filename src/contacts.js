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
 * @returns {Promise<object>} - Promise resolving to a contact data object
 */
const createUserContact = (
  accessToken = "null accessToken",
  userUuid = "null user uuid",
  contactData = {}
) => {
  const MS = util.getEndpoint("contacts");
  //console.log('MMMMSSSSS', MS, contactData);

  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUuid}/contacts`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    body: contactData,
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas contacts service to delete a contact
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [contactUUID="null contact uuid"] - contact UUID to be used
 * @returns {Promise} - Promise resolving to a data object
 */
const deleteContact = (
  accessToken = "null accessToken",
  contactUUID = "null contact uuid"
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/contacts/${contactUUID}`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas contacts service to get user contacts based on input criteria
 * @param {string} [user_uuid="null user uuid"]
 * @param {object} [params={}] - object containing query params
 * @param {*} accessToken - access token
 * @returns {Promise<object>} - Promise resolving to a data object containing collection of user contacts
 */
const getContacts = (
  user_uuid = "null user uuid",
  params = {},
  accessToken
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/contacts`,
    qs: { ...params
    },
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json",
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};


/**
 * @async
 * @description This function will call getContacts one or more times to list all user contacts
 * @param {string} [user_uuid="null user uuid"]
 * @param {object} [params={}] - object containing query params
 * @param {*} accessToken - access token
 * @returns {Promise<object>} - Promise resolving to a data object containing collection of user contacts
 */
const listContacts = (user_uuid="missing uuid", params, accessToken) => {
  return new Promise((resolve, reject) => {
    // this array will accumulate the contact list
    let returnContacts = [];
    let parameters = {};
    // make initial call to get first contacts
    getContacts(user_uuid,  params, accessToken).then((contactData) => {
      resolve(contactData);
    }).catch((e) => {
      console.log('Error getting contacts', e);
      reject(e);
    });
  });


};

module.exports = {
  createUserContact,
  deleteContact,
  listContacts
};