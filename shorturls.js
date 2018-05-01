/* global require module*/
"use strict";
const request = require('request-promise');
const util = require('./utilities');
const ObjectMerge = require('object-merge');

/**
 * This function will get a list of all short urls
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param options - object of options  --- see swagger
 * @returns promise for list of short urls
 **/
const list = (userUUID = 'null user uuid', accessToken = 'null accessToken', options = {}) => {
    const MS = util.getEndpoint("shorturls");
    const requestOptions = {
        method: 'GET',
        uri: `${MS}/shorturls`,
        qs: options,
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'user_uuid': userUUID
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * This function will create a new short url
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param options - options Object
 * @returns data
 **/
const create = (userUUID = 'null user uuid', accessToken = 'null accessToken',
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
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'user_uuid': userUUID
        },
        json: true
    };
    return request(requestOptions);
};

/**
 * This function will create a new short url
 *
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param short_code - short_code to delete
 * @returns no content
 **/
const deleteShortCode = (userUUID = 'null user uuid', accessToken = 'null accessToken', short_code = 'notdefined') => {
    const MS = util.getEndpoint("shorturls");


    //console.log('bbbbbbbb', b)
    const requestOptions = {
        method: 'DELETE',
        uri: `${MS}/shorturls/${short_code}`,
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
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