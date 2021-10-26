/* global require module*/
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");
/**
 * @async
 * @description This function will return metadata for all API's or a subset of API's
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [subsystems=""] - empty or comma-separated list of requested subsystems
 * @param {object} [trace={}] - optional cpaas lifecycle headers
 * @returns {Promise}
 */


var getMetadataSubsystems = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        subsystems,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null access token";
            subsystems = _args.length > 1 ? _args[1] : undefined;
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = util.getEndpoint("metadata");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/subsystems/"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };

            if (subsystems !== undefined) {
              requestOptions.qs = {
                "subsystems": subsystems
              };
            }

            util.addRequestTrace(requestOptions, trace);
            _context.next = 10;
            return request(requestOptions);

          case 10:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 14]]);
  }));

  return function getMetadataSubsystems() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  getMetadataSubsystems: getMetadataSubsystems
};