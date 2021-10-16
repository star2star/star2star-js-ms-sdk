/* global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var request = require("request-promise");

var Logger = require("./node-logger");

var logger = new Logger.default();
/**
 * @async
 * @description This function creates a new conversation and returns metadata.
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {string} [toPhoneNumber="null toPhoneNumber"] - Destination phone number for the conversation
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<object>} A promise resolving to a conversation metadata object
 */

var getConversation = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        userUuid,
        toPhoneNumber,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null accessToken";
            userUuid = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null userUuid";
            toPhoneNumber = _args.length > 2 && _args[2] !== undefined ? _args[2] : "null toPhoneNumber";
            trace = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            _context.prev = 4;
            MS = util.getEndpoint("Messaging");
            requestOptions = {
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
            _context.next = 10;
            return request(requestOptions);

          case 10:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](4);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 14]]);
  }));

  return function getConversation() {
    return _ref.apply(this, arguments);
  };
}(); // end function getConversation

/**
 * @async
 * @description This function deletes (archives for 30 days) a specific conversation
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [conversation_uuid="null conversation_uuid"] - conversation uuid
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteConversation = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        conversation_uuid,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            conversation_uuid = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null conversation_uuid";
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            MS = util.getEndpoint("Messaging");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/conversations/").concat(conversation_uuid),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 9;
            return request(requestOptions);

          case 9:
            response = _context2.sent;
            return _context2.abrupt("return", {
              "status": "ok"
            });

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 13]]);
  }));

  return function deleteConversation() {
    return _ref2.apply(this, arguments);
  };
}(); // end function deleteConversation

/**
 * @async
 * @description This function deletes (archives for 30 days) multiple conversations
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {array} [conversations=[]] - array of objects containing 'conversation_uuid' 
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */


var deleteMultipleConversations = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        conversations,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null accessToken";
            conversations = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : [];
            trace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.prev = 3;
            MS = util.getEndpoint("Messaging");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/conversations/remove"),
              body: {
                "conversations": conversations
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            response = _context3.sent;
            return _context3.abrupt("return", {
              "status": "ok"
            });

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](3);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 13]]);
  }));

  return function deleteMultipleConversations() {
    return _ref3.apply(this, arguments);
  };
}(); // end function deleteMultipleConversations

/**
 * @async
 * @description This function will retrieve the conversation uuid for whom you are sending it to.
 * @param {string} accessToken - Access token for cpaas systems
 * @param {string} userUuid - The user uuid making the request
 * @param {string} toPhoneNumber - A full phone number you will be sending the sms too
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a conversation uuid data object
 */


var getConversationUuid = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(accessToken, userUuid, toPhoneNumber) {
    var trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            trace = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
            _context4.prev = 1;
            MS = util.getEndpoint("Messaging");
            requestOptions = {
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
            _context4.next = 7;
            return request(requestOptions);

          case 7:
            response = _context4.sent;
            return _context4.abrupt("return", response.context.uuid);

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](1);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 11]]);
  }));

  return function getConversationUuid(_x, _x2, _x3) {
    return _ref4.apply(this, arguments);
  };
}(); // end function getConversation UUID

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


var sendMessage = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        userUUID,
        conversationUUID,
        fromPhoneNumber,
        channel,
        content,
        trace,
        objectBody,
        MS,
        requestOptions,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null accessToken";
            userUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null userUUID";
            conversationUUID = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : "null conversationUUID";
            fromPhoneNumber = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : "null fromPhoneNumber";
            channel = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : "sms";
            content = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : [];
            trace = _args5.length > 6 && _args5[6] !== undefined ? _args5[6] : {};
            _context5.prev = 7;
            objectBody = {
              to: conversationUUID,
              from: fromPhoneNumber,
              channel: channel,
              content: content
            };
            MS = util.getEndpoint("Messaging");
            requestOptions = {
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
            _context5.next = 14;
            return request(requestOptions);

          case 14:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](7);
            return _context5.abrupt("return", Promise.reject(util.formatError(_context5.t0)));

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[7, 18]]);
  }));

  return function sendMessage() {
    return _ref5.apply(this, arguments);
  };
}();
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


