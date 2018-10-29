/* global require process module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var config = require("./config.json");
var uuidv4 = require("uuid/v4");
var winston = require("winston");
var logLevel = config.localDebug ? "debug" : "silent";

/**
 *
 * @description This function will determine microservice endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
var getEndpoint = function getEndpoint() {
  var microservice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "NOTHING";

  var upperMS = microservice.toUpperCase();
  var env = isBrowser() ? window.s2sJsMsSdk : process.env;
  return config.microservices[upperMS] ? env.MS_HOST + config.microservices[upperMS] : undefined;
};

/**
 *
 * @description This function will determine microservice authentication endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
var getAuthHost = function getAuthHost() {
  return isBrowser() ? window.s2sJsMsSdk.AUTH_HOST : process.env.AUTH_HOST;
};

/**
 *
 * @description This function will determine microservice version.
 * @returns {string} - the configured string value or undefined
 */
var getVersion = function getVersion() {
  var env = isBrowser() ? window.s2sJsMsSdk : process.env;
  return env.MS_VERSION ? env.MS_VERSION : config.ms_version;
};

/**
 *
 * @description This function will lookup static items to be replaced.
 * @param {string} matchString - the string that we are matching on.
 * @returns {string} - the string value or undefined
 */
var replaceStaticValues = function replaceStaticValues(matchString) {
  var TDATE = new Date();
  var MONTH = "" + (TDATE.getMonth() + 1);
  var MYDAY = "" + TDATE.getDate();
  var aValues = {
    datetime: TDATE,
    YYYY: TDATE.getFullYear(),
    MM: ("0" + MONTH).substring(MONTH.length + 1 - 2),
    DD: ("0" + MYDAY).substring(MYDAY.length + 1 - 2)
  };
  //console.log('matchstring:',("0"+DAY).substring((DAY.length+1 - 2)), matchString, DAY, aValues)
  return aValues[matchString];
};

/**
 *
 * @description This function will get the value from the object tree, recursively.
 * @param {string} [matchString=""] - the string that we are matching on
 * @param {object} [objectTree={}] - the json object to search
 * @returns {string} - the string value or undefined
 */
var getValueFromObjectTree = function getValueFromObjectTree() {
  var matchString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var objectTree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var mString = matchString.replace(/%/g, "");
  var sValue = replaceStaticValues(mString);
  if (sValue) {
    return sValue;
  }
  var xReturn = void 0;
  //console.log('---', mString, matchString, objectTree)
  if (Object.keys(objectTree).indexOf(mString) > -1) {
    //console.log('rrrr', matchString, objectTree[mString])
    xReturn = objectTree[mString];
  } else {
    xReturn = Object.keys(objectTree).reduce(function (p, c) {
      if (p === undefined) {
        //console.log(p)
        if (_typeof(objectTree[c]) === "object") {
          return getValueFromObjectTree(mString, objectTree[c]);
        }
      }
      return p;
    }, undefined);
  }
  //console.log('bbbb', matchString, xReturn)
  return xReturn;
};

/**
 *
 * @description This function will take in an inputValue String and replace variables from objectTree.
 * @param {string} [inputValue=""] - what to look for
 * @param {*} [objectTree={}] - json Object to search
 * @returns {string} - replaced inputValue
 */
var replaceVariables = function replaceVariables() {
  var inputValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var objectTree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // will search for %xxxxx%
  var myRegex = /(\%[\w|\d|\.\-\*\/]+\%)/g;
  var returnString = inputValue;

  var arrayOfMatches = inputValue.match(myRegex);

  arrayOfMatches !== null && arrayOfMatches.forEach(function (theMatch) {
    var retrievedValue = getValueFromObjectTree(theMatch, objectTree);
    //console.log('^^^^^^^^', theMatch, retrievedValue)
    returnString = returnString.replace(theMatch, retrievedValue ? retrievedValue : theMatch);
  });

  return returnString;
};

/**
 *
 * @description This function will create a new UUID
 * @returns {string} - new UUID
 */
var createUUID = function createUUID() {
  var d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
  });
};

/**
 *
 * @description This function returns a portion of a response in a paginated format.
 * @param {object} [response={}] - API list response object with format {"items":[]}
 * @param {number} [offset=0] - response offset
 * @param {number} [limit=10] - reponse items limit
 * @returns {object} - response object with format {"items":[],"meatadata":{}}
 */
var paginate = function paginate(response) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

  var total = response.items.length;
  var paginatedResponse = {
    items: response.items.slice(offset, offset + limit)
  };
  var count = paginatedResponse.items.length;
  paginatedResponse.metadata = {
    total: total,
    offset: offset,
    count: count,
    limit: limit
  };
  return paginatedResponse;
};

/**
 *
 * @description This function filters an API response in an "AND" format. Returned items must match filter
 * @param {object} [response={}] - API list response object with format {"items":[]}
 * @param {array} [filter=[]] - Array of filters to apply to API response object
 * @returns {object} - Response object with format {"items":[]}
 */
