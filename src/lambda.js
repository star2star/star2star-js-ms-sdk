/* global require module*/
"use strict";
const util = require('./utilities');
const request = require('request-promise');

/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [lambdaName='not defined'] - string representing the lambda name
 * @param {object} [params={}] - json object of parameters to be passed to the lambda function
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const invokeLambda = (accessToken = 'null access Token', lambdaName = 'not defined', params = {}) => {
    const MS = util.getEndpoint("lambda");
    const requestOptions = {
        method: 'POST',
        uri: `${MS}/actions/${lambdaName}/invoke`,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            'x-api-version': `${util.getVersion()}`,
            'Content-Type': 'application/json'
        },
        body: params,
        json: true
    };
    return request(requestOptions);
};


module.exports = {
    invokeLambda
};