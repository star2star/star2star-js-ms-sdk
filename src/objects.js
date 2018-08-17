/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("request-promise");

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
const getDataObjectByType = (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  loadContent = "false"
) => {
  return new Promise((resolve, reject) => {
    const MS = util.getEndpoint("objects");

    const arrayRequest = [];
    const requestOptionsGlobal = {
      method: "GET",
      uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/json',
        'x-api-version': `${util.getVersion()}`
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsGlobal));
    const requestOptionsUser = {
      method: "GET",
      uri: `${MS}/users/${userUUID}/objects?type=${dataObjectType}&load_content=${loadContent}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsUser));
    Promise.all(arrayRequest)
      .then(arrayData => {
        // need to build data to return
        //console.log('>>>>>>', JSON.stringify(arrayData));
        const returnItems = [];
        const isNotDuplicate = (item, dataArray) => {
          return (
            dataArray.filter(i => {
              return i.uuid === item.uuid;
            }).length === 0
          );
        };
        arrayData.forEach(i => {
          //console.log('', i)
          if (Array.isArray(i)) {
            i.forEach(x => {
              // let us make sure this is not a duplicate
              if (isNotDuplicate(x, returnItems)) {
                returnItems.push(x);
              }
            });
          } else {
            i.items &&
              i.items.forEach(x => {
                if (isNotDuplicate(x, returnItems)) {
                  returnItems.push(x);
                }
              });
          }
        });

        resolve({
          items: returnItems
        });
      })
      .catch(pError => {
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
const getDataObjectByTypeAndName = (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  dataObjectName = "noName",
  loadContent = "false"
) => {
  return new Promise((resolve, reject) => {
    const MS = util.getEndpoint("objects");

    const arrayRequest = [];
    const requestOptionsGlobal = {
      method: "GET",
      uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}&name=${dataObjectName}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/json',
        'x-api-version': `${util.getVersion()}`
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsGlobal));

    const requestOptionsUser = {
      method: "GET",
      uri: `${MS}/users/${userUUID}/objects?type=${dataObjectType}&load_content=${loadContent}&name=${dataObjectName}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      json: true
    };
    arrayRequest.push(request(requestOptionsUser));

    Promise.all(arrayRequest)
      .then(arrayData => {
        // need to build data to return
        //console.log('>>>>>>', JSON.stringify(arrayData));
        const returnItems = [];
        const isNotDuplicate = (item, dataArray) => {
          return (
            dataArray.filter(i => {
              return i.uuid === item.uuid;
            }).length === 0
          );
        };
        arrayData.forEach(i => {
          //console.log('', i)
          if (Array.isArray(i)) {
            i.forEach(x => {
              // let us make sure this is not a duplicate
              if (isNotDuplicate(x, returnItems)) {
                returnItems.push(x);
              }
            });
          } else {
            i.items &&
              i.items.forEach(x => {
                if (isNotDuplicate(x, returnItems)) {
                  returnItems.push(x);
                }
              });
          }
        });

        resolve({
          items: returnItems
        });
      })
      .catch(pError => {
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
const getDataObject = (
  accessToken = "null accessToken",
  dataObjectUUID = "null uuid"
) => {
  const MS = util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/objects/${dataObjectUUID}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
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
const createUserDataObject = (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  objectName,
  objectType,
  objectDescription,
  content = {}
) => {
  const MS = util.getEndpoint("objects");

  const b = {
    name: objectName,
    type: objectType,
    description: objectDescription,
    content_type: "application/json",
    content: content
  };
  //console.log('bbbbbbbb', b)
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUUID}/objects`,
    body: b,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
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
const createDataObject = (
  accessToken = "null accessToken",
  objectName,
  objectType,
  objectDescription,
  content = {}
) => {
  const MS = util.getEndpoint("objects");

  const b = {
    name: objectName,
    type: objectType,
    description: objectDescription,
    content_type: "application/json",
    content: content
  };
  //console.log('bbbbbbbb', b)
  const requestOptions = {
    method: "POST",
    uri: `${MS}/objects`,
    body: b,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
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
const deleteDataObject = (
  accessToken = "null accessToken",
  data_uuid = "not specified"
) => {
  const MS = util.getEndpoint("objects");

  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/objects/${data_uuid}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    json: true,
    resolveWithFullResponse: true
  };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
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
const updateDataObject = (
  accessToken = "null accessToken",
  data_uuid = "uuid not specified",
  body = {}
) => {
  const MS = util.getEndpoint("objects");

  const requestOptions = {
    method: "PUT",
    uri: `${MS}/objects/${data_uuid}`,
    body: body,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };
  return request(requestOptions);
};
module.exports = {
  getDataObject,
  getDataObjectByType,
  getDataObjectByTypeAndName,
  createUserDataObject,
  createDataObject,
  deleteDataObject,
  updateDataObject
};