var filterResponse = function filterResponse(response, filters) {
  //console.log("*****FILTERS*****", filters);
  Object.keys(filters).forEach(function (filter) {
    var filteredResponse = response.items.filter(function (filterItem) {
      var found = false;
      var doFilter = function doFilter(obj, filter) {
        Object.keys(obj).forEach(function (prop) {
          if (found) return;
          //not seaching through arrays
          if (!Array.isArray(obj[prop])) {
            if (typeof obj[prop] === "string" || typeof obj[prop] === "number" || typeof obj[prop] === "boolean") {
              // console.log("PROP", prop);
              // console.log("OBJ[PROP]", obj[prop]);
              // console.log("FILTER", filter);
              // console.log("FILTERS[FILTER}",filters[filter]);
              found = prop === filter && obj[prop] === filters[filter];
              return;
            } else if (_typeof(obj[prop]) === "object") {
              //console.log("************ Filter recursing **************",obj[prop]);
              return doFilter(obj[prop], filter);
            }
          }
        });
        //console.log("FOUND", found);
        return found;
      };
      return doFilter(filterItem, filter);
    });
    response.items = filteredResponse;
    //console.log("FILTERED RESPONSE", filteredResponse);
  });
  //console.log("FINAL RESPONSE ARRAY", response.items.length, response.items);
  return response;
};

/**
 * @async
 * @description This utility will fetch all items for a GET call and return them as a single response.
 * @param {Promise} request
 * @param {object} requestOptions
 * @returns
 */
var aggregate = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, requestOptions) {
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var total, offset, makeRequest;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            requestOptions.qs.limit = 10; //uncomment to force pagination for testing.
            total = void 0, offset = 0;

            makeRequest = function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, requestOptions) {
                var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var nextTrace, response, nextResponse, items;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        nextTrace = generateNewMetaData(trace);

                        addRequestTrace(requestOptions, nextTrace);
                        _context.prev = 2;
                        _context.next = 5;
                        return request(requestOptions);

                      case 5:
                        response = _context.sent;

                        total = response.metadata.total;
                        offset = response.metadata.offset + response.metadata.count;

                        if (!(total > offset)) {
                          _context.next = 23;
                          break;
                        }

                        console.log("recursing");
                        requestOptions.qs.offset = offset;
                        _context.next = 13;
                        return makeRequest(request, requestOptions);

                      case 13:
                        nextResponse = _context.sent;
                        items = response.items.concat(nextResponse.items);

                        response.items = items;
                        response.metadata.offset = 0;
                        response.metadata.count = total;
                        response.metadata.limit = total;
                        delete response.links; //the links are invalid
                        return _context.abrupt("return", response);

                      case 23:
                        return _context.abrupt("return", response);

                      case 24:
                        _context.next = 29;
                        break;

                      case 26:
                        _context.prev = 26;
                        _context.t0 = _context["catch"](2);
                        return _context.abrupt("return", Promise.reject(_context.t0));

                      case 29:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, undefined, [[2, 26]]);
              }));

              return function makeRequest(_x12, _x13) {
                return _ref2.apply(this, arguments);
              };
            }();

            _context2.next = 5;
            return makeRequest(request, requestOptions, trace);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function aggregate(_x9, _x10) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @description Returns true is window is found and sets sdk namespace if needed.
 *
 * @returns
 */
var isBrowser = function isBrowser() {
  if (typeof window === "undefined") {
    return false;
  } else {
    if (!window.hasOwnProperty("s2sJsMsSdk")) {
      window.s2sJsMsSdk = {};
    }
    return true;
  }
};

var addRequestTrace = function addRequestTrace(request) {
  var trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var headerKeys = ["id", "trace", "parent"];

  headerKeys.forEach(function (keyName) {
    if ((typeof trace === "undefined" ? "undefined" : _typeof(trace)) === "object" && trace.hasOwnProperty(keyName)) {
      request.headers[keyName] = trace[keyName];
      logger.log("debug", "Found Trace " + keyName + ": " + request.headers[keyName]);
    } else {
      request.headers[keyName] = uuidv4();
      logger.log("debug", "Assigning Trace " + keyName + ": " + request.headers[keyName]);
    }
  });
  if ((typeof trace === "undefined" ? "undefined" : _typeof(trace)) === "object" && trace.hasOwnProperty("debug")) {
    request.headers["debug"] = trace["debug"];
  } else if (config.msDebug) {
    request.headers["debug"] = true;
  } else {
    request.headers["debug"] = false;
  }

  return request;
};

var logger = new winston.Logger({
  level: logLevel,
  transports: [new winston.transports.Console({ colorize: true })]
});

var generateNewMetaData = function generateNewMetaData() {
  var oldMetaData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var rObject = {};
  if (oldMetaData.hasOwnProperty("id")) {
    rObject.parent = oldMetaData.id;
  }

  if (oldMetaData.hasOwnProperty("trace")) {
    rObject.trace = oldMetaData.trace;
  } else {
    rObject.trace = uuidv4();
  }

  if (config.msDebug) {
    rObject.debug = true;
  } else if (oldMetaData.hasOwnProperty("debug")) {
    rObject.debug = oldMetaData.debug;
  } else {
    rObject.debug = false;
  }

  rObject.id = uuidv4();

  return rObject;
};

module.exports = {
  getEndpoint: getEndpoint,
  getAuthHost: getAuthHost,
  getVersion: getVersion,
  config: config,
  replaceVariables: replaceVariables,
  createUUID: createUUID,
  aggregate: aggregate, //TODO Unit test 9/27/18 nh
  filterResponse: filterResponse, //TODO Unit test 9/27/18 nh
  paginate: paginate, //TODO Unit test 9/27/18 nh
  isBrowser: isBrowser, //TODO Unit test 10/05/18 nh
  addRequestTrace: addRequestTrace, //TODO Unit test 10/10/18 nh
  logger: logger, //TODO Unit test 10/11/18 nh
  generateNewMetaData: generateNewMetaData
};