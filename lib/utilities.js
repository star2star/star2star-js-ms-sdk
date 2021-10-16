/* global require process module*/
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var config = require("./config.json");

var v4 = require("uuid");

var request = require("request-promise");

var objectMerge = require("object-merge");

var Logger = require("./node-logger");

var logger = new Logger.default();

var crypto = require("crypto");
/**
 *
 * @description Returns a platform specitic reference to global runtime
 * @returns {object} process.env in node, and window.s2sJsMsSdk in browser
 */


var getThis = function getThis() {
  // initialize config if in broswer.
  if (window === "object" && window !== null) {
    if (_typeof(window.s2sJsMsSdk) !== "object" || window.s2sJsMsSdk === null) {
      window.s2sJsMsSdk = {};
    }

    return window.s2sJsMsSdk;
  } else {
    return process.env;
  }
};
/**
 *
 * @description This function will determine microservice endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */


var getEndpoint = function getEndpoint() {
  var microservice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "NOTHING";
  var upperMS = microservice.toUpperCase();
  return config.microservices[upperMS] ? getThis().MS_HOST + config.microservices[upperMS] : undefined;
};
/**
 *
 * @description This function will determine microservice authentication endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */


var getAuthHost = function getAuthHost() {
  return getThis().AUTH_HOST;
};
/**
 *
 * @description This function will determine microservice version.
 * @returns {string} - the configured string value or undefined
 */


var getVersion = function getVersion() {
  return getThis().MS_VERSION;
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
  return v4();
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


var aggregate = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, requestOptions) {
    var trace,
        total,
        offset,
        makeRequest,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 1;
            offset = 0;

            makeRequest = /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, requestOptions) {
                var trace,
                    nextTrace,
                    _response,
                    nextResponse,
                    items,
                    _args = arguments;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                        _context.prev = 1;
                        nextTrace = generateNewMetaData(trace);
                        addRequestTrace(requestOptions, nextTrace);
                        _context.next = 6;
                        return request(requestOptions);

                      case 6:
                        _response = _context.sent;
                        total = _response.metadata.total;
                        offset = (_response.metadata.hasOwnProperty("offset") ? _response.metadata.offset : 0) + _response.metadata.count;

                        if (!(total > offset)) {
                          _context.next = 23;
                          break;
                        }

                        requestOptions.qs.offset = offset;
                        _context.next = 13;
                        return makeRequest(request, requestOptions);

                      case 13:
                        nextResponse = _context.sent;
                        items = _response.items.concat(nextResponse.items);
                        _response.items = items;
                        _response.metadata.offset = 0;
                        _response.metadata.count = total;
                        _response.metadata.limit = total;
                        delete _response.links; //the links are invalid now

                        return _context.abrupt("return", _response);

                      case 23:
                        return _context.abrupt("return", _response);

                      case 24:
                        _context.next = 29;
                        break;

                      case 26:
                        _context.prev = 26;
                        _context.t0 = _context["catch"](1);
                        return _context.abrupt("return", Promise.reject(formatError(_context.t0)));

                      case 29:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[1, 26]]);
              }));

              return function makeRequest(_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }();

            _context2.next = 6;
            return makeRequest(request, requestOptions, trace);

          case 6:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", Promise.reject(formatError(_context2.t0)));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 10]]);
  }));

  return function aggregate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var addRequestTrace = function addRequestTrace(request) {
  var trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var headerKeys = ["id", "trace", "parent"];
  headerKeys.forEach(function (keyName) {
    if (_typeof(trace) === "object" && trace.hasOwnProperty(keyName)) {
      request.headers[keyName] = trace[keyName]; //logger.debug(`Found Trace ${keyName}: ${request.headers[keyName]}`);
    } else {
      request.headers[keyName] = v4(); //logger.debug(`Assigning Trace ${keyName}: ${request.headers[keyName]}`);
    }
  });

  if (_typeof(trace) === "object" && trace.hasOwnProperty("debug")) {
    request.headers["debug"] = trace["debug"];
  } else if (config.msDebug) {
    request.headers["debug"] = true;
  } else {
    request.headers["debug"] = false;
  }

  logger.debug("Microservice Request ".concat(request.method, ": ").concat(request.uri), request.headers);
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
    rObject.trace = v4();
  }

  if (config.msDebug) {
    rObject.debug = true;
  } else if (oldMetaData.hasOwnProperty("debug")) {
    rObject.debug = oldMetaData.debug;
  } else {
    rObject.debug = false;
  }

  rObject.id = v4();
  return rObject;
};
/**
 * @async
 * @description This function takes in a request and polls the microservice until it is ready
 * @param {function} verifyFunc - function that is used to confirm resource is ready.
 * @param {string} startingResourceStatus - argument to specify expected resolution or skip polling if ready
 * @returns {Promise} - Promise resolved when verify func is successful.
 */


