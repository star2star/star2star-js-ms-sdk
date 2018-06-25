/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");
var ObjectMerge = require("object-merge");

/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [user_uuid="no user uuid provided"] - UUID for user
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of groups for this user
 */
var listUserMedia = function listUserMedia() {
  var user_uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no user uuid provided";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";

  var MS = util.getEndpoint("media");

  var requestOptions = {
    method: "GET",
    uri: MS + "/users/" + user_uuid + "/media",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will upload a file to the cpaas media service for the user.
 * @param {string} [file_name=Date.now()] - File name.
 * @param {formData} file - File to be uploaded
 * @param {string} [user_uuid="not specified user uuid "]
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @returns {Promise<object>} - Promise resolving to a data object containing upload attributes.
 */
var uploadFile = function uploadFile() {
  var file_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();
  var file = arguments[1];
  var user_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "not specified user uuid ";
  var accessToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null accessToken";

  var MS = util.getEndpoint("media");
  //console.log(">>>>>", file )
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/" + user_uuid + "/media",
    headers: {
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    formData: {
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
 * @async
 * @description This function will ask the cpaas media service to delete a specific user file.
 * @param {string} [file_id="no file_id provided"] - File ID
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
var deleteMedia = function deleteMedia() {
  var file_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no file_id provided";
  var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accessToken";

  var MS = util.getEndpoint("media");

  var requestOptions = {
    method: "DELETE",
    uri: MS + "/media/" + file_id,
    headers: {
      "Authorization": "Bearer " + accessToken,
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

module.exports = {
  listUserMedia: listUserMedia,
  uploadFile: uploadFile,
  deleteMedia: deleteMedia
};