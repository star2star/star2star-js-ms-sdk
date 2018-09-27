/* global require module*/
"use strict";
const util = require("./utilities");
const request = require("request-promise");

/**
 * @async 
 * @description This function returns objects permitted to user with flexible filtering.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUUID="null userUUID"]
 * @param {number} [offset=0] - pagination limit
 * @param {number} [limit=10] - pagination offset
 * @param {boolean} [load_content=false] - return object content or just descriptors
 * @param {array} [filters=undefined] - array of filter options [name, description, status, etc]
 */
const getDataObjects = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  offset = 0,
  limit = 10,
  loadContent = false,
  filters = undefined
) => {
  const MS = util.getEndpoint("objects");
  
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/allowed-objects`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    "qs": {
      "load_content": loadContent    
    },
    json: true
  };

  
  //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice
  if (filters) {
    // filter param has been passed in, make sure it is an array befor proceeding
    if (typeof filters !== "object") {
      return Promise.reject({"statusCode":400,"message":"ERROR: filters is not an object"});
    }

    // sort the filters into those the API handles and those handled by the SDK.
    const apiFilters = [
      "content_type",
      "description",
      "name",
      "sort",
      "type"
    ];
    const sdkFilters = {};
    Object.keys(filters).forEach(filter => {
      if (apiFilters.includes(filter)) {
        requestOptions.qs[filter] = filters[filter];
      } else {
        sdkFilters[filter] = filters[filter];
      }
    });
    //console.log("Request Query Params", requestOptions.qs);
    //console.log("sdkFilters",sdkFilters, Object.keys(sdkFilters).length);
    // if the sdkFilters object is empty, the API can handle everything, otherwise the sdk needs to augment the api.
    if (Object.keys(sdkFilters).length === 0) {
        requestOptions.qs.offset = offset;
        requestOptions.qs.limit = limit;
        try {
          return await request(requestOptions);
        } catch (error) {
          return Promise.reject(error);
        }      
    } else {
     try {
      const response = await util.aggregate(request, requestOptions);
      //console.log("****** RESPONSE *******",response); 
      if(response.hasOwnProperty("items") && response.items.length > 0){
       const filteredResponse = util.filterResponse(response, sdkFilters);
       //console.log("******* FILTERED RESPONSE ********",filteredResponse);
       const paginatedResponse = util.paginate(filteredResponse, offset, limit);
       //console.log("******* PAGINATED RESPONSE ********",paginatedResponse);
       return paginatedResponse; 
      } else {
        return response;
      }
     } catch (error){
       return Promise.reject(error);
     }
    }
  }
};

/**
 * @async
 * @name Get Data Object By Type
 * @description This function will ask the cpaas data object service for a specific
 * type of object.
 * @param {string} userUUID - user UUID to be used
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {number} offset - pagination offset
 * @param {number} limit - pagination limit
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
const getDataObjectByType = (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  offset = 0,
  limit = 10,
  loadContent = "false"
) => {
  const MS = util.getEndpoint("objects");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}&sort=name&offset=${offset}&limit=${limit}`,
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
 * @description This function will ask the cpaas data object service for a specific
 * type of object with name.
 * @param {string} userUUID - user UUID to be used
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {number} offset - pagination offset
 * @param {number} limit - pagination limit
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
const getDataObjectByTypeAndName = (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  dataObjectName = "noName",
  offset = 0,
  limit = 10,
  loadContent = "false"
) => {
  const MS = util.getEndpoint("objects");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}&name=${dataObjectName}&offset=${offset}&limit=${limit}`,
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
  getDataObjects,
  getDataObjectByType,
  getDataObjectByTypeAndName,
  createUserDataObject,
  createDataObject,
  deleteDataObject,
  updateDataObject
};