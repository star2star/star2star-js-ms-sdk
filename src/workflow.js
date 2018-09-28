/* global require module*/
"use strict";
const request = require("request-promise");
const util = require("./utilities");

/**
 * @async
 * @description This function will create a new workflow template
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {object} [body="null body"] - workflow template body
 * @returns {Promise}
 */
const createWorkflowTemplate = ( accessToken = "null access token", body = "null body") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/workflows`,
    body: body,
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-type': 'application/json',
    'x-api-version': `${util.getVersion()}`
    },
    json: true
    };
  return request(requestOptions);
}; 

/**
 * @async
 * @description This function will cancel a specific running workflow instance
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [wfIntanceUUID="null wfInstanceUUID"]
 * @returns {Promise}
 */
const cancelWorkflow = (accessToken = "null access token",  wfTemplateUUID = "null wfTemplateUUID", wfIntanceUUID = "null wfInstanceUUID") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances/${wfIntanceUUID}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
    };
  return new Promise (function (resolve, reject){
    request(requestOptions).then(function(responseData){
        responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
    }).catch(function(error){
        reject(error);
    });
  });
};

/**
 * @async
 * @description This function will delete a workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [version="null version"] - workflow version
 * @returns {Promise}
 */
const deleteWorkflowTemplate = (accessToken = "null access token",  wfTemplateUUID = "null wfTemplateUUID", version = "null version") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/workflows/${wfTemplateUUID}/${version}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
    };

    return new Promise (function (resolve, reject){
      request(requestOptions).then(function(responseData){
          responseData.statusCode === 204 ?  resolve({"status":"ok"}): reject({"status":"failed"});
      }).catch(function(error){
          reject(error);
      });
    });
};

/**
 * @async
 * @description This function will get a specific workflow instance
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [wfInstanceUUID="null wfInstanceUUID"] - workflow uuid
 * @returns {Promise}
 */
const getRunningWorkflow = (accessToken = "null access token", wfTemplateUUID = "null wfTemplateUUID", wfInstanceUUID = "null wfTemplateUUID") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances/${wfInstanceUUID}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
      },
    json: true
    };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @returns {Promise}
 */
const getWorkflowGroup = (accessToken = "null access token", wfGroupUUID = "null wfTemplateUUID") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups/${wfGroupUUID}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
      },
    json: true
    };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get an execution history for a specific workflow uuid
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow uuid
 * @returns {Promise}
 */
const getWfInstanceHistory = (accessToken = "null access token", wfInstanceUUID = "null wfTemplateUUID") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/history/${wfInstanceUUID}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
      },
    json: true
    };

  return request(requestOptions);
};


/**
 * @async
 * @description This function returns a history of a template execution.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional filters, incuding start_datetime and end_datetime (RFC3339 format), and version
 * @returns {Promise}
 */
const getWfTemplateHistory = (accessToken = "null access token", wfTemplateUUID = "null wfTemplateUUID", offset = 0, limit = 10, filters = undefined) => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/history`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "template_uuid": wfTemplateUUID,
      "offset": offset,
      "limit": limit
    },
    json: true
    };

    if(filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get a specific workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] workflow template uuid
 * @param {array} [filters=undefined] - optional filters
 * @returns {Promise}
 */
const getWorkflowTemplate = (accessToken = "null access token", wfTemplateUUID = "null wfTemplateUUID", filters = undefined) => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows/${wfTemplateUUID}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
      },
    json: true
    };

    if(filters) {
      Object.keys(filters).forEach(filter => {
        if(filter === "version") {
          requestOptions.uri += `/${filters[filter]}`;
        } else {
          !requestOptions.hasOwnProperty("qs") && (requestOptions.qs = {}); //init if not there
          requestOptions.qs[filter] = filters[filter];
        }
      });
    }

  return new Promise (function (resolve, reject){
    if (typeof filters["version"] !== "undefined" && typeof filters["expand"] !== "undefined") {
      reject({"status":"failed", "message":"version and expand cannot be included in the same request"});
    } else {
      request(requestOptions).then(responseData => {
        resolve(responseData);
      }).catch(function(error){
        reject(error);
      });
    } 
  });
};

/**
 * @async
 * @description This function lists running workflow instances by template uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {string} [version=undefined] - optional filter by version
 * @returns {Promise}
 */
const listRunningWorkflows = (accessToken = "null access token", wfTemplateUUID = "null wfTemplateUUID", offset = 0, limit = 10, filters = undefined) => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "offset": offset,
      "limit": limit
    },
    json: true
    };

    if(filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

  return request(requestOptions);
};

/**
 * @async
 * @description This function will return a list of group objects
 * @param {string} [accessToken="null accesToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - object containing optional filters (start_datetime,end_datetime,template_uuid)
 * @returns
 */
const listWorkflowGroups = (accessToken = "null accesToken", offset = 0, limit = 10, filters = undefined) => {
  const MS = util.getEndpoint("workflow");

  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "offset": offset,
      "limit": limit
    },
    json: true
    };

    if(filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

  return request(requestOptions);
};

/**
 * @async
 * @description This function lists configured workflow templates
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {string} [status=undefined] - option status filter
 * @returns {Promise}
 */
const listWorkflowTemplates = (accessToken = "null access token", offset = 0, limit = 10, filters = undefined) => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
    },
    qs: {
      "offset": offset,
      "limit": limit
    },
    json: true
    };

    if(filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

  return request(requestOptions);
};

/**
 * @async
 * @description This function updates a workflow template definition. 
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [body="null body"]
 * @returns
 */
const modifyWorkflowTemplate = ( accessToken = "null access token", wfTemplateUUID = "null wfTemplateUUID", body = "null body") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/workflows/${wfTemplateUUID}`,
    body: body,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${util.getVersion()}`
      },
    json: true
    };
  return request(requestOptions);
}; 

/**
 * @async
 * @description This function will start a new workflow baed on the selected template.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template UUID
 * @param {object} [body="null body"] - workflow template body
 * @returns {Promise}
 */
const startWorkflow = (accessToken, wfTemplateUUID = "null wfTemplateUUID", body = "null body") => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances`,
    body: body,
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-type': 'application/json',
    'x-api-version': `${util.getVersion()}`
    },
    json: true
    };
  return request(requestOptions);
};

/**
 * @async
 * @description This function updates the status and data for a workflow group
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [groupUUID="null group uuid"] - workflow group uuid
 * @param {string} [status="null status"] - workflow instance status [ active, complete, cancelled ]
 * @param {object} [data="null data"] - workflow instance data object 
 * @returns {Promise} - promise resolving to updated workflow group
 */
const updateWorkflowGroup = (
  accessToken = "null access token",
  groupUUID = "null group uuid",
  status = "null status",
  data = "null data"
) => {
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/groups/${groupUUID}`,
    body: {
      "status": status,
      "data": data
    },
    headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-type': 'application/json',
    'x-api-version': `${util.getVersion()}`
    },
    json: true
    };
  return request(requestOptions);
};

module.exports = {
  createWorkflowTemplate,
  cancelWorkflow,
  deleteWorkflowTemplate,
  getRunningWorkflow,
  getWfInstanceHistory,
  getWfTemplateHistory,
  getWorkflowGroup,
  getWorkflowTemplate,
  listRunningWorkflows,
  listWorkflowGroups,
  listWorkflowTemplates,
  modifyWorkflowTemplate,
  startWorkflow,
  updateWorkflowGroup
};