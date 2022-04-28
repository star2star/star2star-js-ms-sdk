const fetch = require("node-fetch");
const util = require("./utilities");
const { URLSearchParams } = require("url");
const FormData = require("form-data");

/**
 * @async
 * @description Polyfil to allow request-promise style functions to use node-fetch
 * @param {object} requestOptions request-promise formatted request options
 * @returns {Promise<any>} Promise resolving to the HTTP response specified
 */
const request = async function (requestOptions) {
  try {
    // const requestOptions = merge(options);
    let uri = requestOptions.uri;
    if (typeof uri === "undefined") {
      throw {
        code: 400,
        message: "request missing URI",
      };
    }
    if (
      typeof requestOptions?.body === "object" &&
      requestOptions.body !== null
    ) {
      try {
        // application/json
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
      const params = new URLSearchParams();
      Object.keys(requestOptions.form).forEach((param) => {
        params.append(param, requestOptions.form[param]);
      });
      requestOptions.body = params;
    } else if (
      // multipart/form-data
      typeof requestOptions?.formData === "object" &&
      requestOptions.formData !== null
    ) {
      let formData = new FormData();
      // combine auto generated mutlipart form headers with passed in headers
      const headers = {
        ...formData.getHeaders(),
        ...requestOptions.headers,
      };
      requestOptions.headers = headers;

      // build the body
      Object.keys(requestOptions.formData).forEach((param) => {
        // multipart can't be object
        let formattedParam;
        if (
          param === "file" &&
          typeof requestOptions.formData[param] === "object" &&
          typeof requestOptions.formData[param].value !== undefined
        ) {
          formattedParam = requestOptions.formData[param].value;
        } else {
          formattedParam = requestOptions.formData[param];
        }
        formData.append(param, formattedParam);
      });
      requestOptions.body = formData;
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
      if(response.redirected === true){
        // the request may have failed due to included bearer token that we have no control over.
        const redirectOptions = {
          uri: response.url
        };
        if(requestOptions.resolveWithFullResponse === true){
          redirectOptions.resolveWithFullResponse = true;
        }
        const redirectPayload = await request(redirectOptions);
        return redirectPayload;
      }
      const error = await util.formatFetchError(response);
      throw error;
    } else {
      let payload;
      const responseType = response.headers.get("Content-Type");
      if (
        response.status !== 204 &&
        typeof responseType === "string" &&
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
          body: payload,
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
