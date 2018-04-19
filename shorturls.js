/* global require module*/
"use strict";
const request = require('request-promise');
const util = require('./utilities');
const ObjectMerge = require('object-merge');

/**
 * This function will get a list of all short urls
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param options - object of options  --- see swagger
 * @returns promise for list of short urls
 **/
const list = (apiKey = 'null api key', userUUID = 'null user uuid', identityJWT = 'null jwt', options = {}) => {
    const MS = util.getEndpoint("shorturls");
    const requestOptions = {
        method: 'GET',
        uri: `${MS}/shorturls`,
        qs: options,
        headers: {
            'application-key': apiKey,
            'Content-type': 'application/json',
            'Authorization': `Bearer ${identityJWT}`,
            'user_uuid': userUUID
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * This function will create a new short url
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param options - options Object
 * @returns data
 **/
const create = (apiKey = 'null api key', userUUID = 'null user uuid', identityJWT = 'null jwt',
    options = {}) => {
    const MS = util.getEndpoint("shorturls");

    const b = ObjectMerge({}, options);
    if (!b.hasOwnProperty('url')) {
        return Promise.reject('options object missing url property');
    }
    //console.log('bbbbbbbb', b)
    const requestOptions = {
        method: 'POST',
        uri: `${MS}/shorturls`,
        body: b,
        headers: {
            'application-key': apiKey,
            'Content-type': 'application/json',
            'Authorization': `Bearer ${identityJWT}`,
            'user_uuid': userUUID
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * This function will create a new short url
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param short_code - short_code to delete
 * @returns no content
 **/
const deleteShortCode = (apiKey = 'null api key', userUUID = 'null user uuid', identityJWT = 'null jwt', short_code = 'notdefined') => {
    const MS = util.getEndpoint("shorturls");


    //console.log('bbbbbbbb', b)
    const requestOptions = {
        method: 'DELETE',
        uri: `${MS}/shorturls/${short_code}`,
        headers: {
            'application-key': apiKey,
            'Content-type': 'application/json',
            'Authorization': `Bearer ${identityJWT}`,
            'user_uuid': userUUID
        },
        json: true
    };
    return request(requestOptions);
};

module.exports = {
    list,
    create,
    deleteShortCode
};