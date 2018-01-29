"use strict";
const request = require('request-promise');
const utilities = require('./utilities');
const Objects = require('./objects');
const objectMerge = require('object-merge');

const EVENT_TYPE = "app_event";

/**
* This function will ask the cpaas data object service for a specific object
*
* @param array tasks objects - takes in an array of tasks objects
* @returns object - containing status, message and tasks
**/
const getValidEvent = (obj={}) =>{
  let rReturn = objectMerge({}, obj);

  //!rReturn.hasOwnProperty('uuid') && (rReturn.uuid = utilities.createUUID());
  !rReturn.hasOwnProperty('type') && (rReturn.type = 'event_generic');
  !rReturn.hasOwnProperty('title') && (rReturn.title = 'event_generic_title');
  !rReturn.hasOwnProperty('description') && (rReturn.description = 'event descriptions should go here');
  !rReturn.hasOwnProperty('timestamp') && (rReturn.timestamp = Date.now());
  !rReturn.hasOwnProperty('status') && (rReturn.status = 'completed');
  !rReturn.hasOwnProperty('metadata') && (rReturn.metadata = {});
  !rReturn.hasOwnProperty('responses') && (rReturn.responses = {});
  !rReturn.hasOwnProperty('child_events') && (rReturn.child_events =  []);

  return rReturn;
}

/**
* This function will ask the cpaas data object service for a list of event objects
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @returns promise for list of data object task templates with content
**/
const listEvents = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt' ) => {
  return Objects.getDataObjectByType(apiKey, userUUID, identityJWT, 'event', true);
}
/**
* This function will create a new event object
*
* @param apiKey string - api key for cpaas systems
* @param userUUID string - user UUID to be used
* @param identityJWT string - identity JWT
* @param event object - event object consisting of standard event object
* @returns promise for creating object
**/
const createEvent = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
  event_name, event_object={} ) => {
  return Objects.createDataObject(apiKey, userUUID, identityJWT, event_name, EVENT_TYPE, getValidEvent(event_object) );
}

/**
* This function will delete event
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param EventObjectUUUID - event UUID
* @returns promise
**/
const deleteEvent  = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              event_uuid ="missing task uuid" ) => {
    return Objects.deleteDataObject(apiKey, userUUID, identityJWT, event_uuid );
}

/**
* This function will retrieve task list
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param uuid - UUID
* @returns promise
**/
const getEvent  = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              uuid='null uuid' ) => {
    return Objects.getDataObject(apiKey, userUUID, identityJWT, uuid, true);
}

/**
* This function will update event
*
* @param apiKey - api key for cpaas systems
* @param userUUID - user UUID to be used
* @param identityJWT - identity JWT
* @param uuid -  UUID
* @param event_object - event object
* @returns promise
**/
const updateEvent  = (apiKey='null api key', userUUID='null user uuid', identityJWT='null jwt',
                              uuid="missing_uuid",  dataObj={} ) => {
    const newEvent = objectMerge(dataObj, {content: getValidEvent(dataObj.content) });

    return Objects.updateDataObject(apiKey, userUUID, identityJWT, uuid, newEvent );
}

module.exports = { updateEvent, getEvent, deleteEvent, createEvent, listEvents }
