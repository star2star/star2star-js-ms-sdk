/* global require process module*/
"use strict";

const config = require("./config");
const merge = require("@star2star/merge-deep");
const compareVersions = require("compare-versions");
const crypto = require("crypto");
const { v4 } = require("uuid");
const Logger = require("./node-logger");
const zlib = require("node:zlib");

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
  const MS_VERSION = getGlobalThis().MS_VERSION
  return typeof MS_VERSION === "undefined" ? "v1" : MS_VERSION;
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

  // recursive function to search
  const doFilter = (obj, filter, filters, found) => {
    Object.keys(obj).forEach((prop) => {
      if (found) return;
      // property is array
      if (Array.isArray(obj[prop])) {
        // property is array
        return obj[prop].forEach((elem) => {
          found = checkProp(elem, prop, filter, filters, found);
        });
      } else {
        found = checkProp(obj[prop], prop, filter, filters, found);
      }
    });
    //console.log("FOUND", found);
    return found;
  };

  const checkProp = (obj, prop, filter, filters, found) => {
    if (
      typeof obj === "string" ||
      typeof obj === "number" ||
      typeof obj === "boolean"
    ) {
      return prop === filter && obj === filters[filter];
    } else if (typeof obj === "object" && obj !== null) {
      //console.log("************ Filter recursing **************",obj[prop]);
      return doFilter(obj, filter, filters, found);
    }
  };

  // filters are "AND", so return only matches when all filters are satisfied
  // do the things here
  Object.keys(filters).forEach((filter) => {
    const filteredResponse = response.items.filter((filterItem) => {
      let found = false;
      return doFilter(filterItem, filter, filters, found);
    });
    //console.log("FILTERED RESPONSE", filteredResponse);
    response.items = filteredResponse;
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
        throw formatError(error);
      }
    };
    const response = await makeRequest(request, requestOptions, trace);
    return response;
  } catch (error) {
    throw formatError(error);
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
  if (typeof requestOptions !== "object" || requestOptions === null) {
    requestOptions = {};
  }
  if (typeof requestOptions.headers === "undefined") {
    requestOptions.headers = {};
  }

  if (typeof trace !== "object" || trace === null) {
    trace = {};
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
  Logger.getInstance().debug(
    `Microservice Request ${requestOptions.method}: ${requestOptions.uri}`,
    requestOptions.headers
  );

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
 * @param {string} resourceLoc location of resource updates
 * @param {async function} request node fetch for request promise syntax
 * @param {object} requestOptions fetch request options from original request
 * @param {object} trace optional CPaaS lifecycle headers
 * @param {string} [startingResourceStatus="processing"] - argument to specify expected resolution or skip polling if ready
 * @returns {Promise} - Promise resolved when verify func is successful.
 * @returns
 */
const pendingResource = async (
  resourceLoc,
  request,
  requestOptions,
  trace,
  startingResourceStatus = "processing"
) => {
  try {
    // if the startingResourceStatus is complete, there is nothing to do since the resource is ready
    if (startingResourceStatus === "complete") {
      return { status: "ok" };
    }
    // update our requestOptions for the verification URL
    // at this point we may not need to pass in options to this function
    requestOptions.method = "HEAD";
    requestOptions.uri = resourceLoc;
    delete requestOptions.body;

    //add trace headers
    const nextTrace = generateNewMetaData(trace);
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
  // console.log('eeee', error)
  if (error?.constructor?.name === "StatusCodeError") {
    // just pass along what we got back from API
    if (typeof error?.response?.body !== "undefined") {
      // for external systems that don't follow our standards, try to return something ...
      if (typeof error.response.body === "string") {
        try {
          const parsedBody = JSON.parse(error.response.body);
          error.response.body = parsedBody;
        } catch (e) {
          const body = merge({}, error.response.body);
          error.response.body = {
            message: body,
          };
        }
      }

      // console.log(error, error.StatusCode, typeof error.statusCode, error.statusCode.toString().length  )
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
        const newBody = merge({}, error.response.body);
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
    } else if (error.hasOwnProperty("statusCode")) {
      retObj.code = error.statusCode;
    } else {
      retObj.code = 500;
    }

    // message
    retObj.message =
      typeof error?.message === "string" && error.message.length > 0
        ? error.message
        : error?.response?.body && typeof error?.response?.body === "string"
        ? error?.response?.body
        : "unspecified error";

    // trace
    retObj.trace_id =
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
 * @param {string} salt - optional but recommended salt value
 * @param {string} algorithm - optional encryption algorithm
 * @returns {string} - encrypted string
 */
const encrypt = (cryptoKey, text, salt = "salt", algorithm = "aes-192-cbc") => {
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(cryptoKey, salt, 24);
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
 * @param {string} salt - optional but recommended salt value
 * @param {string} algorithm - optional encryption algorithm
 * @returns - decrypted string
 */
const decrypt = (cryptoKey, text, salt = "salt", algorithm = "aes-192-cbc") => {
  // Use the async `crypto.scrypt()` instead.
  const key = crypto.scryptSync(cryptoKey, salt, 24);
  // The IV is usually passed along with the ciphertext.
  const iv = Buffer.alloc(16, 0); // Initialization vector.

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};


/**
 * @description This function decrypts an encrypted string into an object
 * @param {string} key - key / password used to encrypt
 * @param {object} obj - object to be encrypted
 * @param {string} iv - optional initialization vector. string should be hex
 * @param {string} algorithm - optional encryption algorithm
 * @returns {object} object containing iv and encrypted strting
 */
const encryptObject = (key, obj, iv, algorithm = "aes-256-cbc") => {
  try {
    {
      let objAsString;
      try {
        if (typeof obj !== "object" || obj === null) {
          throw new Error("obj param not object or null");
        }
        // turn the object into a string to be encrypted or compressed further before encryption
        objAsString = zlib.gzipSync(JSON.stringify(obj)).toString("base64");
      } catch (e) {
        console.warn(e);
        throw new Error(
          "unable to process object for encryption. check that input is valid JSON"
        );
      }
      // create a random iv if we don't get one passed in.
      let initializationVector = crypto.randomBytes(16);
      if (typeof iv === "string") {
        // we received a iv, use it.
        initializationVector = Buffer.from(iv, "hex");
      }
      // convert the iv buffer to a strint to use as a salt in the key
      // the iv and salt can be public, but they greatly aid in the randomness.
      // only the key itself needs to be secret.
      const salt = initializationVector.toString("hex");
      const saltedKey = crypto.scryptSync(key, salt, 32);
      const cipher = crypto.createCipheriv(
        algorithm,
        saltedKey,
        initializationVector
      );
      let ciphertext = cipher.update(objAsString, "utf8", "hex");
      ciphertext += cipher.final("hex");
      // return an object with the iv so other objects can be bound with the same iv
      return {
        iv: salt,
        ciphertext: zlib
          .gzipSync(
            JSON.stringify({
              iv: salt, // the iv as a string which will be required to decrypt this data
              ciphertext: ciphertext, // compressed encrypted data as a string
            })
          )
          .toString("base64"),
      };
    }
  } catch (e){
    console.error(e);
    throw new Error("encrypt object failed: ", e.message ? e.message : "unspecified error");
  }
};

/**
 * @description This function decrypts an encrypted string into an object
 * @param {string} key - key / password used to encrypt
 * @param {string} ciphertext - string to be decrypted
 * @param {string} algorithm - optional encryption algorithm
 * @returns {object} - decrypted object
 */
const decryptObject = (key, ciphertext, algorithm = 'aes-256-cbc') => {
  try {
    const cipherObj = JSON.parse(zlib.gunzipSync(Buffer.from(ciphertext, "base64")));
    const initializationVector = Buffer.from(cipherObj.iv, 'hex');
    const saltedKey = crypto.scryptSync(key, cipherObj.iv, 32);
    const decipher = crypto.createDecipheriv(algorithm, saltedKey, initializationVector);
    let decrypted = decipher.update(cipherObj.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    decrypted = zlib.gunzipSync(Buffer.from(decrypted, "base64"));
    return JSON.parse(decrypted);
  } catch (e){
    console.error("error decrypting", e);
    throw new Error("decrypt object failed: ", e.message ? e.message : "unspecified error");
  }
}

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
    "_oauth2_app",
  ];
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((elem) => {
          if (typeof elem === "object" && elem !== null) {
            elem = sanitizeObject(elem);
          } else if (
            typeof obj[key] === "string" &&
            propsToClean.indexOf(key) !== -1
          ) {
            delete obj[key];
          }
        });
      } else {
        obj[key] = sanitizeObject(obj[key]);
      }
    } else if (
      typeof obj[key] === "string" &&
      propsToClean.indexOf(key) !== -1
    ) {
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

const getAccountUuidFromToken = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      .tid;
  } catch (error) {
    throw formatError(error);
  }
};

const arrayDiff = (oldArray = [], newArray = [], doDedupe = true) => {
  const retObj = {
    added: [],
    removed: [],
  };
  if (Array.isArray(oldArray) && Array.isArray(newArray)) {
    const dedupe = (arr, doDedupe = true) => {
      if (!doDedupe) {
        return arr;
      }
      // using separate primatives here to prevent casting
      const primatives = {
        boolean: [],
        number: [],
        string: [],
      };
      return arr.filter((elem) => {
        const type = typeof elem;
        let doInclude = false;
        if (typeof primatives?.[type] !== "undefined") {
          if (primatives[type].indexOf(elem) === -1) {
            primatives[type].push(elem);
            doInclude = true;
          }
        }
        return doInclude;
      });
    };
    retObj.added = dedupe(newArray, doDedupe).filter((elem) => {
      return oldArray.indexOf(elem) === -1;
    });
    retObj.removed = dedupe(oldArray, doDedupe).filter((elem) => {
      return newArray.indexOf(elem) === -1;
    });
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
  if (
    typeof target === "undefined" ||
    target === null ||
    typeof oldValue !== "string" ||
    typeof newValue !== "string"
  ) {
    return target;
  } else if (typeof target === "string") {
    const regexp = new RegExp(`\\b${oldValue}`, "g");
    const replacedString = target.replace(regexp, newValue);
    if (target !== replacedString) {
      return replacedString;
    }
    return target;
  } else if (Array.isArray(target)) {
    return target.map((elem) => {
      return findAndReplaceString(elem, oldValue, newValue);
    });
  } else if (typeof target === "object") {
    Object.keys(target).forEach((prop) => {
      target[prop] = findAndReplaceString(target[prop], oldValue, newValue);
    });
    return target;
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

/**
   *
   *
   * @param {*} baseUrl
   * @param {*} [queryParamsObj={}]
   * @param {*} [filterArray=[]]
   * @returns
   */
 const addUrlQueryParams = (baseUrl, queryParamsObj = {}, filterArray = []) => {
  const filteredParamsObj = extractProps(
    queryParamsObj,
    filterArray
  );
  const queryParamsString = Object.keys(filteredParamsObj).reduce(
    (acc, curr) => {
      // skip properties with empty values
      if (typeof filteredParamsObj[curr] === "undefined") {
        return acc;
      }
      const encodedValue = encodeURIComponent(filteredParamsObj[curr]);
      //first pass starts with a '?'
      if (acc === "") {
        if(baseUrl === ""){
          return `${curr}=${encodedValue}`;
        }
        return `?${curr}=${encodedValue}`;
      }
      // thereafter append with '&'
      return `${acc}&${curr}=${encodedValue}`;
    },
    "" // default to an empty string
  );
  return `${baseUrl}${queryParamsString}`;
};

/**
 *
 *
 * @param {*} sourceObj
 * @param {*} filterArray
 * @returns
 */
const extractProps = (sourceObj, filterArray) => {
  if (!Array.isArray(filterArray) || filterArray.length === 0) {
    return sourceObj;
  } else {
    // clone to ensure we don't affect any linking to source obj
    try {
      const clonedObj = JSON.parse(JSON.stringify(sourceObj));
      Object.keys(sourceObj).forEach((prop) => {
        if (filterArray.indexOf(prop) === -1) {
          delete clonedObj[prop];
        }
      });
      return clonedObj;
    } catch (error) {
      console.warn("unable to extract props", formatError(error));
      // fail safe
      return sourceObj;
    }
  }
};

module.exports = {
  addUrlQueryParams,
  extractProps,
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
  encryptObject,
  decrypt,
  decryptObject,
  setMsDebug,
  getMsDebug,
  sanitizeObject,
  getUserUuidFromToken,
  getAccountUuidFromToken,
  arrayDiff,
  findAndReplaceString,
  isValidVersionString,
  isVersionHigher,
};
