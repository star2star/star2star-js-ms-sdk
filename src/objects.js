/* global require module*/
"use strict";
import "@babel/polyfill";
const Util = require("./utilities");
const request = require("request-promise");
const objectMerge = require("object-merge");
const ResourceGroups = require("./resourceGroups");
import Logger from "./node-logger";
const logger = new Logger();
logger.setLevel(Util.getLogLevel());
logger.setPretty(Util.getLogPretty());

/**
 * @async
 * @name Get By Type
 * @description This function will ask the cpaas data object service for a specific
 * type of object.
 * @param {string} accessToken - Access Token
 * @param {string} dataObjectType - Data object type to be retrieved; default: dataObjectType
 * @param {number} offset - pagination offset
 * @param {number} limit - pagination limit
 * @param {boolean} [loadContent] - String boolean if the call should also return content of object; default false
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
const getByType = (
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  offset = 0,
  limit = 10,
  loadContent = "false",
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/objects?type=${dataObjectType}&load_content=${loadContent}&sort=name&offset=${offset}&limit=${limit}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};


/**
 * @async
 * @description This function returns objects permitted to user with flexible filtering.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUUID="null userUUID"]
 * @param {number} [offset=0] - pagination limit
 * @param {number} [limit=10] - pagination offset
 * @param {boolean} [load_content=false] - return object content or just descriptors
 * @param {array} [filters=undefined] - array of filter options [name, description, status, etc]
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise} - Promise resolving to a list of objects
 */
