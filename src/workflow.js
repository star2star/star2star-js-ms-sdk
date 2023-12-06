/* global require module*/
"use strict";

const request = require("./requestPromise");
const util = require("./utilities");

/**
 * @async
 * @description This function will create a new workflow template
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {object} [body="null body"] - workflow template body
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const createWorkflowTemplate = async (
  accessToken = "null access token",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/workflows`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will cancel a specific running workflow instance
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [wfIntanceUUID="null wfInstanceUUID"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const cancelWorkflow = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  wfIntanceUUID = "null wfInstanceUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/workflows/${wfTemplateUUID}/instances/${wfIntanceUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if(response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "cancel workflow failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
      };
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will delete a workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [version="null version"] - workflow version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const deleteWorkflowTemplate = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  version = "null version",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/workflows/${wfTemplateUUID}/${version}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if(response.statusCode === 204) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete workflow template failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace")
          ? requestOptions.headers.trace 
          : undefined,
        "details": typeof response.body === "object" && response.body !== null
          ? [response.body]
          : []
      };
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

 /**
  *
  * @async
  * @description This function will start a new workflow with a specific return type.
  * @param {string} [accessToken="null accessToken"] CPaaS access token
  * @param {string} [wfTemplateUUID="null wfTemplateUUID"] workflow template uuid
  * @param {string} [workflowVarsPath="null workflowVarsPath"] json dot notation path to workflow vars to return
  * @param {string} [responseContentType="application/json"] response content type
  * @param {object} [inpputVars={}] workflow input vars
  * @param {object} [trace={}] optional microservice lifecycle trace headers
  * @param {string} [startState=undefined] The Start State to start with 
  * @returns {Promise} promise resolving to data in format of response content type matching workflow vars path
  */
 const execWorkflow = async (
  accessToken,
  wfTemplateUUID = "null wfTemplateUUID",
  groupUUID = "",
  workflowVarsPath = "",
  responseContentType = "application/json",
  inputVars = {},
  trace = {},
  startState = undefined
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/workflows/${wfTemplateUUID}/instances/exec`,
      body: {
        workflow_vars_path: workflowVarsPath,
        response_content_type: responseContentType,
        input_vars: inputVars
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      resolveWithFullResponse: true,
      json: true
    };
    
    // add a group uuid if sepcified
    if(typeof groupUUID === "string" && groupUUID.length > 0){
      requestOptions.body.group_uuid = groupUUID;
    }

    // start State 
    if (startState && startState.length > 0) {
      requestOptions.body.start_state = startState;
    }
    
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get a specific workflow instance
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [wfInstanceUUID="null wfInstanceUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getRunningWorkflow = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  wfInstanceUUID = "null wfTemplateUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/workflows/${wfTemplateUUID}/instances/${wfInstanceUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowGroup = async (
  accessToken = "null access token",
  wfGroupUUID = "null wfTemplateUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups/${wfGroupUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {boolean} [show_master=false] - show master (defaults to false)
 * @param {boolean} [show_children=false] - show children (defaults to false)
 * @param {boolean} [show_data=false] - show data (defaults to false)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowGroupFiltered = async (
  accessToken = "null access token",
  wfGroupUUID = "null wfGroupUUID",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups/${wfGroupUUID}/filter`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: { },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get workflow group master by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowGroupMaster = async (
  accessToken = "null access token",
  wfGroupUUID = "null wfGroupUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups/${wfGroupUUID}/filter/master`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get workflow group data by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowGroupData = async (
  accessToken = "null access token",
  wfGroupUUID = "null wfGroupUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups/${wfGroupUUID}/filter/data`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get workflow group children by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowGroupChildren = async (
  accessToken = "null access token",
  wfGroupUUID = "null wfGroupUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups/${wfGroupUUID}/filter/children`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get workflow group child by child uuid
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {string} [wfChildUUID="null wfChildUUID"] - child uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowGroupChild = async (
  accessToken = "null access token",
  wfGroupUUID = "null wfGroupUUID",
  wfChildUUID = "null wfChildUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups/${wfGroupUUID}/filter/children/${wfChildUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get a filtered execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {boolean} [show_workflow_vars=false] - show workflow_vars (defaults to false)
 * @param {boolean} [show_incoming_data=false] - show incoming_data (defaults to false)
 * @param {boolean} [show_transition_results=false] - show transition results (defaults to false)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWfInstanceHistory = async (
  accessToken = "null access_token",
  wfInstanceUUID = "null wfTemplateUUID",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/history/${wfInstanceUUID}/filter`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: { },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get filtered workflow vars execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWfInstanceWorkflowVars = async (
  accessToken = "null access token",
  wfInstanceUUID = "null wfTemplateUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/history/${wfInstanceUUID}/filter/workflow_vars`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get filtered incoming data execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWfInstanceIncomingData = async (
  accessToken = "null access token",
  wfInstanceUUID = "null wfTemplateUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/history/${wfInstanceUUID}/filter/incoming_data`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will get filtered transaction results execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {string} [wfTransitionUUID="null instance_uuid"] - workflow instance uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWfInstanceResults = async (
  accessToken = "null access token",
  wfInstanceUUID = "null wfTemplateUUID",
  transitionUUID = "null wfTransitionUUID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/history/${wfInstanceUUID}/filter/${transitionUUID}/results`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function returns a history of a template execution.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional filters, incuding start_datetime and end_datetime (RFC3339 format), and version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWfTemplateHistory = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/history`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        template_uuid: wfTemplateUUID,
        offset: offset,
        limit: limit,
        short: true
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    let aggregate = false;
    if (filters) {
      if(filters.hasOwnProperty("aggregate")){
        if(typeof filters.aggregate === "boolean"){
          aggregate = filters.aggregate;
        }
        delete filters.aggregate;
      }
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    } 
    let response;
    if(aggregate){
      response = await util.aggregate(request, requestOptions, trace);
    } else {
      response = await request(requestOptions);
    }
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get a specific workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] workflow template uuid
 * @param {array} [filters=undefined] - optional filters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const getWorkflowTemplate = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/workflows/${wfTemplateUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        if (filter === "version") {
          requestOptions.uri += `/${filters[filter]}`;
        } else {
          !requestOptions.hasOwnProperty("qs") && (requestOptions.qs = {}); //init if not there
          requestOptions.qs[filter] = filters[filter];
        }
      });
    }

    if (
      filters &&
      typeof filters["version"] !== "undefined" &&
      typeof filters["expand"] !== "undefined"
    ) {
      throw {
        "code": 400,
        "message": "version and expand cannot be included in the same request"
      };
    } else {
      const response = await request(requestOptions);
      return response;
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function lists running workflow instances by template uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {string} [version=undefined] - optional filter by version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const listRunningWorkflows = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/workflows/${wfTemplateUUID}/instances`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset: offset,
        limit: limit
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will return a list of group objects
 * @param {string} [accessToken="null accesToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - object containing optional filters (start_datetime,end_datetime,template_uuid)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const listWorkflowGroups = async (
  accessToken = "null accesToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/groups`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset: offset,
        limit: limit
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function lists configured workflow templates
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filter=undefined] - option filter object status or type 
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const listWorkflowTemplates = async (
  accessToken = "null access token",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/workflows`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        offset: offset,
        limit: limit
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function updates a workflow template definition.
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const modifyWorkflowTemplate = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/workflows/${wfTemplateUUID}`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function will start a new workflow based on the selected template.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template UUID
 * @param {object} [body="null body"] - workflow template body
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
const startWorkflow = async (
  accessToken,
  wfTemplateUUID = "null wfTemplateUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/workflows/${wfTemplateUUID}/instances`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
  * @description Same as startWorkflow, but ms request body is composed from params
  * @param {string} [access_token="no access token provided"] CPaaS access token
  * @param {string} [workflow_uuid="no workflow temaplte uuid provided"] workflow template to start
  * @param {object} [input_vars={}] workflow variable to inject at start of runtime
  * @param {boolean} [return_workflow_vars=true] include workflow runtime vars in response
  * @param {boolean} [wait_until_finish=false] run workflow sync, waiting until complete to respond to request
  * @param {string} version optional semver of workflow template to use
  * @param {string} start_state optional start state
  * @param {string} group_uuid optional group uuid
  * @param {string} group_name optional group name
  * @param {object} [trace={}] optional CPaaS microservice lifecycle headers
  * @returns
  */
 const startWorkflowFlat = async (
  access_token = "no access token provided",
  workflow_uuid = "no workflow temaplte uuid provided",
  input_vars = {},
  return_workflow_vars = true,
  wait_until_finish = false,
  version,
  start_state,
  group_uuid,
  group_name,
  trace = {}
) => {
  try {
    // default params
    const body = {
      input_vars: typeof input_vars === "object" && input_vars !== null ? input_vars : {}
    };

    // optional params
    const optionalParams = {
      group_uuid: group_uuid,
      group_name: group_name,
      return_workflow_vars: return_workflow_vars,
      start_state: start_state,
      version: version,
      wait_until_finish: wait_until_finish
    }
    Object.keys(optionalParams).forEach(option =>{
      if(typeof optionalParams[option] !== "undefined"){
        body[option] = optionalParams[option];
      }
    });
    const MS = util.getEndpoint("workflow");
    const baseURL = `${MS}/workflows/${workflow_uuid}/instances`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      body: undefined
    };
    try {
      options.body = JSON.stringify(body);
    } catch (e){
      throw {
        code: 400,
        message: "supplied parameters could not assembled into start request",
        details: [JSON.stringify(util.formatError(e))]
      };
    }
    // make the call
    const response = await fetch(baseURL, util.addRequestTrace(options, trace));
    if (response.ok === false) {
      const error = await util.formatFetchError(response);
      throw error;
    } else {
      const json = await response.json();
      return json;
    }
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function updates the status and data for a workflow group
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [groupUUID="null group uuid"] - workflow group uuid
 * @param {string} [status="null status"] - workflow instance status [ active, complete, cancelled ]
 * @param {object} [data="null data"] - workflow instance data object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to updated workflow group
 */
const updateWorkflowGroup = async (
  accessToken = "null access token",
  groupUUID = "null group uuid",
  status = "null status",
  data = "null data",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/groups/${groupUUID}`,
      body: {
        status: status,
        data: data
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      json: true
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
 * @description This function provides a way to search workflow history 
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [start_datetime="2022-05-12T14:19:00.000Z"] - start datetime(RFC3339 format)
 * @param {string} [end_datetime="2022-05-12T14:19:00.000Z"] - end datetime (RFC3339 format)
 * @param {string} [search="null"] - search values can be comma seperated
 * @param {number} [limit=50] - pagination limit ... max 50
 * @param {array} [filters=undefined] - optional filters, version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */
 const searchWFHistory = async (
  accessToken = "null access token",
  wfTemplateUUID = "null wfTemplateUUID",
  start_datetime = "2022-05-12T14:19:00.000Z",
  end_datetime="2022-05-12T14:19:00.000Z",
  search = "null",
  limit = 50,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("workflow");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/history`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
      },
      qs: {
        template_uuid: wfTemplateUUID,
        limit: limit,
        search: search,
        start_datetime: start_datetime, 
        end_datetime: end_datetime
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    let aggregate = false;
    if (filters) {
      if(filters.hasOwnProperty("aggregate")){
        if(typeof filters.aggregate === "boolean"){
          aggregate = filters.aggregate;
        }
        delete filters.aggregate;
      }
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    } 
    let response;
    if(aggregate){
      response = await util.aggregate(request, requestOptions, trace);
    } else {
      response = await request(requestOptions);
    }
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  createWorkflowTemplate,
  cancelWorkflow,
  deleteWorkflowTemplate,
  execWorkflow,
  getRunningWorkflow,
  getWfInstanceHistory,
  getWfTemplateHistory,
  getWorkflowGroup,
  getWorkflowGroupFiltered,
  getWorkflowGroupMaster,
  getWorkflowGroupData,
  getWorkflowGroupChildren,
  getWorkflowGroupChild,
  getWorkflowTemplate,
  listRunningWorkflows,
  listWorkflowGroups,
  listWorkflowTemplates,
  modifyWorkflowTemplate,
  startWorkflow,
  startWorkflowFlat,
  updateWorkflowGroup,
  getWfInstanceWorkflowVars,
  getWfInstanceIncomingData,
  getWfInstanceResults,
  searchWFHistory
};
