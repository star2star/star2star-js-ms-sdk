/*global module require */
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

var Util = require("./utilities");

var request = require("request-promise");
/**
 * @description This function returns a single entitlement product
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [productUUID="null productUUID"] - product UUID
 * @param {object} [trace={}] - option CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a product object
 */


var getProduct = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        productUUID,
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
            productUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null productUUID";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = Util.getEndpoint("entitlements");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/products/").concat(productUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context.next = 9;
            return request(requestOptions);

          case 9:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](3);
            throw Util.formatError(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 13]]);
  }));

  return function getProduct() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @description This fuction returns a list of products
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - optional filters object {"key": "value"}
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a list of products
 */


var getProducts = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        filteredResponse,
        paginatedResponse,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            offset = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
            limit = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 10;
            filters = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : undefined;
            trace = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : {};
            _context2.prev = 5;
            MS = Util.getEndpoint("entitlements");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/products"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);

            if (!(typeof filters !== "undefined")) {
              _context2.next = 25;
              break;
            }

            if (!(_typeof(filters) !== "object" || filters === null)) {
              _context2.next = 12;
              break;
            }

            throw {
              "code": 400,
              "message": "filters param not an object",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": [{
                "filters": filters
              }]
            };

          case 12:
            // API limited to 100 per page
            requestOptions.qs = {
              offset: 0,
              limit: 100
            };
            _context2.next = 15;
            return Util.aggregate(request, requestOptions, trace);

          case 15:
            response = _context2.sent;

            if (!(response.hasOwnProperty("items") && response.items.length > 0)) {
              _context2.next = 22;
              break;
            }

            filteredResponse = Util.filterResponse(response, filters);
            paginatedResponse = Util.paginate(filteredResponse, offset, limit);
            return _context2.abrupt("return", paginatedResponse);

          case 22:
            return _context2.abrupt("return", response);

          case 23:
            _context2.next = 30;
            break;

          case 25:
            requestOptions.qs = {
              offset: offset,
              limit: limit
            };
            _context2.next = 28;
            return request(requestOptions);

          case 28:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 30:
            _context2.next = 35;
            break;

          case 32:
            _context2.prev = 32;
            _context2.t0 = _context2["catch"](5);
            throw Util.formatError(_context2.t0);

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 32]]);
  }));

  return function getProducts() {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  getProduct: getProduct,
  getProducts: getProducts
};