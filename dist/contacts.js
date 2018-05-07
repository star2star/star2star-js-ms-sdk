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
      "Content-type": "application/json"
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
      "Content-type": "application/json"
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
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("contacts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUuid + "/contacts",
    qs: _extends({}, params),
    headers: {
      "application-key": apiKey,
      "Content-type": "application/json"
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
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";

  return new Promise(function (resolve, reject) {
    // this array will accumulate the contact list
    var returnContacts = [];
    var parameters = {};
    // make initial call to get first contacts
    getContacts(apiKey, userUuid).then(function (contactData) {
      // add the contacts we got to the array
      returnContacts = returnContacts.concat(contactData.items);

      // Compute how many additional calls we need to make to get all contacts
      var numberOfAdditionalCalls = Math.ceil(contactData.metadata.total / contactData.metadata.count) - 1; // subtract 1 because of initial call

      // If we need to make more calls...
      if (numberOfAdditionalCalls > 0) {
        // Build array of promises (one for each call to get more contacts)
        //  --- making an array of '1' of the correct length  so we can use
        //  --- the map function to return the array of promises
        var contactRequest = '1'.repeat(numberOfAdditionalCalls).split('').map(function (item, index) {
          var newParams = _extends({}, parameters);
          // need offset and limit
          newParams.offset = (index + 1) * contactData.metadata.count + 1;
          //newParams.limit = contactData.metadata.count;
          return getContacts(apiKey, userUuid, newParams);
        });
        // when all of the promises are resolved, push the contacts onto the array
        // then resolve the speak
        Promise.all(contactRequest).then(function (arrayContacts) {
          arrayContacts.forEach(function (contacts) {
            returnContacts = returnContacts.concat(contacts.items);
          });
          resolve(returnContacts);
        }).catch(function (e1) {
          console.log('Error getting more contacts', e1);
          reject(e1);
        });
      } else {
        // we get here if no additional calls for contacts needed... resolve the speak
        resolve(returnContacts);
      }
    }).catch(function (e) {
      console.log('Error getting initial contacts', e);
      reject(e);
    });
  });
};

module.exports = {
  createUserContact: createUserContact,
  deleteContact: deleteContact,
  listContacts: listContacts
};