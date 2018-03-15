"use strict";
const util = require('./utilities');
const request = require('request-promise');

/**
 * This function will retrieve the conversation uuid for whom you are sending it to
 * @param apiKey - cpaas api key
 * @param userUUID - the user uuid making the request
 * @param toPhoneNumber - a single string full phone number you will be sending the sms too
 * @return promise which will resolve to conversation uuid
 */
const getConvesationUUID = (apiKey, userUUID, toPhoneNumber ) => {
  return new Promise((resolve, reject)=>{
    const GET_CONVERSATION_CMD = `/users/${userUUID}/conversations`;
    const MS = util.getEndpoint("Messaging");
    const REQUEST_OPTIONS = {
      method: 'POST',
      uri: `${MS}${GET_CONVERSATION_CMD}`,
      body: {"phone_numbers":[toPhoneNumber]},
      headers: {
                'Content-Type': 'application/json',
                'application-key':`${apiKey}`
                },
      json: true
    }

    //console.log('RRRR:', REQUEST_OPTIONS)
    request(REQUEST_OPTIONS).then((response)=>{
        //console.log('rrrr', response.context.uuid)
        resolve(response.context.uuid);
    }).catch((fetchError)=>{
      // something went wrong so
      //console.log('fetch error: ', fetchError)
      reject(fetchError);
    });
  }); // end promise
} // end function getConversation UUID

/**
 * This function will send an sms message
 * @param apiKey - cpaas api key
 * @param conversationUUID - uuid of conversation; see getConvesationUUID
 * @param userUUID - the user uuid making the request
 * @param fromPhoneNumber - full phone number to use as the sender/reply too
 * @param msg - the message to send
 * @return promise which will resolve to  the response
 */
const sendSMSMessage = (apiKey, convesationUUID, userUUID,  fromPhoneNumber, msg ) =>{
  return new Promise((resolve, reject)=>{
    const SEND_MSG_CMD = `/users/${userUUID}/messages`;
    const OBJ_BODY = {
        "to": `${convesationUUID}`,
        "from": `${fromPhoneNumber}`,
        "channel": "sms",
        "content": [{
            "type": "text",
            "body": `${msg}`
          }]
      };
    const MS = util.getEndpoint("Messaging");

    const REQUEST_OPTIONS = {
      method: 'POST',
      uri: `${MS}${SEND_MSG_CMD}`,
      body: OBJ_BODY,
      headers: {
                'Content-Type': 'application/json',
                'application-key': apiKey
                },
      json: true
    };

    request(REQUEST_OPTIONS).then((response)=>{
      //console.log('xxxxx', response)
      resolve(response);
    }).catch((e)=>{
      //console.log(e)
      reject(`sendSMSMessage errored: ${e}`);
    });

  })
}

/**
 * This function will send an sms message
 * @param apiKey - cpaas api key
 * @param userUUID - the user uuid making the request
 * @param msg - the message to send
 * @param fromPhoneNumber - full phone number to use as the sender/reply too
 * @param toPhoneNumber - a single string full phone number you will be sending the sms too
 * @return promise which will resolve to  the response
 */
const sendSMS = (apiKey, userUUID, msg, fromPhoneNumber, toPhoneNumber ) =>{
  return new Promise((resolve, reject)=>{
      getConvesationUUID(apiKey, userUUID, toPhoneNumber).then((conversationUUID)=>{
        sendSMSMessage(apiKey, conversationUUID, userUUID, fromPhoneNumber, msg).then((response)=>{
          resolve(response);
        }).catch((sError)=>{
          reject(sError);
        });
      }).catch((cError)=>{
        //console.log('EEEEE:', cError)
        reject(cError);
      });
  });
};

/**
 * This function will get user sms number
 * @param apiKey - cpaas api key
 * @param userUUID - the user uuid making the request
 * @return promise which will resolve to  the sms number or reject if empty
 */
const getSMSNumber = (apiKey, userUUID) =>{

  return new Promise((resolve, reject)=>{
      const MS = util.getEndpoint("identity");

      const SMS_REQ_OPTIONS = {
          method: 'GET',
          uri: `${MS}/identities/${userUUID}`,
          headers: {
              'application-key': apiKey,
              'Content-type': 'application/json'
          },
          json: true
      };
      request(SMS_REQ_OPTIONS).then((r) => {
        if (r && r.aliases){
          const smsNbr = r.aliases.reduce((prev, curr)=>{
            if (!prev){
              if (curr && curr.hasOwnProperty('sms')){
                return curr['sms'];
              }
            }
            return prev;
          }, undefined)
          if (smsNbr){
            resolve(smsNbr)
          } else {
            reject();
          }
        } else {
          reject();
        }
      }).catch((e)=>{
        reject();
      });
  });
}

module.exports = { getSMSNumber, sendSMS, sendSMSMessage, getConvesationUUID }
