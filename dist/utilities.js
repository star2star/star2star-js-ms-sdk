/* global require process module*/
"use strict";

require("core-js/modules/es6.array.copy-within");

require("core-js/modules/es6.array.every");

require("core-js/modules/es6.array.fill");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.from");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.array.last-index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.array.of");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/es6.array.reduce-right");

require("core-js/modules/es6.array.some");

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.array.species");

require("core-js/modules/es6.date.now");

require("core-js/modules/es6.date.to-iso-string");

require("core-js/modules/es6.date.to-json");

require("core-js/modules/es6.date.to-primitive");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.has-instance");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.map");

require("core-js/modules/es6.math.acosh");

require("core-js/modules/es6.math.asinh");

require("core-js/modules/es6.math.atanh");

require("core-js/modules/es6.math.cbrt");

require("core-js/modules/es6.math.clz32");

require("core-js/modules/es6.math.cosh");

require("core-js/modules/es6.math.expm1");

require("core-js/modules/es6.math.fround");

require("core-js/modules/es6.math.hypot");

require("core-js/modules/es6.math.imul");

require("core-js/modules/es6.math.log1p");

require("core-js/modules/es6.math.log10");

require("core-js/modules/es6.math.log2");

require("core-js/modules/es6.math.sign");

require("core-js/modules/es6.math.sinh");

require("core-js/modules/es6.math.tanh");

require("core-js/modules/es6.math.trunc");

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es6.number.epsilon");

require("core-js/modules/es6.number.is-finite");

require("core-js/modules/es6.number.is-integer");

require("core-js/modules/es6.number.is-nan");

require("core-js/modules/es6.number.is-safe-integer");

require("core-js/modules/es6.number.max-safe-integer");

require("core-js/modules/es6.number.min-safe-integer");

require("core-js/modules/es6.number.parse-float");

require("core-js/modules/es6.number.parse-int");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.object.create");

require("core-js/modules/es7.object.define-getter");

require("core-js/modules/es7.object.define-setter");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.define-properties");

require("core-js/modules/es7.object.entries");

require("core-js/modules/es6.object.freeze");

require("core-js/modules/es6.object.get-own-property-descriptor");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.object.get-own-property-names");

require("core-js/modules/es6.object.get-prototype-of");

require("core-js/modules/es7.object.lookup-getter");

require("core-js/modules/es7.object.lookup-setter");

require("core-js/modules/es6.object.prevent-extensions");

require("core-js/modules/es6.object.is");

require("core-js/modules/es6.object.is-frozen");

require("core-js/modules/es6.object.is-sealed");

require("core-js/modules/es6.object.is-extensible");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.seal");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es7.object.values");

require("core-js/modules/es6.promise");

require("core-js/modules/es7.promise.finally");

require("core-js/modules/es6.reflect.apply");

require("core-js/modules/es6.reflect.construct");

require("core-js/modules/es6.reflect.define-property");

require("core-js/modules/es6.reflect.delete-property");

require("core-js/modules/es6.reflect.get");

require("core-js/modules/es6.reflect.get-own-property-descriptor");

require("core-js/modules/es6.reflect.get-prototype-of");

require("core-js/modules/es6.reflect.has");

require("core-js/modules/es6.reflect.is-extensible");

require("core-js/modules/es6.reflect.own-keys");

require("core-js/modules/es6.reflect.prevent-extensions");

require("core-js/modules/es6.reflect.set");

require("core-js/modules/es6.reflect.set-prototype-of");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.flags");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.search");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.set");

require("core-js/modules/es6.symbol");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.string.anchor");

require("core-js/modules/es6.string.big");

require("core-js/modules/es6.string.blink");

require("core-js/modules/es6.string.bold");

require("core-js/modules/es6.string.code-point-at");

require("core-js/modules/es6.string.ends-with");

require("core-js/modules/es6.string.fixed");

require("core-js/modules/es6.string.fontcolor");

require("core-js/modules/es6.string.fontsize");

require("core-js/modules/es6.string.from-code-point");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.string.italics");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.string.link");

require("core-js/modules/es7.string.pad-start");

require("core-js/modules/es7.string.pad-end");

require("core-js/modules/es6.string.raw");

require("core-js/modules/es6.string.repeat");

require("core-js/modules/es6.string.small");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.string.strike");

require("core-js/modules/es6.string.sub");

require("core-js/modules/es6.string.sup");

require("core-js/modules/es6.string.trim");

require("core-js/modules/es6.typed.array-buffer");

require("core-js/modules/es6.typed.data-view");

require("core-js/modules/es6.typed.int8-array");

require("core-js/modules/es6.typed.uint8-array");

require("core-js/modules/es6.typed.uint8-clamped-array");

require("core-js/modules/es6.typed.int16-array");

require("core-js/modules/es6.typed.uint16-array");

require("core-js/modules/es6.typed.int32-array");

require("core-js/modules/es6.typed.uint32-array");

