/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");
var ObjectMerge = require("object-merge");

/**
 * This function will ask the cpaas media service for the list of user's files they have uploaded 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
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
 * This function will upload a file to the cpaas media service for the user 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
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
 * This function will ask the cpaas media service to delete a specific user file 
 *
 * @param accessToken - access Token
 * @returns promise for list of groups for this user
 **/
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