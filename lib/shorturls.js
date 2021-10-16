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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");

var objectMerge = require("object-merge");
/**
 * @async
 * @description This function will get a list of all short urls.
 * @param {string} [userUuid='null user uuid'] - account_uuid
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {object} [options={}] - object of options
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of short urls
 */


var listShortUrls = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var userUuid,
        accessToken,
        options,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userUuid = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null user uuid";
            accessToken = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null accessToken";
            options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            trace = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            _context.prev = 4;
            MS = util.getEndpoint("shorturls");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/shorturls?user_uuid=").concat(userUuid),
              qs: options,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
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

  return function listShortUrls() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will create a new short url.
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {object} [options={}] - {
  "account_uuid": "string",
  "analyze_content": false,
  "expires_after": 0,
  "max_view_count": 0,
  "mode": "Proxy",
  "save_content": false,
  "save_preview": false,
  "secure_pin": "string",
  "secure_view": "None",
  "short_code": "string",
  "short_domain": "string",
  "thumbnail": false,
  "url": "string",
  "user_uuid": "string"
 }
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of short urls
 */


var createShortUrl = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        options,
        trace,
        MS,
        b,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            MS = util.getEndpoint("shorturls");
            b = objectMerge({}, options);

            if (b.hasOwnProperty("url")) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", Promise.reject("options object missing url property"));

          case 8:
            //console.log('bbbbbbbb', b)
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/shorturls"),
              body: b,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 12;
            return request(requestOptions);

          case 12:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 16]]);
  }));

  return function createShortUrl() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete a short url.
 * @param {string} [userUuid='null user uuid'] - account_uuid
 * @param {string} [accessToken='null accessToken'] - access token for cpaas systems
 * @param {string} [short_code='notdefined'] - short code for url to delete
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteShortCode = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var userUuid,
        accessToken,
        short_code,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userUuid = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null user uuid";
            accessToken = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null accessToken";
            short_code = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "notdefined";
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            MS = util.getEndpoint("shorturls"); //console.log('bbbbbbbb', b)

            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/shorturls/").concat(short_code),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion()),
                user_uuid: userUuid
              },
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 10;
            return request(requestOptions);

          case 10:
            response = _context3.sent;

            if (!(response.statusCode === 204)) {
              _context3.next = 15;
              break;
            }

            return _context3.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "assign permission to role failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context3.next = 21;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](4);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 18]]);
  }));

  return function deleteShortCode() {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  listShortUrls: listShortUrls,
  createShortUrl: createShortUrl,
  deleteShortCode: deleteShortCode
};