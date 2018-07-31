/* global require module*/
"use strict";

var util = require('./utilities');
var request = require('request-promise');

/**
 * @async
 * @description This function will retrieve the conversation uuid for whom you are sending it to.
 * @param {string} accessToken - Access token for cpaas systems
 * @param {string} userUuid - The user uuid making the request
 * @param {string} toPhoneNumber - A full phone number you will be sending the sms too
 * @returns {Promise<object>} - Promise resolving to a conversation uuid data object
 */
var getConversationUuid = function getConversationUuid(accessToken, userUuid, toPhoneNumber) {
  return new Promise(function (resolve, reject) {
    var MS = util.getEndpoint("Messaging");
    var requestOptions = {
      method: 'POST',
      uri: MS + '/users/' + userUuid + '/conversations',
      body: {
        "phone_numbers": [toPhoneNumber]
      },
      headers: {
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + accessToken,
        'x-api-version': '' + util.getVersion()
      },
      json: true
    };

    //console.log('RRRR:', requestOptions)
    request(requestOptions).then(function (response) {
      //console.log('rrrr', response.context.uuid)
      resolve(response.context.uuid);
    }).catch(function (fetchError) {
      // something went wrong so
      //console.log('fetch error: ', fetchError)
      reject(fetchError);
    });
  }); // end promise
}; // end function getConversation UUID

/**
 * @async
 * @description This function will send an sms message.
 * @param {string} accessToken - cpaas access Token
 * @param {string} convesationUUID - uuid of conversation; see getConvesationUUID
 * @param {string} userUuid - the user uuid making the request
 * @param {string} fromPhoneNumber - full phone number to use as the sender/reply too
 * @param {string} msg - the message to send
 * @returns {Promise<object>} - Promise resolving to a response confirmation data object
 */
var sendSMSMessage = function sendSMSMessage(accessToken, convesationUUID, userUuid, fromPhoneNumber, msg) {
  return new Promise(function (resolve, reject) {
    var objectBody = {
      "to": '' + convesationUUID,
      "from": '' + fromPhoneNumber,
      "channel": "sms",
      "content": [{
        "type": "text",
        "body": '' + msg
      }]
    };
    var MS = util.getEndpoint("Messaging");
    var requestOptions = {
      method: 'POST',
      uri: MS + '/users/' + userUuid + '/messages',
      body: objectBody,
      headers: {
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + accessToken,
        'x-api-version': '' + util.getVersion()
      },
      json: true
    };

    request(requestOptions).then(function (response) {
      //console.log('xxxxx', response)
      resolve(response);
    }).catch(function (e) {
      //console.log(e)
      reject('sendSMSMessage errored: ' + e);
    });
  });
};

/**
 * @async
 * @description This function will send an sms message.
 * @param {string} accessToken - cpaas access Token
 * @param {string} userUuid - the user uuid making the request
 * @param {string} msg - the message to send
 * @param {string} fromPhoneNumber - full phone number to use as the sender/reply too
 * @param {string} toPhoneNumber - full phone number you will be sending the sms too
 * @returns {Promise<object>} - Promise resolving to a response confirmation data object
 */
var sendSMS = function sendSMS(accessToken, userUuid, msg, fromPhoneNumber, toPhoneNumber) {
  return new Promise(function (resolve, reject) {
    getConversationUuid(accessToken, userUuid, toPhoneNumber).then(function (conversationUUID) {
      sendSMSMessage(accessToken, conversationUUID, userUuid, fromPhoneNumber, msg).then(function (response) {
        resolve(response);
      }).catch(function (sError) {
        reject(sError);
      });
    }).catch(function (cError) {
      //console.log('EEEEE:', cError)
      reject(cError);
    });
  });
};

/**
 * @async
 * @description This function will get user sms number.
 * @param {string} accessToken - cpaas access Token
 * @param {string} userUuid - the user uuid making the request
 * @returns {Promise<object>} - Promise resolving to a data object containing the sms number
 */
var getSMSNumber = function getSMSNumber(accessToken, userUuid) {

  return new Promise(function (resolve, reject) {
    var MS = util.getEndpoint("identity");

    var requestOptions = {
      method: 'GET',
      uri: MS + '/identities/' + userUuid + '?include=alias',
      headers: {
        "Authorization": 'Bearer ' + accessToken,
        'x-api-version': '' + util.getVersion(),
        'Content-type': 'application/json'
      },
      json: true
    };
    request(requestOptions).then(function (smsResponse) {
      if (smsResponse && smsResponse.aliases) {
        var smsNbr = smsResponse.aliases.reduce(function (prev, curr) {
          if (!prev) {
            if (curr && curr.hasOwnProperty('sms')) {
              return curr['sms'];
            }
          }
          return prev;
        }, undefined);
        if (smsNbr) {
          resolve(smsNbr);
        } else {
          reject({
            message: 'No sms number in alias: ' + smsResponse
          });
        }
      } else {
        reject({
          message: 'No aliases in sms response ' + smsResponse
        });
      }
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports = {
  getSMSNumber: getSMSNumber,
  sendSMS: sendSMS,
  sendSMSMessage: sendSMSMessage,
  getConversationUuid: getConversationUuid
};