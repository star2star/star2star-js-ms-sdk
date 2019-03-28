/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * @async
 * @description This function will return media file metadata including a URL
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [fileUUID="null fileUUID"] - file UUID
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing file meta-data
 */
const getMediaFileUrl = (
  accessToken = "null accessToken",
  fileUUID = "null fileUUID",
  trace = {}
) => {
  const MS = util.getEndpoint("media");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/media/${fileUUID}`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    qs: {
      "content_url": true
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};


/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [user_uuid="no user uuid provided"] - UUID for user
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of groups for this user
 */
const listUserMedia = (
  user_uuid = "no user uuid provided",
  accessToken = "null accessToken",
  trace = {}
) => {
  const MS = util.getEndpoint("media");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/users/${user_uuid}/media`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will upload a file to the cpaas media service for the user.
 * @param {string} [file_name=Date.now()] - File name.
 * @param {formData} file - File to be uploaded
 * @param {string} [user_uuid="not specified user uuid "]
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing upload attributes.
 */
const uploadFile = (
  file_name = Date.now(),
  file,
  user_uuid = "not specified user uuid ",
  accessToken = "null accessToken",
  trace = {}
) => {
  const MS = util.getEndpoint("media");
  //console.log(">>>>>", file )
  const requestOptions = {
    method: "POST",
    uri: `${MS}/users/${user_uuid}/media`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    formData: {
      file: {
        value: file,
        options: {
          filename: "file_name"
        }
      },
      file_name: file_name
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas media service to delete a specific user file.
 * @param {string} [file_id="no file_id provided"] - File ID
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteMedia = async (
  file_id = "no file_id provided",
  accessToken = "null accessToken",
  trace = {}
) => {
  const MS = util.getEndpoint("media");

  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/media/${file_id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-version": `${util.getVersion()}`
    },
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);
  if(response.statusCode === 204) {
    return {"status": "ok"};
  } else {
    return {"status": "failed"};
  }
};

module.exports = {
  deleteMedia,
  getMediaFileUrl,
  listUserMedia,
  uploadFile,
  
};
