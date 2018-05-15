/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");
const ObjectMerge = require("object-merge");

/**
 * This function will ask the cpaas media service for the list of user's files they have uploaded 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
const listUserMedia = (
  user_uuid = "no user uuid provided",
  accessToken = "null accessToken"
) => {
  const MS = util.getEndpoint("media");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/media`,
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will upload a file to the cpaas media service for the user 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
const uploadFile = (
  file_name = Date.now(), 
  file, 
  user_uuid = "not specified user uuid ", 
  accessToken = "null accessToken"
) => {
  const MS = util.getEndpoint("media");
  //console.log(">>>>>", file )
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${user_uuid}/media`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    formData:{
      "file": {
        value: file,
        options: {
            filename: 'file_name'
        }
    }, 
      "file_name": file_name 
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * This function will ask the cpaas media service to delete a specific user file 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
const deleteMedia = (
  file_id = "no file_id provided",
  accessToken = "null accessToken"
) => {
  const MS = util.getEndpoint("media");

  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/media/${file_id}`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      'x-api-version': `${util.getVersion()}`
    },
    json: true
  };

  return request(requestOptions);
};

module.exports = {
  listUserMedia,
  uploadFile,
  deleteMedia 
};