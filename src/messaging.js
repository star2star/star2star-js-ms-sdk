/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("request-promise");
const logger = require("./node-logger").getInstance();

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
  try {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
}; // end function getConversation

/**
 * @async
 * @description This function deletes (archives for 30 days) a specific conversation
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [conversation_uuid="null conversation_uuid"] - conversation uuid
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteConversation = async (
  accessToken = "null accessToken",
  conversation_uuid = "null conversation_uuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/conversations/${conversation_uuid}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return {"status": "ok"};

  } catch (error) {
    throw util.formatError(error);
  }
}; // end function deleteConversation


/**
 * @async
 * @description This function deletes (archives for 30 days) multiple conversations
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {array} [conversations=[]] - array of objects containing 'conversation_uuid' 
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
const deleteMultipleConversations = async (
  accessToken = "null accessToken",
  conversations = [],
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/conversations/remove`,
      body: {
        "conversations": conversations
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return {"status": "ok"};

  } catch (error) {
    throw util.formatError(error);
  }
}; // end function deleteMultipleConversations


/**
 * @async
 * @description This function will retrieve the conversation uuid for whom you are sending it to.
 * @param {string} accessToken - Access token for cpaas systems
 * @param {string} userUuid - The user uuid making the request
 * @param {string} toPhoneNumber - A full phone number you will be sending the sms too
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a conversation uuid data object
 */
const getConversationUuid = async (
  accessToken,
  userUuid,
  toPhoneNumber,
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    return response.context.uuid;
  } catch (error) {
    throw util.formatError(error);
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
const sendMessage = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  conversationUUID = "null conversationUUID",
  fromPhoneNumber = "null fromPhoneNumber",
  channel = "sms",
  content = [],
  trace = {}
) => {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
const sendSMSMessage = async (
  accessToken,
  convesationUUID,
  userUuid,
  fromPhoneNumber,
  msg,
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
const sendSMS = async (
  accessToken,
  userUuid,
  msg,
  fromPhoneNumber,
  toPhoneNumber,
  trace = {}
) => {
  try {
    const conversationUUID = await getConversationUuid(accessToken, userUuid, toPhoneNumber, trace);
    const response = await sendSMSMessage (
      accessToken,
      conversationUUID,
      userUuid,
      fromPhoneNumber,
      msg,
      trace
    );
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {number} [offset=0] - pagination offest
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional filters. currently supports "snooze"
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
* @returns {Promise<object>} - Promise resolving to user conversations
 */
const retrieveConversations = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
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
        "messages.sort" : "-datetime",
      },
      json: true
    };
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
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
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function returns message history
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=100] - pagination limit
 * @param {string} [sort="-datetime"] - sort by column (default "-datetime")
 * @param {object} [trace={}] - microservice lifecycle headers
 * @returns {Promise<object>} - Promise resolving to to a message history object.
 */
const retrieveMessages = async (
  accessToken = "null accessToken",
  conversationUUID = "null conversationUUID",
  offset = 0,
  limit = 100,
  sort = "-datetime",
  trace = {}
) => {
  try {
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
        "sort": sort 
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
const getSMSNumber = async (accessToken, userUuid, trace = {}) => {
  try {
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
          "code" : 400,
          "message": "No sms number in alias",
          "details" : [{"response": smsResponse}],
          "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace 
            : undefined,
        };
      }
    } else {
      throw {
        "code" : 400,
        "message": "No aliases in sms response",
        "details" : [{"response": smsResponse}],
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
      };
    }
  } catch (error) {
    throw util.formatError(error);
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
const sendSimpleSMS = async (
  accessToken = "null access token",
  sender = "null sender",
  receiver = "null receiver",
  message = "null message",
  type = "text",
  metadata = {},
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  } 
};

/**
 * @async
 * @description - This function will mark all conversations read
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a modified conversation object
 */
const markAllConversationMessagesRead = async (
  accessToken = "null accessToken",
  conversationUUID = "null conversationUUID",
  trace = {}
) => {
  try {
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
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  } 
};

/**
 * @async
 * @description This function deletes a specific message
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [message_uuid="null message_uuid"] - message uuid
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteMessage = async (
  accessToken = "null accessToken",
  message_uuid = "null message_uuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/messages/${message_uuid}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) { 
      return {
        "status": "ok"
      };
    } else {
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete message failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    throw util.formatError(error);
  }
}; // end function deleteMessage


/**
 * @async
 * @description This function deletes multiple messages
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {array} [messages=[]] - array of strings containing 'message_uuid' 
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
const deleteMultipleMessages = async (
  accessToken = "null accessToken",
  messages = [],
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("Messaging");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/messages/remove`,
      body: {
        "messages": messages
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 204) { 
      return {
        "status": "ok"
      };
    } else {
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete multiple messages failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }

  } catch (error) {
    throw util.formatError(error);
  }
}; // end function deleteMultipleMessages

/**
 * @async
 * @description - This function will snooze/un-snooze conversations
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {boolean} [snooze="false snooze"] - snooze:true OR snooze:false to either snooze / un-snooze
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a modified conversation object
 */
const snoozeUnsnoozeConversation = async (
  accessToken = "null accessToken",
  conversationUUID = "null conversationUUID",
  snooze = false,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("messaging");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/conversations/${conversationUUID}/modify`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
        "Content-type": "application/json"
      },
      body: {
        "snooze": snooze
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
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
  sendSMSMessage,
  deleteConversation,
  deleteMultipleConversations,
  deleteMessage,
  deleteMultipleMessages,
  snoozeUnsnoozeConversation
};
