/*global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * This function will ask the cpaas contacts service to create a contact
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param contactData - objedt with contact data
 * @returns promise for list of groups for this user
 **/
const createUserContact = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  contactData = {}
) => {
  const MS = util.getEndpoint("contacts");
  //console.log('MMMMSSSSS', MS, contactData);

  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUUID}/contacts`,
    headers: {
      "application-key": apiKey,
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
 * @param apiKey - api key for cpaas systems
 * @param contactUUID - contact UUID to be used
 * @returns promise for list of groups for this user
 **/
const deleteContact = (
  apiKey = "null api key",
  contactUUID = "null contact uuid"
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/contacts/${contactUUID}`,
    headers: {
      "application-key": apiKey,
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
 * @param userUUID - user UUID to be used
 * @returns promise for list of groups for this user
 **/
const getContacts = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  params = {}
) => {
  const MS = util.getEndpoint("contacts");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/contacts`,
    qs: { ...params
    },
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
 * @param userUUID - user UUID to be used
 * @returns promise for list of groups for this user
 **/
const listContacts = (
  apiKey = "null api key",
  userUUID = "null user uuid"
) => {
  return new Promise((resolve, reject) => {
    // this array will accumulate the contact list
    let returnContacts = [];
    let parameters = {};
    // make initial call to get first contacts
    getContacts(apiKey, userUUID).then((contactData) => {
      // add the contacts we got to the array
      returnContacts = returnContacts.concat(contactData.items);

      // Compute how many additional calls we need to make to get all contacts
      var numberOfAdditionalCalls = Math.ceil(contactData.metadata.total / contactData.metadata.count) - 1; // subtract 1 because of initial call

      // If we need to make more calls...
      if (numberOfAdditionalCalls > 0) {
        // Build array of promises (one for each call to get more contacts)
        //  --- making an array of '1' of the correct length  so we can use
        //  --- the map function to return the array of promises
        var contactRequest = '1'.repeat(numberOfAdditionalCalls).split('').map((item, index) => {
          let newParams = { ...parameters
          };
          // need offset and limit
          newParams.offset = ((index + 1) * contactData.metadata.count) + 1;
          //newParams.limit = contactData.metadata.count;
          return getContacts(apiKey, userUUID, newParams);
        });
        // when all of the promises are resolved, push the contacts onto the array
        // then resolve the speak
        Promise.all(contactRequest).then((arrayContacts) => {
          arrayContacts.forEach((contacts) => {
            returnContacts = returnContacts.concat(contacts.items);
          });
          resolve(returnContacts);
        }).catch((e1) => {
          console.log('Error getting more contacts', e1);
          reject(e1);
        });
      } else {
        // we get here if no additional calls for contacts needed... resolve the speak
        resolve(returnContacts);
      }

    }).catch((e) => {
      console.log('Error getting initial contacts', e);
      reject(e);
    });
  });


};







module.exports = {
  createUserContact,
  deleteContact,
  listContacts
};