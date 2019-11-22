/* global require module*/
"use strict";

const util = require("./utilities");

const request = require("request-promise");

const Logger = require("./node-logger");

const logger = new Logger.default();
/**
 * @async
 * @description This function creates a new conversation and returns metadata.
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {string} [toPhoneNumber="null toPhoneNumber"] - Destination phone number for the conversation
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<object>} A promise resolving to a conversation metadata object
 */

const getConversation = async function getConversation() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  let toPhoneNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null toPhoneNumber";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/").concat(userUuid, "/conversations"),
      body: {
        phone_numbers: [toPhoneNumber]
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
}; // end function getConversation

/**
 * @async
 * @description This function will retrieve the conversation uuid for whom you are sending it to.
 * @param {string} accessToken - Access token for cpaas systems
 * @param {string} userUuid - The user uuid making the request
 * @param {string} toPhoneNumber - A full phone number you will be sending the sms too
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a conversation uuid data object
 */


const getConversationUuid = async function getConversationUuid(accessToken, userUuid, toPhoneNumber) {
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/").concat(userUuid, "/conversations"),
      body: {
        phone_numbers: [toPhoneNumber]
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response.context.uuid;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
}; // end function getConversation UUID

/**
 * @async
 * @description This function will send messages in multiple formats
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {string} [fromPhoneNumber="null fromPhoneNumber"] - sender phone number
 * @param {string} [channel="sms"] - channel (sms or mms)
 * @param {array} [content=[]] - array of content objects
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise<object>} - promise resolving to a message confirmation object
 */


const sendMessage = async function sendMessage() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let conversationUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null conversationUUID";
  let fromPhoneNumber = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null fromPhoneNumber";
  let channel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "sms";
  let content = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  let trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  try {
    const objectBody = {
      to: conversationUUID,
      from: fromPhoneNumber,
      channel: channel,
      content: content
    };
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/").concat(userUUID, "/messages"),
      body: objectBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
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


const sendSMSMessage = async function sendSMSMessage(accessToken, convesationUUID, userUuid, fromPhoneNumber, msg) {
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const objectBody = {
      to: "".concat(convesationUUID),
      from: "".concat(fromPhoneNumber),
      channel: "sms",
      content: [{
        type: "text",
        body: "".concat(msg)
      }]
    };
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/").concat(userUuid, "/messages"),
      body: objectBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
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


const sendSMS = async function sendSMS(accessToken, userUuid, msg, fromPhoneNumber, toPhoneNumber) {
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const conversationUUID = await getConversationUuid(accessToken, userUuid, toPhoneNumber, trace);
    const response = await sendSMSMessage(accessToken, conversationUUID, userUuid, fromPhoneNumber, msg, trace);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {number} [offset=0] - pagination offest
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
* @returns {Promise<object>} - Promise resolving to user conversations
 */


const retrieveConversations = async function retrieveConversations() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = util.getEndpoint("messaging");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/").concat(userUUID, "/conversations"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion()),
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

    if (limit > 100) {
      logger.debug("****** AGGREGATE RESPONSE ******", requestOptions, trace);
      const response = await util.aggregate(request, requestOptions, trace);
      return response;
    } else {
      util.addRequestTrace(requestOptions, trace);
      const response = await request(requestOptions);
      return response;
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function returns message history
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=100] - pagination limit
 * @param {object} [trace={}] - microservice lifecycle headers
 * @returns {Promise<object>} - Promise resolving to to a message history object.
 */


const retrieveMessages = async function retrieveMessages() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let conversationUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null conversationUUID";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = util.getEndpoint("messaging");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/conversations/").concat(conversationUUID, "/messages"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion()),
        "Content-type": "application/json"
      },
      qs: {
        "offset": offset,
        "limit": limit,
        "sort": "-datetime"
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will get user sms number.
 * @param {string} accessToken - cpaas access Token
 * @param {string} userUuid - the user uuid making the request
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing the sms number
 */


const getSMSNumber = async function getSMSNumber(accessToken, userUuid) {
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/identities/").concat(userUuid, "?include=alias"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion()),
        "Content-type": "application/json"
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const smsResponse = await request(requestOptions);

    if (smsResponse && smsResponse.aliases) {
      const smsNbr = smsResponse.aliases.reduce((prev, curr) => {
        if (!prev) {
          if (curr && curr.hasOwnProperty("sms")) {
            return curr["sms"];
          }
        }

        return prev;
      }, undefined);

      if (smsNbr) {
        return smsNbr;
      } else {
        throw {
          "code": 400,
          "message": "No sms number in alias",
          "details": [{
            "response": smsResponse
          }],
          "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined
        };
      }
    } else {
      throw {
        "code": 400,
        "message": "No aliases in sms response",
        "details": [{
          "response": smsResponse
        }],
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
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


const sendSimpleSMS = async function sendSimpleSMS() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let sender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null sender";
  let receiver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null receiver";
  let message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null message";
  let type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "text";
  let metadata = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  let trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  try {
    const MS = util.getEndpoint("sms");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/messages/send"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion()),
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @deprecated - This function will mark all conversations read
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a modified conversation object
 */


const markAllConversationMessagesRead = async function markAllConversationMessagesRead() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let conversationUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null conversationUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("messaging");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/conversations/").concat(conversationUUID, "/messages/modify"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "x-api-version": "".concat(util.getVersion()),
        "Content-type": "application/json"
      },
      body: {
        "tags": ["@read"]
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  getConversation,
  getConversationUuid,
  getSMSNumber,
  markAllConversationMessagesRead,
  retrieveConversations,
  retrieveMessages,
  sendMessage,
  sendSimpleSMS,
  sendSMS,
  sendSMSMessage
};