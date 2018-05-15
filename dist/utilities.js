/* global require process module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var config = require('./config.json');

/**
 * This function will determine microservice endpoint URI
 *
 * @param matchString - the string that we are matching on
 * @return String or undefined - will return you the string value or undefined
 */
var getEndpoint = function getEndpoint() {
  var microservice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "NOTHING";

  var upperMS = microservice.toUpperCase();

  return config.microservices[upperMS] ? process.env.MS_HOST + config.microservices[upperMS] : undefined;
};
/**
 * This function will determine microservice version
 *
 * @return String or undefined - will return you the string value or undefined
 */
var getVersion = function getVersion() {

  return process.env.MS_VERSION ? process.env.MS_VERSION : config.ms_version;
};

/**
 * This function will lookup static items to be replaced
 *
 * @param matchString - the string that we are matching on
 * @return value or undefined - will return you the string value or undefined
 */
var replaceStaticValues = function replaceStaticValues(matchString) {
  var TDATE = new Date();
  var MONTH = "" + (TDATE.getMonth() + 1);
  var MYDAY = "" + TDATE.getDate();
  var aValues = {
    'datetime': TDATE,
    'YYYY': TDATE.getFullYear(),
    'MM': ("0" + MONTH).substring(MONTH.length + 1 - 2),
    'DD': ("0" + MYDAY).substring(MYDAY.length + 1 - 2)
  };
  //console.log('matchstring:',("0"+DAY).substring((DAY.length+1 - 2)), matchString, DAY, aValues)
  return aValues[matchString];
};

/**
 * This function will get the value from the object tree; recursive
 * @param matchString - the string that we are matching on
 * @param objectTree - the json object to search
 * @return value or undefined - will return you the string value or undefined
 */
var getValueFromObjectTree = function getValueFromObjectTree() {
  var matchString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var objectTree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var mString = matchString.replace(/%/g, '');
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

    xReturn = Object.keys(objectTree).reduce(function (p, c, i, a) {
      if (p === undefined) {
        //console.log(p)
        if (_typeof(objectTree[c]) === 'object') {
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
 * This function will take in an inputValue String and replace variables from objectTree
 *
 * @param inputValue - what to look for
 * @param objectTree - json Object to search
 * @returns String - replaced inputValue
 **/
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
 * This function will take a new UUID
 *
 * @returns String - in the UUID format
 **/
var createUUID = function createUUID() {
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
};

module.exports = {
  getEndpoint: getEndpoint,
  getVersion: getVersion,
  config: config,
  replaceVariables: replaceVariables,
  createUUID: createUUID
};