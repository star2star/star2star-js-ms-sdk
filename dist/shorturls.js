/* global require module*/
"use strict";

var request = require('request-promise');
var util = require('./utilities');
var ObjectMerge = require('object-merge');

/**
 * This function will get a list of all short urls
 *
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param options - object of options  --- see swagger
 * @returns promise for list of short urls
 **/
var listShortUrls = function listShortUrls() {
    var userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null user uuid';
    var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null accessToken';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var MS = util.getEndpoint("shorturls");
    var requestOptions = {
        method: 'GET',
        uri: MS + '/shorturls?user_uuid=' + userUuid,
        qs: options,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-type': 'application/json',
            'x-api-version': '' + util.getVersion()
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * This function will create a new short url
 *
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param options - options Object
 * @returns data
 **/
var createShortUrl = function createShortUrl() {
    var userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null user uuid';
    var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null accessToken';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var MS = util.getEndpoint("shorturls");

    var b = ObjectMerge({}, options);
    if (!b.hasOwnProperty('url')) {
        return Promise.reject('options object missing url property');
    }
    //console.log('bbbbbbbb', b)
    var requestOptions = {
        method: 'POST',
        uri: MS + '/shorturls',
        body: b,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-type': 'application/json',
            'x-api-version': '' + util.getVersion(),
            'user_uuid': userUuid
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * This function will create a new short url
 *
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param short_code - short_code to delete
 * @returns no content
 **/
var deleteShortCode = function deleteShortCode() {
    var userUuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null user uuid';
    var accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null accessToken';
    var short_code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'notdefined';

    var MS = util.getEndpoint("shorturls");

    //console.log('bbbbbbbb', b)
    var requestOptions = {
        method: 'DELETE',
        uri: MS + '/shorturls/' + short_code,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-type': 'application/json',
            'x-api-version': '' + util.getVersion(),
            'user_uuid': userUuid
        },
        json: true
    };
    return request(requestOptions);
};

module.exports = {
    listShortUrls: listShortUrls,
    createShortUrl: createShortUrl,
    deleteShortCode: deleteShortCode
};