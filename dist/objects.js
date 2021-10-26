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

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Util = require("./utilities");

var request = require("request-promise");

var objectMerge = require("object-merge");

var ResourceGroups = require("./resourceGroups");

var Logger = require("./node-logger");

var logger = new Logger.default();
/**
 * @async
 * @name Get By Type
 * @description This function will ask the cpaas data object service for a specific
 * type of object.
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {number} offset - pagination offset
 * @param {number} limit - pagination limit
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */

var getByType = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        dataObjectType,
        offset,
        limit,
        loadContent,
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
            dataObjectType = _args.length > 1 && _args[1] !== undefined ? _args[1] : "data_object";
            offset = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0;
            limit = _args.length > 3 && _args[3] !== undefined ? _args[3] : 10;
            loadContent = _args.length > 4 && _args[4] !== undefined ? _args[4] : "false";
            trace = _args.length > 5 && _args[5] !== undefined ? _args[5] : {};
            _context.prev = 6;
            MS = Util.getEndpoint("objects");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/objects?type=").concat(dataObjectType, "&load_content=").concat(loadContent, "&sort=name&offset=").concat(offset, "&limit=").concat(limit),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context.next = 12;
            return request(requestOptions);

          case 12:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](6);
            return _context.abrupt("return", Promise.reject(Util.formatError(_context.t0)));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 16]]);
  }));

  return function getByType() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function returns objects permitted to user with flexible filtering.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUUID="null userUUID"]
 * @param {number} [offset=0] - pagination limit
 * @param {number} [limit=10] - pagination offset
 * @param {boolean} [load_content=false] - return object content or just descriptors
 * @param {array} [filters=undefined] - array of filter options [name, description, status, etc]
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise} - Promise resolving to a list of objects
 */


var getDataObjects = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        userUUID,
        offset,
        limit,
        loadContent,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        apiFilters,
        sdkFilters,
        filteredResponse,
        paginatedResponse,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            userUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null userUUID";
            offset = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 0;
            limit = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : 10;
            loadContent = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : false;
            filters = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : undefined;
            trace = _args2.length > 6 && _args2[6] !== undefined ? _args2[6] : {};
            _context2.prev = 7;
            MS = Util.getEndpoint("objects");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(userUUID, "/allowed-objects"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              qs: {
                load_content: loadContent
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);

            if (!filters) {
              _context2.next = 38;
              break;
            }

            if (!(_typeof(filters) !== "object")) {
              _context2.next = 14;
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

          case 14:
            // sort the filters into those the API handles and those handled by the SDK.
            apiFilters = ["content_type", "description", "name", "sort", "type"];
            sdkFilters = {};
            Object.keys(filters).forEach(function (filter) {
              if (apiFilters.includes(filter)) {
                requestOptions.qs[filter] = filters[filter];
              } else {
                sdkFilters[filter] = filters[filter];
              }
            });
            logger.debug("Request Query Params", requestOptions.qs);
            logger.debug("sdkFilters", sdkFilters); // if the sdkFilters object is empty, the API can handle everything, otherwise the sdk needs to augment the api.

            if (!(Object.keys(sdkFilters).length === 0)) {
              _context2.next = 28;
              break;
            }

            requestOptions.qs.offset = offset;
            requestOptions.qs.limit = limit;
            _context2.next = 24;
            return request(requestOptions);

          case 24:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 28:
            _context2.next = 30;
            return Util.aggregate(request, requestOptions, trace);

          case 30:
            response = _context2.sent;

            if (!(response.hasOwnProperty("items") && response.items.length > 0)) {
              _context2.next = 37;
              break;
            }

            filteredResponse = Util.filterResponse(response, sdkFilters); //logger.debug("******* FILTERED RESPONSE ********",filteredResponse);

            paginatedResponse = Util.paginate(filteredResponse, offset, limit); //logger.debug("******* PAGINATED RESPONSE ********",paginatedResponse);

            return _context2.abrupt("return", paginatedResponse);

          case 37:
            return _context2.abrupt("return", response);

          case 38:
            _context2.next = 43;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t0 = _context2["catch"](7);
            return _context2.abrupt("return", Promise.reject(Util.formatError(_context2.t0)));

          case 43:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 40]]);
  }));

  return function getDataObjects() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @name Get Data Object By Type
 * @description This function will ask the cpaas data object service for a specific
 * type of object.
 * @param {string} userUUID - user UUID to be used
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {number} offset - pagination offset
 * @param {number} limit - pagination limit
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */


