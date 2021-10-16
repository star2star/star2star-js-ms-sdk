/*global module require */
"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var request = require("request-promise");
/**
 * @async
 * @description This function will get an already created report.
 * @param {string} [accessToken="null access token"]
 * @param {string} reportUUID
 * @param {string} templateUUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */


var getReport = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        reportUUID,
        templateUUID,
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
            reportUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null report uuid";
            templateUUID = _args.length > 2 && _args[2] !== undefined ? _args[2] : "null template uuid";
            trace = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            _context.prev = 4;
            MS = util.getEndpoint("activity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/report"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                report_uuid: reportUUID,
                template_uuid: templateUUID
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 10;
            return request(requestOptions);

          case 10:
            response = _context.sent;

            if (!(response.statusCode === 204)) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", {});

          case 13:
            return _context.abrupt("return", response.body);

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](4);
            throw util.formatError(_context.t0);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 16]]);
  }));

  return function getReport() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will list available report templates.
 * @param {string} [accessToken="null access token"]
 * @param {number} [offset = 0] - pagination offset
 * @param {number} [limit = 10] = pagination limit
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */


var listReportTemplates = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        offset,
        limit,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null access token";
            offset = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
            limit = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 10;
            trace = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            _context2.prev = 4;
            MS = util.getEndpoint("activity");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/report/template"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                offset: offset,
                limit: limit
              },
              resolveWithFullResponse: false,
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
            throw util.formatError(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 14]]);
  }));

  return function listReportTemplates() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will create a report based on a template.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [templateUuid="null account uuid"] - report template uuid
 * @param {string} [ownerUuid=undefined] - owner uuid (CPaaS user_uuid) - required if account uuid not specified
 * @param {string} [accountUuid=undefined] - CPaaS account uuid - required if owner uuid not specified
 * @param {object} [paramaters={}] - report parameters
 * @param {object} [trace={}] - optional CPaaS microservice lifecycle headers
 * @returns {Promise<object>} - Promise resolving to an object containing report uuid
 */


var runReport = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        templateUuid,
        ownerUuid,
        accountUuid,
        parameters,
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
            templateUuid = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null account uuid";
            ownerUuid = _args3.length > 2 ? _args3[2] : undefined;
            accountUuid = _args3.length > 3 ? _args3[3] : undefined;
            parameters = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {};
            trace = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : {};
            _context3.prev = 6;
            MS = util.getEndpoint("activity");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/report/").concat(templateUuid),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {},
              body: {
                parameters: parameters
              },
              json: true
            };

            if (!(typeof ownerUuid !== "undefined")) {
              _context3.next = 13;
              break;
            }

            requestOptions.qs.owner_uuid = ownerUuid;
            _context3.next = 18;
            break;

          case 13:
            if (!(typeof accountUuid !== "undefined")) {
              _context3.next = 17;
              break;
            }

            requestOptions.qs.account_uuid = accountUuid;
            _context3.next = 18;
            break;

          case 17:
            throw {
              "code": 400,
              "message": "request requires either owner or account uuid"
            };

          case 18:
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 21;
            return request(requestOptions);

          case 21:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3["catch"](6);
            throw util.formatError(_context3.t0);

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 25]]);
  }));

  return function runReport() {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  getReport: getReport,
  listReportTemplates: listReportTemplates,
  runReport: runReport
};