require("core-js/modules/es6.typed.float32-array");

require("core-js/modules/es6.typed.float64-array");

require("core-js/modules/es6.weak-map");

require("core-js/modules/es6.weak-set");

require("core-js/modules/web.timers");

require("core-js/modules/web.immediate");

require("core-js/modules/web.dom.iterable");

require("regenerator-runtime/runtime");

var _nodeLogger = _interopRequireDefault(require("./node-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var config = require("./config.json");

var uuidv4 = require("uuid/v4");

var logger = new _nodeLogger.default();
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
  }; //console.log('matchstring:',("0"+DAY).substring((DAY.length+1 - 2)), matchString, DAY, aValues)

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

  var xReturn; //console.log('---', mString, matchString, objectTree)

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
  } //console.log('bbbb', matchString, xReturn)


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
  var myRegex = /(%[\w|\d|.\-*/]+%)/g;
  var returnString = inputValue;
  var arrayOfMatches = inputValue.match(myRegex);
  arrayOfMatches !== null && arrayOfMatches.forEach(function (theMatch) {
    var retrievedValue = getValueFromObjectTree(theMatch, objectTree); //console.log('^^^^^^^^', theMatch, retrievedValue)

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
          if (found) return; //not seaching through arrays

          if (!Array.isArray(obj[prop])) {
            if (typeof obj[prop] === "string" || typeof obj[prop] === "number" || typeof obj[prop] === "boolean") {
              // console.log("PROP", prop);
              // console.log("OBJ[PROP]", obj[prop]);
              // console.log("FILTER", filter);
              // console.log("FILTERS[FILTER}",filters[filter]);
              found = prop === filter && obj[prop] === filters[filter];
              return;
            } else if (_typeof(obj[prop]) === "object" && obj[prop] !== null) {
              //console.log("************ Filter recursing **************",obj[prop]);
              return doFilter(obj[prop], filter);
            }
          }
        }); //console.log("FOUND", found);

        return found;
      };

      return doFilter(filterItem, filter);
    });
    response.items = filteredResponse; //console.log("FILTERED RESPONSE", filteredResponse);
  }); //console.log("FINAL RESPONSE ARRAY", response.items.length, response.items);

  return response;
};
/**
 * @async
 * @description This utility will fetch all items for a GET call and return them as a single response.
 * @param {Promise} request
 * @param {object} requestOptions
 * @returns
 */


var aggregate =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(request, requestOptions) {
    var trace,
        total,
        offset,
        makeRequest,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            //uncomment and set to less than total expected resources to force aggregation for testing.
            //requestOptions.qs.limit = 1;
            offset = 0;

            makeRequest =
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(request, requestOptions) {
                var trace,
                    nextTrace,
                    response,
                    nextResponse,
                    items,
                    _args = arguments;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                        nextTrace = generateNewMetaData(trace);
                        addRequestTrace(requestOptions, nextTrace);
                        _context.next = 5;
                        return request(requestOptions);

                      case 5:
                        response = _context.sent;
                        total = response.metadata.total;
                        offset = response.metadata.offset + response.metadata.count;

                        if (!(total > offset)) {
                          _context.next = 22;
                          break;
                        }

                        requestOptions.qs.offset = offset;
                        _context.next = 12;
                        return makeRequest(request, requestOptions);

                      case 12:
                        nextResponse = _context.sent;
                        items = response.items.concat(nextResponse.items);
                        response.items = items;
                        response.metadata.offset = 0;
                        response.metadata.count = total;
                        response.metadata.limit = total;
                        delete response.links; //the links are invalid now

                        return _context.abrupt("return", response);

                      case 22:
                        return _context.abrupt("return", response);

                      case 23:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function makeRequest(_x3, _x4) {
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
    }, _callee2, this);
  }));

  return function aggregate(_x, _x2) {
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
  //defaults to "trace" if MS_LOGLEVEL is undefined.
  logger.setLevel(getLogLevel()); //defaults to "false" if MS_LOGPRETTY is undefined.

  logger.setPretty(getLogPretty());
  var headerKeys = ["id", "trace", "parent"];
  headerKeys.forEach(function (keyName) {
    if (_typeof(trace) === "object" && trace.hasOwnProperty(keyName)) {
      request.headers[keyName] = trace[keyName]; //logger.debug(`Found Trace ${keyName}: ${request.headers[keyName]}`);
    } else {
      request.headers[keyName] = uuidv4(); //logger.debug(`Assigning Trace ${keyName}: ${request.headers[keyName]}`);
    }
  });

  if (_typeof(trace) === "object" && trace.hasOwnProperty("debug")) {
    request.headers["debug"] = trace["debug"];
  } else if (config.msDebug) {
    request.headers["debug"] = true;
  } else {
    request.headers["debug"] = false;
  }

  logger.trace("Microservice Request ".concat(request.method, ": ").concat(request.uri), request.headers);
  return request;
};

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
/**
 *
 * @description This function sets the log level. Disabled in browsers.
 * @param {string} logLevel
 */


