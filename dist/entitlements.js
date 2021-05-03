/*global module require */
"use strict";

const Util = require("./utilities");

const request = require("request-promise");
/**
 * @description This function returns a single entitlement product
 * @async
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [productUUID="null productUUID"] - product UUID
 * @param {object} [trace={}] - option CPaaS lifecycle headers
 * @returns {Promise<object>} Promise resolving to a product object
 */


const getProduct = async function getProduct() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let productUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null productUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/products/").concat(productUUID),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(Util.getVersion())
      },
      json: true
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


const getProducts = async function getProducts() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    const MS = Util.getEndpoint("entitlements");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/products"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(Util.getVersion())
      },
      json: true
    };
    Util.addRequestTrace(requestOptions, trace);
    let response; //here we determine if we will need to handle aggrigation, pagination, and filtering or send it to the microservice

    if (typeof filters !== "undefined") {
      if (typeof filters !== "object" || filters === null) {
        throw {
          "code": 400,
          "message": "filters param not an object",
          "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
          "details": [{
            "filters": filters
          }]
        };
      }

      response = await Util.aggregate(request, requestOptions, trace);

      if (response.hasOwnProperty("items") && response.items.length > 0) {
        const filteredResponse = Util.filterResponse(response, filters);
        const paginatedResponse = Util.paginate(filteredResponse, offset, limit);
        return paginatedResponse;
      } else {
        return response;
      }
    } else {
      requestOptions.qs = {
        offset: offset,
        limit: limit
      };
      response = await request(requestOptions);
      return response;
    }
  } catch (error) {
    throw Util.formatError(error);
  }
};

module.exports = {
  getProduct,
  getProducts
};