/*global module require */
"use strict";
const Util = require("./utilities");
const request = require("./requestPromise");

/**
 * @description This fuction will activate a pending async entitlement
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - CPaaS user uuid
 * @param {object} [entitlementUUID="null entitlementUUID"] - entitlement uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to an acknowledgement of the entitlement being activated
 */
const activateUserEntitlement = async (
  accessToken = "null accessToken",
  userUUID = "null userUUID",
  entitlementUUID = "null entitlementUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/users/${userUUID}/entitlements/${entitlementUUID}/activate`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: {},
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This function returns a single entitlement product
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [productUUID="null productUUID"] - product UUID
 * @param {object} [trace={}] - option CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a product object
 */
const getProduct = async (
  accessToken = "null accessToken",
  productUUID = "null productUUID",
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/products/${productUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This fuction returns a list of products
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - optional filters object {"key": "value"}
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a list of products
 */
const getProducts = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/products`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
      qs: {},
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    requestOptions.qs.offset = offset;
    requestOptions.qs.limit = limit;

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This fuction returns a product by application uuid
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - optional filters object {"key": "value"}
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a list of products
 */
const getProductByApplicationUuid = async (
  accessToken = "null accessToken",
  offset = 0,
  limit = 10,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/products`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
      qs: {},
    };
    Util.addRequestTrace(requestOptions, trace);
    if (filters) {
      Object.keys(filters).forEach((filter) => {
        requestOptions.qs[filter] = filters[filter];
      });
    }
    requestOptions.qs.offset = offset;
    requestOptions.qs.limit = limit;

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};
/**
 * @description This fuction returns a list of user entitlements
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [user_uuid="null"] - User uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - optional filters object {"key": "value"}
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a list of user entitlements
 */
const getUserEntitlements = async (
  accessToken = "null accessToken",
  user_uuid = "null",
  offset = 0,
  limit = 1000,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/${user_uuid}/entitlements`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    let response;
    //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice
    if (typeof filters !== "undefined") {
      if (typeof filters !== "object" || filters === null) {
        throw {
          code: 400,
          message: "filters param not an object",
          trace_id:
            requestOptions.hasOwnProperty("headers") &&
            requestOptions.headers.hasOwnProperty("trace")
              ? requestOptions.headers.trace
              : undefined,
          details: [{ filters: filters }],
        };
      }

      // API limited to 100 per page
      requestOptions.qs = {
        offset: 0,
        limit: 100,
      };

      response = await Util.aggregate(request, requestOptions, trace);
      if (response.hasOwnProperty("items") && response.items.length > 0) {
        const filteredResponse = Util.filterResponse(response, filters);
        const paginatedResponse = Util.paginate(
          filteredResponse,
          offset,
          limit
        );
        return paginatedResponse;
      } else {
        return response;
      }
    } else {
      requestOptions.qs = {
        offset: offset,
        limit: limit,
      };
      response = await request(requestOptions);
      return response;
    }
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This fuction returns a list of user entitlements.  This is new an improved uses query for filters.
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [user_uuid="null"] - User uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=20] - pagination limit
 * @param {object} [filters={}}] - optional filters object {"key": "value"}
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a list of user entitlements
 */
const getUserEntitlementsV2 = async (
  accessToken = "null accessToken",
  user_uuid = "null",
  offset = 0,
  limit = 20,
  filters = {},
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const apiKeys = [
      "account_uuid",
      "product_type",
      "status",
      "product_uuid",
      "include",
    ];

    // validate filter keys
    const isFilterKeysValid = Object.keys(filters).reduce((p, c) => {
      if (p === true) {
        return apiKeys.indexOf(c) > -1;
      }
      return p;
    }, true);

    const requestOptions = {
      method: "GET",
      uri: `${MS}/users/${user_uuid}/entitlements`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };

    if (isFilterKeysValid === false) {
      throw {
        code: 400,
        message:
          "filters contain an invalid key valid keys are: " + apiKeys.join(","),
        trace_id:
          requestOptions.hasOwnProperty("headers") &&
          requestOptions.headers.hasOwnProperty("trace")
            ? requestOptions.headers.trace
            : undefined,
        details: [{ filters: filters }],
      };
    }

    Util.addRequestTrace(requestOptions, trace);

    // add filters keys to query string
    Object.keys(filters).forEach((filter) => {
      requestOptions.qs[filter] = filters[filter];
    });

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This fuction returns a list of entitlements by account
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [accountUUID="null"] - account uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=100] - pagination limit
 * @param {object} [filters=undefined] - optional filters object {"key": "value"}
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a list of user entitlements
 */
const listAccountEntitlements = async (
  accessToken = "null accessToken",
  accountUUID = "null accountUUID",
  offset = 0,
  limit = 100,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/accounts/${accountUUID}/entitlements`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      qs: {
        offset: offset,
        limit: limit,
      },
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    if (typeof filters !== "undefined") {
      if (typeof filters !== "object" || filters === null) {
        throw {
          code: 400,
          message: "filters param not an object",
          trace_id:
            requestOptions.hasOwnProperty("headers") &&
            requestOptions.headers.hasOwnProperty("trace")
              ? requestOptions.headers.trace
              : undefined,
          details: [{ filters: filters }],
        };
      } else {
        Object.keys(filters).forEach((filter) => {
          requestOptions.qs[filter] = filters[filter];
        });
      }
    }
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

/**
 * @description This fuction will update a product specified
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [product_uuid="null"] - product uuid
 * @param {object} [product=undefined] - the product object
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving the updated product
 */
const updateProduct = async (
  accessToken = "null accessToken",
  product_uuid = "null productUUID",
  product = undefined,
  trace = {}
) => {
  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "PUT",
      uri: `${MS}/products/${product_uuid}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${Util.getVersion()}`,
      },
      body: product,
      json: true,
    };
    Util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw Util.formatError(error);
  }
};

module.exports = {
  activateUserEntitlement,
  getProduct,
  getProducts,
  getProductByApplicationUuid,
  getUserEntitlements,
  getUserEntitlementsV2,
  listAccountEntitlements,
  updateProduct,
};