var getDataObjectByType = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var userUUID,
        accessToken,
        dataObjectType,
        offset,
        limit,
        loadContent,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userUUID = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null user uuid";
            accessToken = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null accessToken";
            dataObjectType = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "data_object";
            offset = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 0;
            limit = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : 10;
            loadContent = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : "false";
            trace = _args3.length > 6 && _args3[6] !== undefined ? _args3[6] : {};
            _context3.prev = 7;
            MS = Util.getEndpoint("objects");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(userUUID, "/allowed-objects?type=").concat(dataObjectType, "&load_content=").concat(loadContent, "&sort=name&offset=").concat(offset, "&limit=").concat(limit),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context3.next = 13;
            return request(requestOptions);

          case 13:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](7);
            return _context3.abrupt("return", Promise.reject(Util.formatError(_context3.t0)));

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[7, 17]]);
  }));

  return function getDataObjectByType() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas data object service for a specific
 * type of object with name.
 * @param {string} userUUID - user UUID to be used
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {number} offset - pagination offset
 * @param {number} limit - pagination limit
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */


var getDataObjectByTypeAndName = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var userUUID,
        accessToken,
        dataObjectType,
        dataObjectName,
        offset,
        limit,
        loadContent,
        trace,
        MS,
        requestOptions,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userUUID = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null user uuid";
            accessToken = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null accessToken";
            dataObjectType = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : "data_object";
            dataObjectName = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : "noName";
            offset = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : 0;
            limit = _args4.length > 5 && _args4[5] !== undefined ? _args4[5] : 10;
            loadContent = _args4.length > 6 && _args4[6] !== undefined ? _args4[6] : "false";
            trace = _args4.length > 7 && _args4[7] !== undefined ? _args4[7] : {};
            _context4.prev = 8;
            MS = Util.getEndpoint("objects");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/users/").concat(userUUID, "/allowed-objects?type=").concat(dataObjectType, "&load_content=").concat(loadContent, "&name=").concat(dataObjectName, "&offset=").concat(offset, "&limit=").concat(limit),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            return _context4.abrupt("return", request(requestOptions));

          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4["catch"](8);
            return _context4.abrupt("return", Promise.reject(Util.formatError(_context4.t0)));

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[8, 15]]);
  }));

  return function getDataObjectByTypeAndName() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [dataObjectUUID="null uuid"] - data object UUID
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */


var getDataObject = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        dataObjectUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null accessToken";
            dataObjectUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null uuid";
            trace = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            _context5.prev = 3;
            MS = Util.getEndpoint("objects");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/objects/").concat(dataObjectUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion()),
                "cache-control": "no-cache"
              },
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context5.next = 9;
            return request(requestOptions);

          case 9:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", Promise.reject(Util.formatError(_context5.t0)));

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 13]]);
  }));

  return function getDataObject() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will create a new user data object.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} objectName - object name
 * @param {string} objectType - object type (use '_' between words)
 * @param {string} objectDescription - object description
 * @param {object} [content={}] - object to be created
 * @param {string} [accountUUID="null accountUUID"] - optional account uuid to scope user permissions
 * @param {object} [users=undefined] - optional object containing users for creating permissions groups
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */


