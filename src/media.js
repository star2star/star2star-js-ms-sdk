/* global require module*/
"use strict";
const request = require("./requestPromise");
const util = require("./utilities");

/**
 * @async
 * @description This function will return media file metadata including a URL
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {number} [offset=0] pagination offset
 * @param {number} [limit=10] pagination limit
 * @param {date} startDatetime UTC format start date
 * @param {date} endDatetime UTC format end date
 * @param {string} sort column sort
 * @param {boolean} includeDeleted included flagged deleted
 * @param {string} fileCategory file category to search for
 * @param {string} filter search by file_name, file_title, or description
 * @param {boolean} includeThumbnails include refs to thumbnail versions
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to list or global media objects
 */
const getGlobalMedia = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  startDatetime,
  endDatetime,
  sort,
  includeDeleted,
  fileCategory,
  filter,
  includeThumbnails,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("media");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/media`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    const optionalParams = {
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      sort: sort,
      include_deleted: includeDeleted,
      file_dategory: fileCategory,
      filter: filter,
      include_thumbnails: includeThumbnails,
    };
    Object.keys(optionalParams).forEach((param) => {
      if (typeof optionalParams[param] !== "undefined") {
        requestOptions.qs[param] = optionalParams[param];
      }
    });
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

/**
 * @async
 * @description This function will return media file metadata including a URL
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [fileUUID="null fileUUID"] - file UUID
 * @param {object} [trace={}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing file meta-data
 */
const getMediaFileUrl = async (
  accessToken = "null accessToken",
  fileUUID = "null fileUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("media");

    const requestOptions = {
      method: "GET",
      uri: `${MS}/media/${fileUUID}`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        content_url: true,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will ask the cpaas media service for the list of user's files they have uploaded.
 * @param {string} [user_uuid="no user uuid provided"] - UUID for user
 * @param {string} [accessToken="null accessToken"] - Access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of groups for this user
 */
const listUserMedia = async (
  user_uuid = "no user uuid provided",
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("media");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/${user_uuid}/media`,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
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
const uploadFile = async (
  file_name = Date.now(),
  file,
  user_uuid = "not specified user uuid ",
  accessToken = "null accessToken",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("media");
    //console.log(">>>>>", file )
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/${user_uuid}/media`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
      },
      formData: {
        file: {
          value: file,
          options: {
            filename: "file_name",
          },
        },
        file_name: file_name,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
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
  try {
    const MS = util.getEndpoint("media");

    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/media/${file_id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "delete media failed",
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details:
          typeof response.body === "object" && response.body !== null
            ? [response.body]
            : [],
      };
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  deleteMedia,
  getGlobalMedia,
  getMediaFileUrl,
  listUserMedia,
  uploadFile,
};
