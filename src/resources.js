/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function adds a relationship to a CMS resource instance row
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [rowUUID="null rowUUID"] - CMS instance row uuid
 * @param {array} [relationships=[]] - array off relationship uuids
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */
const addRelationshipsToRow = async (
  accessToken = "null accessToken",
  rowUUID = "null instanceUUID",
  relationships = [],
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/relation/${rowUUID}/add`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: relationships,
      json: true,
    };

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function adds a row to a CMS resource instance
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [instanceUUID="null instanceUUID"] - CMS instance uuid
 * @param {object} [body] - row object
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */
const addRowToInstance = async (
  accessToken = "null accessToken",
  instanceUUID = "null instanceUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/instance/${instanceUUID}/row`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: body,
      json: true,
    };

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 *
 * @description This function deletes a CMS resource instance row.
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [instance_uuid="null instance_uuid"] - resource instance uuid
 * @param {string} [row_id="null row_id"] - resource instance row id
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to a CMS instance row object
 * @returns
 */
const deleteResourceInstanceRow = async (
  accessToken = "null accessToken",
  instance_uuid = "null instance_uuid",
  row_id = "null row_id",
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/instance/${instance_uuid}/row/${row_id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [type="null uuid"] - CMS instance type
 * @param {int} [offset=0] - instance rows offset
 * @param {int} [limit=100] - instance rows limit
 * @param {string} [include=undefined] - optional query param "include"
 * @param {string} [expand=undefined] - optional query param "expand"
 * @param {string} [referenceFilter=undefined] - optional query paran "reference_filter"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */
const getResourceInstance = async (
  accessToken = "null accessToken",
  type = "null type",
  offset = 0,
  limit = 100,
  include = undefined,
  expand = undefined,
  referenceFilter = undefined,
  trace = {}
) => {
  try {
    const listResponse = await listResources(
      accessToken,
      type,
      undefined, //not using include here
      trace
    );

    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/${listResponse?.items?.[0]?.uuid}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        ["rows.limit"]: limit,
        ["rows.offset"]: offset,
      },
      json: true,
    };

    // add expand query param if defined
    if (expand !== undefined) {
      requestOptions.qs.expand = expand;
    }

    // add include query param if defined
    if (include !== undefined) {
      requestOptions.qs.include = include;
    }

    // add reference filter query param if defined
    if (referenceFilter !== undefined) {
      requestOptions.qs["reference_filter"] = referenceFilter;
    }

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function returns CMS resource instance rows by instance uuid
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [instanceUUID="null instanceUUID"] - CMS instance uuid
 * @param {int} [offset=0] - instance rows offset
 * @param {int} [limit=100] - instance rows limit
 * @param {string} [include=undefined] - optional query param "include"
 * @param {string} [expand=undefined] - optional query param "expand"
 * @param {string} [referenceFilter=undefined] - optional query paran "reference_filter"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to instance object
 */
const getResourceInstanceByUUID = async (
  accessToken = "null accessToken",
  instanceUUID = "null instanceUUID",
  offset = 0,
  limit = 100,
  include = undefined,
  expand = undefined,
  referenceFilter = undefined,
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/${instanceUUID}/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {
        ["rows.limit"]: limit,
        ["rows.offset"]: offset,
      },
      json: true,
    };

    // add expand query param if defined
    if (expand !== undefined) {
      requestOptions.qs.expand = expand;
    }

    // add include query param if defined
    if (include !== undefined) {
      requestOptions.qs.include = include;
    }

    // add reference filter query param if defined
    if (referenceFilter !== undefined) {
      requestOptions.qs["reference_filter"] = referenceFilter;
    }

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 *
 * @description This function returns a CMS resource instance row.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [instance_uuid="null instance_uuid"]
 * @param {string} [row_id="null row_id"]
 * @param {string} [include="content"]
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to a CMS instance row object
 * @returns
 */
const getResourceInstanceRow = async (
  accessToken = "null accessToken",
  instance_uuid = "null instance_uuid",
  row_id = "null row_id",
  include = "content",
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/${instance_uuid}/row/${row_id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: { include: include },
      json: true,
    };

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function returns CMS resource instance rows
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [type=undefined] - optional query param "type"
 * @param {string} [include=undefined] - optional query param "include"
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @param {string} [account_uuid=undefined] - optional query param "account_uuid"
 * @returns {Promise} - promise resolving to identity object
 */
const listResources = async (
  accessToken = "null accessToken",
  type = undefined,
  include = undefined,
  trace = {},
  account_uuid = undefined
) => {
  try {
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/instance/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      qs: {},
      json: true,
    };

    // add include query param if defined
    if (typeof type === "string") {
      requestOptions.qs.type = type;
    }

    // add include query param if defined
    if (typeof include === "string") {
      requestOptions.qs.include = include;
    }

    if (typeof account_uuid === "string") {
      requestOptions.qs.account_uuid = account_uuid;
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
 * @description This function register an account CMS resource template
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [account_uuid=undefined] -  account uuid
 * @param {string} [name=undefined] -  name
 * @param {string} [description=undefined] -  description
 * @param {object} [schema=undefined] -  schema
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */
const registerAccountTemplate = async (
  accessToken = "null accessToken",
  account_uuid = undefined,
  name = undefined,
  description = undefined,
  schema = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("resources");
    const body = {
      name,
      description,
      schema,
    };
    const requestOptions = {
      method: "POST",
      uri: `${MS}/account/${account_uuid}/register`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
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
 * @description This function register an user CMS resource template
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [user_uuid=undefined] -  user uuid
 * @param {string} [name=undefined] -  name
 * @param {string} [description=undefined] -  description
 * @param {object} [schema=undefined] -  schema
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */
const registerUserTemplate = async (
  accessToken = "null accessToken",
  user_uuid = undefined,
  name = undefined,
  description = undefined,
  schema = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("resources");
    const body = {
      name,
      description,
      schema,
    };
    const requestOptions = {
      method: "POST",
      uri: `${MS}/user/${user_uuid}/register`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
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
 * @description This function create an instance from a resource template
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [template_uuid=undefined] -  template uuid
 * @param {string} [name=undefined] -  name
 * @param {string} [description=undefined] -  description
 * @param {string} [type=undefined] -  optional type
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */
const createInstance = async (
  accessToken = "null accessToken",
  template_uuid = undefined,
  name = undefined,
  description = undefined,
  type = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("resources");
    const body = {
      template_uuid,
      name,
      description,
    };
    // optional parameter
    if (type !== undefined) {
      body.type = type;
    }

    const requestOptions = {
      method: "POST",
      uri: `${MS}/instance`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
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
 * @description This function searches a CMS resource.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [resourceUUID="null resourceUUID"] resource uuid
 * @param {object} [body={}] search expression object
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise<object>} - promise resolving to a CMS instance row object
 */
const searchResourceInstance = async (
  accessToken = "null accessToken",
  resourceUUID = "null resource_uuid",
  body = {},
  trace = {}
) => {
  try {
    const nextTrace = util.generateNewMetaData(trace);
    const MS = util.getEndpoint("resources");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/instance/${resourceUUID}/search`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: body,
      json: true,
    };

    util.addRequestTrace(requestOptions, nextTrace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  addRelationshipsToRow,
  addRowToInstance,
  createInstance,
  deleteResourceInstanceRow,
  getResourceInstance,
  getResourceInstanceByUUID,
  getResourceInstanceRow,
  listResources,
  registerAccountTemplate,
  registerUserTemplate,
  searchResourceInstance
};