var setLogLevel = function setLogLevel(logLevel) {
  isBrowser() ? window.s2sJsMsSdk.MS_LOGLEVEL = "silent" : process.env.MS_LOGLEVEL = logLevel;
};
/**
 *
 * @description - This function retreives the currently configured log level. "silent" in browsers.
 * @returns {string} - log level.
 */


var getLogLevel = function getLogLevel() {
  if (isBrowser()) {
    //winston logger is not configured to run in browser
    return "silent";
  } else if (!process.env.hasOwnProperty("MS_LOGLEVEL")) {
    setLogLevel(config.logLevel);
  }

  return process.env.MS_LOGLEVEL;
};
/**
 *
 * @description This function sets the log level. Disabled in browsers.
 * @param {string} logLevel
 */


var setLogPretty = function setLogPretty(isPretty) {
  isBrowser() ? window.s2sJsMsSdk.MS_LOGPRETTY = isPretty : process.env.MS_LOGPRETY = isPretty;
};
/**
 *
 * @description - This function retreives the currently configured log level. "silent" in browsers.
 * @returns {string} - log level.
 */


var getLogPretty = function getLogPretty() {
  if (isBrowser()) {
    //winston logger is not configured to run in browser
    return false;
  } else if (!process.env.hasOwnProperty("MS_LOGPRETTY")) {
    setLogPretty(config.logPretty);
  }

  return !process.env.MS_LOGPRETTY || process.env.MS_LOGPRETTY === "false" ? false : true;
};
/**
 * @async
 * @description This function takes in a request and polls the microservice until it is ready
 * @param {function} verifyFunc - function that is used to confirm resource is ready.
 * @param {string} startingResourceStatus - argument to specify expected resolution or skip polling if ready
 * @returns {Promise} - Promise resolved when verify func is successful.
 */


var pendingResource =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(verifyFunc) {
    var startingResourceStatus,
        expires,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            startingResourceStatus = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "ready";
            _context3.prev = 1;
            expires = Date.now() + config.pollTimeout;

          case 3:
            if (!(Date.now() < expires)) {
              _context3.next = 22;
              break;
            }

            _context3.next = 6;
            return verifyFunc();

          case 6:
            response = _context3.sent;

            if (!response.hasOwnProperty("resource_status")) {
              _context3.next = 17;
              break;
            }

            _context3.t0 = response.resource_status;
            _context3.next = _context3.t0 === "new" ? 11 : _context3.t0 === "updating" ? 11 : _context3.t0 === "deleting" ? 11 : _context3.t0 === "ready" ? 12 : _context3.t0 === "not_updated" ? 13 : _context3.t0 === "not_deleted" ? 13 : 14;
            break;

          case 11:
            return _context3.abrupt("break", 15);

          case 12:
            return _context3.abrupt("return", response);

          case 13:
            throw Error("unable to complete request: ".concat(response.resource_status));

          case 14:
            throw Error("unrecognized resource_status property: ".concat(response.resource_status, " in response"));

          case 15:
            _context3.next = 18;
            break;

          case 17:
            throw Error("resource_status missing from response");

          case 18:
            _context3.next = 20;
            return new Promise(function (resolve) {
              return setTimeout(resolve, config.pollInterval);
            });

          case 20:
            _context3.next = 3;
            break;

          case 22:
            throw Error("request timeout");

          case 25:
            _context3.prev = 25;
            _context3.t1 = _context3["catch"](1);

            if (!(startingResourceStatus === "deleting" && _context3.t1.hasOwnProperty("statusCode") && _context3.t1.statusCode === 404)) {
              _context3.next = 30;
              break;
            }

            console.log("deleted........", _context3.t1.message);
            return _context3.abrupt("return", Promise.resolve({
              "status": "ok"
            }));

          case 30:
            return _context3.abrupt("return", Promise.reject({
              "statusCode": 500,
              "message": _context3.t1.hasOwnProperty("message") ? _context3.t1.message : _context3.t1
            }));

          case 31:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 25]]);
  }));

  return function pendingResource(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  getEndpoint: getEndpoint,
  getAuthHost: getAuthHost,
  getVersion: getVersion,
  config: config,
  replaceVariables: replaceVariables,
  createUUID: createUUID,
  aggregate: aggregate,
  //TODO Unit test 9/27/18 nh
  filterResponse: filterResponse,
  //TODO Unit test 9/27/18 nh
  paginate: paginate,
  //TODO Unit test 9/27/18 nh
  isBrowser: isBrowser,
  //TODO Unit test 10/05/18 nh
  addRequestTrace: addRequestTrace,
  //TODO Unit test 10/10/18 nh
  generateNewMetaData: generateNewMetaData,
  setLogLevel: setLogLevel,
  getLogLevel: getLogLevel,
  setLogPretty: setLogPretty,
  getLogPretty: getLogPretty,
  pendingResource: pendingResource
};