const getDataObjects = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  offset = 0,
  limit = 10,
  loadContent = false,
  filters = undefined,
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/allowed-objects`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    qs: {
      load_content: loadContent
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice
  if (filters) {
    // filter param has been passed in, make sure it is an array befor proceeding
    if (typeof filters !== "object") {
      return Promise.reject({
        statusCode: 400,
        message: "ERROR: filters is not an object"
      });
    }

    // sort the filters into those the API handles and those handled by the SDK.
    const apiFilters = ["content_type", "description", "name", "sort", "type"];
    const sdkFilters = {};
    Object.keys(filters).forEach(filter => {
      if (apiFilters.includes(filter)) {
        requestOptions.qs[filter] = filters[filter];
      } else {
        sdkFilters[filter] = filters[filter];
      }
    });
    logger.debug("Request Query Params", requestOptions.qs);
    logger.debug("sdkFilters",sdkFilters);
    // if the sdkFilters object is empty, the API can handle everything, otherwise the sdk needs to augment the api.
    if (Object.keys(sdkFilters).length === 0) {
      requestOptions.qs.offset = offset;
      requestOptions.qs.limit = limit;
      return await request(requestOptions);
    } else {
      const response = await Util.aggregate(request, requestOptions, trace);
      logger.debug("****** AGGREGATE RESPONSE *******",response);
      if (response.hasOwnProperty("items") && response.items.length > 0) {
        const filteredResponse = Util.filterResponse(response, sdkFilters);
        logger.debug("******* FILTERED RESPONSE ********",filteredResponse);
        const paginatedResponse = Util.paginate(
          filteredResponse,
          offset,
          limit
        );
        logger.debug("******* PAGINATED RESPONSE ********",paginatedResponse);
        return paginatedResponse;
      } else {
        return response;
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
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
const getDataObjectByType = (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  offset = 0,
  limit = 10,
  loadContent = "false",
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}&sort=name&offset=${offset}&limit=${limit}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<array>} Promise resolving to an array of data objects
 */
const getDataObjectByTypeAndName = async (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  dataObjectType = "data_object",
  dataObjectName = "noName",
  offset = 0,
  limit = 10,
  loadContent = "false",
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}&name=${dataObjectName}&offset=${offset}&limit=${limit}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [dataObjectUUID="null uuid"] - data object UUID
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
const getDataObject = (
  accessToken = "null accessToken",
  dataObjectUUID = "null uuid",
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/objects/${dataObjectUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`,
      "cache-contro":"no-cache"
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
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
 * @param {string} [accountUUID="null accountUUID"] - optional account uuid to scope user permissions
 * @param {object} [users=undefined] - optional object containing users for creating permissions groups
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
const createUserDataObject = async (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  objectName,
  objectType,
  objectDescription,
  content = {},
  accountUUID = undefined,
  users = undefined,
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");
  const body = {
    name: objectName,
    type: objectType,
    description: objectDescription,
    content_type: "application/json",
    content: content
  };

  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${userUUID}/objects`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  //create the object first
  let newObject;
  let nextTrace = objectMerge({}, trace);
  try {
    const response = await request(requestOptions);
    newObject = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await Util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace,
        newObject.hasOwnProperty("resource_status") ? newObject.resource_status : "complete"
      );
    }
    
    //need to create permissions resource groups
    if (
      accountUUID &&
      users && 
      typeof users === "object"
    ) {
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      await ResourceGroups.createResourceGroups(
        accessToken,
        accountUUID,
        newObject.uuid,
        "object", //system role type
        users,
        nextTrace
      );
    }
    return newObject;
  } catch (createError) {
    //delete the object if we have one
    if (newObject && newObject.hasOwnProperty("uuid")) {
      try {
        nextTrace = objectMerge(
          {},
          nextTrace,
          Util.generateNewMetaData(nextTrace)
        );
        await deleteDataObject(accessToken, newObject.uuid, nextTrace); //this will clean up the groups created if there are any.
        return Promise.reject(createError);
      } catch (cleanupError) {
        return Promise.reject({
          errors: {
            create: createError,
            cleanup: cleanupError
          }
        });
      }
    } else {
      return Promise.reject(createError);
    }
  }
};

/**
 * @async
 * @description This function will create a new data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} objectName - string object name
 * @param {string} objectType - string object type (use '_' between words)
 * @param {string} objectDescription - string object description
 * @param {object} [content={}] - object with contents
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
const createDataObject = async (
  accessToken = "null accessToken",
  objectName,
  objectType,
  objectDescription,
  content = {},
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");

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
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const newObject = response.body;
  // create returns a 202....suspend return until the new resource is ready
  if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
  {    
    await Util.pendingResource(
      response.headers.location,
      requestOptions, //reusing the request options instead of passing in multiple params
      trace,
      newObject.hasOwnProperty("resource_status") ? newObject.resource_status : "complete"
    );
  }
  return newObject;
};

/**
 * @async
 * @description This function will delete a data object and any resource groups associated with that object.
 * @param {string} [accessToken="null accessToken"] - accessToken
 * @param {string} [dataUUID="not specified"] - data object UUID
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
const deleteDataObject = async (
  accessToken = "null accessToken",
  dataUUID = "null dataUUID",
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");
  const ResourceGroups = require("./resourceGroups");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/objects/${dataUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    json: true,
    resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  let nextTrace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  await ResourceGroups.cleanUpResourceGroups(
    accessToken,
    dataUUID,
    nextTrace
  );

  const response = await request(requestOptions);
  // delete returns a 202....suspend return until the new resource is ready
  if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
  {    
    await Util.pendingResource(
      response.headers.location,
      requestOptions, //reusing the request options instead of passing in multiple params
      trace,
      "deleting"
    );
  }
  return Promise.resolve({ status: "ok" });
};

/**
 * @async
 * @description This function will update an existing data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [dataUUID="uuid not specified"] - data object UUID
 * @param {object} [body={}] - data object replacement
 * @param {string} [accountUUID=undefined] - optional account to scope users object permissions to
 * @param {object} [users=undefined] - optional users permissions object
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to a data object
 */
const updateDataObject = async (
  accessToken = "null accessToken",
  dataUUID = "uuid not specified",
  body = {},
  accountUUID = undefined, // only needed for shared objects
  users = undefined, //only needed for shared objects
  trace = {}
) => {
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/objects/${dataUUID}`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${Util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  let nextTrace = objectMerge({}, trace);
  if (
    accountUUID &&
      users && 
      typeof users === "object"
  ) {
    nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
    await ResourceGroups.updateResourceGroups(
      accessToken,
      dataUUID,
      accountUUID,
      "object", //specifies the system role to find in config.json
      users,
      nextTrace
    );
  }
  const response =  await request(requestOptions);
  const updatedObj = response.body ;
  // update returns a 202....suspend return until the new resource is ready
  if (response.hasOwnProperty("statusCode") && 
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location"))
  {  
    await Util.pendingResource(
      response.headers.location,
      requestOptions, //reusing the request options instead of passing in multiple params
      trace,
      updatedObj.hasOwnProperty("resource_status") ? updatedObj.resource_status : "complete"
    );
  }
  return updatedObj;
};

module.exports = {
  getByType,
  getDataObject,
  getDataObjects,
  getDataObjectByType,
  getDataObjectByTypeAndName,
  createDataObject,
  createUserDataObject,
  deleteDataObject,
  updateDataObject
};
