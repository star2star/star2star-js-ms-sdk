/* global require module*/
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will retrieve the conversation uuid for whom you are sending it to.
 * @param {string} accessToken - Access token for cpaas systems
 * @param {string} userUuid - The user uuid making the request
 * @param {string} toPhoneNumber - A full phone number you will be sending the sms too
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a conversation uuid data object
 */
var getConversationUuid = function getConversationUuid(accessToken, userUuid, toPhoneNumber) {
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return new Promise(function (resolve, reject) {
    var MS = util.getEndpoint("Messaging");
    var requestOptions = {
      method: "POST",
      uri: MS + "/users/" + userUuid + "/conversations",
      body: {
        phone_numbers: [toPhoneNumber]
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        "x-api-version": "" + util.getVersion()
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a response confirmation data object
 */
var sendSMSMessage = function sendSMSMessage(accessToken, convesationUUID, userUuid, fromPhoneNumber, msg) {
  var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  return new Promise(function (resolve, reject) {
    var objectBody = {
      to: "" + convesationUUID,
      from: "" + fromPhoneNumber,
      channel: "sms",
      content: [{
        type: "text",
        body: "" + msg
      }]
    };
    var MS = util.getEndpoint("Messaging");
    var requestOptions = {
      method: "POST",
      uri: MS + "/users/" + userUuid + "/messages",
      body: objectBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        "x-api-version": "" + util.getVersion()
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    request(requestOptions).then(function (response) {
      //console.log('xxxxx', response)
      resolve(response);
    }).catch(function (e) {
      //console.log(e)
      reject("sendSMSMessage errored: " + e);
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a response confirmation data object
 */
var sendSMS = function sendSMS(accessToken, userUuid, msg, fromPhoneNumber, toPhoneNumber) {
  var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  return new Promise(function (resolve, reject) {
    getConversationUuid(accessToken, userUuid, toPhoneNumber, trace).then(function (conversationUUID) {
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing the sms number
 */

/**
 *
 *
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {number} [offset=0] - pagination offest
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
* @returns {Promise<object>} - Promise resolving to user conversations
 */
var retrieveConversations = function retrieveConversations() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = util.getEndpoint("messaging");

  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUUID + "/conversations",
    headers: {
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion(),
      "Content-type": "application/json"
    },
    qs: {
      "offset": offset,
      "limit": limit,
      "sort": "-last_message_datetime",
      "expand": "messages",
      "messages.limit": 1,
      "messages.sort": "-datetime"
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will get user sms number.
 * @param {string} accessToken - cpaas access Token
 * @param {string} userUuid - the user uuid making the request
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing the sms number
 */
var getSMSNumber = function getSMSNumber(accessToken, userUuid) {
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new Promise(function (resolve, reject) {
    var MS = util.getEndpoint("identity");

    var requestOptions = {
      method: "GET",
      uri: MS + "/identities/" + userUuid + "?include=alias",
      headers: {
        Authorization: "Bearer " + accessToken,
        "x-api-version": "" + util.getVersion(),
        "Content-type": "application/json"
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    request(requestOptions).then(function (smsResponse) {
      if (smsResponse && smsResponse.aliases) {
        var smsNbr = smsResponse.aliases.reduce(function (prev, curr) {
          if (!prev) {
            if (curr && curr.hasOwnProperty("sms")) {
              return curr["sms"];
            }
          }
          return prev;
        }, undefined);
        if (smsNbr) {
          resolve(smsNbr);
        } else {
          reject({
            message: "No sms number in alias: " + smsResponse
          });
        }
      } else {
        reject({
          message: "No aliases in sms response " + smsResponse
        });
      }
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function sends a basic SMS message
 * @param {string} [accessToken="null access token" - cpaas access token
 * @param {string} [receiver="null receiver"] - recipient number (+15555555555)
 * @param {string} [sender="null sender"] - sender number (+15555555555)
 * @param {string} [message="null message"] - message
 * @param {type} [type="text"] - message type
 * @param {object} [metadata={}] - optional metadata object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns Promise resolving to sms send confirmation with uuid
 */
var sendSimpleSMS = function sendSimpleSMS() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var sender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null sender";
  var receiver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null receiver";
  var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null message";
  var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "text";
  var metadata = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  var MS = util.getEndpoint("sms");
  var requestOptions = {
    method: "POST",
    uri: MS + "/messages/send",
    headers: {
      Authorization: "Bearer " + accessToken,
      "x-api-version": "" + util.getVersion(),
      "Content-type": "application/json"
    },
    body: {
      to: receiver,
      from: sender,
      content: [{
        type: type,
        body: message
      }],
      metadata: metadata
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  getConversationUuid: getConversationUuid,
  getSMSNumber: getSMSNumber,
  retrieveConversations: retrieveConversations,
  sendSimpleSMS: sendSimpleSMS,
  sendSMS: sendSMS,
  sendSMSMessage: sendSMSMessage
};