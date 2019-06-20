/* global require process module*/
"use strict";

const config = require("./config.json");
const uuidv4 = require("uuid/v4");
const request = require("request-promise");
const objectMerge = require("object-merge");
const Logger = require("./node-logger");
const logger = new Logger.default();
/**
 *
 * @description This function will determine microservice endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
const getEndpoint = (microservice = "NOTHING") => {
  const upperMS = microservice.toUpperCase();
  const env = isBrowser() ? window.s2sJsMsSdk : process.env;
  return config.microservices[upperMS]
    ? env.MS_HOST + config.microservices[upperMS]
    : undefined;
};

/**
 *
 * @description This function will determine microservice authentication endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
const getAuthHost = () => {
  return isBrowser() ? window.s2sJsMsSdk.AUTH_HOST : process.env.AUTH_HOST;
};

/**
 *
 * @description This function will determine microservice version.
 * @returns {string} - the configured string value or undefined
 */
const getVersion = () => {
  const env = isBrowser() ? window.s2sJsMsSdk : process.env;
  return env.MS_VERSION ? env.MS_VERSION : config.ms_version;
};

/**
 *
 * @description This function will lookup static items to be replaced.
 * @param {string} matchString - the string that we are matching on.
 * @returns {string} - the string value or undefined
 */
const replaceStaticValues = matchString => {
  const TDATE = new Date();
  const MONTH = "" + (TDATE.getMonth() + 1);
  const MYDAY = "" + TDATE.getDate();
  const aValues = {
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
    arrayOfMatches.forEach(theMatch => {
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
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
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
const paginate = (response, offset = 0, limit = 10) => {
  const total = response.items.length;
  const paginatedResponse = {
    items: response.items.slice(offset, offset + limit)
  };
  const count = paginatedResponse.items.length;
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
const filterResponse = (response, filters) => {
  //console.log("*****FILTERS*****", filters);
  Object.keys(filters).forEach(filter => {
    const filteredResponse = response.items.filter(filterItem => {
      let found = false;
      const doFilter = (obj, filter) => {
        Object.keys(obj).forEach(prop => {
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
              found = (prop === filter) && obj[prop] === filters[filter];
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
  let total,
    offset = 0;

  const makeRequest = async (request, requestOptions, trace = {}) => {
    const nextTrace = generateNewMetaData(trace);
    addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    total = response.metadata.total;
    offset = response.metadata.offset + response.metadata.count;
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
  };

  return await makeRequest(request, requestOptions, trace);
};

/**
 * @description Returns true is window is found and sets sdk namespace if needed.
 *
 * @returns
 */
const isBrowser = () => {
  if (typeof window === "undefined") {
    return false;
  } else {
    if (!window.hasOwnProperty("s2sJsMsSdk")) {
      window.s2sJsMsSdk = {};
    }
    return true;
  }
};

const addRequestTrace = (request, trace = {}) => {
  const headerKeys = ["id", "trace", "parent"];

  headerKeys.forEach(keyName => {
    if (typeof trace === "object" && trace.hasOwnProperty(keyName)) {
      request.headers[keyName] = trace[keyName];
      //logger.debug(`Found Trace ${keyName}: ${request.headers[keyName]}`);
    } else {
      request.headers[keyName] = uuidv4();
      //logger.debug(`Assigning Trace ${keyName}: ${request.headers[keyName]}`);
    }
  });
  if (typeof trace === "object" && trace.hasOwnProperty("debug")) {
    request.headers["debug"] = trace["debug"];
  } else if (config.msDebug) {
    request.headers["debug"] = true;
  } else {
    request.headers["debug"] = false;
  }
  logger.debug(`Microservice Request ${request.method}: ${request.uri}`, request.headers);

  return request;
};

const generateNewMetaData = (oldMetaData = {}) => {
  let rObject = {};
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
 * @async
 * @description This function takes in a request and polls the microservice until it is ready
 * @param {function} verifyFunc - function that is used to confirm resource is ready.
 * @param {string} startingResourceStatus - argument to specify expected resolution or skip polling if ready
 * @returns {Promise} - Promise resolved when verify func is successful.
 */
const pendingResource = async (resourceLoc, requestOptions, trace, startingResourceStatus = "complete") => {
  logger.debug("Pending Resource Location", resourceLoc, requestOptions);
  try {
    // if the startingResourceStatus is complete, there is nothing to do since the resource is ready
    if (startingResourceStatus === "complete") {
      return Promise.resolve({"status":"ok"});
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
      logger.debug("Pending Resource verification HEAD response", response.headers);
      if(response.headers.hasOwnProperty("x-resource-status")){
        switch(response.headers["x-resource-status"]) {
        case "processing":
          break;
        case "complete":
          return Promise.resolve({"status":"ok"});
        case "failure":
          throw Error(`failure: ${JSON.stringify(response)}`);
        default:
          throw Error(`unrecognized resource_status: ${JSON.stringify(response)}`);
        }
      } else {
        throw Error(`resource_status missing from response: ${JSON.stringify(response)}`);
      }
      await new Promise(resolve => setTimeout(resolve, config.pollInterval));
    }
    throw Error("request timeout");
    
  } catch (error) {
    // a fetch on an item we are deleting should return a 404 when complete.
    if(
      startingResourceStatus === "deleting" &&
      error.hasOwnProperty("statusCode") &&
      error.statusCode === 404
    ){
      logger.debug("Pending Resource Deleted", error.message);
      return Promise.resolve({"status":"ok"});
    }
    return Promise.reject(
      {
        "statusCode": 500,
        "message": error.hasOwnProperty("message") ? error.message : error 
      }
    );
  }
};

module.exports = {
  getEndpoint,
  getAuthHost,
  getVersion,
  config,
  replaceVariables,
  createUUID,
  aggregate, //TODO Unit test 9/27/18 nh
  filterResponse, //TODO Unit test 9/27/18 nh
  paginate, //TODO Unit test 9/27/18 nh
  isBrowser, //TODO Unit test 10/05/18 nh
  addRequestTrace, //TODO Unit test 10/10/18 nh
  generateNewMetaData,
  pendingResource
};
