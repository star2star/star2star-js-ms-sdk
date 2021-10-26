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
/**
 * @async
 * @description This function will return media file metadata including a URL
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [fileUUID="null fileUUID"] - file UUID
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing file meta-data
 */


var getMediaFileUrl = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        fileUUID,
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
            fileUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null fileUUID";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = util.getEndpoint("media");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/media/").concat(fileUUID),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                "content_url": true
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 9;
            return request(requestOptions);

          case 9:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 13]]);
  }));

  return function getMediaFileUrl() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [user_uuid="no user uuid provided"] - UUID for user
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of groups for this user
 */


var listUserMedia = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var user_uuid,
        accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user_uuid = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "no user uuid provided";
            accessToken = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null accessToken";
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            MS = util.getEndpoint("media");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(user_uuid, "/media"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 9;
            return request(requestOptions);

          case 9:
            response = _context2.sent;
            return _context2.abrupt("return", response);

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

  return function listUserMedia() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will upload a file to the cpaas media service for the user.
 * @param {string} [file_name=Date.now()] - File name.
 * @param {formData} file - File to be uploaded
 * @param {string} [user_uuid="not specified user uuid "]
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing upload attributes.
 */


var uploadFile = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var file_name,
        file,
        user_uuid,
        accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            file_name = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : Date.now();
            file = _args3.length > 1 ? _args3[1] : undefined;
            user_uuid = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "not specified user uuid ";
            accessToken = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : "null accessToken";
            trace = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {};
            _context3.prev = 5;
            MS = util.getEndpoint("media"); //console.log(">>>>>", file )

            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/users/").concat(user_uuid, "/media"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              formData: {
                file: {
                  value: file,
                  options: {
                    filename: "file_name"
                  }
                },
                file_name: file_name
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 11;
            return request(requestOptions);

          case 11:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](5);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 15]]);
  }));

  return function uploadFile() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas media service to delete a specific user file.
 * @param {string} [file_id="no file_id provided"] - File ID
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */


var deleteMedia = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var file_id,
        accessToken,
        trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            file_id = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "no file_id provided";
            accessToken = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null accessToken";
            trace = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.prev = 3;
            MS = util.getEndpoint("media");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/media/").concat(file_id),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 9;
            return request(requestOptions);

          case 9:
            response = _context4.sent;

            if (!(response.statusCode === 204)) {
              _context4.next = 14;
              break;
            }

            return _context4.abrupt("return", {
              "status": "ok"
            });

          case 14:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete media failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 15:
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](3);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 17]]);
  }));

  return function deleteMedia() {
    return _ref4.apply(this, arguments);
  };
}();

module.exports = {
  deleteMedia: deleteMedia,
  getMediaFileUrl: getMediaFileUrl,
  listUserMedia: listUserMedia,
  uploadFile: uploadFile
};