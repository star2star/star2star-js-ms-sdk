/* global require module*/
"use strict";

var util = require('./utilities');
var request = require('request-promise');

/**
 * This function will ask the cpaas data object service for a specific object
 *
 * @param accessToken - access Token for cpaas systems
 * @param lambdaName - string representing the lambda name
 * @param params - json object of parameters to be passed to the lambda function
 * @returns promise
 **/
var invokeLambda = function invokeLambda() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null access Token';
    var lambdaName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'not defined';
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var MS = util.getEndpoint("lambda");
    var requestOptions = {
        method: 'POST',
        uri: MS + '/actions/' + lambdaName + '/invoke',
        headers: {
            "Authorization": 'Bearer ' + accessToken,
            'x-api-version': '' + util.getVersion(),
            'Content-Type': 'application/json'
        },
        body: params,
        json: true
    };
    return request(requestOptions);
};

module.exports = {
    invokeLambda: invokeLambda
};