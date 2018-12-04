/* global require module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require("./utilities");
var request = require("request-promise");
var objectMerge = require("object-merge");
var ResourceGroups = require("./resourceGroups");
var Identity = require("./identity");

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
var getByType = function getByType() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var dataObjectType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "data_object";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var loadContent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "false";
  var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "GET",
    uri: MS + "/objects?type=" + dataObjectType + "&load_content=" + loadContent + "&sort=name&offset=" + offset + "&limit=" + limit,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

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
var getDataObjects = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
    var loadContent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var filters = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
    var trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    var MS, requestOptions, apiFilters, sdkFilters, response, filteredResponse, paginatedResponse;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            MS = util.getEndpoint("objects");
            requestOptions = {
              method: "GET",
              uri: MS + "/users/" + userUUID + "/allowed-objects",
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              qs: {
                load_content: loadContent
              },
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice

            if (!filters) {
              _context.next = 39;
              break;
            }

            if (!((typeof filters === "undefined" ? "undefined" : _typeof(filters)) !== "object")) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", Promise.reject({
              statusCode: 400,
              message: "ERROR: filters is not an object"
            }));

          case 6:

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
            //console.log("Request Query Params", requestOptions.qs);
            //console.log("sdkFilters",sdkFilters, Object.keys(sdkFilters).length);
            // if the sdkFilters object is empty, the API can handle everything, otherwise the sdk needs to augment the api.

            if (!(Object.keys(sdkFilters).length === 0)) {
              _context.next = 23;
              break;
            }

            requestOptions.qs.offset = offset;
            requestOptions.qs.limit = limit;
            _context.prev = 12;
            _context.next = 15;
            return request(requestOptions);

          case 15:
            return _context.abrupt("return", _context.sent);

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](12);
            return _context.abrupt("return", Promise.reject(_context.t0));

          case 21:
            _context.next = 39;
            break;

          case 23:
            _context.prev = 23;
            _context.next = 26;
            return util.aggregate(request, requestOptions, trace);

          case 26:
            response = _context.sent;

            if (!(response.hasOwnProperty("items") && response.items.length > 0)) {
              _context.next = 33;
              break;
            }

            filteredResponse = util.filterResponse(response, sdkFilters);
            //console.log("******* FILTERED RESPONSE ********",filteredResponse);

            paginatedResponse = util.paginate(filteredResponse, offset, limit);
            //console.log("******* PAGINATED RESPONSE ********",paginatedResponse);

            return _context.abrupt("return", paginatedResponse);

          case 33:
            return _context.abrupt("return", response);

          case 34:
            _context.next = 39;
            break;

          case 36:
            _context.prev = 36;
            _context.t1 = _context["catch"](23);
            return _context.abrupt("return", Promise.reject(_context.t1));

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[12, 18], [23, 36]]);
  }));

  return function getDataObjects() {
    return _ref.apply(this, arguments);
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
var getDataObjectByType = function getDataObjectByType() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  var loadContent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "false";
  var trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUUID + "/allowed-objects?type=" + dataObjectType + "&load_content=" + loadContent + "&sort=name&offset=" + offset + "&limit=" + limit,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

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
var getDataObjectByTypeAndName = function getDataObjectByTypeAndName() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  var dataObjectName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "noName";
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var limit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 10;
  var loadContent = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "false";
  var trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUUID + "/allowed-objects?type=" + dataObjectType + "&load_content=" + loadContent + "&name=" + dataObjectName + "&offset=" + offset + "&limit=" + limit,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [dataObjectUUID="null uuid"] - data object UUID
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
var getDataObject = function getDataObject() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var dataObjectUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("objects");
  var requestOptions = {
    method: "GET",
    uri: MS + "/objects/" + dataObjectUUID,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will create a new user data object.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} objectName - object name
 * @param {string} objectType - object type (use '_' between words)
 * @param {string} objectDescription - object description
 * @param {object} [content={}] - object to be created
 * @param {object} [users=undefined] - optinal object containing users for creating permissions groups
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
var createUserDataObject = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
    var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
    var objectName = arguments[2];
    var objectType = arguments[3];
    var objectDescription = arguments[4];
    var content = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var users = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
    var trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
    var MS, msDelay, body, requestOptions, newObject, nextTrace, identity;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            MS = util.getEndpoint("objects");
            msDelay = util.config.msDelay;
            body = {
              name: objectName,
              type: objectType,
              description: objectDescription,
              content_type: "application/json",
              content: content
            };
            requestOptions = {
              method: "POST",
              uri: MS + "/users/" + userUUID + "/objects",
              body: body,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            //create the object first
            newObject = void 0;
            nextTrace = objectMerge({}, trace);
            _context2.prev = 7;
            _context2.next = 10;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 10:
            _context2.next = 12;
            return request(requestOptions);

          case 12:
            newObject = _context2.sent;

            if (!(users && (typeof users === "undefined" ? "undefined" : _typeof(users)) === "object")) {
              _context2.next = 21;
              break;
            }

            nextTrace = objectMerge({}, nextTrace, util.generateNewMetaData(nextTrace));
            //user groups require an account
            _context2.next = 17;
            return Identity.getIdentityDetails(accessToken, userUUID, nextTrace);

          case 17:
            identity = _context2.sent;

            nextTrace = objectMerge({}, nextTrace, util.generateNewMetaData(nextTrace));
            _context2.next = 21;
            return ResourceGroups.createResourceGroups(accessToken, identity.account_uuid, newObject.uuid, "object", //system role type
            users, nextTrace);

          case 21:
            return _context2.abrupt("return", newObject);

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](7);

            if (!(newObject && newObject.hasOwnProperty("uuid"))) {
              _context2.next = 41;
              break;
            }

            _context2.prev = 27;
            _context2.next = 30;
            return new Promise(function (resolve) {
              return setTimeout(resolve, msDelay);
            });

          case 30:
            //this is to allow microservices time ack the new group before deleting.
            nextTrace = objectMerge({}, nextTrace, util.generateNewMetaData(nextTrace));
            _context2.next = 33;
            return deleteDataObject(accessToken, newObject.uuid, nextTrace);

          case 33:
            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 36:
            _context2.prev = 36;
            _context2.t1 = _context2["catch"](27);
            return _context2.abrupt("return", Promise.reject({
              errors: {
                create: _context2.t0,
                cleanup: _context2.t1
              }
            }));

          case 39:
            _context2.next = 42;
            break;

          case 41:
            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 42:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[7, 24], [27, 36]]);
  }));

  return function createUserDataObject() {
    return _ref2.apply(this, arguments);
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
var createDataObject = function createDataObject() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var objectName = arguments[1];
  var objectType = arguments[2];
  var objectDescription = arguments[3];
  var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var MS = util.getEndpoint("objects");

  var b = {
    name: objectName,
    type: objectType,
    description: objectDescription,
    content_type: "application/json",
    content: content
  };
  //console.log('bbbbbbbb', b)
  var requestOptions = {
    method: "POST",
    uri: MS + "/objects",
    body: b,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will delete a data object and any resource groups associated with that object.
 * @param {string} [accessToken="null accessToken"] - accessToken
 * @param {string} [data_uuid="not specified"] - data object UUID
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
var deleteDataObject = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var data_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not specified";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, ResourceGroups, requestOptions;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            MS = util.getEndpoint("objects");
            ResourceGroups = require("./resourceGroups");
            requestOptions = {
              method: "DELETE",
              uri: MS + "/objects/" + data_uuid,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              json: true,
              resolveWithFullResponse: true
            };

            util.addRequestTrace(requestOptions, trace);

            _context3.prev = 4;
            _context3.next = 7;
            return ResourceGroups.cleanUpResourceGroups(accessToken, data_uuid, util.generateNewMetaData(trace));

          case 7:
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            return _context3.abrupt("return", Promise.resolve({ status: "ok" }));

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](4);
            return _context3.abrupt("return", Promise.reject({ status: "failed", error: _context3.t0 }));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 12]]);
  }));

  return function deleteDataObject() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will update an existing data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [data_uuid="uuid not specified"] - data object UUID
 * @param {object} [body={}] - data object replacement
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
var updateDataObject = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var data_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "uuid not specified";
    var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var users = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var MS, requestOptions, nextTrace, object, identity;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            MS = util.getEndpoint("objects");
            requestOptions = {
              method: "PUT",
              uri: MS + "/objects/" + data_uuid,
              body: body,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            nextTrace = objectMerge({}, trace);
            _context4.prev = 4;

            if (!(users && (typeof users === "undefined" ? "undefined" : _typeof(users)) === "object")) {
              _context4.next = 17;
              break;
            }

            //first determine this object's owner and account
            nextTrace = objectMerge({}, nextTrace, util.generateNewMetaData(nextTrace));
            _context4.next = 9;
            return getDataObject(accessToken, data_uuid, nextTrace);

          case 9:
            object = _context4.sent;

            nextTrace = objectMerge({}, nextTrace, util.generateNewMetaData(nextTrace));
            _context4.next = 13;
            return Identity.getIdentityDetails(accessToken, object.audit.created_by, nextTrace);

          case 13:
            identity = _context4.sent;

            nextTrace = objectMerge({}, nextTrace, util.generateNewMetaData(nextTrace));
            _context4.next = 17;
            return ResourceGroups.updateResourceGroups(accessToken, data_uuid, identity.account_uuid, users, nextTrace);

          case 17:
            _context4.next = 19;
            return request(requestOptions);

          case 19:
            return _context4.abrupt("return", _context4.sent);

          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4["catch"](4);
            return _context4.abrupt("return", Promise.reject(_context4.t0));

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[4, 22]]);
  }));

  return function updateDataObject() {
    return _ref4.apply(this, arguments);
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