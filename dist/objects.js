/* global require module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async 
 * @description This function returns objects permitted to user with flexible filtering.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUUID="null userUUID"]
 * @param {number} [offset=0] - pagination limit
 * @param {number} [limit=10] - pagination offset
 * @param {boolean} [load_content=false] - return object content or just descriptors
 * @param {array} [filters=undefined] - array of filter options [name, description, status, etc]
 */
var getDataObjects = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
    var loadContent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var filters = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
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
                'Authorization': "Bearer " + accessToken,
                'Content-type': 'application/json',
                'x-api-version': "" + util.getVersion()
              },
              "qs": {
                "load_content": loadContent
              },
              json: true
            };

            //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice

            if (!filters) {
              _context.next = 38;
              break;
            }

            if (!((typeof filters === "undefined" ? "undefined" : _typeof(filters)) !== "object")) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", Promise.reject({ "statusCode": 400, "message": "ERROR: filters is not an object" }));

          case 5:

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
              _context.next = 22;
              break;
            }

            requestOptions.qs.offset = offset;
            requestOptions.qs.limit = limit;
            _context.prev = 11;
            _context.next = 14;
            return request(requestOptions);

          case 14:
            return _context.abrupt("return", _context.sent);

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](11);
            return _context.abrupt("return", Promise.reject(_context.t0));

          case 20:
            _context.next = 38;
            break;

          case 22:
            _context.prev = 22;
            _context.next = 25;
            return util.aggregate(request, requestOptions);

          case 25:
            response = _context.sent;

            if (!(response.hasOwnProperty("items") && response.items.length > 0)) {
              _context.next = 32;
              break;
            }

            filteredResponse = util.filterResponse(response, sdkFilters);
            //console.log("******* FILTERED RESPONSE ********",filteredResponse);

            paginatedResponse = util.paginate(filteredResponse, offset, limit);
            //console.log("******* PAGINATED RESPONSE ********",paginatedResponse);

            return _context.abrupt("return", paginatedResponse);

          case 32:
            return _context.abrupt("return", response);

          case 33:
            _context.next = 38;
            break;

          case 35:
            _context.prev = 35;
            _context.t1 = _context["catch"](22);
            return _context.abrupt("return", Promise.reject(_context.t1));

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[11, 17], [22, 35]]);
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
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
var getDataObjectByType = function getDataObjectByType() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  var loadContent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "false";

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUUID + "/allowed-objects?type=" + dataObjectType + "&load_content=" + loadContent + "&sort=name&offset=" + offset + "&limit=" + limit,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
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

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + userUUID + "/allowed-objects?type=" + dataObjectType + "&load_content=" + loadContent + "&name=" + dataObjectName + "&offset=" + offset + "&limit=" + limit,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async 
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [dataObjectUUID="null uuid"] - data object UUID
 * @returns {Promise<object>} Promise resolving to a data object
 */
var getDataObject = function getDataObject() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var dataObjectUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";

  var MS = util.getEndpoint("objects");
  var requestOptions = {
    method: "GET",
    uri: MS + "/objects/" + dataObjectUUID,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
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
 * @returns {Promise<object>} Promise resolving to a data object
 */
var createUserDataObject = function createUserDataObject() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var objectName = arguments[2];
  var objectType = arguments[3];
  var objectDescription = arguments[4];
  var content = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

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
    uri: MS + "/users/" + userUUID + "/objects",
    body: b,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will create a new data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} objectName - string object name
 * @param {string} objectType - string object type (use '_' between words)
 * @param {string} objectDescription - string object description
 * @param {object} [content={}] - object with contents
 * @returns {Promise<object>} Promise resolving to a data object
 */
var createDataObject = function createDataObject() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var objectName = arguments[1];
  var objectType = arguments[2];
  var objectDescription = arguments[3];
  var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

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
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async 
 * @description This function will delete a data object.
 * @param {string} [accessToken="null accessToken"] - accessToken
 * @param {string} [data_uuid="not specified"] - data object UUID
 * @returns {Promise<object>} Promise resolving to a data object
 */
var deleteDataObject = function deleteDataObject() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var data_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "not specified";

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/objects/" + data_uuid,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true,
    resolveWithFullResponse: true
  };
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will update an existing data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [data_uuid="uuid not specified"] - data object UUID
 * @param {object} [body={}] - data object replacement
 * @returns {Promise<object>} Promise resolving to a data object
 */
var updateDataObject = function updateDataObject() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var data_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "uuid not specified";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("objects");

  var requestOptions = {
    method: "PUT",
    uri: MS + "/objects/" + data_uuid,
    body: body,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};
module.exports = {
  getDataObject: getDataObject,
  getDataObjects: getDataObjects,
  getDataObjectByType: getDataObjectByType,
  getDataObjectByTypeAndName: getDataObjectByTypeAndName,
  createUserDataObject: createUserDataObject,
  createDataObject: createDataObject,
  deleteDataObject: deleteDataObject,
  updateDataObject: updateDataObject
};