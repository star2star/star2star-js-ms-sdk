/* global require module*/
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.concat.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var request = require("request-promise");
/**
 * @async
 * @description This function lists lambdas
 * @param {string} [accessToken='null access Token'] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var listLambdas = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        offset,
        limit,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null access Token";
            offset = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
            limit = _args.length > 2 && _args[2] !== undefined ? _args[2] : 10;
            trace = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            _context.prev = 4;
            MS = util.getEndpoint("lambda");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/actions"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion()),
                "Content-Type": "application/json"
              },
              qs: {
                limit: limit,
                skip: offset
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

  return function listLambdas() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [lambdaName='not defined'] - string representing the lambda name
 * @param {object} [params={}] - json object of parameters to be passed to the lambda function
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var invokeLambda = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        lambdaName,
        params,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null access Token";
            lambdaName = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "not defined";
            params = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            trace = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            _context2.prev = 4;
            MS = util.getEndpoint("lambda");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/actions/").concat(lambdaName, "/invoke"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion()),
                "Content-Type": "application/json"
              },
              body: params,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 10;
            return request(requestOptions);

          case 10:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 14]]);
  }));

  return function invokeLambda() {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  listLambdas: listLambdas,
  invokeLambda: invokeLambda
};