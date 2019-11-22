/*global module require */
"use strict";

const util = require("./utilities");

const request = require("request-promise");
/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {object} [body="null body"] - JSON object containing new user info
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


const createIdentity = async function createIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/accounts/").concat(accountUUID, "/identities"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: body,
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    const identity = response.body; // update returns a 202....suspend return until the new resource is ready

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202 && response.headers.hasOwnProperty("location")) {
      await util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
      trace, identity.hasOwnProperty("resource_status") ? identity.resource_status : "complete");
    }

    return identity;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const modifyIdentity = async function modifyIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/identities/").concat(userUuid, "/modify"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: body,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const modifyIdentityProps = async function modifyIdentityProps() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/identities/").concat(userUuid, "/properties/modify"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: body,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const deactivateIdentity = async function deactivateIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/identities/").concat(userUuid, "/deactivate"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.statusCode === 204) {
      return {
        status: "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "deactivate identity failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const reactivateIdentity = async function reactivateIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/identities/").concat(userUuid, "/reactivate"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.statusCode === 204) {
      return {
        status: "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "reactivate identity failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const createAlias = async function createAlias() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/identities/").concat(userUuid, "/aliases"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: body,
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace); //Returning "ok" here as response object does not contain alias.

    const response = await request(requestOptions);

    if (response.statusCode === 201) {
      return {
        status: "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "create alias failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const updateAliasWithDID = async function updateAliasWithDID() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let did = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null DID";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: "".concat(MS, "/identities/").concat(userUuid, "/aliases/").concat(did),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202) {
      if (response.headers.hasOwnProperty("location")) {
        await util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
        trace, response.hasOwnProperty("resource_status") ? response.resource_status : "complete");
      }

      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "update alias with DID failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const deleteIdentity = async function deleteIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "DELETE",
      uri: "".concat(MS, "/identities/").concat(userUuid),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true,
      resolveWithFullResponse: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions); // delete returns a 202....suspend return until the new resource is ready if possible

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202) {
      if (response.headers.hasOwnProperty("location")) {
        await util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
        trace, "deleting");
      }

      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "delete identity failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function returns a single identity object
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [userUuid="null uuid"] - user uuid
 * @param {objet} [trace={}] - optional microservice lifcycle headers
 * @returns {Promise} - promise resolving to identity object
 */


const getIdentity = async function getIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/identities/").concat(userUuid),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const login = async function login() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
  let pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null pwd";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/login"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: {
        email: email,
        password: pwd
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
}; //TODO not seeing this call in Tyk...investigate.

/**
 * @async
 * @description This function will return the identity data for the authenticated user.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */


const getMyIdentityData = async function getMyIdentityData() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/me"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const getIdentityDetails = async function getIdentityDetails() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/identities/").concat(user_uuid, "?include=alias&include=properties"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const listIdentitiesByAccount = async function listIdentitiesByAccount() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/accounts/").concat(accountUUID, "/identities"),
      qs: {
        offset: offset,
        limit: limit
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    } //console.log("REQUEST********",requestOptions);


    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const lookupIdentity = async function lookupIdentity() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/identities"),
      qs: {
        offset: offset,
        limit: limit
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    } //console.log("REQUEST********",requestOptions);


    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};
/**
 * @async
 * @description This function will update a user's password.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null passwordToken"] - Reset token received via email
 * @param {object} [body="null body"] - object containing email address and new password
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */


const resetPassword = async function resetPassword() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let passwordToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null passwordToken";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "PUT",
      uri: "".concat(MS, "/users/password-tokens/").concat(passwordToken),
      body: body,
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202) {
      if (response.headers.hasOwnProperty("location")) {
        await util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
        trace, response.hasOwnProperty("resource_status") ? response.resource_status : "complete");
      }

      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "reset password failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const generatePasswordToken = async function generatePasswordToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let emailAddress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null emailAddress";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/users/password-tokens"),
      body: {
        email: emailAddress
      },
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      resolveWithFullResponse: true,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);

    if (response.hasOwnProperty("statusCode") && response.statusCode === 202) {
      if (response.headers.hasOwnProperty("location")) {
        await util.pendingResource(response.headers.location, requestOptions, //reusing the request options instead of passing in multiple params
        trace, response.hasOwnProperty("resource_status") ? response.resource_status : "complete");
      }

      return {
        "status": "ok"
      };
    } else {
      // this is an edge case, but protects against unexpected 2xx or 3xx response codes.
      throw {
        "code": response.statusCode,
        "message": typeof response.body === "string" ? response.body : "generate password token failed",
        "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
        "details": typeof response.body === "object" && response.body !== null ? [response.body] : []
      };
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
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


const validatePasswordToken = async function validatePasswordToken() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let password_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null password token";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = util.getEndpoint("identity");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/users/password-tokens/").concat(password_token),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  createAlias,
  createIdentity,
  modifyIdentity,
  modifyIdentityProps,
  reactivateIdentity,
  deactivateIdentity,
  updateAliasWithDID,
  deleteIdentity,
  login,
  getMyIdentityData,
  listIdentitiesByAccount,
  lookupIdentity,
  getIdentity,
  getIdentityDetails,
  generatePasswordToken,
  resetPassword,
  validatePasswordToken
};