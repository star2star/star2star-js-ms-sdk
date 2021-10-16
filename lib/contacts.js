/*global require module*/
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


var createUserContact = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        userUuid,
        contactData,
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
            userUuid = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null user uuid";
            contactData = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            trace = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            _context.prev = 4;
            MS = util.getEndpoint("contacts"); //console.log('MMMMSSSSS', MS, contactData);

            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/users/").concat(userUuid, "/contacts"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              body: contactData,
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

  return function createUserContact() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas contacts service to delete a contact
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [contactUUID="null contact uuid"] - contact UUID to be used
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - Promise resolving to a data object
 */


var deleteContact = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        contactUUID,
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
            contactUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null contact uuid";
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            MS = util.getEndpoint("contacts");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/contacts/").concat(contactUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
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

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 204)) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete contact failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 17]]);
  }));

  return function deleteContact() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description - This function will return 
 * @param {string} [accessToken="null access token"]
 * @param {string} [user_uuid="null user uuid"]
 * @param {*} [trace={}]
 * @returns
 */


var exportContacts = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        user_uuid,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null access token";
            user_uuid = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null user uuid";
            trace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.prev = 3;
            MS = util.getEndpoint("contacts");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(user_uuid, "/contacts"),
              qs: {
                "offset": 0,
                "limit": 999
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 9;
            return util.aggregate(request, requestOptions, trace);

          case 9:
            response = _context3.sent;
            return _context3.abrupt("return", response);

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

  return function exportContacts() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @description This function return a single contact by uuid
 * @async
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [contactUUID="null contact_uuid"] - contact uuid
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise<object>} - promise resolving to a contact object
 */


var getContact = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        contactUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            accessToken = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null access_token";
            contactUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null contact_uuid";
            trace = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.prev = 3;
            MS = util.getEndpoint("contacts");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/contacts/").concat(contactUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 9;
            return request(requestOptions);

          case 9:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](3);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 13]]);
  }));

  return function getContact() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will list a user's contacts
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [user_uuid="null user_uuid"] - user uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters={}] - optional filters or search params
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns
 */


var listContacts = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        user_uuid,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null access_token";
            user_uuid = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null user_uuid";
            offset = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 0;
            limit = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : 10;
            filters = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : undefined;
            trace = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : {};
            _context5.prev = 6;
            MS = util.getEndpoint("contacts");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(user_uuid, "/contacts"),
              qs: {
                offset: offset,
                limit: limit
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            _context5.next = 13;
            return request(requestOptions);

          case 13:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](6);
            return _context5.abrupt("return", Promise.reject(util.formatError(_context5.t0)));

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[6, 17]]);
  }));

  return function listContacts() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will update a contact
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [contactUUID="null contactUUID"] - contact uuid
 * @param {string} [body="null body"] - contact data (PUT)
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to updated contact data
 */


var updateContact = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        contactUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            accessToken = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null access_token";
            contactUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null contactUUID";
            body = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : "null body";
            trace = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {};
            _context6.prev = 4;
            MS = util.getEndpoint("contacts");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/contacts/").concat(contactUUID),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context6.next = 10;
            return request(requestOptions);

          case 10:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](4);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 14]]);
  }));

  return function updateContact() {
    return _ref6.apply(this, arguments);
  };
}();

module.exports = {
  createUserContact: createUserContact,
  deleteContact: deleteContact,
  getContact: getContact,
  exportContacts: exportContacts,
  listContacts: listContacts,
  updateContact: updateContact
};