var pendingResource = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resourceLoc, requestOptions, trace) {
    var startingResourceStatus,
        nextTrace,
        expires,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            startingResourceStatus = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : "processing";
            logger.debug("Pending Resource Location", resourceLoc);
            _context3.prev = 2;

            if (!(startingResourceStatus === "complete")) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", {
              status: "ok"
            });

          case 5:
            //update our requestOptions for the verification URL
            requestOptions.method = "HEAD";
            requestOptions.uri = resourceLoc;
            delete requestOptions.body; //add trace headers

            nextTrace = objectMerge({}, generateNewMetaData(trace));
            addRequestTrace(requestOptions, nextTrace); // starting resource is not complete, poll the verify endpoint

            expires = Date.now() + config.pollTimeout;

          case 11:
            if (!(Date.now() < expires)) {
              _context3.next = 31;
              break;
            }

            _context3.next = 14;
            return request(requestOptions);

          case 14:
            response = _context3.sent;
            logger.debug("Pending Resource verification HEAD response", response.headers, response.statusCode);

            if (!response.headers.hasOwnProperty("x-status")) {
              _context3.next = 26;
              break;
            }

            _context3.t0 = response.headers["x-status"];
            _context3.next = _context3.t0 === "processing" ? 20 : _context3.t0 === "complete" ? 21 : _context3.t0 === "failure" ? 22 : 23;
            break;

          case 20:
            return _context3.abrupt("break", 24);

          case 21:
            return _context3.abrupt("return", {
              status: "ok"
            });

          case 22:
            throw response;

          case 23:
            throw response;

          case 24:
            _context3.next = 27;
            break;

          case 26:
            throw "x-status missing from response: ".concat(JSON.stringify(response));

          case 27:
            _context3.next = 29;
            return new Promise(function (resolve) {
              return setTimeout(resolve, config.pollInterval);
            });

          case 29:
            _context3.next = 11;
            break;

          case 31:
            throw {
              code: 408,
              message: "request timeout",
              details: [{
                requestOptions: requestOptions
              }]
            };

          case 34:
            _context3.prev = 34;
            _context3.t1 = _context3["catch"](2);

            if (!(startingResourceStatus === "deleting" && _context3.t1.hasOwnProperty("statusCode") && _context3.t1.statusCode === 404)) {
              _context3.next = 39;
              break;
            }

            logger.debug("Pending Resource Deleted", _context3.t1.message);
            return _context3.abrupt("return", {
              status: "ok"
            });

          case 39:
            throw formatError(_context3.t1);

          case 40:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 34]]);
  }));

  return function pendingResource(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @description This function standardizes error responses to objects containing "code", "message", "trace_id", and "details properties"
 * @param {object} error - standard javascript error object, or request-promise error object
 * @returns {Object} - error object formatted to standard
 */


var formatError = function formatError(error) {
  //console.log("formatError() THE ERROR!!!!", error);
  // defaults ensure we always get a compatbile format back
  var returnedObject = {
    code: undefined,
    message: "unspecified error",
    trace_id: v4(),
    details: []
  };

  try {
    if (error) {
      //const retObj = {};
      // request-promise errors, non 2xx or 3xx response
      if (error.hasOwnProperty("name") && error.name === "StatusCodeError") {
        // just pass along what we got back from API
        if (error.hasOwnProperty("response") && error.response.hasOwnProperty("body")) {
          // for external systems that don't follow our standards, try to return something ...
          if (typeof error.response.body === "string") {
            try {
              var parsedBody = JSON.parse(error.response.body);
              error.response.body = parsedBody;
            } catch (e) {
              var body = error.response.body;
              error.response.body = {
                message: body
              };
            }
          }

          returnedObject.code = error.response.body.hasOwnProperty("code") && error.response.body.code && error.response.body.code.toString().length === 3 ? error.response.body.code : returnedObject.code;
          returnedObject.message = error.response.body.hasOwnProperty("message") && error.response.body.message && error.response.body.message.length > 0 ? error.response.body.message : returnedObject.message;
          returnedObject.trace_id = error.response.body.hasOwnProperty("trace_id") && error.response.body.trace_id && error.response.body.trace_id.length > 0 ? error.response.body.trace_id : returnedObject.trace_id; // if we have no message add the body to details since this is a non-standard error message

          if (returnedObject.message === "unspecified error") {
            returnedObject.details.push(error.response.body);
          } //make sure details is an array of objects or strings


          if (error.response.body.hasOwnProperty("details") && Array.isArray(error.response.body.details)) {
            var filteredDetails = returnedObject.details.concat(error.response.body.details).filter(function (detail) {
              return _typeof(detail) === "object" && detail !== null || typeof detail === "string";
            }).map(function (detail) {
              if (_typeof(detail) === "object") {
                try {
                  return JSON.stringify(detail);
                } catch (e) {
                  logger.debug("formatError unable to parse error detail", formatError(e));
                }
              }

              return detail;
            });
            returnedObject.details = filteredDetails;
          }
        } // in case we didn't get a body, or the body was missing the code, try to get code from the http response code


        if (error.hasOwnProperty("statusCode") && error.statusCode.toString().length === 3) {
          // we did not get a code out of the response body
          if (!returnedObject.code) {
            returnedObject.code = error.statusCode;
          } else if (returnedObject.code.toString() !== error.statusCode.toString()) {
            // record a mismatch between the http response code and the "code" property returned in the respose body
            // this seems strage but CPaaS will sometimes bubble back nested responses that are different than the http response code
            returnedObject.message = "".concat(returnedObject.code, " - ").concat(returnedObject.message); // make the code property match the actual http response code

            returnedObject.code = error.statusCode;
          }
        } // in case we didn't get a trace_id in the body, it should match the one we sent so use that instead


        if (error.hasOwnProperty("options") && error.options.hasOwnProperty("headers") && error.options.headers.hasOwnProperty("trace") && error.options.headers.trace.toString().length > 0) {
          returnedObject.trace_id = error.options.headers.trace;
        } // some problem making request, general JS errors, or already formatted from nested call

      } else {
        returnedObject.code = error.hasOwnProperty("code") && error.code && error.code.toString().length === 3 ? error.code : returnedObject.code;
        returnedObject.message = error.hasOwnProperty("message") && error.message && error.message.toString().length > 0 ? error.message : returnedObject.message;
        returnedObject.trace_id = error.hasOwnProperty("trace_id") && error.trace_id && error.trace_id.toString().length > 0 ? error.trace_id : returnedObject.trace_id; //make sure details is an array of objects

        if (error.hasOwnProperty("details") && Array.isArray(error.details)) {
          var _filteredDetails = error.details.filter(function (detail) {
            return _typeof(detail) === "object" && detail !== null || typeof detail === "string";
          }).map(function (detail) {
            if (_typeof(detail) === "object") {
              return JSON.stringify(detail);
            }

            return detail;
          });

          returnedObject.details = _filteredDetails;
        }
      } //if error is just a string, set it as the message


      if (typeof error === "string" && error.length > 0) {
        returnedObject.message = error;
      }
    } // we did not get a code anywhere to use a default internal server error


    if (!returnedObject.code) {
      returnedObject.code = 500;
    }

    logger.debug("formatted error: ", returnedObject);
    return returnedObject;
  } catch (error) {
    // something blew up formatting or parsing somewhere. try to handle it....
    logger.error("Error Format Failed", error);
    returnedObject.code = 500;
    returnedObject.message = error.hasOwnProperty("message") ? error.message : "error format failed";
    returnedObject.details = [{
      location: "formatError() utilities.js star2star-js-ms-sdk"
    }];
    return returnedObject;
  }
};
/**
 * @description This function encrypts a string with a key
 * @param {string} cryptoKey - key used to encrypt
 * @param {string} text - text to be encrypted
 * @returns {string} - encrypted string
 */


var encrypt = function encrypt(cryptoKey, text) {
  var algorithm = "aes-192-cbc"; // Use the async `crypto.scrypt()` instead.

  var key = crypto.scryptSync(cryptoKey, "salt", 24); // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.

  var iv = Buffer.alloc(16, 0); // Initialization vector.

  var cipher = crypto.createCipheriv(algorithm, key, iv);
  var encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
/**
 * @description This function decrypts a string with a key
 * @param {string} cryptoKey - key used to encrypt
 * @param {string} text - text to be encrypted
 * @returns - decrypted string
 */


var decrypt = function decrypt(cryptoKey, text) {
  var algorithm = "aes-192-cbc"; // Use the async `crypto.scrypt()` instead.

  var key = crypto.scryptSync(cryptoKey, "salt", 24); // The IV is usually passed along with the ciphertext.

  var iv = Buffer.alloc(16, 0); // Initialization vector.

  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = {
  getEndpoint: getEndpoint,
  getAuthHost: getAuthHost,
  getVersion: getVersion,
  config: config,
  replaceVariables: replaceVariables,
  createUUID: createUUID,
  aggregate: aggregate,
  filterResponse: filterResponse,
  paginate: paginate,
  addRequestTrace: addRequestTrace,
  generateNewMetaData: generateNewMetaData,
  pendingResource: pendingResource,
  formatError: formatError,
  encrypt: encrypt,
  decrypt: decrypt
};