var sendSMSMessage = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(accessToken, convesationUUID, userUuid, fromPhoneNumber, msg) {
    var trace,
        objectBody,
        MS,
        requestOptions,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            trace = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : {};
            _context6.prev = 1;
            objectBody = {
              to: "".concat(convesationUUID),
              from: "".concat(fromPhoneNumber),
              channel: "sms",
              content: [{
                type: "text",
                body: "".concat(msg)
              }]
            };
            MS = util.getEndpoint("Messaging");
            requestOptions = {
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
            _context6.next = 8;
            return request(requestOptions);

          case 8:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](1);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 12]]);
  }));

  return function sendSMSMessage(_x4, _x5, _x6, _x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();
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


var sendSMS = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(accessToken, userUuid, msg, fromPhoneNumber, toPhoneNumber) {
    var trace,
        conversationUUID,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            trace = _args7.length > 5 && _args7[5] !== undefined ? _args7[5] : {};
            _context7.prev = 1;
            _context7.next = 4;
            return getConversationUuid(accessToken, userUuid, toPhoneNumber, trace);

          case 4:
            conversationUUID = _context7.sent;
            _context7.next = 7;
            return sendSMSMessage(accessToken, conversationUUID, userUuid, fromPhoneNumber, msg, trace);

          case 7:
            response = _context7.sent;
            return _context7.abrupt("return", response);

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7["catch"](1);
            return _context7.abrupt("return", Promise.reject(util.formatError(_context7.t0)));

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 11]]);
  }));

  return function sendSMS(_x9, _x10, _x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {number} [offset=0] - pagination offest
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional filters. currently supports "snooze"
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
* @returns {Promise<object>} - Promise resolving to user conversations
 */


var retrieveConversations = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        userUUID,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _response,
        _args8 = arguments;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            accessToken = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null accessToken";
            userUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null userUUID";
            offset = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 0;
            limit = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : 10;
            filters = _args8.length > 4 && _args8[4] !== undefined ? _args8[4] : undefined;
            trace = _args8.length > 5 && _args8[5] !== undefined ? _args8[5] : {};
            _context8.prev = 6;
            MS = util.getEndpoint("messaging");
            requestOptions = {
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

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            if (!(limit > 100)) {
              _context8.next = 18;
              break;
            }

            logger.debug("****** AGGREGATE RESPONSE ******", requestOptions, trace);
            _context8.next = 14;
            return util.aggregate(request, requestOptions, trace);

          case 14:
            response = _context8.sent;
            return _context8.abrupt("return", response);

          case 18:
            util.addRequestTrace(requestOptions, trace);
            _context8.next = 21;
            return request(requestOptions);

          case 21:
            _response = _context8.sent;
            return _context8.abrupt("return", _response);

          case 23:
            _context8.next = 28;
            break;

          case 25:
            _context8.prev = 25;
            _context8.t0 = _context8["catch"](6);
            return _context8.abrupt("return", Promise.reject(util.formatError(_context8.t0)));

          case 28:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[6, 25]]);
  }));

  return function retrieveConversations() {
    return _ref8.apply(this, arguments);
  };
}();
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


var retrieveMessages = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        conversationUUID,
        offset,
        limit,
        sort,
        trace,
        MS,
        requestOptions,
        response,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null accessToken";
            conversationUUID = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null conversationUUID";
            offset = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : 0;
            limit = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : 100;
            sort = _args9.length > 4 && _args9[4] !== undefined ? _args9[4] : "-datetime";
            trace = _args9.length > 5 && _args9[5] !== undefined ? _args9[5] : {};
            _context9.prev = 6;
            MS = util.getEndpoint("messaging");
            requestOptions = {
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
                "sort": sort
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context9.next = 12;
            return request(requestOptions);

          case 12:
            response = _context9.sent;
            return _context9.abrupt("return", response);

          case 16:
            _context9.prev = 16;
            _context9.t0 = _context9["catch"](6);
            return _context9.abrupt("return", Promise.reject(util.formatError(_context9.t0)));

          case 19:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[6, 16]]);
  }));

  return function retrieveMessages() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get user sms number.
 * @param {string} accessToken - cpaas access Token
 * @param {string} userUuid - the user uuid making the request
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing the sms number
 */


