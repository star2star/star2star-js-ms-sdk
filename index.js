"use strict";
const Lambda = require('./lambda');
const Identity = require('./identity');
const Messaging = require('./messaging');
const Objects = require('./objects');
const Util = require('./utilities');
const Task = require('./task');
const Event = require('./event');
const Groups = require('./groups');

let cpaasKey;

/**
* This function set the environment variable you want to run in
*
* @param environment String - dev, development, test, prod or production
**/
const setEnvironment = (env) =>{
  let xEnv;
  switch(env){
    case 'dev':
    case 'development':
      xEnv = 'dev';
      break;
    case 'test':
      xEnv = 'test';
      break;
    case 'prod':
    case 'production':
    case 'default':
      xEnv = 'prod';
      break;
  }
  process.env.NODE_ENV = xEnv;
}

/**
* This function set the environment variable you want to run in
*
* @returns string - environment of which it has been configured
**/
const getEnvironment = () =>{
  setEnvironment(process.env.NODE_ENV);
  return process.env.NODE_ENV;
}

/**
* This function set the environment variable you want to run in
*
* @param key String - valid cpaas application key
**/
const setApplicationKey = (key="missing")=>{
  cpaasKey = key;
}

/**
* This function set the environment variable you want to run in
*
* @returns app key string which was set
**/
const getApplicationKey = () =>{
  return cpaasKey;
}

module.exports = {Lambda, Identity, Messaging, Objects, Util, Task, Event, setEnvironment,getEnvironment, setApplicationKey, getApplicationKey, Groups };
