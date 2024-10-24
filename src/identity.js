/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {object} [body="null body"] - JSON object containing new user info
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const createIdentity = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/accounts/${accountUUID}/identities`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: body,
      json: true,
      resolveWithFullResponse: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const identity = response.body;
    // update returns a 202....suspend return until the new resource is ready
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return identity;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will allow you to modify all details of identity except account_uuid, username and external_id, password and provider.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const modifyIdentity = async (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUuid}/modify`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: body,
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
 * @description This function updates properties of an identity
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null userUuid"] - user uuid
 * @param {object} [body="null body"] - property body
 * @param {object} [trace={}] - optional microservice lifecycle headers
 * @returns {Promise} - return a promise containing the updataded idenity
 */
const modifyIdentityProps = async (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUuid}/properties/modify`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: body,
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
 * @description This function will deactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an status data object
 */
const deactivateIdentity = async (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUuid}/deactivate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
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
            : "deactivate identity failed",
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

/**
 * @async
 * @description This function will reactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an status data object
 */
const reactivateIdentity = async (
  accessToken = "null accessToken",
  userUuid = "null userUuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUuid}/reactivate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
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
            : "reactivate identity failed",
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

/**
 * @async
 * @description This function will add aliases to an identity
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {object} [body="null body"] - object containing any combination of email, nickname, or sms alias assignments.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */
const createAlias = async (
  accessToken = "null accessToken",
  userUuid = "null user uuid",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUuid}/aliases`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: body,
      json: true,
      resolveWithFullResponse: true,
    };
    util.addRequestTrace(requestOptions, trace);
    //Returning "ok" here as response object does not contain alias.
    const response = await request(requestOptions);
    if (response.statusCode === 201) {
      return { status: "ok" };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        code: response.statusCode,
        message:
          typeof response.body === "string"
            ? response.body
            : "create alias failed",
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

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {string} [did="null DID"] - sms number to associate with the user
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */
const updateAliasWithDID = async (
  accessToken = "null accessToken",
  userUuid = "null user uuid",
  did = "null DID",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/identities/${userUuid}/aliases/${did}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in and delete the user object matching the user_uuid submitted.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUuid="null uuid"] - uuid for a star2star user
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
const deleteIdentity = async (
  accessToken = "null accessToken",
  userUuid = "null uuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/identities/${userUuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
      resolveWithFullResponse: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    // delete returns a 202....suspend return until the new resource is ready if possible
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function returns a single identity object
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null uuid"] - user uuid
 * @param {object} [trace={}] - optional microservice lifcycle headers
 * @param {string} [include=undefined] - optional query param -"properties" and "alias" are valid values
 * @returns {Promise} - promise resolving to identity object
 */
const getIdentity = async (
  accessToken = "null accessToken",
  userUuid = "null uuid",
  trace = {},
  include = undefined
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/identities/${userUuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    // add include query param if defined
    if (include !== undefined) {
      requestOptions.qs = { include: include };
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
 * @description This function returns array of MFA email/SMS and their active status for use in multifactor auth
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null uuid"] - user uuid
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @returns {Promise} - promise resolving to identity MFA response object containing array of MFA settings
 */
const getIdentityMFA = async (
  accessToken = "null accessToken",
  userUuid = "null uuid",
  offset=0,
  limit=10,
  trace = {},
  include = undefined
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/identities/${userUuid}/mfa`,
      qs: {
        offset: offset,
        limit: limit,
      },
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
 * @description This function will update a user's MFA settings.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUuid="null uuid"] - user uuid
 * @param {string} [type=undefined] - "EMAIL" or "SMS"
 * @param {boolean} [active=false] - true or false
 * @param {string} [source=undefined] - email address or SMS number 
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing the new account MFA policy
 */
const updateIdentityMFA = async (
  accessToken = "null access token",
  userUUID = "null password token",
  type="null type",
  active=false,
  source="null source",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/identities/${userUUID}/mfa/${type}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: {
        active: active,
        source: source
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
 * @description This function will delete an SMS number from the identity MFA 
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [source="null source"] - SMS number to be deleted from MFA
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object confirming success or failure
 */
const deleteIdentityMFASMS = async (
  accessToken = "null access token",
  userUUID = "null password token",
  source="null source",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/identities/${userUUID}/mfa/SMS`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body:{
        source: source
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    await request(requestOptions);
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will initiate proces to add a new source to the identity MFA 
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [type="null type"] - "EMAIL" or "SMS"
 * @param {string} [source="null source"] - SMS number or email to be added to MFA
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object including 'token' to use in confirm
 */
const initiateIdentityMFASetup = async (
  accessToken = "null access token",
  userUUID = "null password token",
  type="null type",
  source="null source",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUUID}/mfa/setup/init`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body:{
        type: type,
        source: source
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
 * @description This function will complete the process to add a new source to the identity MFA by confirming the token and code
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [token="null token"] - token received from InitiateIdentityMFASetup
 * @param {string} [code="null code"] - code sent to the source to be added
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object including 'token' to use in confirm
 */
const confirmIdentityMFASetup = async (
  accessToken = "null access token",
  userUUID = "null password token",
  token="null token",
  code="null code",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/identities/${userUUID}/mfa/setup/confirm`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: {
        token: token,
        code: code,
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
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [pwd="null pwd"] - passowrd for that account
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const login = async (
  accessToken = "null access token",
  email = "null email",
  pwd = "null pwd",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/login`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: {
        email: email,
        password: pwd,
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

//TODO not seeing this call in Tyk...investigate.
/**
 * @async
 * @description This function will return the identity data for the authenticated user.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getMyIdentityData = async (
  accessToken = "null access token",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/me`,
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
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [user_uuid="null user uuid"] - user uuid to lookup
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const getIdentityDetails = async (
  accessToken = "null access token",
  user_uuid = "null user uuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/identities/${user_uuid}?include=alias&include=properties`,
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
 * @description This function will list the identities associated with a given account.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const listIdentitiesByAccount = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/identities`,
      qs: {
        offset: offset,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    //console.log("REQUEST********",requestOptions);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will list the identities associated with a given account.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response using or condition on fliters.
 * @param {boolean} [aggregate=false] - retrieves all results for client side search or pagination
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const listIdentitiesByAccountOrFilter = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  offset = 0,
  limit = 10,
  filters = {},
  aggregate = false,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/identities/v2`,
      qs: {
        offset: offset,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    if (typeof filters === "object" && filters !== null) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }

    let response;
    if (aggregate) {
      const nextTrace = util.generateNewMetaData(trace);
      response = await util.aggregate(request, requestOptions, nextTrace);
    } else {
      util.addRequestTrace(requestOptions, trace);
      response = await request(requestOptions);
    }
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will look up an identity by username.
 * @param {string} [accessToken="null accessToken"]
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const lookupIdentity = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/identities`,
      qs: {
        offset: offset,
        limit: limit,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    //console.log("REQUEST********",requestOptions);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will change a user's password. NOTE THAT THIS IS DIFFERENT FROM RESET PASSWORD function!!
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [email] - user's email address
 * @param {string} ["old_data"] - user's old password
 * @param {string} ["new_data"] - user's new password
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
const changePassword = async (
  accessToken = "null access token",
  email = "null email",
  old_data = "null old_data",
  new_data = "null new_data",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/change_password`,
      body: {
        email: email,
        old_data: old_data,
        new_data: new_data,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      resolveWithFullResponse: true,
    };
    util.addRequestTrace(requestOptions, trace);
    await request(requestOptions);
    
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};


/**
 * @async
 * @description This function will update a user's password. This is part of the 'forgot password' flow.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null passwordToken"] - Reset token received via email
 * @param {object} [body="null body"] - object containing email address and new password
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
const resetPassword = async (
  accessToken = "null access token",
  passwordToken = "null passwordToken",
  body = "null body",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/users/password-tokens/${passwordToken}`,
      body: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will initiate a request for a password reset token via the user email account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [emailAddress="null emailAddress"] - target email address
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
const generatePasswordToken = async (
  accessToken = "null access token",
  emailAddress = "null emailAddress",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/password-tokens`,
      body: {
        email: emailAddress,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      resolveWithFullResponse: true,
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    if (
      response.hasOwnProperty("statusCode") &&
      response.statusCode === 202 &&
      response.headers.hasOwnProperty("location")
    ) {
      await util.pendingResource(
        response.headers.location,
        request,
        requestOptions, //reusing the request options instead of passing in multiple params
        trace
      );
    }
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will validate a password reset token received from email.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null password token"] - password reset token received via email
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object confirming the token and target email
 */
const validatePasswordToken = async (
  accessToken = "null access token",
  password_token = "null password token",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/password-tokens/${password_token}`,
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
 * @description This function will delete an account password policy.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="null accountUUID"] - password reset token received via email
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object confirming success or failure
 */
const deleteAccountPasswordPolicy = async (
  accessToken = "null access token",
  accountUUID = "null password token",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "DELETE",
      uri: `${MS}/accounts/${accountUUID}/password_policy`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    await request(requestOptions);
    return { status: "ok" };
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will get an account's current password policy.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="null accountUUID"] - password reset token received via email
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing the current account password policy
 */
const getAccountPasswordPolicy = async (
  accessToken = "null access token",
  accountUUID = "null password token",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/password_policy`,
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
 * @description This function will get an account's current MFA policy.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="null accountUUID"] - password reset token received via email
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing the account MFA policy
 */
const getAccountMFAPolicy = async (
  accessToken = "null access token",
  accountUUID = "null password token",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/mfa`,
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
 * @description This function will the available password policies.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [include] - optional include, include=rules
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a list of CPaaS IDP password policies
 */
const listPasswordPolicies = async (
  accessToken = "null access token",
  include,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/passwords/policies`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      json: true,
    };
    if (typeof include === "string") {
      requestOptions.qs = { include: include };
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
 * @description This function will update an account's MFA policy.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="null accountUUID"] - password reset token received via email
 * @param {array} [mfaOptions] - array of mfa options to enable for the account
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing the new account MFA policy
 */
const updateAccountMFAPolicy = async (
  accessToken = "null access token",
  accountUUID = "null password token",
  mfaOptions = [],
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/accounts/${accountUUID}/mfa`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: {
        required: mfaOptions,
      },
      json: true,
    };
    util.addRequestTrace(requestOptions, trace);
    if (!Array.isArray(mfaOptions)) {
      throw { code: 400, message: "MFA options not an array" };
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will update an account's password policy.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [accountUUID="null accountUUID"] - password reset token received via email
 * @param {string} [policyUUID="null policy uuid"] - CPaaS password policy uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object containing the new account password policy
 */
const updateAccountPasswordPolicy = async (
  accessToken = "null access token",
  accountUUID = "null password token",
  policyUUID = "null policy uuid",
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/accounts/${accountUUID}/password_policy`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`,
      },
      body: {
        uuid: policyUUID,
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

module.exports = {
  changePassword,
  confirmIdentityMFASetup,
  createAlias,
  createIdentity,
  deactivateIdentity,
  deleteAccountPasswordPolicy,
  deleteIdentity,
  deleteIdentityMFASMS,
  generatePasswordToken,
  getAccountPasswordPolicy,
  getIdentity,
  getIdentityDetails,
  getIdentityMFA,
  getAccountMFAPolicy,
  getMyIdentityData,
  initiateIdentityMFASetup,
  listIdentitiesByAccount,
  listIdentitiesByAccountOrFilter,
  listPasswordPolicies,
  login,
  lookupIdentity,
  modifyIdentity,
  modifyIdentityProps,
  reactivateIdentity,
  resetPassword,
  updateAliasWithDID,
  updateAccountMFAPolicy,
  updateAccountPasswordPolicy,
  updateIdentityMFA,
  validatePasswordToken,
};