var getSMSNumber = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(accessToken, userUuid) {
    var trace,
        MS,
        requestOptions,
        smsResponse,
        smsNbr,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            trace = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : {};
            _context10.prev = 1;
            MS = util.getEndpoint("identity");
            requestOptions = {
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
            _context10.next = 7;
            return request(requestOptions);

          case 7:
            smsResponse = _context10.sent;

            if (!(smsResponse && smsResponse.aliases)) {
              _context10.next = 17;
              break;
            }

            smsNbr = smsResponse.aliases.reduce(function (prev, curr) {
              if (!prev) {
                if (curr && curr.hasOwnProperty("sms")) {
                  return curr["sms"];
                }
              }

              return prev;
            }, undefined);

            if (!smsNbr) {
              _context10.next = 14;
              break;
            }

            return _context10.abrupt("return", smsNbr);

          case 14:
            throw {
              "code": 400,
              "message": "No sms number in alias",
              "details": [{
                "response": smsResponse
              }],
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined
            };

          case 15:
            _context10.next = 18;
            break;

          case 17:
            throw {
              "code": 400,
              "message": "No aliases in sms response",
              "details": [{
                "response": smsResponse
              }],
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined
            };

          case 18:
            _context10.next = 23;
            break;

          case 20:
            _context10.prev = 20;
            _context10.t0 = _context10["catch"](1);
            return _context10.abrupt("return", Promise.reject(util.formatError(_context10.t0)));

          case 23:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 20]]);
  }));

  return function getSMSNumber(_x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();
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


var sendSimpleSMS = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var accessToken,
        sender,
        receiver,
        message,
        type,
        metadata,
        trace,
        MS,
        requestOptions,
        response,
        _args11 = arguments;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            accessToken = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : "null access token";
            sender = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : "null sender";
            receiver = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : "null receiver";
            message = _args11.length > 3 && _args11[3] !== undefined ? _args11[3] : "null message";
            type = _args11.length > 4 && _args11[4] !== undefined ? _args11[4] : "text";
            metadata = _args11.length > 5 && _args11[5] !== undefined ? _args11[5] : {};
            trace = _args11.length > 6 && _args11[6] !== undefined ? _args11[6] : {};
            _context11.prev = 7;
            MS = util.getEndpoint("sms");
            requestOptions = {
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
            _context11.next = 13;
            return request(requestOptions);

          case 13:
            response = _context11.sent;
            return _context11.abrupt("return", response);

          case 17:
            _context11.prev = 17;
            _context11.t0 = _context11["catch"](7);
            return _context11.abrupt("return", Promise.reject(util.formatError(_context11.t0)));

          case 20:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[7, 17]]);
  }));

  return function sendSimpleSMS() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @async
 * @deprecated - This function will mark all conversations read
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a modified conversation object
 */


var markAllConversationMessagesRead = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var accessToken,
        conversationUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            accessToken = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : "null accessToken";
            conversationUUID = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : "null conversationUUID";
            trace = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
            _context12.prev = 3;
            MS = util.getEndpoint("messaging");
            requestOptions = {
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
            _context12.next = 9;
            return request(requestOptions);

          case 9:
            response = _context12.sent;
            return _context12.abrupt("return", response);

          case 13:
            _context12.prev = 13;
            _context12.t0 = _context12["catch"](3);
            return _context12.abrupt("return", Promise.reject(util.formatError(_context12.t0)));

          case 16:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[3, 13]]);
  }));

  return function markAllConversationMessagesRead() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function deletes a specific message
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {string} [message_uuid="null message_uuid"] - message uuid
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteMessage = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var accessToken,
        message_uuid,
        trace,
        MS,
        requestOptions,
        response,
        _args13 = arguments;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            accessToken = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : "null accessToken";
            message_uuid = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : "null message_uuid";
            trace = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : {};
            _context13.prev = 3;
            MS = util.getEndpoint("Messaging");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/messages/").concat(message_uuid),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context13.next = 9;
            return request(requestOptions);

          case 9:
            response = _context13.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 204)) {
              _context13.next = 14;
              break;
            }

            return _context13.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete message failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context13.next = 20;
            break;

          case 17:
            _context13.prev = 17;
            _context13.t0 = _context13["catch"](3);
            return _context13.abrupt("return", Promise.reject(util.formatError(_context13.t0)));

          case 20:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[3, 17]]);
  }));

  return function deleteMessage() {
    return _ref13.apply(this, arguments);
  };
}(); // end function deleteMessage

