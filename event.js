/* global require module*/
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
const getValidEvent = (obj = {}) => {
  let rReturn = objectMerge({}, obj);

  //!rReturn.hasOwnProperty('uuid') && (rReturn.uuid = utilities.createUUID());
  !rReturn.hasOwnProperty('type') && (rReturn.type = 'event_generic');
  !rReturn.hasOwnProperty('title') && (rReturn.title = 'event_generic_title');
  !rReturn.hasOwnProperty('description') && (rReturn.description = 'event descriptions should go here');
  !rReturn.hasOwnProperty('timestamp') && (rReturn.timestamp = Date.now());
  !rReturn.hasOwnProperty('status') && (rReturn.status = 'completed');
  !rReturn.hasOwnProperty('metadata') && (rReturn.metadata = {});
  !rReturn.hasOwnProperty('responses') && (rReturn.responses = {});
  !rReturn.hasOwnProperty('child_events') && (rReturn.child_events = []);

  return rReturn;
};

/**
 * This function will ask the cpaas data object service for a list of event objects
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @returns promise for list of data object task templates with content
 **/
const listEvents = (userUUID = 'null user uuid', accessToken = 'null accessToken') => {
  return Objects.getDataObjectByType(userUUID, accessToken, EVENT_TYPE, true);
};

/**
 * This function will create a new event object
 *
 * @param userUUID string - user UUID to be used
 * @param accessToken string - access Token
 * @param eventName string - name for event object
 * @param eventDescription string - description for event object
 * @param eventObject - event object consisting of standard event object content
 * @returns promise for creating object
 **/
const createEvent = (userUUID = 'null user uuid', accessToken = 'null accessToken',
  eventName, eventDescription, eventObject = {}) => {
  return Objects.createUserDataObject(userUUID, accessToken, eventName, EVENT_TYPE, eventDescription, getValidEvent(eventObject));
};

/**
 * This function will delete event
 *
 * @param accessToken - access Token
 * @param EventObjectUUID - event UUID
 * @returns promise
 **/
const deleteEvent = (accessToken = 'null accessToken',
  EventObjectUUID = "missing task uuid") => {
  return Objects.deleteDataObject(accessToken, EventObjectUUID);
};

/**
 * This function will retrieve task list
 *
 * @param accessToken - access Token
 * @param uuid - UUID
 * @returns promise
 **/
const getEvent = (accessToken = 'null accessToken',
  uuid = 'null uuid') => {
  return Objects.getDataObject(accessToken, uuid, true);
};

/**
 * This function will update event
 *
 * @param accessToken - access Token
 * @param uuid -  UUID
 * @param eventObject - event object
 * @returns promise
 **/
const updateEvent = (accessToken = 'null jwt', uuid = "missing_uuid", eventObj = {}) => {
  const newEvent = objectMerge(eventObj, {
    content: getValidEvent(eventObj.content)
  });

  return Objects.updateDataObject(accessToken, uuid, newEvent);
};

module.exports = {
  updateEvent,
  getEvent,
  deleteEvent,
  createEvent,
  listEvents
};