/* global require process module*/
"use strict";
const config = require('./config.json');

/**
 *
 * @description This function will determine microservice endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
const getEndpoint = (microservice = "NOTHING") => {
  const upperMS = microservice.toUpperCase();

  return config.microservices[upperMS] ? process.env.MS_HOST + config.microservices[upperMS] : undefined;
};

/**
 *
 * @description This function will determine microservice authentication endpoint URI.
 * @param {string} [microservice="NOTHING"] - the string that we are matching on
 * @returns {string} - the configured value or undefined
 */
const getAuthHost = () => {
  return process.env.AUTH_HOST;
};

/**
 *
 * @description This function will determine microservice version.
 * @returns {string} - the configured string value or undefined
 */
const getVersion = () => {

  return process.env.MS_VERSION ? process.env.MS_VERSION  : config.ms_version;
};

/**
 *
 * @description This function will lookup static items to be replaced.
 * @param {string} matchString - the string that we are matching on.
 * @returns {string} - the string value or undefined
 */
const replaceStaticValues = (matchString) => {
  const TDATE = new Date();
  const MONTH = "" + ((TDATE).getMonth() + 1);
  const MYDAY = "" + ((TDATE).getDate());
  const aValues = {
    'datetime': TDATE,
    'YYYY': (TDATE).getFullYear(),
    'MM': ("0" + MONTH).substring((MONTH.length + 1 - 2)),
    'DD': ("0" + MYDAY).substring((MYDAY.length + 1 - 2))
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

  const mString = matchString.replace(/%/g, '');
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

    xReturn = Object.keys(objectTree).reduce((p, c, i, a) => {
      if (p === undefined) {
        //console.log(p)
        if (typeof (objectTree[c]) === 'object') {
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
  const myRegex = /(\%[\w|\d|\.\-\*\/]+\%)/g;
  let returnString = inputValue;

  const arrayOfMatches = inputValue.match(myRegex);

  arrayOfMatches !== null && arrayOfMatches.forEach((theMatch) => {
    const retrievedValue = getValueFromObjectTree(theMatch, objectTree);
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
const createUUID = () => {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
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
  const paginatedResponse = {"items":response.items.slice(offset, (offset + limit))};
  const count = paginatedResponse.items.length;
  paginatedResponse.metadata = {
    "total": total,
    "offset": offset,
    "count": count,
    "limit": limit
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

  Object.keys(filters).forEach(filter => {
    const filteredResponse = response.items.filter(filterItem => {
      let found=false;
      const doFilter = (obj, filter) => {
        Object.keys(obj).forEach(prop =>{
          if(found) return;
          //not seaching through arrays
          if (!Array.isArray(obj[prop])) {
            if ((typeof obj[prop] === "string") || (typeof obj[prop] === "number") || (typeof obj[prop] === "boolean")){
              // console.log("PROP", prop);
              // console.log("OBJ[PROP]", obj[prop]);
              // console.log("FILTER", filter);
              // console.log("FILTERS[FILTER}",filters[filter]);
              found = (prop === filter) && obj[prop].toLowerCase().includes(filters[filter].toLowerCase());
              return;
            } else if (typeof obj[prop] === "object") {
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

module.exports = {
  getEndpoint,
  getAuthHost,
  getVersion, 
  config,
  replaceVariables,
  createUUID,
  paginate,
  filterResponse
};