var createUserDataObject = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var userUUID,
        accessToken,
        objectName,
        objectType,
        objectDescription,
        content,
        accountUUID,
        users,
        trace,
        MS,
        body,
        requestOptions,
        newObject,
        nextTrace,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            userUUID = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null user uuid";
            accessToken = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null accessToken";
            objectName = _args6.length > 2 ? _args6[2] : undefined;
            objectType = _args6.length > 3 ? _args6[3] : undefined;
            objectDescription = _args6.length > 4 ? _args6[4] : undefined;
            content = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : {};
            accountUUID = _args6.length > 6 && _args6[6] !== undefined ? _args6[6] : undefined;
            users = _args6.length > 7 && _args6[7] !== undefined ? _args6[7] : undefined;
            trace = _args6.length > 8 && _args6[8] !== undefined ? _args6[8] : {};
            _context6.prev = 9;
            MS = Util.getEndpoint("objects");
            body = {
              name: objectName,
              type: objectType,
              description: objectDescription,
              content_type: "application/json",
              content: content
            };
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/users/").concat(userUUID, "/objects"),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace); //create the object first

            nextTrace = objectMerge({}, trace);
            _context6.prev = 15;
            _context6.next = 18;
            return request(requestOptions);

          case 18:
            response = _context6.sent;
            newObject = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context6.next = 23;
              break;
            }

            _context6.next = 23;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 23:
            if (!(accountUUID && users && _typeof(users) === "object")) {
              _context6.next = 27;
              break;
            }

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context6.next = 27;
            return ResourceGroups.createResourceGroups(accessToken, accountUUID, newObject.uuid, "object", //system role type
            users, nextTrace);

          case 27:
            return _context6.abrupt("return", newObject);

          case 30:
            _context6.prev = 30;
            _context6.t0 = _context6["catch"](15);

            if (!(newObject && newObject.hasOwnProperty("uuid"))) {
              _context6.next = 42;
              break;
            }

            _context6.prev = 33;
            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context6.next = 37;
            return deleteDataObject(accessToken, newObject.uuid, nextTrace);

          case 37:
            _context6.next = 42;
            break;

          case 39:
            _context6.prev = 39;
            _context6.t1 = _context6["catch"](33);
            throw {
              "code": 500,
              "message": "create user data object resource groups failed. unable to clean up data object",
              "details": [{
                "groups_error": _context6.t0
              }, {
                "delete_object_error": _context6.t1
              }]
            };

          case 42:
            throw _context6.t0;

          case 43:
            _context6.next = 48;
            break;

          case 45:
            _context6.prev = 45;
            _context6.t2 = _context6["catch"](9);
            return _context6.abrupt("return", Promise.reject(Util.formatError(_context6.t2)));

          case 48:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[9, 45], [15, 30], [33, 39]]);
  }));

  return function createUserDataObject() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will create a new data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} objectName - string object name
 * @param {string} objectType - string object type (use '_' between words)
 * @param {string} objectDescription - string object description
 * @param {object} [content={}] - object with contents
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */


var createDataObject = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        objectName,
        objectType,
        objectDescription,
        content,
        trace,
        MS,
        b,
        requestOptions,
        response,
        newObject,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            accessToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null accessToken";
            objectName = _args7.length > 1 ? _args7[1] : undefined;
            objectType = _args7.length > 2 ? _args7[2] : undefined;
            objectDescription = _args7.length > 3 ? _args7[3] : undefined;
            content = _args7.length > 4 && _args7[4] !== undefined ? _args7[4] : {};
            trace = _args7.length > 5 && _args7[5] !== undefined ? _args7[5] : {};
            _context7.prev = 6;
            MS = Util.getEndpoint("objects");
            b = {
              name: objectName,
              type: objectType,
              description: objectDescription,
              content_type: "application/json",
              content: content
            }; //console.log('bbbbbbbb', b)

            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/objects"),
              body: b,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            _context7.next = 13;
            return request(requestOptions);

          case 13:
            response = _context7.sent;
            newObject = response.body; // create returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context7.next = 18;
              break;
            }

            _context7.next = 18;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 18:
            return _context7.abrupt("return", newObject);

          case 21:
            _context7.prev = 21;
            _context7.t0 = _context7["catch"](6);
            return _context7.abrupt("return", Promise.reject(Util.formatError(_context7.t0)));

          case 24:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[6, 21]]);
  }));

  return function createDataObject() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete a data object and any resource groups associated with that object.
 * @param {string} [accessToken="null accessToken"] - accessToken
 * @param {string} [dataUUID="not specified"] - data object UUID
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */


