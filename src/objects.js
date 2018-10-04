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
 * @description This function will create a new user data object.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} objectName - object name
 * @param {string} objectType - object type (use '_' between words)
 * @param {string} objectDescription - object description
 * @param {object} [content={}] - object to be created
 * @param {object} [users=undefined] - optinal object containing users for creating permissions groups
 * @returns {Promise<object>} Promise resolving to a data object
 */
const createSharedUserObject = async (
  userUUID = "null user uuid",
  accessToken = "null accessToken",
  objectName,
  objectType,
  objectDescription,
  content = {},
  users = undefined
) => {
  const MS = util.getEndpoint("objects");
  
  
  const body = {
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
    body: body,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };

  const errors = [];

  //create the object first
  let newObject;
  try {
    newObject = await request(requestOptions);
  } catch (error) {
    return Promise.reject(error);
  }
  //need to create permissions resource groups
  if (users && typeof users === "object") {
    const Auth = require("./auth");
    const roles = util.config.objectRoles;
    console.log("ROLES",roles);
    //create the groups
    Object.keys(users).forEach(async (prop) => {
      if(roles.hasOwnProperty(prop)){
        const userGroup = {
          "name": `${prop}: ${newObject.uuid}`,
          "users": [...users[prop]],
          "description": "resource group"
        };
      let group;
      try{
        group = await Auth.createUserGroup(accessToken, userUUID, userGroup);
        console.log("CREATED GROUP",group);
      } catch (error) {
        const errorName = `resource_group_create_${prop}`;   
        errors.push(
          {[errorName]:error}
        );
      } 
      try {
        await Auth.assignScopedRoleToUserGroup(
          accessToken,
          group.uuid,
          roles[prop],
          newObject.uuid
          );
      } catch (error) {
        const errorName = `resource_group_scope_${prop}`;   
        errors.push(
          {[errorName]:error}
        );
      }
    }
      
    });
  }
  if(errors.length > 0){
    try {
      const cleanUpObject = await deleteDataObject(accessToken,newObject.uuid); //this will clean up the groups created if there are any.
      errors.push({"clean_up_object":cleanUpObject});
    } catch (error) {
      errors.push({"clean_up_object":error});
    }
    return Promise.reject(
      {
        "message": "unable to create new object, permissions assignment failure",
        "statusCode": 400,
        "errors": errors
      }
    );
  } else {
    //users are not part of the object itself, so tag them onto the response.
    newObject.users = users;
    return newObject;
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
 * @description This function will delete a data object and any resource groups associated with that object.
 * @param {string} [accessToken="null accessToken"] - accessToken
 * @param {string} [data_uuid="not specified"] - data object UUID
 * @returns {Promise<object>} Promise resolving to a data object
 */
const deleteSharedObject = async (
  accessToken = "null accessToken",
  data_uuid = "not specified"
) => {
  const MS = util.getEndpoint("objects");
  const Auth = require('./auth');
  const Groups = require('./groups');
  //First determine if there are any resource groups we should try to clean up... this is best effort.
  try {
    const resourceGroups = await Auth.listAccessByGroups(accessToken,data_uuid);
    
    if (resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0) {     
      resourceGroups.items.forEach(async item => {
        console.log("Resource Groups",item);
        await Groups.deleteGroup(accessToken,item.user_group.uuid);
      });
    }
  } catch (error) {
   return Promise.reject(error);
  }
  
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

/**
 * @async
 * @description This function will update an existing data object.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [data_uuid="uuid not specified"] - data object UUID
 * @param {object} [body={}] - data object replacement
 * @param {object} [users="undefined"] - optional, users object treated as PUT
 * @returns {Promise<object>} Promise resolving to a data object
 */
const updateSharedObject = async (
  accessToken = "null accessToken",
  data_uuid = "uuid not specified",
  body = {},
  users = undefined
) => {
  const MS = util.getEndpoint("objects");
  
  /* Update resource groups is needed. This is best effort.
   * Assumption is it is better to reject then update the object and have corrupt or invalid resource groups.
   * On object update retry, hopefully the groups will be updated succesfully.
   */

  if (users && typeof users === "object") {
    const Auth = require("./auth");
    const Groups = require("./groups");
    const roles = util.config.objectRoles;
    //Fetch any existing resource groups in case we need to update them. If we can't get them, bail out.
    const permissionsGroups = {};
    try {
      const resourceGroups = await Auth.listAccessByGroups(accessToken,data_uuid);
      //if we have any items, convert this into a format that aligns with our roles object.
      if (resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0){
        resourceGroups.items.forEach(item => {
          const prop = item.permission.reduce((p, c) => {
            if (!p) {
              return c.charAt(0);
            }
            return p.concat(c.charAt(0));
           }, undefined);
           console.log("Prop", prop);
          //there should be only one user-group per permission set. if not something went wrong. 
          if(permissionsGroups.hasOwnProperty("prop")) {
            Promise.reject({
              "statusCode":400,
              "message": `object resource groups corrupt, duplicate groups for prop ${prop} found`
            });
          } else {
            permissionsGroups[prop] = item.user_group.uuid;
            console.log("PermissionsGroups",permissionsGroups);
          }
        });
      }
    } catch (error) {
     return Promise.reject(error);
    }
    Object.keys(users).forEach(async (prop) => {
      if(roles.hasOwnProperty(prop)){
        //figure out what we need to CRUD
        if (permissionsGroups.hasOwnProperty(prop)) {
          //update the group...can admins update these groups?

          permissionsGroups[prop].found = true;
          //do update stuff
        
        } else{
          //create a resource group
          const userGroup = {
            "name": `${prop}: ${data_uuid}`,
            "users": [...users[prop]],
            "description": "resource group"
          };
          let group;
          try{
            group = await Auth.createUserGroup(accessToken, userGroup);
            console.log("CREATED GROUP",group);
          } catch (error) {
            return Promise.reject(error); 
          } 
          try {
            await Auth.assignScopedRoleToUserGroup(
              accessToken,
              group.uuid,
              roles[prop],
              newObject.uuid
              );
          } catch (error) {
            const errorName = `resource_group_scope_${prop}`;   
            errors.push(
              {[errorName]:error}
            );
          }
        }
        try {
        //do update stuff 
        console.log(prop);
       } catch (error) {
         return Promise.reject(error);
       }
      } 
    });
    //Delete the groups that have no users
    Object.keys(permissionsGroups).forEach(async userGroup => {
      if(!userGroup.hasOwnProperty("found")){
        try {
          await Groups.deleteGroup(accessToken,userGroup.uuid);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    });
  }

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
  try {
    const updatedObject = await request(requestOptions);
    //users are not part of the object itself, so tag them onto the response.
    updatedObject.users = users;
    return updateDataObject;
  } catch (error) {
    return Promise.reject(error);
  }
};


module.exports = {
  getDataObject,
  getDataObjects,
  getDataObjectByType,
  getDataObjectByTypeAndName,
  createDataObject,
  createUserDataObject,
  createSharedUserObject,
  deleteDataObject,
  deleteSharedObject,
  updateDataObject,
  updateSharedObject
};