/* global require module*/
"use strict";

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @name Get Data Object By Type
 * @description This function will ask the cpaas data object service for a specific
 * type of object.
 * @param {string} userUUID - user UUID to be used
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
var getDataObjectByType = function getDataObjectByType() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  var loadContent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "false";

  return new Promise(function (resolve, reject) {
    var MS = util.getEndpoint("objects");

    var arrayRequest = [];
    var requestOptionsGlobal = {
      method: "GET",
      uri: MS + "/users/" + userUUID + "/allowed-objects?type=" + dataObjectType + "&load_content=" + loadContent,
      headers: {
        'Authorization': "Bearer " + accessToken,
        'Content-type': 'application/json',
        'x-api-version': "" + util.getVersion()
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsGlobal));
    var requestOptionsUser = {
      method: "GET",
      uri: MS + "/users/" + userUUID + "/objects?type=" + dataObjectType + "&load_content=" + loadContent,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + accessToken
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsUser));
    Promise.all(arrayRequest).then(function (arrayData) {
      // need to build data to return
      //console.log('>>>>>>', JSON.stringify(arrayData));
      var returnItems = [];
      var isNotDuplicate = function isNotDuplicate(item, dataArray) {
        return dataArray.filter(function (i) {
          return i.uuid === item.uuid;
        }).length === 0;
      };
      arrayData.forEach(function (i) {
        //console.log('', i)
        if (Array.isArray(i)) {
          i.forEach(function (x) {
            // let us make sure this is not a duplicate
            if (isNotDuplicate(x, returnItems)) {
              returnItems.push(x);
            }
          });
        } else {
          i.items && i.items.forEach(function (x) {
            if (isNotDuplicate(x, returnItems)) {
              returnItems.push(x);
            }
          });
        }
      });

      resolve({
        items: returnItems
      });
    }).catch(function (pError) {
      reject(pError);
    });
  });
};

/**
 * @async
 * @description This function will ask the cpaas data object service for a specific
 * type of object with name.
 * @param {string} userUUID - user UUID to be used
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
var getDataObjectByTypeAndName = function getDataObjectByTypeAndName() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  var dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  var dataObjectName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "noName";
  var loadContent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "false";

  return new Promise(function (resolve, reject) {
    var MS = util.getEndpoint("objects");

    var arrayRequest = [];
    var requestOptionsGlobal = {
      method: "GET",
      uri: MS + "/users/" + userUUID + "/allowed-objects?type=" + dataObjectType + "&load_content=" + loadContent + "&name=" + dataObjectName,
      headers: {
        'Authorization': "Bearer " + accessToken,
        'Content-type': 'application/json',
        'x-api-version': "" + util.getVersion()
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsGlobal));

    var requestOptionsUser = {
      method: "GET",
      uri: MS + "/users/" + userUUID + "/objects?type=" + dataObjectType + "&load_content=" + loadContent + "&name=" + dataObjectName,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + accessToken
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsUser));

    Promise.all(arrayRequest).then(function (arrayData) {
      // need to build data to return
      //console.log('>>>>>>', JSON.stringify(arrayData));
      var returnItems = [];
      var isNotDuplicate = function isNotDuplicate(item, dataArray) {
        return dataArray.filter(function (i) {
          return i.uuid === item.uuid;
        }).length === 0;
      };
      arrayData.forEach(function (i) {
        //console.log('', i)
        if (Array.isArray(i)) {
          i.forEach(function (x) {
            // let us make sure this is not a duplicate
            if (isNotDuplicate(x, returnItems)) {
              returnItems.push(x);
            }
          });
        } else {
          i.items && i.items.forEach(function (x) {
            if (isNotDuplicate(x, returnItems)) {
              returnItems.push(x);
            }
          });
        }
      });

      resolve({
        items: returnItems
      });
    }).catch(function (pError) {
      reject(pError);
    });
  });
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
  getDataObjectByType: getDataObjectByType,
  getDataObjectByTypeAndName: getDataObjectByTypeAndName,
  createUserDataObject: createUserDataObject,
  createDataObject: createDataObject,
  deleteDataObject: deleteDataObject,
  updateDataObject: updateDataObject
};