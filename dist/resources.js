/*global module require */
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var request = require("request-promise");
/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [type="null uuid"] - CMS instance uuid
 * @param {int} [offset=0] - instance rows offset
 * @param {int} [limit=100] - instance rows limit
 * @param {string} [include=undefined] - optional query param "include"
 * @param {string} [expand=undefined] - optional query param "expand"
 * @param {string} [referenceFilter=undefined] - optional query paran "reference_filter"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */


var getResourceInstance = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        type,
        offset,
        limit,
        include,
        expand,
        referenceFilter,
        trace,
        _listResponse$items,
        _listResponse$items$,
        _qs,
        listResponse,
        nextTrace,
        MS,
        requestOptions,
        response,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null accessToken";
            type = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null type";
            offset = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0;
            limit = _args.length > 3 && _args[3] !== undefined ? _args[3] : 100;
            include = _args.length > 4 && _args[4] !== undefined ? _args[4] : undefined;
            expand = _args.length > 5 && _args[5] !== undefined ? _args[5] : undefined;
            referenceFilter = _args.length > 6 && _args[6] !== undefined ? _args[6] : undefined;
            trace = _args.length > 7 && _args[7] !== undefined ? _args[7] : {};
            _context.prev = 8;
            _context.next = 11;
            return listResources(accessToken, type, undefined, //not using include here
            trace);

          case 11:
            listResponse = _context.sent;
            nextTrace = util.generateNewMetaData(trace);
            MS = util.getEndpoint("resources");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/instance/").concat(listResponse === null || listResponse === void 0 ? void 0 : (_listResponse$items = listResponse.items) === null || _listResponse$items === void 0 ? void 0 : (_listResponse$items$ = _listResponse$items[0]) === null || _listResponse$items$ === void 0 ? void 0 : _listResponse$items$.uuid, "/"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: (_qs = {}, _defineProperty(_qs, "rows.limit", limit), _defineProperty(_qs, "rows.offset", offset), _qs),
              json: true
            }; // add expand query param if defined

            if (expand !== undefined) {
              requestOptions.qs.expand = expand;
            } // add include query param if defined


            if (include !== undefined) {
              requestOptions.qs.include = include;
            } // add reference filter query param if defined


            if (referenceFilter !== undefined) {
              requestOptions.qs["reference_filter"] = referenceFilter;
            }

            util.addRequestTrace(requestOptions, nextTrace);
            _context.next = 21;
            return request(requestOptions);

          case 21:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](8);
            throw util.formatError(_context.t0);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 25]]);
  }));

  return function getResourceInstance() {
    return _ref.apply(this, arguments);
  };
}();
/**
 *
 * @description This function returns a CMS resource instance row.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [instance_uuid="null instance_uuid"]
 * @param {string} [row_id="null row_id"]
 * @param {string} [include="content"]
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to a CMS instance row object
 * @returns
 */


var getResourceInstanceRow = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        instance_uuid,
        row_id,
        include,
        trace,
        nextTrace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            instance_uuid = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null instance_uuid";
            row_id = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "null row_id";
            include = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : "content";
            trace = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : {};
            _context2.prev = 5;
            nextTrace = util.generateNewMetaData(trace);
            MS = util.getEndpoint("resources");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/instance/").concat(instance_uuid, "/row/").concat(row_id),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                include: include
              },
              json: true
            };
            util.addRequestTrace(requestOptions, nextTrace);
            _context2.next = 12;
            return request(requestOptions);

          case 12:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](5);
            throw util.formatError(_context2.t0);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 16]]);
  }));

  return function getResourceInstanceRow() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [include=undefined] - optional query param "include"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */


var listResources = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        type,
        include,
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
            type = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : undefined;
            include = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : undefined;
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            MS = util.getEndpoint("resources");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/instance/"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {},
              json: true
            }; // add include query param if defined

            if (typeof type === "string") {
              requestOptions.qs.type = type;
            } // add include query param if defined


            if (typeof include === "string") {
              requestOptions.qs.include = include;
            }

            util.addRequestTrace(requestOptions, trace);
            _context3.next = 12;
            return request(requestOptions);

          case 12:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](4);
            throw util.formatError(_context3.t0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 16]]);
  }));

  return function listResources() {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  getResourceInstance: getResourceInstance,
  getResourceInstanceRow: getResourceInstanceRow,
  listResources: listResources
};