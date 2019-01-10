/* global require module*/
"use strict";
import "@babel/polyfill";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async
 * @description This function creates a new conversation and returns metadata.
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {string} [toPhoneNumber="null toPhoneNumber"] - Destination phone number for the conversation
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<object>} A promise resolving to a conversation metadata object
 */
const getConversation = async (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  toPhoneNumber = "null toPhoneNumber",
  trace = {}
) => {
  const MS = util.getEndpoint("Messaging");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUuid}/conversations`,
    body: {
      phone_numbers: [toPhoneNumber]
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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
const getConversationUuid = (
  accessToken,
  userUuid,
  toPhoneNumber,
  trace = {}
) => {
  return new Promise((resolve, reject) => {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/${userUuid}/conversations`,
      body: {
        phone_numbers: [toPhoneNumber]
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    //console.log('RRRR:', requestOptions)
    request(requestOptions)
      .then(response => {
        //console.log('rrrr', response.context.uuid)
        resolve(response.context.uuid);
      })
      .catch(fetchError => {
        // something went wrong so
        //console.log('fetch error: ', fetchError)
        reject(fetchError);
      });
  }); // end promise
}; // end function getConversation UUID


/**
 * @async
 * @description This function will send messages in multiple formats
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {string} [fromPhoneNumber="null fromPhoneNumber"] - sender phone number
 * @param {string} [channel="sms"] - channel (sms or mms)
 * @param {string} [content={
 *     "type": "text",
 *     "body": "null body"
 *   }] - message to be sent
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise<object>} - promise resolving to a message confirmation object
 */
const sendMessage = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  conversationUUID = "null conversationUUID",
  fromPhoneNumber = "null fromPhoneNumber",
  channel = "sms",
  content = {
    "type": "text",
    "body": "null body"
  },
  trace = {}
) => {
  const objectBody = {
    to: conversationUUID,
    from: fromPhoneNumber,
    channel: channel,
    content: [
      {
        type: content.hasOwnProperty("type") ? content.type: "text",
        body: content.hasOwnProperty("body") ? content.body : ""
      }
    ]
  };
  const MS = util.getEndpoint("Messaging");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUUID}/messages`,
    body: objectBody,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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
const sendSMSMessage = (
  accessToken,
  convesationUUID,
  userUuid,
  fromPhoneNumber,
  msg,
  trace = {}
) => {
  return new Promise((resolve, reject) => {
    const objectBody = {
      to: `${convesationUUID}`,
      from: `${fromPhoneNumber}`,
      channel: "sms",
      content: [
        {
          type: "text",
          body: `${msg}`
        }
      ]
    };
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/${userUuid}/messages`,
      body: objectBody,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    request(requestOptions)
      .then(response => {
        //console.log('xxxxx', response)
        resolve(response);
      })
      .catch(e => {
        //console.log(e)
        reject(`sendSMSMessage errored: ${e}`);
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
const sendSMS = (
  accessToken,
  userUuid,
  msg,
  fromPhoneNumber,
  toPhoneNumber,
  trace = {}
) => {
  return new Promise((resolve, reject) => {
    getConversationUuid(accessToken, userUuid, toPhoneNumber, trace)
      .then(conversationUUID => {
        sendSMSMessage(
          accessToken,
          conversationUUID,
          userUuid,
          fromPhoneNumber,
          msg
        )
          .then(response => {
            resolve(response);
          })
          .catch(sError => {
            reject(sError);
          });
      })
      .catch(cError => {
        //console.log('EEEEE:', cError)
        reject(cError);
      });
  });
};

/**
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {number} [offset=0] - pagination offest
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
* @returns {Promise<object>} - Promise resolving to user conversations
 */
const retrieveConversations = (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  offset = 0,
  limit = 10,
  trace = {}
) => {
  const MS = util.getEndpoint("messaging");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/conversations`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`,
      "Content-type": "application/json"
    },
    qs: {
      "offset": offset,
      "limit": limit,
      "sort": "-last_message_datetime",
      "expand": "messages",
      "messages.limit": 1,
      "messages.sort" : "-datetime"
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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
const retrieveMessages = (
  accessToken = "null accessToken",
  conversationUUID = "null conversationUUID",
  offset = 0,
  limit = 100,
  trace = {}
) => {
  const MS = util.getEndpoint("messaging");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/conversations/${conversationUUID}/messages`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`,
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
const getSMSNumber = (accessToken, userUuid, trace = {}) => {
  return new Promise((resolve, reject) => {
    const MS = util.getEndpoint("identity");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/identities/${userUuid}?include=alias`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json"
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    request(requestOptions)
      .then(smsResponse => {
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
            resolve(smsNbr);
          } else {
            reject({
              message: `No sms number in alias: ${smsResponse}`
            });
          }
        } else {
          reject({
            message: `No aliases in sms response ${smsResponse}`
          });
        }
      })
      .catch(error => {
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
const sendSimpleSMS = (
  accessToken = "null access token",
  sender = "null sender",
  receiver = "null receiver",
  message = "null message",
  type = "text",
  metadata = {},
  trace = {}
) => {
  const MS = util.getEndpoint("sms");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/messages/send`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`,
      "Content-type": "application/json"
    },
    body: {
      to: receiver,
      from: sender,
      content: [
        {
          type: type,
          body: message
        }
      ],
      metadata: metadata
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @deprecated - This function will mark all conversations read
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a modified conversation object
 */
const markAllConversationMessagesRead = (
  accessToken = "null accessToken",
  conversationUUID = "null conversationUUID",
  trace = {}
) => {
  const MS = util.getEndpoint("messaging");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/conversations/${conversationUUID}/messages/modify`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`,
      "Content-type": "application/json"
    },
    body: {
      "tags": [
        "@read"
      ]
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
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
