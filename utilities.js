"use strict";
const config = require('./config.json');

/**
 * This function will determine microservice endpoint URI
 *
 * @param matchString - the string that we are matching on
 * @return String or undefined - will return you the string value or undefined
 */
const getEndpoint = (microservice="NOTHING") =>{
  const upperMS = microservice.toUpperCase();

  return config[upperMS] ? process.baseUrl + config[upperMS] : undefined;
};

/**
 * This function will lookup static items to be replaced
 *
 * @param matchString - the string that we are matching on
 * @return value or undefined - will return you the string value or undefined
 */
const replaceStaticValues = (matchString) => {
  const TDATE = new Date();
  const MONTH = ""+((TDATE).getMonth()+1);
  const MYDAY = ""+((TDATE).getDate() );
  const aValues = {
    'datetime': TDATE,
    'YYYY': (TDATE).getFullYear(),
    'MM': ("0"+MONTH).substring((MONTH.length+1 - 2)),
    'DD': ("0"+MYDAY).substring((MYDAY.length+1 - 2))
  };
  //console.log('matchstring:',("0"+DAY).substring((DAY.length+1 - 2)), matchString, DAY, aValues)
  return aValues[matchString];
}

/**
 * This function will get the value from the object tree; recursive
 * @param matchString - the string that we are matching on
 * @param objectTree - the json object to search
 * @return value or undefined - will return you the string value or undefined
 */
const getValueFromObjectTree = (matchString="", objectTree={}) => {

  const mString = matchString.replace(/%/g, '');
  const sValue = replaceStaticValues(mString);
  if (sValue){
    return sValue;
  }
  let xReturn;
  //console.log('---', mString, matchString, objectTree)
  if (Object.keys(objectTree).indexOf(mString) > -1){
    //console.log('rrrr', matchString, objectTree[mString])
    xReturn =  objectTree[mString];
  } else {

    xReturn =  Object.keys(objectTree).reduce((p, c, i, a)=>{
      if (p === undefined) {
        //console.log(p)
        if (typeof(objectTree[c]) === 'object'){
          return getValueFromObjectTree(mString, objectTree[c]);
        }
      }
      return p;

    }, undefined);
  }
  //console.log('bbbb', matchString, xReturn)
  return xReturn;
}
/**
* This function will take in an inputValue String and replace variables from objectTree
*
* @param inputValue - what to look for
* @param objectTree - json Object to search
* @returns String - replaced inputValue
**/
const replaceVariables = (inputValue="", objectTree={}) => {
  // will search for %xxxxx%
  const myRegex =  /(\%[\w|\d|\.\-\*\/]+\%)/g;
  let returnString = inputValue;

  const arrayOfMatches = inputValue.match(myRegex);

  arrayOfMatches !== null && arrayOfMatches.forEach((theMatch)=>{
    const retrievedValue =  getValueFromObjectTree(theMatch, objectTree);
    //console.log('^^^^^^^^', theMatch, retrievedValue)
    returnString = returnString.replace(theMatch, retrievedValue ? retrievedValue : theMatch );
  });

  return returnString;
}
/**
* This function will take a new UUID
*
* @returns String - in the UUID format
**/
const createUUID = () =>{
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

module.exports = {getEndpoint, config, replaceVariables, createUUID };