var deleteDataObject = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        dataUUID,
        trace,
        MS,
        _ResourceGroups,
        requestOptions,
        nextTrace,
        response,
        _args8 = arguments;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            accessToken = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null accessToken";
            dataUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null dataUUID";
            trace = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            _context8.prev = 3;
            MS = Util.getEndpoint("objects");
            _ResourceGroups = require("./resourceGroups");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/objects/").concat(dataUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              json: true,
              resolveWithFullResponse: true
            };
            Util.addRequestTrace(requestOptions, trace);
            nextTrace = objectMerge({}, trace, Util.generateNewMetaData(trace));
            _context8.next = 11;
            return _ResourceGroups.cleanUpResourceGroups(accessToken, dataUUID, nextTrace);

          case 11:
            _context8.next = 13;
            return request(requestOptions);

          case 13:
            response = _context8.sent;

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context8.next = 17;
              break;
            }

            _context8.next = 17;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace, "deleting");

          case 17:
            return _context8.abrupt("return", {
              status: "ok"
            });

          case 20:
            _context8.prev = 20;
            _context8.t0 = _context8["catch"](3);
            return _context8.abrupt("return", Promise.reject(Util.formatError(_context8.t0)));

          case 23:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 20]]);
  }));

  return function deleteDataObject() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will update an existing data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [dataUUID="uuid not specified"] - data object UUID
 * @param {object} [body={}] - data object replacement
 * @param {string} [accountUUID=undefined] - optional account to scope users object permissions to
 * @param {object} [users=undefined] - optional users permissions object
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */


var updateDataObject = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        dataUUID,
        body,
        accountUUID,
        users,
        trace,
        MS,
        requestOptions,
        nextTrace,
        response,
        updatedObj,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null accessToken";
            dataUUID = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "uuid not specified";
            body = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            accountUUID = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : undefined;
            users = _args9.length > 4 && _args9[4] !== undefined ? _args9[4] : undefined;
            trace = _args9.length > 5 && _args9[5] !== undefined ? _args9[5] : {};
            _context9.prev = 6;
            MS = Util.getEndpoint("objects");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/objects/").concat(dataUUID),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(Util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            Util.addRequestTrace(requestOptions, trace);
            nextTrace = objectMerge({}, trace);

            if (!accountUUID //required to update associated resource groups.
            ) {
              _context9.next = 15;
              break;
            }

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context9.next = 15;
            return ResourceGroups.updateResourceGroups(accessToken, dataUUID, accountUUID, "object", //specifies the system role to find in config.json
            users, nextTrace);

          case 15:
            _context9.next = 17;
            return request(requestOptions);

          case 17:
            response = _context9.sent;
            updatedObj = response.body; // update returns a 202....suspend return until the new resource is ready

            if (!(response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location"))) {
              _context9.next = 22;
              break;
            }

            _context9.next = 22;
            return Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
            trace);

          case 22:
            return _context9.abrupt("return", updatedObj);

          case 25:
            _context9.prev = 25;
            _context9.t0 = _context9["catch"](6);
            return _context9.abrupt("return", Promise.reject(Util.formatError(_context9.t0)));

          case 28:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[6, 25]]);
  }));

  return function updateDataObject() {
    return _ref9.apply(this, arguments);
  };
}();

module.exports = {
  getByType: getByType,
  getDataObject: getDataObject,
  getDataObjects: getDataObjects,
  getDataObjectByType: getDataObjectByType,
  getDataObjectByTypeAndName: getDataObjectByTypeAndName,
  createDataObject: createDataObject,
  createUserDataObject: createUserDataObject,
  deleteDataObject: deleteDataObject,
  updateDataObject: updateDataObject
};