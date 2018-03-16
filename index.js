"use strict";
const Lambda = require('./lambda');
const Identity = require('./identity');
const Messaging = require('./messaging');
const Objects = require('./objects');
const Util = require('./utilities');
const Task = require('./task');
const Event = require('./event');
const Groups = require('./groups');
const ShortUrls = require('./shorturls');
const Auth = require('./auth');
const Chat = require('./chat');

let cpaasKey;

/**
* This function set the _baseUrl variable you want hit for microservices
*
* @param environment String - dev, development, test, prod or production
**/
const setBaseUrl = (baseUrl="https://cpaas.star2star.com/api") =>{
  process.env.BASE_URL = baseUrl;
};

/**
* This function set the environment variable you want to run in
*
* @returns string - environment of which it has been configured
**/
const getBaseUrl = () =>{
  setBaseUrl(process.env.BASE_URL);
  return process.env.BASE_URL;
};


/**
* This function set the environment variable you want to run in
*
* @param key String - valid cpaas application key
**/
const setApplicationKey = (key="missing")=>{
  cpaasKey = key;
};

/**
* This function set the environment variable you want to run in
*
* @returns app key string which was set
**/
const getApplicationKey = () =>{
  return cpaasKey;
};

module.exports = {Lambda, Identity, Messaging, Objects, Util, Task, Event, setBaseUrl,
  getBaseUrl, setApplicationKey, getApplicationKey, Groups, ShortUrls, Auth, Chat };
