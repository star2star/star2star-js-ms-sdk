/* global require module*/
"use strict";
const util = require('./utilities');
const request = require('request-promise');

/**
 * This function will ask the cpaas data object service for a specific object
 *
 * @param accessToken - access Token for cpaas systems
 * @param lambdaName - string representing the lambda name
 * @param params - json object of parameters to be passed to the lambda function
 * @returns promise
 **/
const invokeLambda = (accessToken = 'null access Token', lambdaName = 'not defined', params = {}) => {
    const MS = util.getEndpoint("lambda");
    const requestOptions = {
        method: 'POST',
        uri: `${MS}/actions/${lambdaName}/invoke`,
        headers: {
            'Authorization': accessToken,
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