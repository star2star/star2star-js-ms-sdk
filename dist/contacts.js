/*global require module*/
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var request = require("request-promise");
var util = require("./utilities");

/**
 * This function will ask the cpaas contacts service to create a contact
 *
 * @param accessToken - access token
 * @param userUuid - user UUID to be used
 * @param contactData - objedt with contact data
 * @returns promise for list of groups for this user
 **/
var createUserContact = function createUserContact() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var contactData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("contacts");
  //console.log('MMMMSSSSS', MS, contactData);

  var requestOptions = {
    method: "POST",
    uri: MS + "/users/" + userUuid + "/contacts",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    body: contactData,
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will ask the cpaas contacts service to delete a contact
 *
 * @param accessToken - access token
 * @param contactUUID - contact UUID to be used
 * @returns promise for list of groups for this user
 **/
var deleteContact = function deleteContact() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var contactUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null contact uuid";

  var MS = util.getEndpoint("contacts");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/contacts/" + contactUUID,
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will ask the cpaas contacts service to get user contacts based on input criteria
 *
 * @param apiKey - api key for cpaas systems
 * @param userUuid - user UUID to be used
 * @returns promise for list of groups for this user
 **/
var getContacts = function getContacts() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var accessToken = arguments[2];

  var MS = util.getEndpoint("contacts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + user_uuid + "/contacts",
    qs: _extends({}, params),
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-type": "application/json",
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will call getContacts one or more times to list all user contacts
 *
 * @param apiKey - api key for cpaas systems
 * @param userUuid - user UUID to be used
 * @returns promise for list of groups for this user
 **/
var listContacts = function listContacts() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "missing uuid";
  var params = arguments[1];
  var accessToken = arguments[2];

  return new Promise(function (resolve, reject) {
    // this array will accumulate the contact list
    var returnContacts = [];
    var parameters = {};
    // make initial call to get first contacts
    getContacts(user_uuid, params, accessToken).then(function (contactData) {
      resolve(contactData);
    }).catch(function (e) {
      console.log('Error getting contacts', e);
      reject(e);
    });
  });
};

module.exports = {
  createUserContact: createUserContact,
  deleteContact: deleteContact,
  listContacts: listContacts
};