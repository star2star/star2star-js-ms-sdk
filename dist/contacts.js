/*global require module*/
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var request = require("request-promise");
var util = require("./utilities");

/**
 * @async
 * @description This function will ask the cpaas contacts service to create a contact.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user UUID to be used
 * @param {*} [contactData={}] - contact data object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a contact data object
 */
var createUserContact = function createUserContact() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var contactData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("contacts");
  //console.log('MMMMSSSSS', MS, contactData);

  var requestOptions = {
    method: "POST",
    uri: MS + "/users/" + userUuid + "/contacts",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
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
var deleteContact = function deleteContact() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var contactUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null contact uuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("contacts");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/contacts/" + contactUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
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
var getContacts = function getContacts() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var accessToken = arguments[2];
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("contacts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + user_uuid + "/contacts",
    qs: _extends({}, params),
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);ß;
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
var listContacts = function listContacts() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "missing uuid";
  var params = arguments[1];
  var accessToken = arguments[2];
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return new Promise(function (resolve, reject) {
    // this array will accumulate the contact list
    var returnContacts = [];
    var parameters = {};
    // make initial call to get first contacts
    getContacts(user_uuid, params, accessToken, trace).then(function (contactData) {
      resolve(contactData);
    }).catch(function (e) {
      console.log("Error getting contacts", e);
      reject(e);
    });
  });
};

module.exports = {
  createUserContact: createUserContact,
  deleteContact: deleteContact,
  listContacts: listContacts
};