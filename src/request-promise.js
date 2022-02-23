const fetch = require("node-fetch");
const util = require("./utilities");
/**
 * @async
 * @description Polyfil to allow request-promise style functions to use node-fetch
 * @param {object} requestOptions request-promise formatted request options
 * @returns {Promise<any>} Promise resolving to the HTTP response specified
 */
const request = async function(requestOptions) {
  try {
    let uri = requestOptions?.uri;
    delete requestOptions.uri;

    // the body should be JSON if this is true
    if (
      requestOptions.json === true &&
      typeof requestOptions?.body === "object" &&
      requestOptions.body !== null
    ) {
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
        let payload 
        try {
          payload = await response.json();
        } catch (e){
          payload = await response.text();
        }
        // now check the payload to see if the execution had an error
        console.log("GOT HERE", response.ok,payload);
        
        return payload;
    }
  } catch (e) {
    throw util.formatError(e);
  }
  // const requestOptions = {
  //     method: "POST",
  //     uri: `${MS}/users/${userUuid}/contacts`,
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "Content-type": "application/json",
  //       "x-api-version": `${util.getVersion()}`
  //     },
  //     body: contactData,
  //     json: true
  //   };
};

module.exports = request;
