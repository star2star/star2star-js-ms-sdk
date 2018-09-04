/* global require module*/
"use strict";
const request = require("request-promise");
const Objects = require("./objects");
const util = require("./utilities");
//const objectMerge = require("object-merge");

const validateApplication = (application = {}) => {
  const STATUSES = ["active", "inactive", "deprecated"];

  const rStatus = {
    status: 200,
    message: "valid",
    application: application
  };

  if (typeof application !== "object") {
    rStatus.status = 400;
    rStatus.message = "application must be an object";
  } else {
    
    const vError = [];
    application.hasOwnProperty("name") && application.name.length !== 0 ? vError: vError.push("name missing or empty");
    application.hasOwnProperty("type") && application.type === "starpaas_application" ? vError: vError.push("name missing or empty");
    application.hasOwnProperty("description") && application.description.length !==0 ? vError: vError.push("description missing or empty");
    application.hasOwnProperty("content_type") && application.content_type === "application/json" ? vError: vError.push("content_type missing or incorrect");
    
    if (application.hasOwnProperty("content") && typeof application.content === "object") {
      application.content.hasOwnProperty("account_uuid") ? vError: vError.push("account_uuid missing");
      application.content.hasOwnProperty("admins") ? vError: vError.push("admins missing");   
      if (application.content.hasOwnProperty("versions") && 
        typeof application.content.versions === "object" && 
        Object.keys(application.content.versions).length !== 0) {
        const versions = application.content.versions;
        Object.keys(versions).forEach(version=>{
          RegExp('^([0-9]+[.]){2}[0-9]+$').test(version) ? vError:  vError.push(`version "${version}" invalid format`); //check for major.minor.revision
          
          versions[version].hasOwnProperty("flows") &&
            Array.isArray(versions[version].flows)? vError: vError.push(`version "${version}" flows missing or not array`);
          
          versions[version].hasOwnProperty("workspaces") && 
            Array.isArray(versions[version].workspaces) ? vError: vError.push(`version "${version}" workspaces missing or not array`);

          versions[version].hasOwnProperty("status") && 
            STATUSES.includes(versions[version].status) ? vError : vError.push(`version "${version}" status missing or invalid`);
        });
      } else {
      vError.push("versions missing - empty - or not an object");
      }
    } else {
      vError.push("content missing or not object");
    }
    
    if (vError.length !== 0) {
      const message = vError.join();
      rStatus.status = 400;
      rStatus.message = message;
    }
    
  }
  //console.log("RETURNING RSTATUS",rStatus);  
  return rStatus;
};

/**
 * @async
 * @description This function will create a application object (application_list).
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [name="Missing Application Name"] - name of application object
 * @param {string} [description="application description default"] - description of application object
 * @param {object} [application={} - json object defining application
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
const createApplication = (
  accessToken = "null access_token",
  userUUID,
  body
) => {
  const MS = util.getEndpoint("objects");
  const vApp = validateApplication(body);
  if(vApp.status === 200) {
      const requestOptions = {
        method: "POST",
        uri: `${MS}/users/${userUUID}/objects`,
        body: vApp.application,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-type': 'application/json',
          'x-api-version': `${util.getVersion()}`
        },
        json: true
      };
      return request(requestOptions);
  } else {
    return Promise.reject(vApp);
  }
};

/**
 * @async
 * @description This function will delete application list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [application_uuid="missing application uuid"] - application list UUID
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const deleteApplication = (
  access_token = "null access_token",
  application_uuid = "missing application uuid"
) => {
  return Objects.deleteDataObject(access_token, application_uuid);
};

/**
 * @async
 * @description This function will retrieve application list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [applicationObjectUUID="null uuid" - application list UUID
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
const getApplication = (
  access_token = "null access_token",
  applicationObjectUUID = "null uuid"
) => {
  return Objects.getDataObject(
    access_token,
    applicationObjectUUID,
    true
  );
};

/**
 * @async
 * @description This function will retrieve application list.
 * @param {string} [access_token="null access_token"] - cpaas access token
 * @param {string} [user_uuid="null user_uuid"] - user_uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional array of filters [name, description, status]
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
const listApplications = (
  access_token = "null access_token",
  user_uuid = "null user_uuid",
  offset = 0,
  limit = 10,
  filters = undefined
) => {
  return new Promise((resolve, reject) => {
    Objects.getDataObjectByType(
      user_uuid,
      access_token,
      "starpaas_application",
      true
    ).then(response =>{
      if(filters) {
        response = util.filterResponse(response, filters);
      }
      // Paginate...This pagination is synthetic and limited to the original 100 objects we get from the API
      response = util.paginate(response, offset, limit);
      //console.log("PAGINATED RESPONSE", response);
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will modify application list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [uuid="missing_uuid"] - application list UUID
 * @param {object} [applicationObject={}]
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
const modifyApplication = (
  access_token = "null access_token",
  uuid = "missing_uuid",
  application = {}
) => {
  const vApp = validateApplication(application);
  if (vApp.status === 200) {
    return Objects.updateDataObject(
      access_token,
      uuid,
      vApp.application
    );
  } else {
    return Promise.reject(vApp);
  }
  
};

module.exports = {
  createApplication,
  deleteApplication,
  getApplication,
  listApplications,
  modifyApplication
};