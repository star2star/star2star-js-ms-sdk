/* global require module*/
"use strict";

var util = require('./utilities');
var request = require('request-promise');

/**
 * @async
 * @description This function lists lambdas
 * @param {string} [accessToken='null access Token'] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var listLambdas = function listLambdas() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null access Token';
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

    var MS = util.getEndpoint("lambda");
    var requestOptions = {
        method: 'GET',
        uri: MS + '/actions',
        headers: {
            "Authorization": 'Bearer ' + accessToken,
            'x-api-version': '' + util.getVersion(),
            'Content-Type': 'application/json'
        },
        "qs": {
            "limit": limit,
            "skip": offset
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * @async
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [lambdaName='not defined'] - string representing the lambda name
 * @param {object} [params={}] - json object of parameters to be passed to the lambda function
 * @returns {Promise<object>} - Promise resolving to a data object
 */
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
    listLambdas: listLambdas,
    invokeLambda: invokeLambda
};