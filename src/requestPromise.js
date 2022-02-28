const fetch = require("node-fetch");
const util = require("./utilities");
/**
 * @async
 * @description Polyfil to allow request-promise style functions to use node-fetch
 * @param {object} requestOptions request-promise formatted request options
 * @returns {Promise<any>} Promise resolving to the HTTP response specified
 */
const request = async function (requestOptions) {
  try {
    // const requestOptions = merge(options);
    let uri = requestOptions?.uri;
    if (typeof uri === "undefined") {
      throw {
        code: 400,
        message: "request missing URI",
      };
    }
    // the body should be JSON if this is true
    if (
      typeof requestOptions?.body === "object" &&
      requestOptions.body !== null
    ) {
      // application/json
      try {
        const stringifiedBody = JSON.stringify(requestOptions.body);
        requestOptions.body = stringifiedBody;
      } catch (e) {
        throw {
          code: 400,
          message: "json body declared but could not be parsed",
          details: [JSON.stringify(util.formatError(e))],
        };
      }
    } else if (
      // application/x-www-form-urlencoded
      typeof requestOptions?.form === "object" &&
      requestOptions.form !== null
    ) {
      requestOptions.body = util.addUrlQueryParams("", requestOptions.form);
    }

    // build the query string onto the base URI
    if (
      typeof requestOptions.qs === "object" &&
      requestOptions.qs !== null &&
      Object.keys(requestOptions.qs).length > 0
    ) {
      uri = util.addUrlQueryParams(uri, requestOptions.qs);
    }

    const response = await fetch(uri, requestOptions);
    if (response.ok === false) {
      const error = await util.formatFetchError(response);
      throw error;
    } else {
      let payload;
      const responseType = response.headers.get("Content-Type");
      if (
        typeof responseType === "string" &&
        responseType.indexOf("application/json") !== -1 &&
        requestOptions.json === true
      ) {
        payload = await response.json();
      } else {
        payload = await response.text();
      }

      // caller needs the status code
      if (requestOptions.resolveWithFullResponse === true) {
        const fullResponse = {
          headers: response.headers,
          statusCode: response.status, // backward compatible
          body: payload
        };
        return fullResponse;
      } else {
        return payload;
      }
    }
  } catch (e) {
    throw util.formatError(e);
  }
};

module.exports = request;
