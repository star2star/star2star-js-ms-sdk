/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * This function will ask the cpaas data object service for a specific
 * type of object
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - Access Token
 * @param dataObjectType - data object type to be retrieved; default: dataObjectType
 * @param loadContent - string boolean if the call should also return content of object; default false
 * @returns promise resolving to an array of data objects
 **/
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
 * This function will ask the cpaas data object service for a specific
 * type of object with name
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - Access Token
 * @param dataObjectType - string - data object type to be retrieved; default: dataObjectType
 * @param dataObjectName - string - data object name to be retrieved 
 * @param loadContent - string boolean if the call should also return content of object; default false
 * @returns promise resolving to an array of data objects
 **/
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
 * This function will ask the cpaas data object service for a specific object
 *
 * @param apiKey - api key for cpaas systems
 * @param accessToken - Access Token
 * @param dataObjectUUID - data object UUID
 * @returns data
 **/
const getDataObject = (
  // apiKey = "null api key",
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
 * This function will create a new data object
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - Access Token
 * @param objectName - string object name
 * @param objectType - string object type (use '_' between words)
 * @param objectDescription - string object description
 * @param content - object with contents
 * @returns data
 **/
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
 * This function will create a new data object
 *
 * @param accessToken - Access Token
 * @param objectName - string object name
 * @param objectType - string object type (use '_' between words)
 * @param objectDescription - string object description
 * @param content - object with contents
 * @returns data
 **/
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
 * This function will delete a data object
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - accessToken
 * @param dataObjectUUID - data object UUID
 * @returns data
 **/
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
    json: true
  };
  return request(requestOptions);
};

/**
 * This function will update an existing data object
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - Access Token
 * @param dataObjectUUID - data object UUID
 * @returns data
 **/
const updateDataObject = (
  accessToken = "null accessToken",
  data_uuid = "uuid not specified",
  data_object = {}
) => {
  const MS = util.getEndpoint("objects");

  const requestOptions = {
    method: "PUT",
    uri: `${MS}/objects/${data_uuid}`,
    body: data_object,
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