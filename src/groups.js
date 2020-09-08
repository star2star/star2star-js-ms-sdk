/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * @async
 * @description This function will return the groups associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access otken
 * @param {number} [offset=0] - page number
 * @param {number} [limit=10] - page size
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a list of user groups.
 */
const listGroups = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/user-groups`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset,
        limit
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
        //groups moved to auth...ensure backward compatibility
        if(filter === "member_uuid"){
          requestOptions.qs.user_uuid = filters[filter];
        }
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

/**
 * @async
 * @description This function will create a new group associated with a user
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [body="null body"] - object conatining group data
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const createGroup = async (
  accessToken = "null accessToken",
  body = "null body",
  trace = {}
) => {
  try{
    const newBody = {
      "name": body.name,
      "description": body.description 
    };
    newBody.users = body.members.map(member => {
      return member.uuid;
    });
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/accounts/${body.account_uuid}/user-groups`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      body: newBody,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch(error){
    return Promise.reject(util.formatError(error));
  }
};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This function will ask the cpaas groups service for a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const getGroup = async (
  accessToken = "null accessToken",
  groupUUID = "null uuid",
  filters = undefined,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/user-groups/${groupUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      requestOptions.qs = [];
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    //console.log("****REQUESTOPTS****",requestOptions);
    const response = await request(requestOptions);
    // ensure backward compatibility now that this has been moved out of Groups microservice
    if(response.hasOwnProperty("users")){
      response.members = response.users;
    }
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
  
};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This function will return a list of the members of a group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="null uuid"] - group UUID
 * @param {array} [filters=undefined] - optional array of filters, e.g. [expand] = "members.type", [offset] and [limit] for pagination
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a single group
 */
const listGroupMembers = async (
  accessToken = "null accessToken",
  groupUUID = "null uuid",
  filters = undefined,
  trace = {}
) => {
  try{
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/user-groups/${groupUUID}/users`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      requestOptions.qs = [];
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    //console.log("****REQUESTOPTS****",requestOptions);
    const response = request(requestOptions);
    // ensure backward compatibility now that this has been moved out of Groups microservice
    if(response.hasOwnProperty("users")){
      response.members = response.users;
    }
    return response; 
  } catch(error){
    return Promise.reject(util.formatError(error));
  }
};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This function will delete a specific group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="not specified"] - group UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteGroup = async (
  accessToken = "null accessToken",
  groupUUID = "not specified",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/user-groups/${groupUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response =  await request(requestOptions);
    // delete returns a 202....suspend return until the new resource is ready
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace,
        "deleting"
      );
    }
    return {"status":"ok"};
  } catch(error){
    return Promise.reject(util.formatError(error));
  } 
};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This function will add users to a user group.
 * @param {string} [accessToken="null accessToken"] - access Token
 * @param {string} [groupUUID="group uuid not specified"] - data object UUID
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<array>} - Promise resolving to an array of added users
 */
const addMembersToGroup = async (
  accessToken = "null accessToken",
  groupUUID = "group uuid not specified",
  members = [],
  trace = {}
) => {
  try {
    // ensure backward compatibility with groups api consumers
    const newMembers = members.map(member => {
      return member.hasOwnProperty("uuid") ? member.uuid : undefined;
    });
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${groupUUID}/users`,
      body: {
        "users": newMembers
      },
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const group = response.body;
    // create returns a 202....suspend return until the new resource is ready
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    group.total_members = group.hasOwnProperty("total_members") ? (group.total_members + 1) : undefined;
    return group;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
  

};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This function will remove one or more members from a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUUID="null groupUUID"] - group to remove users from
 * @param {array} [members=[]] - array of objects containing 'uuid' (for known users)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure status object.
 */
const deleteGroupMembers = async (
  accessToken = "null accessToken",
  groupUUID = "null groupUuid",
  members = [],
  trace = {}
) => {
  try{
    // ensure backward compatibility with groups api consumers
    const newMembers = members.map(member => {
      return member.hasOwnProperty("uuid") ? member.uuid : undefined;
    });
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${groupUUID}/users/remove`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      body: {
        "users": newMembers
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // create returns a 202....suspend return until the new resource is ready
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return {"status": "ok"};
  } catch(error){
    return Promise.reject(util.formatError(error));
  }
};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This method will deactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const deactivateGroup = async(
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${groupUuid}/deactivate`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    response.resource_status = "complete";
    response.status = "Inactive";
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};

// TODO this call needs to be migrated out of groups to auth. CCORE-662
/**
 * @async
 * @description This method will reactivate a group
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const reactivateGroup = async (
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${groupUuid}/reactivate`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.hasOwnProperty("statusCode") && 
        response.statusCode === 202 &&
        response.headers.hasOwnProperty("location"))
    {    
      await util.pendingResource(
        response.headers.location,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    response.resource_status = "complete";
    response.status = "Active";
    return response;
  } catch (error) {
    Promise.reject(util.formatError(error));
  }
};

/**
 * @async
 * @description This method will change the group name and description
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [groupUuid="null groupUuid"] - group to modify
 * @param {string} [body="null body] - object containing new name and/or description
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a group object.
 */
const modifyGroup = async (
  accessToken = "null accessToken",
  groupUuid = "null groupUuid",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("auth");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user-groups/${groupUuid}/modify`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`
      },
      body: body,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error){
    return Promise.reject(util.formatError(error));
  }
  
};

module.exports = {
  addMembersToGroup,
  createGroup,
  deactivateGroup,
  deleteGroup,
  deleteGroupMembers,
  getGroup,
  listGroups,
  listGroupMembers,
  modifyGroup,
  reactivateGroup
};
