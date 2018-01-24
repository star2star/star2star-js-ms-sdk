"use strict";
const util = require('./utilities');
const request = require('request-promise');

/**
* This function will ask the cpaas data object service for a specific
* type of object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectType - data object type to be retrieved; default: dataObjectType
* @param loadContent - string boolean if the call should also return content of object; default false
* @returns promise resolving to an array of data objects
**/
const getGlobalObjectsByType = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              dataObjectType='data_object', loadContent='false' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/objects?type=${dataObjectType}&load_content=${loadContent}`,
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

/**
* This function will ask the cpaas data object service for a specific
* type of object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectType - data object type to be retrieved; default: dataObjectType
* @param loadContent - string boolean if the call should also return content of object; default false
* @returns promise resolving to an array of data objects
**/
const getDataObjectByType = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              dataObjectType='data_object', loadContent='false' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}`,
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

/**
* This function will ask the cpaas data object service for a specific
* type of object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectType - data object type to be retrieved; default: dataObjectType
* @param loadContent - string boolean if the call should also return content of object; default false
* @returns promise resolving to an array of data objects
**/
const getDataObjectByTypeAndName = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              dataObjectType='data_object', dataObjectName='noName', loadContent='false' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/users/${userUUID}/allowed-objects?type=${dataObjectType}&load_content=${loadContent}&name=${dataObjectName}`,
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

/**
* This function will ask the cpaas data object service for a specific object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectUUID - data object UUID
* @returns data
**/
const getDataObject = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              dataObjectUUID='null uuid' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");
  const requestOptions = {
      method: 'GET',
      uri: `${MS}/objects/${dataObjectUUID}`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

/**
* This function will create a new data object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectUUID - data object UUID
* @returns data
**/
const createUserDataObject = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        objectName, objectType, content={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");

  const b = {
    "name": objectName,
    "type": objectType,
    "content_type": "application/json",
    "content": content
  }
  //console.log('bbbbbbbb', b)
  const requestOptions = {
      method: 'POST',
      uri: `${MS}/users/${userUUID}/objects`,
      body: b,
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}
/**
* This function will create a new data object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectUUID - data object UUID
* @returns data
**/
const createDataObject = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        objectName, objectType, content={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");

  const b = {
    "name": objectName,
    "type": objectType,
    "content_type": "application/json",
    "content": content
  }
  //console.log('bbbbbbbb', b)
  const requestOptions = {
      method: 'POST',
      uri: `${MS}/objects`,
      body: b,
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}
/**
* This function will create a new data object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectUUID - data object UUID
* @returns data
**/
const deleteDataObject = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        data_uuid='not specified' ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");

  const requestOptions = {
      method: 'DELETE',
      uri: `${MS}/objects/${data_uuid}`,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}

/**
* This function will create a new data object
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param dataObjectUUID - data object UUID
* @returns data
**/
const updateDataObject = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                        data_uuid='not specified', data_object={} ) => {
  const MS = util.getEndpoint(process.env.NODE_ENV, "objects");

  const requestOptions = {
      method: 'PUT',
      uri: `${MS}/objects/${data_uuid}`,
      body: data_object,
      headers: {
          'application-key': apiKey,
          'Content-type': 'application/json',
          'Authorization': `Bearer ${identityJWT}`
      },
      json: true
  };
  return request(requestOptions);
}
module.exports = { getDataObject, getDataObjectByType, getDataObjectByTypeAndName, getGlobalObjectsByType, 
  createUserDataObject, createDataObject, deleteDataObject, updateDataObject }
