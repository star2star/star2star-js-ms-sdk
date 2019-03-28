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


const getMediaFileUrl = function getMediaFileUrl() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let fileUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null fileUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("media");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/media/").concat(fileUUID),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
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


const listUserMedia = function listUserMedia() {
  let user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("media");
  const requestOptions = {
    method: "GET",
    uri: "".concat(MS, "/users/").concat(user_uuid, "/media"),
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
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


const uploadFile = function uploadFile() {
  let file_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();
  let file = arguments.length > 1 ? arguments[1] : undefined;
  let user_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "not specified user uuid ";
  let accessToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null accessToken";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = util.getEndpoint("media"); //console.log(">>>>>", file )

  const requestOptions = {
    method: "POST",
    uri: "".concat(MS, "/users/").concat(user_uuid, "/media"),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
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


const deleteMedia = async function deleteMedia() {
  let file_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no file_id provided";
  let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("media");
  const requestOptions = {
    method: "DELETE",
    uri: "".concat(MS, "/media/").concat(file_id),
    headers: {
      Authorization: "Bearer ".concat(accessToken),
      "x-api-version": "".concat(util.getVersion())
    },
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  const response = await request(requestOptions);

  if (response.statusCode === 204) {
    return {
      "status": "ok"
    };
  } else {
    return {
      "status": "failed"
    };
  }
};

module.exports = {
  deleteMedia,
  getMediaFileUrl,
  listUserMedia,
  uploadFile
};