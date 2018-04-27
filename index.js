/*global require process module*/
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
const Contacts = require('./contacts');
const Oauth = require('./oauth');

let cpaasKey;

/**
 * This function sets the microservice host (MS_HOST) variable you want hit for microservices
 *
 * @param msHost String - valid url for microservice host server
 **/
const setMsHost = (msHost = "https://cpaas.star2star.com/api") => {
  process.env.MS_HOST = msHost;
};

/**
 * This function gets the microservice host variable you want to run in
 *
 * @returns string - environment of which it has been configured
 **/
const getMsHost = () => {
  // setMsHost(process.env.MS_HOST);
  return process.env.MS_HOST;
};


/**
 * This function set the environment variable you want to run in
 *
 * @param key String - valid cpaas application key
 **/
const setApplicationKey = (key = "missing") => {
  cpaasKey = key;
};

/**
 * This function set the environment variable you want to run in
 *
 * @returns app key string which was set
 **/
const getApplicationKey = () => {
  return cpaasKey;
};

module.exports = {
  Lambda,
  Identity,
  Messaging,
  Objects,
  Util,
  Task,
  Event,
  setMsHost,
  getMsHost,
  setApplicationKey,
  getApplicationKey,
  Groups,
  ShortUrls,
  Auth,
  Oauth,
  Chat,
  Contacts
};