/* global require module*/
"use strict";

const Util = require("./utilities");

const request = require("request-promise");

const objectMerge = require("object-merge");

const ResourceGroups = require("./resourceGroups");

const Logger = require("./node-logger");

const logger = new Logger.default();
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

const getByType = function getByType() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let dataObjectType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "data_object";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let loadContent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "false";
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/objects?type=").concat(dataObjectType, "&load_content=").concat(loadContent, "&sort=name&offset=").concat(offset, "&limit=").concat(limit),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
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


const getDataObjects = async function getDataObjects() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUUID";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let loadContent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let filters = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  let trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/users/").concat(userUUID, "/allowed-objects"),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
    },
    qs: {
      load_content: loadContent
    },
    json: true
  };
  Util.addRequestTrace(requestOptions, trace); //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice

  if (filters) {
    // filter param has been passed in, make sure it is an array befor proceeding
    if (typeof filters !== "object") {
      return Promise.reject({
        statusCode: 400,
        message: "ERROR: filters is not an object"
      });
    } // sort the filters into those the API handles and those handled by the SDK.


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
    logger.debug("sdkFilters", sdkFilters); // if the sdkFilters object is empty, the API can handle everything, otherwise the sdk needs to augment the api.

    if (Object.keys(sdkFilters).length === 0) {
      requestOptions.qs.offset = offset;
      requestOptions.qs.limit = limit;
      return request(requestOptions);
    } else {
      const response = await Util.aggregate(request, requestOptions, trace);
      logger.debug("****** AGGREGATE RESPONSE *******", response);

      if (response.hasOwnProperty("items") && response.items.length > 0) {
        const filteredResponse = Util.filterResponse(response, sdkFilters);
        logger.debug("******* FILTERED RESPONSE ********", filteredResponse);
        const paginatedResponse = Util.paginate(filteredResponse, offset, limit);
        logger.debug("******* PAGINATED RESPONSE ********", paginatedResponse);
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


const getDataObjectByType = function getDataObjectByType() {
  let userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  let offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  let loadContent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "false";
  let trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/users/").concat(userUUID, "/allowed-objects?type=").concat(dataObjectType, "&load_content=").concat(loadContent, "&sort=name&offset=").concat(offset, "&limit=").concat(limit),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
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


const getDataObjectByTypeAndName = async function getDataObjectByTypeAndName() {
  let userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let dataObjectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "data_object";
  let dataObjectName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "noName";
  let offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let limit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 10;
  let loadContent = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "false";
  let trace = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/users/").concat(userUUID, "/allowed-objects?type=").concat(dataObjectType, "&load_content=").concat(loadContent, "&name=").concat(dataObjectName, "&offset=").concat(offset, "&limit=").concat(limit),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
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


const getDataObject = function getDataObject() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let dataObjectUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/objects/").concat(dataObjectUUID),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion()),
      "cache-control": "no-cache"
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


const createUserDataObject = async function createUserDataObject() {
  let userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let objectName = arguments.length > 2 ? arguments[2] : undefined;
  let objectType = arguments.length > 3 ? arguments[3] : undefined;
  let objectDescription = arguments.length > 4 ? arguments[4] : undefined;
  let content = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  let accountUUID = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
  let users = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : undefined;
  let trace = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};
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
    uri: "".concat(MS, "/users/").concat(userUUID, "/objects"),
    body: body,
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace); //create the object first

  let newObject;
  let nextTrace = objectMerge({}, trace);

  try {
    const response = await request(requestOptions);
    newObject = response.body; // create returns a 202....suspend return until the new resource is ready

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
      await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
      trace, newObject.hasOwnProperty("resource_status") ? newObject.resource_status : "complete");
    } //need to create permissions resource groups


    if (accountUUID && users && typeof users === "object") {
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      await ResourceGroups.createResourceGroups(accessToken, accountUUID, newObject.uuid, "object", //system role type
      users, nextTrace);
    }

    return newObject;
  } catch (createError) {
    //delete the object if we have one
    if (newObject && newObject.hasOwnProperty("uuid")) {
      try {
        nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
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


const createDataObject = async function createDataObject() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let objectName = arguments.length > 1 ? arguments[1] : undefined;
  let objectType = arguments.length > 2 ? arguments[2] : undefined;
  let objectDescription = arguments.length > 3 ? arguments[3] : undefined;
  let content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = Util.getEndpoint("objects");
  const b = {
    name: objectName,
    type: objectType,
    description: objectDescription,
    content_type: "application/json",
    content: content
  }; //console.log('bbbbbbbb', b)

  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/objects"),
    body: b,
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  const newObject = response.body; // create returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, newObject.hasOwnProperty("resource_status") ? newObject.resource_status : "complete");
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


const deleteDataObject = async function deleteDataObject() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let dataUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null dataUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = Util.getEndpoint("objects");

  const ResourceGroups = require("./resourceGroups");

  const requestOptions = {
    method: "DELETE",
    uri: "".concat(MS, "/objects/").concat(dataUUID),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
    },
    json: true,
    resolveWithFullResponse: true
  };
  Util.addRequestTrace(requestOptions, trace);
  let nextTrace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  await ResourceGroups.cleanUpResourceGroups(accessToken, dataUUID, nextTrace);
  const response = await request(requestOptions); // delete returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, "deleting");
  }

  return Promise.resolve({
    status: "ok"
  });
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


const updateDataObject = async function updateDataObject() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let dataUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "uuid not specified";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let accountUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let users = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = Util.getEndpoint("objects");
  const requestOptions = {
    method: "PUT",
    uri: "".concat(MS, "/objects/").concat(dataUUID),
    body: body,
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "Content-type": "application/json",
      "x-api-version": "".concat(Util.getVersion())
    },
    resolveWithFullResponse: true,
    json: true
  };
  Util.addRequestTrace(requestOptions, trace);
  let nextTrace = objectMerge({}, trace);

  if (accountUUID //required to update associated resource groups.
  ) {
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      await ResourceGroups.updateResourceGroups(accessToken, dataUUID, accountUUID, "object", //specifies the system role to find in config.json
      users, nextTrace);
    }

  const response = await request(requestOptions);
  const updatedObj = response.body; // update returns a 202....suspend return until the new resource is ready

  if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
    await Util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
    trace, updatedObj.hasOwnProperty("resource_status") ? updatedObj.resource_status : "complete");
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