/**
 * @async
 * @description This function deletes multiple messages
 * @param {string} [accessToken="null accessToken"] - cpaas application token
 * @param {array} [messages=[]] - array of strings containing 'message_uuid' 
 * @param {object} [trace={}] - options microservice lifecycle tracking headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */


var deleteMultipleMessages = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var accessToken,
        messages,
        trace,
        MS,
        requestOptions,
        response,
        _args14 = arguments;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            accessToken = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : "null accessToken";
            messages = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : [];
            trace = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : {};
            _context14.prev = 3;
            MS = util.getEndpoint("Messaging");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/messages/remove"),
              body: {
                "messages": messages
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context14.next = 9;
            return request(requestOptions);

          case 9:
            response = _context14.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 204)) {
              _context14.next = 14;
              break;
            }

            return _context14.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete multiple messages failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context14.next = 20;
            break;

          case 17:
            _context14.prev = 17;
            _context14.t0 = _context14["catch"](3);
            return _context14.abrupt("return", Promise.reject(util.formatError(_context14.t0)));

          case 20:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[3, 17]]);
  }));

  return function deleteMultipleMessages() {
    return _ref14.apply(this, arguments);
  };
}(); // end function deleteMultipleMessages

/**
 * @async
 * @deprecated - This function will snooze/un-snooze conversations
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [conversationUUID="null conversationUUID"] - conversation uuid
 * @param {boolean} [snooze="false snooze"] - snooze:true OR snooze:false to either snooze / un-snooze
 * @param {object} [trace={}] - microservice lifecyce headers
 * @returns {Promise} - Promise resolving to a modified conversation object
 */


var snoozeUnsnoozeConversation = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var accessToken,
        conversationUUID,
        snooze,
        trace,
        MS,
        requestOptions,
        response,
        _args15 = arguments;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            accessToken = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : "null accessToken";
            conversationUUID = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : "null conversationUUID";
            snooze = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : false;
            trace = _args15.length > 3 && _args15[3] !== undefined ? _args15[3] : {};
            _context15.prev = 4;
            MS = util.getEndpoint("messaging");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/conversations/").concat(conversationUUID, "/modify"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion()),
                "Content-type": "application/json"
              },
              body: {
                "snooze": snooze
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context15.next = 10;
            return request(requestOptions);

          case 10:
            response = _context15.sent;
            return _context15.abrupt("return", response);

          case 14:
            _context15.prev = 14;
            _context15.t0 = _context15["catch"](4);
            return _context15.abrupt("return", Promise.reject(util.formatError(_context15.t0)));

          case 17:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[4, 14]]);
  }));

  return function snoozeUnsnoozeConversation() {
    return _ref15.apply(this, arguments);
  };
}();

module.exports = {
  getConversation: getConversation,
  getConversationUuid: getConversationUuid,
  getSMSNumber: getSMSNumber,
  markAllConversationMessagesRead: markAllConversationMessagesRead,
  retrieveConversations: retrieveConversations,
  retrieveMessages: retrieveMessages,
  sendMessage: sendMessage,
  sendSimpleSMS: sendSimpleSMS,
  sendSMS: sendSMS,
  sendSMSMessage: sendSMSMessage,
  deleteConversation: deleteConversation,
  deleteMultipleConversations: deleteMultipleConversations,
  deleteMessage: deleteMessage,
  deleteMultipleMessages: deleteMultipleMessages,
  snoozeUnsnoozeConversation: snoozeUnsnoozeConversation
};