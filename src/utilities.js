/* global require process module*/
"use strict";

const config = require("./config");
const request = require("request-promise");
const objectMerge = require("object-merge");
const compareVersions = require("compare-versions");
const crypto = require("crypto");
const { v4 } = require("uuid");
const Logger = require("./node-logger");

/**
 *
 * @description Returns a platform specitic reference to global runtime
 * @returns {object} process.env in node, and window.s2sJsMsSdk in browser
 */
const getGlobalThis = () => {
  // initialize config if in broswer.
  if (typeof window === "object" && window !== null) {
    if (typeof window.s2sJsMsSdk !== "object" || window.s2sJsMsSdk === null) {
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
const getEndpoint = (microservice = "NOTHING") => {
  const upperMS = microservice.toUpperCase();
  return config.microservices[upperMS]
    ? getGlobalThis().MS_HOST + config.microservices[upperMS]
    : undefined;
};

/**
 *
 * @description This function will determine microservice authentication endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
const getAuthHost = () => {
  return getGlobalThis().AUTH_HOST;
};

/**
 *
 * @description This function will determine microservice version.
 * @returns {string} - the configured string value or undefined
 */
const getVersion = () => {
  return getGlobalThis().MS_VERSION;
};

/**
 *
 * @description This function will lookup static items to be replaced.
 * @param {string} matchString - the string that we are matching on.
 * @returns {string} - the string value or undefined
 */
const replaceStaticValues = (matchString) => {
  const TDATE = new Date();
  const MONTH = "" + (TDATE.getMonth() + 1);
  const MYDAY = "" + TDATE.getDate();
  const aValues = {
    datetime: TDATE,
    YYYY: TDATE.getFullYear(),
    MM: ("0" + MONTH).substring(MONTH.length + 1 - 2),
    DD: ("0" + MYDAY).substring(MYDAY.length + 1 - 2),
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
const getValueFromObjectTree = (matchString = "", objectTree = {}) => {
  const mString = matchString.replace(/%/g, "");
  const sValue = replaceStaticValues(mString);
  if (sValue) {
    return sValue;
  }
  let xReturn;
  //console.log('---', mString, matchString, objectTree)
  if (Object.keys(objectTree).indexOf(mString) > -1) {
    //console.log('rrrr', matchString, objectTree[mString])
    xReturn = objectTree[mString];
  } else {
    xReturn = Object.keys(objectTree).reduce((p, c) => {
      if (p === undefined) {
        //console.log(p)
        if (typeof objectTree[c] === "object") {
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
const replaceVariables = (inputValue = "", objectTree = {}) => {
  // will search for %xxxxx%
  const myRegex = /(%[\w|\d|.\-*/]+%)/g;
  let returnString = inputValue;

  const arrayOfMatches = inputValue.match(myRegex);

  arrayOfMatches !== null &&
    arrayOfMatches.forEach((theMatch) => {
      const retrievedValue = getValueFromObjectTree(theMatch, objectTree);
      //console.log('^^^^^^^^', theMatch, retrievedValue)
      returnString = returnString.replace(
        theMatch,
        retrievedValue ? retrievedValue : theMatch
      );
    });

  return returnString;
};

/**
 *
 * @description This function will create a new UUID
 * @returns {string} - new UUID
 */
const createUUID = () => {
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
const paginate = (response, offset = 0, limit = 10) => {
  const total = response.items.length;
  const paginatedResponse = {
    items: response.items.slice(offset, offset + limit),
  };
  const count = paginatedResponse.items.length;
  paginatedResponse.metadata = {
    total: total,
    offset: offset,
    count: count,
    limit: limit,
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
const filterResponse = (response, filters) => {
  //console.log("*****FILTERS*****", filters);
  Object.keys(filters).forEach((filter) => {
    const filteredResponse = response.items.filter((filterItem) => {
      let found = false;
      const doFilter = (obj, filter) => {
        Object.keys(obj).forEach((prop) => {
          if (found) return;
          //not seaching through arrays
          if (!Array.isArray(obj[prop])) {
            if (
              typeof obj[prop] === "string" ||
              typeof obj[prop] === "number" ||
              typeof obj[prop] === "boolean"
            ) {
              // console.log("PROP", prop);
              // console.log("OBJ[PROP]", obj[prop]);
              // console.log("FILTER", filter);
              // console.log("FILTERS[FILTER}",filters[filter]);
              found = prop === filter && obj[prop] === filters[filter];
              return;
            } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
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
const aggregate = async (request, requestOptions, trace = {}) => {
  //uncomment and set to less than total expected resources to force aggregation for testing.
  //requestOptions.qs.limit = 1;
  try {
    let total,
      offset = 0;

    const makeRequest = async (request, requestOptions, trace = {}) => {
      try {
        const nextTrace = generateNewMetaData(trace);
        addRequestTrace(requestOptions, nextTrace);
        const response = await request(requestOptions);
        total = response.metadata.total;
        offset =
          (response.metadata.hasOwnProperty("offset")
            ? response.metadata.offset
            : 0) + response.metadata.count;
        if (total > offset) {
          requestOptions.qs.offset = offset;
          const nextResponse = await makeRequest(request, requestOptions);
          const items = response.items.concat(nextResponse.items);
          response.items = items;
          response.metadata.offset = 0;
          response.metadata.count = total;
          response.metadata.limit = total;
          delete response.links; //the links are invalid now
          return response;
        } else {
          return response;
        }
      } catch (error) {
        return Promise.reject(formatError(error));
      }
    };
    const response = await makeRequest(request, requestOptions, trace);
    return response;
  } catch (error) {
    return Promise.reject(formatError(error));
  }
};

/**
 *
 *
 * @param {*} requestOptions
 * @param {*} [trace={}]
 * @returns
 */
const addRequestTrace = (requestOptions, trace = {}) => {
  if (typeof requestOptions !== "object" || requestOptions === null){
    requestOptions = {}
  }
  if(typeof requestOptions.headers === "undefined"){
    requestOptions.headers = {};
  }

  if (typeof trace !== "object" || trace === null){
    trace = {}
  }

  const headerKeys = ["id", "trace", "parent"];

  headerKeys.forEach((keyName) => {
    if (typeof trace?.[keyName] === "string") {
      requestOptions.headers[keyName] = trace[keyName];
    } else {
      requestOptions.headers[keyName] = v4();
    }
  });
  if (trace.debug === true) {
    requestOptions.headers.debug = true;
  } else if (
    typeof getGlobalThis().DEBUG !== "undefined" &&
    getGlobalThis().DEBUG.toString().toLowerCase() === "true"
  ) {
    requestOptions.headers.debug = true;
  } else {
    requestOptions.headers.debug = false;
  }
  Logger.getInstance().debug(`Microservice Request ${requestOptions.method}: ${requestOptions.uri}`, requestOptions.headers);

  return requestOptions;
};

const generateNewMetaData = (oldMetaData = {}) => {
  let rObject = {};

  if (typeof oldMetaData !== "object" || oldMetaData === null) {
    oldMetaData = {};
  }

  if (typeof oldMetaData.id === "string") {
    rObject.parent = oldMetaData.id;
  }

  if (typeof oldMetaData.trace === "string") {
    rObject.trace = oldMetaData.trace;
  } else {
    rObject["trace"] = v4();
  }

  if (typeof oldMetaData.trace !== "undefined") {
    rObject.debug = oldMetaData.debug;
  } else if (
    // env may be string "true" or boolean true
    typeof getGlobalThis().DEBUG !== "undefined" &&
    getGlobalThis().DEBUG.toString().toLowerCase() === "true"
  ) {
    rObject.debug = true;
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
const pendingResource = async (
  resourceLoc,
  requestOptions,
  trace,
  startingResourceStatus = "processing"
) => {
  try {
    // if the startingResourceStatus is complete, there is nothing to do since the resource is ready
    if (startingResourceStatus === "complete") {
      return { status: "ok" };
    }
    //update our requestOptions for the verification URL
    requestOptions.method = "HEAD";
    requestOptions.uri = resourceLoc;
    delete requestOptions.body;

    //add trace headers
    const nextTrace = objectMerge({}, generateNewMetaData(trace));
    addRequestTrace(requestOptions, nextTrace);
    // starting resource is not complete, poll the verify endpoint
    const expires = Date.now() + config.pollTimeout;
    while (Date.now() < expires) {
      let response = await request(requestOptions);

      if (response.headers.hasOwnProperty("x-status")) {
        switch (response.headers["x-status"]) {
          case "processing":
            break;
          case "complete":
            return { status: "ok" };
          case "failure":
            throw response;
          default:
            throw response;
        }
      } else {
        throw `x-status missing from response: ${JSON.stringify(response)}`;
      }
      await new Promise((resolve) => setTimeout(resolve, config.pollInterval));
    }
    throw {
      code: 408,
      message: "request timeout",
      details: [{ requestOptions: requestOptions }],
    };
  } catch (error) {
    // a fetch on an item we are deleting should return a 404 when complete.
    if (
      startingResourceStatus === "deleting" &&
      error.hasOwnProperty("statusCode") &&
      error.statusCode === 404
    ) {
      return { status: "ok" };
    }
    throw formatError(error);
  }
};

/**
 * @description This function standardizes error responses to objects containing "code", "message", "trace_id", and "details properties"
 * @param {object} error - standard javascript error object, or request-promise error object
 * @returns {Object} - error object formatted to standard
 */
const formatError = (error) => {
  const retObj = {};
  //begin request-promise error formatting
  if (error?.constructor?.name === "StatusCodeError") {
    // just pass along what we got back from API
    if (typeof error?.response?.body !== "undefined") {
      // for external systems that don't follow our standards, try to return something ...
      if (typeof error.response.body === "string") {
        try {
          const parsedBody = JSON.parse(error.response.body);
          error.response.body = parsedBody;
        } catch (e) {
          const body = objectMerge({}, error.response.body);
          error.response.body = {
            message: body,
          };
        }
      }

      // try to get the code from the response body, fall back to http response code
      retObj.code =
        typeof error?.response?.body?.code === "number" &&
        error.response.body.code.toString().length === 3
          ? error.response.body.code
          : typeof error?.statusCode === "number" &&
            error.statusCode.toString().length === 3
          ? error.statusCode
          : 500;

      retObj.message =
        typeof error?.response?.body?.message === "string" &&
        error.response.body.message.length > 0
          ? error.response.body.message
          : "unspecified error";

      retObj.trace_id =
        typeof error?.response?.body?.trace_id === "string" &&
        error.response.body.trace_id.length > 0
          ? error.response.body.trace_id
          : v4();

      // if we have no message add the body to details since this is a non-standard error message
      if (retObj.message === "unspecified error") {
        const newBody = objectMerge({}, error.response.body);
        error.response.body = {
          details: [newBody],
        };
      }
      //make sure details is an array of objects or strings
      if (Array.isArray(error?.response?.body?.details)) {
        retObj.details = error.response.body.details.reduce((acc, curr) => {
          if (typeof curr === "object" && curr !== null) {
            try {
              return acc.concat([JSON.stringify(curr)]);
            } catch (e) {
              Logger.getInstance().debug(
                "formatError unable to parse error detail",
                formatError(e)
              );
              return acc.concat(["unable to parse error detail"]);
            }
          } else if (typeof curr === "string" && curr.length > 0) {
            return acc.concat([curr]);
          } else {
            return acc;
          }
        }, []);
      }
    }

    // in case we didn't get a trace_id in the body, it should match the one we sent so use that instead
    if (
      typeof error?.options?.headers?.trace === "string" &&
      error.options.headers.trace.length > 0
    ) {
      retObj.trace_id = error.options.headers.trace;
    }
    // end request-promise error formatting
  } else {
    // begin generic error formatting

    // code
    if (typeof error?.code !== "undefined") {
      try {
        const code = parseInt(error.code);
        if (code.toString() !== "NaN" && code.toString().length === 3) {
          retObj.code = code;
        }
      } catch (e) {
        Logger.getInstance().debug(
          "formatError unable to parse error code",
          formatError(e)
        );
        retObj.code = 500;
      }
      // default
    } else {
      retObj.code = 500;
    }

    // message
    retObj.message =
      typeof error?.message === "string" && error.message.length > 0
        ? error.message
        : "unspecified error";

    // trace
    retObj.traceId =
      typeof error?.trace_id === "string" && error.trace_id.length > 0
        ? error.trace_id
        : v4();

    //make sure details is an array of strings
    retObj.details =
      error.hasOwnProperty("details") && Array.isArray(error.details)
        ? error.details.reduce((acc, curr) => {
            if (typeof curr === "object" && curr !== null) {
              try {
                return acc.concat(JSON.stringify(curr));
              } catch (e) {
                console.warn(
                  "fetch error formatter unable to parse detail",
                  formatError(e)
                );
              }
            } else if (typeof curr === "string" && curr.length > 0) {
              return acc.concat(curr);
            }
          }, [])
        : [];

    //if error is just a string, set it as the message
    if (typeof error === "string" && error.length > 0) {
      retObj.message = error;
    } else if (
      typeof error === "object" &&
      error !== null &&
      retObj.message === "unspecified error" &&
      retObj.details.length === 0
    ) {
      // error is an object, but does not follow CPaaS format standards
      // try to add it to the details array
      try {
        retObj.details = retObj.details.concat(JSON.stringify(error));
      } catch (e) {
        Logger.getInstance().debug(
          "formatError unable to parse error json",
          formatError(e)
        );
      }
    }
  }
  return retObj;
};

/**
 * @async
 * @description This function will format a fetch error response into a standard format
 * @param {*} fetchResponse
 * @returns {object}
 */
const formatFetchError = async (fetchResponse) => {
  try {
    const retObj = {
      code:
        typeof fetchResponse?.status === "number" ? fetchResponse.status : 500,
      message: "unspecified error",
      details: [],
      trace_id: v4(),
    };

    // set returned code for now. this may get overwritted if there are details in the body
    const parseType =
      fetchResponse?.headers?.get("Content-Type").split(";")[0] === "text/html"
        ? "text"
        : "json";
    const errorBody = await fetchResponse[parseType]();

    if (typeof errorBody === "string") {
      retObj.message = errorBody;
      return retObj;
    } else {
      if (typeof errorBody.code === "undefined") {
        errorBody.code = retObj.code;
      }
      return formatError(errorBody);
    }
  } catch (e) {
    // pass this up the call stack in standard format
    throw formatError(e);
  }
};

/**
 * @description This function encrypts a string with a key
 * @param {string} cryptoKey - key used to encrypt
 * @param {string} text - text to be encrypted
 * @returns {string} - encrypted string
 */
const encrypt = (cryptoKey, text) => {
  const algorithm = "aes-192-cbc";
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(cryptoKey, "salt", 24);
  // Use `crypto.randomBytes` to generate a random iv instead of the static iv
  // shown here.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

/**
 * @description This function decrypts a string with a key
 * @param {string} cryptoKey - key used to encrypt
 * @param {string} text - text to be encrypted
 * @returns - decrypted string
 */
const decrypt = (cryptoKey, text) => {
  const algorithm = "aes-192-cbc";
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(cryptoKey, "salt", 24);
  // The IV is usually passed along with the ciphertext.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// adds "debug" header to all requests if not included in trace
// does not override trace.debug set to "false" explicitly
const setMsDebug = (bool = false) => {
  if (typeof bool === "boolean") {
    getGlobalThis().DEBUG = bool;
  }
};

const getMsDebug = () => {
  if (typeof getGlobalThis().DEBUG === "boolean") {
    return getGlobalThis().DEBUG;
  }
  return false;
};

const sanitizeObject = (obj) => {
  const propsToClean = [
    "_token",
    "_basic_token",
    "_client_token", // legacy
    "_oauth2_app"
  ];
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === "object" && obj[key] !== null){
      if(Array.isArray(obj[key])){
        obj[key].forEach(elem => {
          if(typeof elem === "object" && elem !== null){
            elem = sanitizeObject(elem);
          } else if (typeof obj[key] === "string" && propsToClean.indexOf(key) !== -1){
            delete obj[key];
          }
        });
      } else {
        obj[key] = sanitizeObject(obj[key]);
      }
    } else if (typeof obj[key] === "string" && propsToClean.indexOf(key) !== -1){
      delete obj[key];
    }
  });
  return obj;
};

const getUserUuidFromToken = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      .sub;
  } catch (error) {
    throw formatError(error);
  }
};

const arrayDiff = (oldArray = [], newArray = [], doDedupe = true) => {
  const retObj = {
    "added": [],
    "removed": [] 
  };
  if(Array.isArray(oldArray) && Array.isArray(newArray)){
    const dedupe = (arr, doDedupe = true) => {
      if(!doDedupe){
        return arr;
      }
      // using separate primatives here to prevent casting
      const primatives = {
        "boolean": [],
        "number": [],
        "string": []
      }
      return arr.filter(elem => {
        const type = typeof elem;
        let doInclude = false;
        if(typeof primatives?.[type] !== "undefined"){
          if(primatives[type].indexOf(elem) === -1){
            primatives[type].push(elem);	
            doInclude = true;
          }
        }
        return doInclude;
      });
    }
    retObj.added = dedupe(newArray, doDedupe)
      .filter(elem => {return oldArray.indexOf(elem) === -1});
    retObj.removed = dedupe(oldArray, doDedupe)
      .filter(elem => {return newArray.indexOf(elem) === -1});
  }
  return retObj;
};

/**
	 *
	 * @desc Function recursively finds a target string and replaces it with a new value
	 * @param {object|array|string|number|boolean} target - any data type other than undefined or null
	 * @param {string} oldValue - the string to be replaced
	 * @param {string} newValue - the replacing string
	 * @returns
	 */
 
 const findAndReplaceString = (target, oldValue, newValue) => {
  // TODO should this be able to handle other types of primitive for oldValue an newValue?
  
  //fail safe. if params invalid, return original
  if (typeof target === "undefined" || target === null || typeof oldValue !== "string" || typeof newValue !== "string"){
    return target;
  } else if (typeof target === "string"){
    const regexp = new RegExp(`\\b${oldValue}\\b`, 'g');
     const replacedString = target.replace(regexp, newValue);
    if(target !== replacedString){
      return replacedString;
    }
    return target; 
  } else if (Array.isArray(target)){
    return target.map(elem => {
      return findAndReplaceString(elem, oldValue, newValue);
    }); 
  } else if (typeof target === "object"){
    Object.keys(target).forEach(prop => {
      target[prop] = findAndReplaceString(target[prop], oldValue, newValue);
    });
    return target
  } else {
    // no match return original target
    return target;
  }
};

const isValidVersionString = (version) => {
  return compareVersions.validate(version);
};

const isVersionHigher = (newVersion, oldVersion) => {
  return compareVersions.compare(newVersion, oldVersion, ">");
};

module.exports = {
  getGlobalThis,
  getEndpoint,
  getAuthHost,
  getVersion,
  config,
  replaceVariables,
  createUUID,
  aggregate,
  filterResponse,
  paginate,
  addRequestTrace,
  generateNewMetaData,
  pendingResource,
  formatError,
  formatFetchError,
  encrypt,
  decrypt,
  setMsDebug,
  getMsDebug,
  sanitizeObject,
  getUserUuidFromToken,
  arrayDiff,
  findAndReplaceString,
  isValidVersionString,
  isVersionHigher
};
